/**
 * ==============================================================================
 * VIASA SYSTEM - MOTOR DE GUARDIAS, CONTROL DE CAMPO, CRM Y LOGÍSTICA
 * Panadería y Pastelería Nueva Viasa, C.A.
 * RIF: J-31163165-8 | La Sabanita, Ciudad Bolívar, Venezuela
 * ==============================================================================
 * Módulo híbrido transversal de alta tecnología:
 * 1. Altas y Bajas Dinámicas con Credencial Digital QR y PIN
 * 2. Matriz de Guardias y Turnos Rotativos Multi-departamento
 * 3. Sincronización Cruzada con CRM Y Salón Cafetín Viasa
 * 4. Extensión Logística y Rutas de Despacho en Ciudad Bolívar
 * 5. Reloj Control por Proximidad/QR con cálculo de retrasos y horas extras LOTTT
 * 6. Bolsa de Intercambio de Guardias (Shift Marketplace)
 * 7. Arquitectura Offline-First resiliente
 * ==============================================================================
 */

(function(window) {
    'use strict';

    const ViasaGuardiasEngine = {
        subViewActiva: 'plantilla', // 'plantilla', 'matriz', 'crm_cafetin', 'logistica', 'marketplace', 'asistencia'
        vistaTemporalMatriz: 'dia', // 'dia', 'semana1', 'semana2', 'semana3', 'semana4', 'mes'
        mesOperativo: new Date().toISOString().slice(0, 7), // '2026-11'
        filtroDepto: 'todos',
        filtroTurno: 'todos',
        filtroBusqueda: '',
        fechaSeleccionada: new Date().toISOString().split('T')[0],
        pinsVisibles: {},
        empIdSubiendoFoto: null,
        turnoSeleccionadoForm: null,
        modoAsignacionModal: 'dia',
        pestanaAnalesActiva: 'bitacora',
        filtroAnalesEmp: 'todos',
        filtroAnalesMes: new Date().toISOString().slice(0, 7),
        filtroAnalesEvento: 'todos',
        empleadoLOTTTSeleccionado: 'todos',

        // Inicialización
        async init() {
            console.log('[VIASA GUARDIAS] Inicializando Motor Tecnológico de Guardias y Operaciones de Campo...');
            this.inicializarEventosOffline();
            try {
                await this.inicializarTurnosOperativos();
                await this.inicializarAnalesHistoricos();
            } catch (e) {
                console.warn('[VIASA GUARDIAS] Error inicializando turnos o anales:', e);
            }
        },

        togglePinVisibilidad(empId) {
            this.pinsVisibles[empId] = !this.pinsVisibles[empId];
            this.renderGuardiasHub();
        },

        normalizarDepartamento(depto, cargo = '') {
            const d = (depto || '').toLowerCase().trim();
            const c = (cargo || '').toLowerCase().trim();
            if (d.includes('fabric') || d.includes('producc') || d.includes('panader') || d.includes('horno') || d.includes('pastel')) return 'Fabricación';
            if (d.includes('cocina') || d.includes('cafet') || c.includes('chef') || c.includes('mesoner') || c.includes('barista')) return 'Cocina';
            if (d.includes('venta') || d.includes('mostrador') || d.includes('caja')) return 'Ventas';
            if (d.includes('despacho') || d.includes('logistic') || d.includes('ruta') || d.includes('delivery')) return 'Despacho';
            if (d.includes('mantenim') || d.includes('tecnic') || d.includes('servic')) return 'Mantenimiento';
            if (d.includes('admin') || d.includes('gerenc') || d.includes('rrhh') || d.includes('contab')) return 'Administración';
            return depto || 'Fabricación';
        },

        obtenerEstiloDepto(deptoNorm) {
            switch (deptoNorm) {
                case 'Fabricación':
                    return { clase: 'depto-badge-amber', icono: 'fa-wheat-awn', label: 'Fabricación' };
                case 'Cocina':
                    return { clase: 'depto-badge-orange', icono: 'fa-utensils', label: 'Cocina' };
                case 'Ventas':
                    return { clase: 'depto-badge-emerald', icono: 'fa-cash-register', label: 'Ventas' };
                case 'Despacho':
                    return { clase: 'depto-badge-sky', icono: 'fa-truck-fast', label: 'Despacho' };
                case 'Mantenimiento':
                    return { clase: 'depto-badge-purple', icono: 'fa-screwdriver-wrench', label: 'Mantenimiento' };
                case 'Administración':
                    return { clase: 'depto-badge-indigo', icono: 'fa-user-tie', label: 'Administración' };
                default:
                    return { clase: 'depto-badge-slate', icono: 'fa-building-user', label: deptoNorm || 'Operaciones' };
            }
        },

        obtenerFotoPorDefecto(emp = {}) {
            const depto = this.normalizarDepartamento(emp.departamento, emp.cargo);
            const nombre = (emp.nombreCompleto || emp.nombres || '').toLowerCase();
            const esFemenino = nombre.includes('maría') || nombre.includes('maria') || nombre.includes('luisa') ||
                               nombre.includes('carmen') || nombre.includes('ana') || nombre.includes('valentina') ||
                               nombre.includes('elena') || nombre.includes('gabriela') || nombre.includes('rosa') ||
                               nombre.includes('daniela') || nombre.includes('andrea') || nombre.includes('carolina') ||
                               (emp.cargo || '').toLowerCase().includes('cajera') || (emp.cargo || '').toLowerCase().includes('gerente administrativa');
            if (esFemenino) {
                if (depto === 'Administración') return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80';
                if (depto === 'Ventas') return 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80';
                return 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80';
            }
            if (depto === 'Fabricación') return 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&auto=format&fit=crop&q=80';
            if (depto === 'Cocina') return 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80';
            if (depto === 'Despacho') return 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80';
            if (depto === 'Mantenimiento') return 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80';
            if (depto === 'Administración') return 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80';
            return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80';
        },

        obtenerFotoEmpleado(emp) {
            if (!emp) return this.obtenerFotoPorDefecto({});
            if (emp.foto && typeof emp.foto === 'string' && emp.foto.trim().length > 5) return emp.foto;
            if (emp.photoUrl && typeof emp.photoUrl === 'string' && emp.photoUrl.trim().length > 5) return emp.photoUrl;
            // Buscar si en ViasaDatabase.empleados existe foto para esta cédula o id
            if (window.ViasaDatabase && Array.isArray(window.ViasaDatabase.empleados)) {
                const match = window.ViasaDatabase.empleados.find(x => x.id === emp.id || (x.cedula && x.cedula === emp.cedula));
                if (match && match.foto) return match.foto;
            }
            return this.obtenerFotoPorDefecto(emp);
        },

        redimensionarImagenABase64(file, maxDim = 320, callback) {
            if (!file || !file.type.startsWith('image/')) {
                alert('⚠️ Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let w = img.width;
                    let h = img.height;
                    const size = Math.min(w, h);
                    const sx = (w - size) / 2;
                    const sy = (h - size) / 2;
                    canvas.width = maxDim;
                    canvas.height = maxDim;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, sx, sy, size, size, 0, 0, maxDim, maxDim);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
                    callback(dataUrl);
                };
                img.onerror = () => callback(ev.target.result);
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        },

        dispararSubidaFotoTarjeta(empId, event) {
            if (event) event.stopPropagation();
            this.empIdSubiendoFoto = empId;
            let input = document.getElementById('guardias-direct-photo-input');
            if (!input) {
                input = document.createElement('input');
                input.type = 'file';
                input.id = 'guardias-direct-photo-input';
                input.accept = 'image/*';
                input.style.display = 'none';
                input.onchange = (e) => this.procesarFotoDirectaTarjeta(e);
                document.body.appendChild(input);
            }
            input.value = '';
            input.click();
        },

        async procesarFotoDirectaTarjeta(event) {
            const file = event.target.files && event.target.files[0];
            if (!file || !this.empIdSubiendoFoto) return;
            const targetId = this.empIdSubiendoFoto;
            this.redimensionarImagenABase64(file, 320, async (base64Url) => {
                const emps = await this.obtenerEmpleados();
                const emp = emps.find(e => e.id === targetId);
                if (!emp) return;
                emp.foto = base64Url;
                emp.photoUrl = base64Url;
                await window.ViasaStorage.guardarRegistro('empleados', emp);
                if (window.ViasaDatabase && Array.isArray(window.ViasaDatabase.empleados)) {
                    const dbIdx = window.ViasaDatabase.empleados.findIndex(x => x.id === targetId || (x.cedula && x.cedula === emp.cedula));
                    if (dbIdx >= 0) {
                        window.ViasaDatabase.empleados[dbIdx].foto = base64Url;
                        window.ViasaDatabase.empleados[dbIdx].photoUrl = base64Url;
                    }
                }
                if (window.ViasaAudio) window.ViasaAudio.playSuccess();
                this.renderGuardiasHub();
            });
        },

        onSeleccionarArchivoFotoModal(event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;
            this.redimensionarImagenABase64(file, 320, (base64Url) => {
                const prev = document.getElementById('emp-foto-preview-img');
                const hidden = document.getElementById('emp-foto-base64');
                if (prev) prev.src = base64Url;
                if (hidden) hidden.value = base64Url;
            });
        },

        onDragOverFotoModal(event) {
            event.preventDefault();
            event.stopPropagation();
            const dz = document.getElementById('emp-photo-dropzone');
            if (dz) dz.classList.add('dragover');
        },

        onDragLeaveFotoModal(event) {
            event.preventDefault();
            event.stopPropagation();
            const dz = document.getElementById('emp-photo-dropzone');
            if (dz) dz.classList.remove('dragover');
        },

        onDropFotoModal(event) {
            event.preventDefault();
            event.stopPropagation();
            const dz = document.getElementById('emp-photo-dropzone');
            if (dz) dz.classList.remove('dragover');
            const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
            if (!file) return;
            this.redimensionarImagenABase64(file, 320, (base64Url) => {
                const prev = document.getElementById('emp-foto-preview-img');
                const hidden = document.getElementById('emp-foto-base64');
                if (prev) prev.src = base64Url;
                if (hidden) hidden.value = base64Url;
            });
        },

        restaurarFotoPorDefectoModal() {
            const depto = document.getElementById('emp-depto')?.value || 'Fabricación';
            const nombres = document.getElementById('emp-nombres')?.value || '';
            const cargo = document.getElementById('emp-cargo')?.value || '';
            const urlDefecto = this.obtenerFotoPorDefecto({ departamento: depto, nombres: nombres, cargo: cargo });
            const prev = document.getElementById('emp-foto-preview-img');
            const hidden = document.getElementById('emp-foto-base64');
            if (prev) prev.src = urlDefecto;
            if (hidden) hidden.value = urlDefecto;
        },

        inicializarEventosOffline() {
            window.addEventListener('online', () => {
                this.procesarColaOffline();
            });
        },

        async procesarColaOffline() {
            try {
                const cola = window.ViasaStorage.getItem('sync_offline_queue', []);
                if (cola && cola.length > 0) {
                    console.log(`[VIASA Sync] Sincronizando ${cola.length} operaciones pendientes en cola offline...`);
                    for (const op of cola) {
                        if (op.tipo === 'checkin') {
                            await window.ViasaStorage.guardarRegistro('fichajes_asistencia', op.data);
                        } else if (op.tipo === 'entrega_ruta') {
                            await this.confirmarEntregaParada(op.rutaId, op.paradaNum, op.qrToken, op.firmadoPor, false);
                        } else if (op.tipo === 'swap_request') {
                            await window.ViasaStorage.guardarRegistro('shift_marketplace', op.data);
                        }
                    }
                    window.ViasaStorage.setItem('sync_offline_queue', []);
                    console.log('[VIASA Sync] Cola offline sincronizada con éxito.');
                    if (window.ViasaAudio) window.ViasaAudio.playSuccess();
                }
            } catch (e) {
                console.warn('[VIASA Sync] Error procesando cola offline:', e);
            }
        },

        cambiarSubView(subView) {
            this.subViewActiva = subView;
            if (window.ViasaAudio) window.ViasaAudio.playClick();
            this.renderGuardiasHub();
        },

        setFiltroDepto(depto) {
            this.filtroDepto = depto;
            this.renderGuardiasHub();
        },

        setFiltroTurno(turno) {
            this.filtroTurno = turno;
            this.renderGuardiasHub();
        },

        setFiltroBusqueda(txt) {
            this.filtroBusqueda = (txt || '').toLowerCase().trim();
            this.renderGuardiasHub();
        },

        setFechaSeleccionada(fecha) {
            this.fechaSeleccionada = fecha;
            this.renderGuardiasHub();
        },

        // ======================================================================
        // 1. GESTIÓN DINÁMICA DE ALTAS Y BAJAS DE PERSONAL
        // ======================================================================
        async obtenerEmpleados() {
            let emps = await window.ViasaStorage.obtenerColeccion('empleados');
            if (!emps || emps.length === 0) {
                emps = window.ViasaDatabase.empleados || [];
            }
            return emps;
        },

        async abrirModalNuevoEmpleado(empId = null) {
            const modal = document.getElementById('modal-empleado-form');
            if (!modal) return;

            const title = document.getElementById('modal-emp-title');
            const form = document.getElementById('form-empleado-viasa');
            if (!form) return;

            form.reset();
            document.getElementById('emp-id-hidden').value = '';
            const prevImg = document.getElementById('emp-foto-preview-img');
            const fotoHidden = document.getElementById('emp-foto-base64');

            if (empId) {
                const emps = await this.obtenerEmpleados();
                const emp = emps.find(e => e.id === empId);
                if (emp) {
                    const nombreDisplay = emp.nombreCompleto || `${emp.nombres || ''} ${emp.apellidos || ''}`.trim();
                    const partesNombre = (emp.nombreCompleto || '').split(' ');
                    const nombresFallback = emp.nombres || partesNombre.slice(0, Math.ceil(partesNombre.length / 2)).join(' ');
                    const apellidosFallback = emp.apellidos || partesNombre.slice(Math.ceil(partesNombre.length / 2)).join(' ');
                    const deptoNorm = this.normalizarDepartamento(emp.departamento, emp.cargo);
                    const fotoActual = this.obtenerFotoEmpleado(emp);

                    if (title) title.innerHTML = `<i class="fa-solid fa-user-pen"></i> Editar Expediente: ${nombreDisplay}`;
                    document.getElementById('emp-id-hidden').value = emp.id;
                    document.getElementById('emp-cedula').value = emp.cedula || '';
                    document.getElementById('emp-nombres').value = nombresFallback || '';
                    document.getElementById('emp-apellidos').value = apellidosFallback || '';
                    document.getElementById('emp-depto').value = deptoNorm || 'Fabricación';
                    document.getElementById('emp-cargo').value = emp.cargo || '';
                    document.getElementById('emp-telefono').value = emp.telefono || '';
                    document.getElementById('emp-email').value = emp.email || '';
                    document.getElementById('emp-salario').value = emp.salarioUSD || emp.salarioMensualUSD || 280;
                    document.getElementById('emp-horario').value = emp.horarioDefecto || emp.horarioTexto || '06:00 - 14:00';
                    document.getElementById('emp-pin').value = emp.pinAcceso || emp.pinFichaje || '1234';
                    if (prevImg) prevImg.src = fotoActual;
                    if (fotoHidden) fotoHidden.value = fotoActual;
                }
            } else {
                if (title) title.innerHTML = `<i class="fa-solid fa-user-plus"></i> Alta Dinámica de Personal &bull; Nueva Viasa`;
                const emps = await this.obtenerEmpleados();
                const nextNum = emps.length + 1;
                document.getElementById('emp-id-hidden').value = `EMP-${String(nextNum).padStart(3, '0')}`;
                document.getElementById('emp-pin').value = String(Math.floor(1000 + Math.random() * 9000));
                const fotoDef = this.obtenerFotoPorDefecto({ departamento: 'Fabricación' });
                if (prevImg) prevImg.src = fotoDef;
                if (fotoHidden) fotoHidden.value = fotoDef;
            }

            modal.style.display = 'flex';
        },

        cerrarModalEmpleado() {
            const modal = document.getElementById('modal-empleado-form');
            if (modal) modal.style.display = 'none';
        },

        async guardarEmpleadoForm(e) {
            e.preventDefault();
            const idHidden = document.getElementById('emp-id-hidden').value;
            const cedula = document.getElementById('emp-cedula').value.trim();
            const nombres = document.getElementById('emp-nombres').value.trim();
            const apellidos = document.getElementById('emp-apellidos').value.trim();
            const depto = document.getElementById('emp-depto').value;
            const cargo = document.getElementById('emp-cargo').value.trim();
            const telefono = document.getElementById('emp-telefono').value.trim();
            const email = document.getElementById('emp-email').value.trim();
            const salario = parseFloat(document.getElementById('emp-salario').value) || 0;
            const horario = document.getElementById('emp-horario').value;
            const pin = document.getElementById('emp-pin').value.trim() || '1234';
            const fotoVal = document.getElementById('emp-foto-base64')?.value || '';

            const emps = await this.obtenerEmpleados();
            let index = emps.findIndex(x => x.id === idHidden);

            const qrToken = `VIASA-EMP-TOKEN-${cedula.replace(/[^0-9]/g, '')}-${pin}`;
            const fotoFinal = fotoVal || (index >= 0 ? this.obtenerFotoEmpleado(emps[index]) : this.obtenerFotoPorDefecto({ departamento: depto, nombres, cargo }));

            let empData = {
                id: idHidden || `EMP-${String(emps.length + 1).padStart(3, '0')}`,
                cedula: cedula,
                nombres: nombres,
                apellidos: apellidos,
                nombreCompleto: `${nombres} ${apellidos}`.trim(),
                departamento: depto,
                cargo: cargo,
                telefono: telefono,
                email: email,
                salarioUSD: salario,
                salarioMensualUSD: salario,
                horarioDefecto: horario,
                horarioTexto: horario,
                pinAcceso: pin,
                pinFichaje: pin,
                qrToken: qrToken,
                foto: fotoFinal,
                photoUrl: fotoFinal,
                estado: index >= 0 ? (emps[index].estado || 'activo') : 'activo',
                fechaIngreso: index >= 0 ? emps[index].fechaIngreso : new Date().toISOString().split('T')[0],
                avatar: this.obtenerIconoPorDepartamento(depto)
            };

            if (index >= 0) {
                emps[index] = Object.assign({}, emps[index], empData);
                empData = emps[index];
            } else {
                emps.push(empData);
                if (depto === 'Despacho' || cargo.toLowerCase().includes('chofer') || cargo.toLowerCase().includes('repartidor')) {
                    const repExistentes = await window.ViasaStorage.obtenerColeccion('repartidores') || [];
                    if (!repExistentes.some(r => r.id === empData.id)) {
                        await window.ViasaStorage.guardarRegistro('repartidores', {
                            id: empData.id,
                            nombre: empData.nombreCompleto,
                            telefono: empData.telefono,
                            vehiculo: 'Vehículo Flota Viasa',
                            placa: 'En Asignación',
                            estado: 'disponible',
                            entregasActivas: 0
                        });
                    }
                }
            }

            await window.ViasaStorage.guardarRegistro('empleados', empData);
            if (window.ViasaDatabase && Array.isArray(window.ViasaDatabase.empleados)) {
                const dbIdx = window.ViasaDatabase.empleados.findIndex(x => x.id === empData.id);
                if (dbIdx >= 0) {
                    window.ViasaDatabase.empleados[dbIdx] = Object.assign({}, window.ViasaDatabase.empleados[dbIdx], empData);
                } else {
                    window.ViasaDatabase.empleados.push(empData);
                }
            }
            
            // Sincronizar directorio CRM
            const contactoCRM = {
                id: `CONT-${empData.id}`,
                tipo: 'empleado',
                subtipo: `Personal de ${empData.departamento}`,
                nombre: empData.nombreCompleto,
                rifCedula: empData.cedula,
                email: empData.email,
                telefono: empData.telefono,
                ciudad: 'Ciudad Bolívar',
                etiquetas: ['Empleado', empData.cargo, 'Nómina LOTTT', 'Guardias Activas'],
                entidadId: empData.id,
                cargo: empData.cargo,
                sincronizadoEmail: 'panaderiaviasa@gmail.com',
                totalMensajesIntercambiados: 0
            };
            await window.ViasaStorage.guardarRegistro('contactos_directorio', contactoCRM);

            // Generar guardia automática para hoy si es nuevo
            if (index < 0) {
                const nuevaGuardia = {
                    id: `GRD-${Date.now().toString().slice(-6)}`,
                    empleadoId: empData.id,
                    nombreEmpleado: empData.nombreCompleto,
                    cargo: empData.cargo,
                    departamento: empData.departamento,
                    turno: this.clasificarTurnoPorHorario(horario),
                    nombreTurno: horario,
                    horaEntrada: horario.split('-')[0].trim(),
                    horaSalida: horario.split('-')[1]?.trim() || '15:00',
                    fecha: this.fechaSeleccionada,
                    estado: 'activo',
                    ubicacionAsignada: `Área de ${empData.departamento} (La Sabanita)`,
                    supervisor: 'Gerente General'
                };
                await window.ViasaStorage.guardarRegistro('guardias_turnos', nuevaGuardia);
            }

            this.cerrarModalEmpleado();
            if (window.ViasaAudio) window.ViasaAudio.playSuccess();
            alert(`✅ Expediente de ${empData.nombreCompleto} guardado exitosamente.\nAcceso Móvil Habilitado (PIN: ${empData.pinAcceso}) y vinculado a las Guardias.`);
            this.renderGuardiasHub();
        },

        async bajaLogicaEmpleado(empId) {
            const emps = await this.obtenerEmpleados();
            const emp = emps.find(e => e.id === empId);
            if (!emp) return;

            const motivo = prompt(`⚠️ Dar de Baja Lógica a: ${emp.nombreCompleto || emp.nombres} (C.I: ${emp.cedula})\nIndica el motivo de desincorporación laboral:`, 'Renuncia voluntaria / Fin de contrato');
            if (motivo === null) return;

            if (!confirm(`¿Confirmas la BAJA LÓGICA de ${emp.nombreCompleto}? Su acceso a la App Móvil y su asignación a nuevas guardias serán revocados de inmediato.`)) return;

            emp.estado = 'inactivo';
            emp.motivoBaja = motivo;
            emp.fechaBaja = new Date().toISOString().split('T')[0];

            await window.ViasaStorage.guardarRegistro('empleados', emp);

            const guardias = await window.ViasaStorage.obtenerColeccion('guardias_turnos') || [];
            for (const g of guardias) {
                if (g.empleadoId === empId && g.fecha >= new Date().toISOString().split('T')[0]) {
                    g.estado = 'cancelado_baja';
                    await window.ViasaStorage.guardarRegistro('guardias_turnos', g);
                }
            }

            await window.ViasaStorage.guardarRegistro('banco_memoria_rrhh', {
                id: `MEM-BAJA-${emp.id}-${Date.now()}`,
                empleadoId: emp.id,
                nombre: emp.nombreCompleto,
                tipo: 'baja_logica',
                motivo: motivo,
                fecha: new Date().toISOString(),
                responsable: 'Gerente General'
            });

            if (window.ViasaAudio) window.ViasaAudio.playSuccess();
            alert(`🔒 Baja lógica ejecutada. El personal ${emp.nombreCompleto} ha sido deshabilitado con preservación histórica de expedientes.`);
            this.renderGuardiasHub();
        },

        async reactivarEmpleado(empId) {
            const emps = await this.obtenerEmpleados();
            const emp = emps.find(e => e.id === empId);
            if (!emp) return;

            if (!confirm(`¿Reactivar el expediente de ${emp.nombreCompleto} e incorporarlo nuevamente a la plantilla activa?`)) return;

            emp.estado = 'activo';
            emp.motivoBaja = null;
            emp.fechaReactivacion = new Date().toISOString().split('T')[0];

            await window.ViasaStorage.guardarRegistro('empleados', emp);
            if (window.ViasaAudio) window.ViasaAudio.playSuccess();
            alert(`✅ ${emp.nombreCompleto} ha sido reactivado y habilitado para asignación de turnos.`);
            this.renderGuardiasHub();
        },

        // Credencial Digital Carnet
        async verCredencialDigital(empId) {
            const emps = await this.obtenerEmpleados();
            const emp = emps.find(e => e.id === empId);
            if (!emp) return;

            this.empleadoCredencialActivoId = empId;

            const modal = document.getElementById('modal-credencial-digital');
            if (!modal) return;

            const deptoNorm = this.normalizarDepartamento(emp.departamento, emp.cargo);
            const fotoUrl = this.obtenerFotoEmpleado(emp);

            const fotoEl = document.getElementById('cred-foto-img');
            if (fotoEl) fotoEl.src = fotoUrl;

            document.getElementById('cred-nombre').textContent = emp.nombreCompleto || `${emp.nombres || ''} ${emp.apellidos || ''}`.trim();
            document.getElementById('cred-cargo').textContent = emp.cargo || 'Personal Operativo';
            const codEl = document.getElementById('cred-codigo-laboral');
            if (codEl) codEl.textContent = emp.codigoLaboral || 'PROD-001';
            document.getElementById('cred-depto').textContent = `Departamento: ${deptoNorm}`;
            document.getElementById('cred-cedula').textContent = `C.I: ${emp.cedula || 'N/A'}`;
            document.getElementById('cred-pin').textContent = `PIN: ${emp.pinAcceso || emp.pinFichaje || '1234'}`;
            document.getElementById('cred-ingreso').textContent = `Ingreso: ${emp.fechaIngreso || '2026-01-15'}`;
            
            const qrImg = document.getElementById('cred-qr-img');
            if (qrImg) {
                if (emp.qrCustomImage) {
                    qrImg.src = emp.qrCustomImage;
                } else if (window.ViasaCodeEngine && window.ViasaCodeEngine.qr && typeof window.ViasaCodeEngine.qr.renderQRCanvas === 'function') {
                    const canvas = window.ViasaCodeEngine.qr.renderQRCanvas(emp.qrToken || `NV-EMP-PROD-${emp.cedula}-8F2A`, { size: 180, colorDark: '#0f172a' });
                    qrImg.src = canvas.toDataURL('image/png');
                } else {
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(emp.qrToken || `VIASA-EMP-${emp.cedula}`)}&color=0f172a`;
                    qrImg.src = qrUrl;
                }
            }

            modal.style.display = 'flex';
        },

        cerrarModalCredencial() {
            const modal = document.getElementById('modal-credencial-digital');
            if (modal) modal.style.display = 'none';
        },

        // ======================================================================
        // 2. MATRIZ DE GUARDIAS, TURNOS DINÁMICOS Y BÓVEDA LOTTT
        // ======================================================================
        async inicializarTurnosOperativos() {
            let turnos = await window.ViasaStorage.obtenerColeccion('turnos_operativos');
            if (!turnos || turnos.length === 0) {
                turnos = [
                    {
                        id: 'madrugada',
                        orden: 1,
                        nombre: 'Turno Madrugada',
                        horaInicio: '04:00',
                        horaFin: '12:00',
                        icono: 'fa-moon',
                        color: '#6366f1',
                        colorBorde: '#6366f1',
                        pautas: 'Encendido de hornos, amasado inicial de pan canilla y galletería fina.'
                    },
                    {
                        id: 'matutino',
                        orden: 2,
                        nombre: 'Turno Matutino',
                        horaInicio: '06:30',
                        horaFin: '14:30',
                        icono: 'fa-sun',
                        color: '#f59e0b',
                        colorBorde: '#f59e0b',
                        pautas: 'Atención a primera línea de mostrador, horneado continuo y repostería fresca.'
                    },
                    {
                        id: 'vespertino',
                        orden: 3,
                        nombre: 'Turno Vespertino',
                        horaInicio: '13:00',
                        horaFin: '21:00',
                        icono: 'fa-cloud-sun',
                        color: '#06b6d4',
                        colorBorde: '#06b6d4',
                        pautas: 'Producción de panes de merienda, rotación de vitrinas y despacho a clientes VIP.'
                    },
                    {
                        id: 'nocturno',
                        orden: 4,
                        nombre: 'Turno Nocturno',
                        horaInicio: '21:00',
                        horaFin: '05:00',
                        icono: 'fa-star-half-stroke',
                        color: '#ec4899',
                        colorBorde: '#ec4899',
                        pautas: 'Limpieza profunda, fermentación lenta, custodia de planta física y vanguardia operativa.'
                    }
                ];
                for (const t of turnos) {
                    await window.ViasaStorage.guardarRegistro('turnos_operativos', t);
                }
            }
            return turnos.sort((a, b) => (a.orden || 0) - (b.orden || 0));
        },

        async obtenerTurnos() {
            let turnos = await window.ViasaStorage.obtenerColeccion('turnos_operativos');
            if (!turnos || turnos.length === 0) {
                turnos = await this.inicializarTurnosOperativos();
            }
            return turnos.sort((a, b) => (a.orden || 0) - (b.orden || 0));
        },

        async obtenerGuardias() {
            let grds = await window.ViasaStorage.obtenerColeccion('guardias_turnos');
            if (!grds || grds.length === 0) {
                grds = window.ViasaDatabase.guardiasTurnos || [];
            }
            return grds;
        },

        calcularHorasTurnoLOTTT(horaInicio, horaFin) {
            if (!horaInicio || !horaFin) {
                return { duracionHoras: 8, horasDiurnas: 8, horasNocturnas: 0, tipo: 'Diurna', limiteLegal: '8h máx / 44h sem', recargo: '0% recargo' };
            }
            const [h1, m1] = horaInicio.split(':').map(Number);
            const [h2, m2] = horaFin.split(':').map(Number);
            let minIni = h1 * 60 + m1;
            let minFin = h2 * 60 + m2;
            if (minFin <= minIni) minFin += 24 * 60; // Pasa la medianoche

            const totalMin = minFin - minIni;
            const duracionHoras = +(totalMin / 60).toFixed(2);

            let minNocturnos = 0;
            let minDiurnos = 0;

            for (let m = minIni; m < minFin; m++) {
                const mod = m % (24 * 60);
                // Nocturno: entre 19:00 (1140 min) y 05:00 (300 min) según Art. 173 LOTTT
                if (mod >= 1140 || mod < 300) {
                    minNocturnos++;
                } else {
                    minDiurnos++;
                }
            }

            const horasNocturnas = +(minNocturnos / 60).toFixed(2);
            const horasDiurnas = +(minDiurnos / 60).toFixed(2);

            let tipo = 'Diurna';
            let limiteLegal = '8 hrs/día (44 hrs/sem)';
            let recargo = 'Jornada Diurna Estándar';

            if (horasNocturnas > 4) {
                tipo = 'Nocturna (Total)';
                limiteLegal = '7 hrs/día (35 hrs/sem - Art. 173 LOTTT)';
                recargo = '+30% Recargo Nocturno íntegro (Art. 117 LOTTT)';
            } else if (horasNocturnas > 0) {
                tipo = 'Mixta';
                limiteLegal = '7.5 hrs/día (37.5 hrs/sem - Art. 173 LOTTT)';
                recargo = `+30% Recargo Nocturno sobre ${horasNocturnas} hrs (Art. 117 LOTTT)`;
            }

            return {
                duracionHoras,
                horasDiurnas,
                horasNocturnas,
                tipo,
                limiteLegal,
                recargo
            };
        },

        actualizarCalculoHorasModalTurno() {
            const hIni = document.getElementById('turno-hora-inicio')?.value || '06:00';
            const hFin = document.getElementById('turno-hora-fin')?.value || '14:00';
            const info = this.calcularHorasTurnoLOTTT(hIni, hFin);
            const ind = document.getElementById('turno-lottt-indicator');
            if (ind) {
                ind.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-weight: 800; color: #fbbf24;">
                            <i class="fa-solid fa-calculator"></i> Duración: ${info.duracionHoras} Horas
                        </span>
                        <span class="badge-live-alert" style="background: ${info.horasNocturnas > 0 ? '#6b21a8' : '#047857'}; font-size: 0.68rem; padding: 2px 7px;">
                            ${info.tipo}
                        </span>
                    </div>
                    <div style="color: #cbd5e1; line-height: 1.4;">
                        <div>Diurnas: <strong>${info.horasDiurnas}h</strong> | Nocturnas: <strong style="color: #c084fc;">${info.horasNocturnas}h</strong></div>
                        <div style="font-size: 0.68rem; color: #94a3b8; margin-top: 2px;">
                            <i class="fa-solid fa-scale-balanced" style="color: #38bdf8;"></i> ${info.limiteLegal} &bull; <span style="color: #34d399;">${info.recargo}</span>
                        </div>
                    </div>
                `;
            }
        },

        async abrirModalTurno(turnoId = null) {
            const modal = document.getElementById('modal-turno-form');
            if (!modal) return;

            const turnos = await this.obtenerTurnos();
            const emps = await this.obtenerEmpleados();
            const activos = emps.filter(e => e.estado === 'activo');
            const guardias = await this.obtenerGuardias();

            const tit = document.getElementById('modal-turno-titulo');
            const hiddenId = document.getElementById('turno-id-hidden');
            const ordInput = document.getElementById('turno-orden');
            const nomInput = document.getElementById('turno-nombre');
            const hIniInput = document.getElementById('turno-hora-inicio');
            const hFinInput = document.getElementById('turno-hora-fin');
            const colInput = document.getElementById('turno-color');
            const icoSelect = document.getElementById('turno-icono');
            const pauText = document.getElementById('turno-pautas');
            const boxPersonal = document.getElementById('turno-personal-selector-box');

            let turnoActual = null;
            if (turnoId) {
                turnoActual = turnos.find(t => t.id === turnoId);
            }

            if (turnoActual) {
                if (tit) tit.innerHTML = `<i class="fa-solid fa-pen" style="color:#2dd4bf;"></i> Modificar Turno: ${turnoActual.nombre}`;
                if (hiddenId) hiddenId.value = turnoActual.id;
                if (ordInput) ordInput.value = turnoActual.orden || 1;
                if (nomInput) nomInput.value = turnoActual.nombre || '';
                if (hIniInput) hIniInput.value = turnoActual.horaInicio || '06:00';
                if (hFinInput) hFinInput.value = turnoActual.horaFin || '14:00';
                if (colInput) colInput.value = turnoActual.color || '#10b981';
                if (icoSelect) icoSelect.value = turnoActual.icono || 'fa-sun';
                if (pauText) pauText.value = turnoActual.pautas || '';
            } else {
                if (tit) tit.innerHTML = `<i class="fa-solid fa-plus" style="color:#2dd4bf;"></i> Crear Nuevo Turno Operativo`;
                if (hiddenId) hiddenId.value = '';
                if (ordInput) ordInput.value = turnos.length + 1;
                if (nomInput) nomInput.value = '';
                if (hIniInput) hIniInput.value = '06:00';
                if (hFinInput) hFinInput.value = '14:00';
                if (colInput) colInput.value = '#10b981';
                if (icoSelect) icoSelect.value = 'fa-sun';
                if (pauText) pauText.value = '';
            }

            this.actualizarCalculoHorasModalTurno();

            // Personal en este turno actualmente
            const enTurnoIds = new Set(
                guardias
                    .filter(g => g.turno === (turnoActual ? turnoActual.id : '') && g.fecha === this.fechaSeleccionada && g.estado === 'activo')
                    .map(g => g.empleadoId)
            );

            if (boxPersonal) {
                boxPersonal.innerHTML = activos.map(e => {
                    const isChecked = enTurnoIds.has(e.id);
                    const foto = this.obtenerFotoEmpleado(e);
                    const deptoStyle = this.obtenerEstiloDepto(this.normalizarDepartamento(e.departamento, e.cargo));
                    return `
                        <label style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 8px; border-radius: 6px; background: rgba(255,255,255,0.03); border: 1px solid #1e293b; cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                                <input type="checkbox" class="turno-emp-chk" value="${e.id}" ${isChecked ? 'checked' : ''} style="accent-color: #10b981;">
                                <img src="${foto}" style="width: 26px; height: 26px; border-radius: 6px; object-fit: cover;">
                                <div style="min-width: 0;">
                                    <div style="color: #fff; font-size: 0.78rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${e.nombreCompleto || e.nombres}</div>
                                    <div style="color: #94a3b8; font-size: 0.68rem;">${e.cargo}</div>
                                </div>
                            </div>
                            <span class="${deptoStyle.clase}" style="font-size: 0.65rem; padding: 1px 6px;">${deptoStyle.label}</span>
                        </label>
                    `;
                }).join('');

                const cntBadge = document.getElementById('turno-personal-count-badge');
                if (cntBadge) cntBadge.textContent = `${enTurnoIds.size} seleccionados para hoy`;
            }

            modal.style.display = 'flex';
        },

        cerrarModalTurno() {
            const modal = document.getElementById('modal-turno-form');
            if (modal) modal.style.display = 'none';
        },

        async guardarTurnoForm(e) {
            e.preventDefault();
            const idHidden = document.getElementById('turno-id-hidden').value.trim();
            const orden = parseInt(document.getElementById('turno-orden').value) || 1;
            const nombre = document.getElementById('turno-nombre').value.trim();
            const horaInicio = document.getElementById('turno-hora-inicio').value;
            const horaFin = document.getElementById('turno-hora-fin').value;
            const color = document.getElementById('turno-color').value;
            const icono = document.getElementById('turno-icono').value;
            const pautas = document.getElementById('turno-pautas').value.trim();

            if (!nombre) {
                alert('Por favor indica el nombre del turno.');
                return;
            }

            const turnos = await this.obtenerTurnos();
            let turnoId = idHidden;
            if (!turnoId) {
                turnoId = `TRN-${Date.now().toString().slice(-6)}`;
            }

            const turnoObj = {
                id: turnoId,
                orden: orden,
                nombre: nombre,
                horaInicio: horaInicio,
                horaFin: horaFin,
                color: color,
                colorBorde: color,
                icono: icono,
                pautas: pautas
            };

            await window.ViasaStorage.guardarRegistro('turnos_operativos', turnoObj);

            // Asignar o desasignar personal marcado en el selector rápido
            const chks = document.querySelectorAll('.turno-emp-chk');
            const emps = await this.obtenerEmpleados();
            const guardias = await this.obtenerGuardias();

            for (const chk of chks) {
                const empId = chk.value;
                const emp = emps.find(x => x.id === empId);
                if (!emp) continue;

                const existente = guardias.find(g => g.empleadoId === empId && g.fecha === this.fechaSeleccionada);
                if (chk.checked) {
                    if (existente) {
                        existente.turno = turnoId;
                        existente.nombreTurno = `${nombre} (${horaInicio} - ${horaFin})`;
                        existente.horaEntrada = horaInicio;
                        existente.horaSalida = horaFin;
                        await window.ViasaStorage.guardarRegistro('guardias_turnos', existente);
                    } else {
                        const nuevaGrd = {
                            id: `GRD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*1000)}`,
                            empleadoId: emp.id,
                            nombreEmpleado: emp.nombreCompleto || emp.nombres,
                            cargo: emp.cargo,
                            departamento: emp.departamento,
                            turno: turnoId,
                            nombreTurno: `${nombre} (${horaInicio} - ${horaFin})`,
                            horaEntrada: horaInicio,
                            horaSalida: horaFin,
                            fecha: this.fechaSeleccionada,
                            estado: 'activo',
                            ubicacionAsignada: 'Sede Principal (La Sabanita)',
                            supervisor: 'Gerente General'
                        };
                        await window.ViasaStorage.guardarRegistro('guardias_turnos', nuevaGrd);
                    }
                } else if (existente && existente.turno === turnoId) {
                    await window.ViasaStorage.eliminarRegistro('guardias_turnos', existente.id);
                }
            }

            // Registrar en Anales Históricos
            await this.registrarEventoAnales({
                tipoEvento: idHidden ? 'turno_modificado' : 'creacion_turno',
                turnoId: turnoId,
                nombreTurno: nombre,
                fecha: this.fechaSeleccionada,
                detalles: `Turno ${nombre} [${horaInicio} - ${horaFin}] configurado exitosamente.`
            });

            this.cerrarModalTurno();
            if (window.ViasaAudio) window.ViasaAudio.playSuccess();
            this.mostrarToast(`✅ Turno "${nombre}" guardado y sincronizado.`, 'success');
            this.renderGuardiasHub();
        },

        async eliminarTurno(turnoId) {
            const turnos = await this.obtenerTurnos();
            const turno = turnos.find(t => t.id === turnoId);
            if (!turno) return;

            const confirmar = confirm(`¿Estás seguro de eliminar el turno "${turno.nombre}"?\nEsta acción retirará la columna de la matriz operativa.`);
            if (!confirmar) return;

            await window.ViasaStorage.eliminarRegistro('turnos_operativos', turnoId);

            await this.registrarEventoAnales({
                tipoEvento: 'turno_eliminado',
                turnoId: turnoId,
                nombreTurno: turno.nombre,
                fecha: this.fechaSeleccionada,
                detalles: `Turno ${turno.nombre} eliminado de la configuración operativa.`
            });

            if (window.ViasaAudio) window.ViasaAudio.playTrash();
            this.mostrarToast(`🗑️ Turno "${turno.nombre}" eliminado.`, 'info');
            this.renderGuardiasHub();
        },

        async abrirSelectorModificarTurno() {
            const turnos = await this.obtenerTurnos();
            if (turnos.length === 0) {
                alert('No hay turnos registrados para modificar.');
                return;
            }
            if (turnos.length === 1) {
                this.abrirModalTurno(turnos[0].id);
                return;
            }
            const opciones = turnos.map((t, idx) => `${idx + 1}. ${t.nombre} (${t.horaInicio} - ${t.horaFin})`).join('\n');
            const resp = prompt(`Seleccione el número del Turno que desea modificar:\n\n${opciones}`, '1');
            if (resp === null) return;
            const num = parseInt(resp);
            if (num >= 1 && num <= turnos.length) {
                this.abrirModalTurno(turnos[num - 1].id);
            }
        },

        async abrirSelectorEliminarTurno() {
            const turnos = await this.obtenerTurnos();
            if (turnos.length === 0) {
                alert('No hay turnos para eliminar.');
                return;
            }
            const opciones = turnos.map((t, idx) => `${idx + 1}. ${t.nombre}`).join('\n');
            const resp = prompt(`Seleccione el número del Turno que desea eliminar:\n\n${opciones}`, '1');
            if (resp === null) return;
            const num = parseInt(resp);
            if (num >= 1 && num <= turnos.length) {
                this.eliminarTurno(turnos[num - 1].id);
            }
        },

        async abrirModalReordenarTurnos() {
            const modal = document.getElementById('modal-reordenar-turnos');
            if (!modal) return;
            const container = document.getElementById('reordenar-turnos-list');
            const turnos = await this.obtenerTurnos();

            if (container) {
                container.innerHTML = turnos.map((t, idx) => `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:10px 14px; border-radius:8px; border-left:4px solid ${t.color || '#38bdf8'};">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="background:#0f172a; color:#fbbf24; font-weight:800; font-size:0.8rem; padding:2px 8px; border-radius:6px;">#${t.orden || (idx+1)}</span>
                            <div>
                                <strong style="color:#fff; font-size:0.85rem;">${t.nombre}</strong>
                                <div style="font-size:0.7rem; color:#94a3b8;">${t.horaInicio} - ${t.horaFin}</div>
                            </div>
                        </div>
                        <div style="display:flex; gap:6px;">
                            <button type="button" class="btn-turno-mini" onclick="ViasaGuardiasEngine.moverTurnoOrden('${t.id}', -1)" ${idx === 0 ? 'disabled style="opacity:0.4;"' : ''} title="Subir">
                                <i class="fa-solid fa-arrow-up"></i>
                            </button>
                            <button type="button" class="btn-turno-mini" onclick="ViasaGuardiasEngine.moverTurnoOrden('${t.id}', 1)" ${idx === turnos.length - 1 ? 'disabled style="opacity:0.4;"' : ''} title="Bajar">
                                <i class="fa-solid fa-arrow-down"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }

            modal.style.display = 'flex';
        },

        cerrarModalReordenarTurnos() {
            const modal = document.getElementById('modal-reordenar-turnos');
            if (modal) modal.style.display = 'none';
        },

        async moverTurnoOrden(turnoId, delta) {
            const turnos = await this.obtenerTurnos();
            const idx = turnos.findIndex(t => t.id === turnoId);
            if (idx === -1) return;
            const targetIdx = idx + delta;
            if (targetIdx < 0 || targetIdx >= turnos.length) return;

            const temp = turnos[idx].orden;
            turnos[idx].orden = turnos[targetIdx].orden;
            turnos[targetIdx].orden = temp;

            await window.ViasaStorage.guardarRegistro('turnos_operativos', turnos[idx]);
            await window.ViasaStorage.guardarRegistro('turnos_operativos', turnos[targetIdx]);

            this.abrirModalReordenarTurnos();
            this.renderGuardiasHub();
        },

        async reordenarTurnoDirecto(turnoId, delta) {
            await this.moverTurnoOrden(turnoId, delta);
            this.mostrarToast('↕️ Prioridad del turno actualizada.', 'info');
        },

        setVistaTemporalMatriz(modo) {
            this.vistaTemporalMatriz = modo;
            this.renderGuardiasHub();
        },

        setMesOperativo(val) {
            if (val) this.mesOperativo = val;
            this.renderGuardiasHub();
        },

        cambiarModoAsignacionModal(modo) {
            this.modoAsignacionModal = modo;
            const hid = document.getElementById('asig-modo-actual');
            if (hid) hid.value = modo;

            const tDia = document.getElementById('tab-asig-modo-dia');
            const tSem = document.getElementById('tab-asig-modo-semana');
            const tMes = document.getElementById('tab-asig-modo-mes');

            const sDia = document.getElementById('asig-seccion-dia');
            const sSem = document.getElementById('asig-seccion-semana');
            const sMes = document.getElementById('asig-seccion-mes');

            if (tDia) tDia.classList.toggle('active', modo === 'dia');
            if (tSem) tSem.classList.toggle('active', modo === 'semana');
            if (tMes) tMes.classList.toggle('active', modo === 'mes');

            if (sDia) sDia.style.display = modo === 'dia' ? 'block' : 'none';
            if (sSem) sSem.style.display = modo === 'semana' ? 'block' : 'none';
            if (sMes) sMes.style.display = modo === 'mes' ? 'block' : 'none';
        },

        copiarSemana1ATodoElMes() {
            const s1 = document.getElementById('asig-mes-sem1-turno')?.value;
            if (!s1) return;
            const s2 = document.getElementById('asig-mes-sem2-turno');
            const s3 = document.getElementById('asig-mes-sem3-turno');
            const s4 = document.getElementById('asig-mes-sem4-turno');
            if (s2) s2.value = s1;
            if (s3) s3.value = s1;
            if (s4) s4.value = s1;
            this.mostrarToast('📋 Turno de Semana 1 copiado a las 4 semanas del mes.', 'info');
        },

        async rotarEquiposSemanalmente() {
            const turnos = await this.obtenerTurnos();
            if (turnos.length < 2) {
                alert('Se requieren al menos 2 turnos configurados para activar la rotación.');
                return;
            }
            const s1 = document.getElementById('asig-mes-sem1-turno');
            const s2 = document.getElementById('asig-mes-sem2-turno');
            const s3 = document.getElementById('asig-mes-sem3-turno');
            const s4 = document.getElementById('asig-mes-sem4-turno');

            if (s1 && s2 && s3 && s4) {
                const idx1 = turnos.findIndex(t => t.id === s1.value) || 0;
                s2.value = turnos[(idx1 + 1) % turnos.length].id;
                s3.value = turnos[(idx1 + 2) % turnos.length].id;
                s4.value = turnos[(idx1 + 3) % turnos.length].id;
                this.mostrarToast('🔄 Rotación secuencial de turnos aplicada para las 4 semanas.', 'info');
            }
        },

        async abrirModalAsignarGuardia(turnoPreseleccionado = null) {
            const modal = document.getElementById('modal-asignar-guardia');
            if (!modal) return;

            const emps = await this.obtenerEmpleados();
            const activos = emps.filter(e => e.estado === 'activo');
            const turnos = await this.obtenerTurnos();

            const selEmp = document.getElementById('asig-guardia-emp');
            if (selEmp) {
                selEmp.innerHTML = activos.map(e => `
                    <option value="${e.id}">${e.nombreCompleto || e.nombres} &bull; ${e.cargo} (${e.departamento})</option>
                `).join('');
            }

            const optionsTurnosHTML = turnos.map(t => `
                <option value="${t.id}" ${turnoPreseleccionado === t.id ? 'selected' : ''}>${t.nombre} (${t.horaInicio} - ${t.horaFin})</option>
            `).join('');

            const selTurno = document.getElementById('asig-guardia-turno');
            if (selTurno) selTurno.innerHTML = optionsTurnosHTML;

            const selTurnoSem = document.getElementById('asig-guardia-turno-semana');
            if (selTurnoSem) selTurnoSem.innerHTML = optionsTurnosHTML;

            const s1 = document.getElementById('asig-mes-sem1-turno');
            const s2 = document.getElementById('asig-mes-sem2-turno');
            const s3 = document.getElementById('asig-mes-sem3-turno');
            const s4 = document.getElementById('asig-mes-sem4-turno');
            if (s1) s1.innerHTML = optionsTurnosHTML;
            if (s2) s2.innerHTML = optionsTurnosHTML;
            if (s3) s3.innerHTML = optionsTurnosHTML;
            if (s4) s4.innerHTML = optionsTurnosHTML;

            const fInput = document.getElementById('asig-guardia-fecha');
            if (fInput) fInput.value = this.fechaSeleccionada;

            this.cambiarModoAsignacionModal('dia');
            modal.style.display = 'flex';
        },

        cerrarModalAsignarGuardia() {
            const modal = document.getElementById('modal-asignar-guardia');
            if (modal) modal.style.display = 'none';
        },

        async guardarAsignacionGuardia(e) {
            e.preventDefault();
            const modo = document.getElementById('asig-modo-actual')?.value || 'dia';
            const empId = document.getElementById('asig-guardia-emp').value;
            const ubicacion = document.getElementById('asig-guardia-ubicacion').value.trim() || 'Sede Principal (La Sabanita)';

            const emps = await this.obtenerEmpleados();
            const emp = emps.find(x => x.id === empId);
            if (!emp) return;

            const turnos = await this.obtenerTurnos();

            if (modo === 'dia') {
                const fecha = document.getElementById('asig-guardia-fecha').value;
                const turnoId = document.getElementById('asig-guardia-turno').value;
                const tObj = turnos.find(t => t.id === turnoId) || turnos[0];

                const nuevaGuardia = {
                    id: `GRD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*1000)}`,
                    empleadoId: emp.id,
                    nombreEmpleado: emp.nombreCompleto || emp.nombres,
                    cargo: emp.cargo,
                    departamento: emp.departamento,
                    turno: tObj.id,
                    nombreTurno: `${tObj.nombre} (${tObj.horaInicio} - ${tObj.horaFin})`,
                    horaEntrada: tObj.horaInicio,
                    horaSalida: tObj.horaFin,
                    fecha: fecha,
                    estado: 'activo',
                    ubicacionAsignada: ubicacion,
                    supervisor: 'Gerente General'
                };

                await window.ViasaStorage.guardarRegistro('guardias_turnos', nuevaGuardia);

                const infoLOTTT = this.calcularHorasTurnoLOTTT(tObj.horaInicio, tObj.horaFin);
                await this.registrarEventoAnales({
                    tipoEvento: 'asignacion_guardia',
                    empleadoId: emp.id,
                    empleadoNombre: emp.nombreCompleto || emp.nombres,
                    cargo: emp.cargo,
                    turnoId: tObj.id,
                    nombreTurno: tObj.nombre,
                    fecha: fecha,
                    horasDiurnas: infoLOTTT.horasDiurnas,
                    horasNocturnas: infoLOTTT.horasNocturnas,
                    horasTotales: infoLOTTT.duracionHoras,
                    detalles: `Asignación diaria en ${tObj.nombre} para ${fecha}.`
                });

            } else if (modo === 'semana') {
                const semNum = parseInt(document.getElementById('asig-guardia-semana-num').value) || 1;
                const turnoId = document.getElementById('asig-guardia-turno-semana').value;
                const tObj = turnos.find(t => t.id === turnoId) || turnos[0];

                const diasSemanaChecks = [
                    { id: 'asig-dia-lun', diaIndex: 1 },
                    { id: 'asig-dia-mar', diaIndex: 2 },
                    { id: 'asig-dia-mie', diaIndex: 3 },
                    { id: 'asig-dia-jue', diaIndex: 4 },
                    { id: 'asig-dia-vie', diaIndex: 5 },
                    { id: 'asig-dia-sab', diaIndex: 6 },
                    { id: 'asig-dia-dom', diaIndex: 0 }
                ];

                const [anio, mes] = this.mesOperativo.split('-').map(Number);
                let startDay = (semNum - 1) * 7 + 1;
                let endDay = semNum === 4 ? new Date(anio, mes, 0).getDate() : semNum * 7;

                let guardiasCreadas = 0;
                for (let d = startDay; d <= endDay; d++) {
                    const dateObj = new Date(anio, mes - 1, d);
                    const dayOfWeek = dateObj.getDay();
                    const checkCfg = diasSemanaChecks.find(c => c.diaIndex === dayOfWeek);
                    const isChecked = checkCfg && document.getElementById(checkCfg.id)?.checked;

                    if (isChecked) {
                        const fechaStr = `${this.mesOperativo}-${String(d).padStart(2, '0')}`;
                        const nuevaGrd = {
                            id: `GRD-${Date.now().toString().slice(-6)}-${d}`,
                            empleadoId: emp.id,
                            nombreEmpleado: emp.nombreCompleto || emp.nombres,
                            cargo: emp.cargo,
                            departamento: emp.departamento,
                            turno: tObj.id,
                            nombreTurno: `${tObj.nombre} (${tObj.horaInicio} - ${tObj.horaFin})`,
                            horaEntrada: tObj.horaInicio,
                            horaSalida: tObj.horaFin,
                            fecha: fechaStr,
                            estado: 'activo',
                            ubicacionAsignada: ubicacion,
                            supervisor: 'Gerente General'
                        };
                        await window.ViasaStorage.guardarRegistro('guardias_turnos', nuevaGrd);
                        guardiasCreadas++;
                    }
                }

                await this.registrarEventoAnales({
                    tipoEvento: 'asignacion_semanal',
                    empleadoId: emp.id,
                    empleadoNombre: emp.nombreCompleto || emp.nombres,
                    cargo: emp.cargo,
                    turnoId: tObj.id,
                    nombreTurno: tObj.nombre,
                    fecha: `${this.mesOperativo}-Sem${semNum}`,
                    detalles: `Asignación de Semana ${semNum} (${guardiasCreadas} guardias programadas) en turno ${tObj.nombre}.`
                });

            } else if (modo === 'mes') {
                const s1 = document.getElementById('asig-mes-sem1-turno').value;
                const s2 = document.getElementById('asig-mes-sem2-turno').value;
                const s3 = document.getElementById('asig-mes-sem3-turno').value;
                const s4 = document.getElementById('asig-mes-sem4-turno').value;
                const [anio, mes] = this.mesOperativo.split('-').map(Number);
                const diasMes = new Date(anio, mes, 0).getDate();

                const semanasTurnos = [
                    { start: 1, end: 7, turnoId: s1 },
                    { start: 8, end: 14, turnoId: s2 },
                    { start: 15, end: 21, turnoId: s3 },
                    { start: 22, end: diasMes, turnoId: s4 }
                ];

                for (const sem of semanasTurnos) {
                    const tObj = turnos.find(t => t.id === sem.turnoId) || turnos[0];
                    for (let d = sem.start; d <= sem.end; d++) {
                        const dateObj = new Date(anio, mes - 1, d);
                        // Descanso domingo por defecto
                        if (dateObj.getDay() === 0) continue;

                        const fechaStr = `${this.mesOperativo}-${String(d).padStart(2, '0')}`;
                        const nuevaGrd = {
                            id: `GRD-${Date.now().toString().slice(-6)}-M${d}`,
                            empleadoId: emp.id,
                            nombreEmpleado: emp.nombreCompleto || emp.nombres,
                            cargo: emp.cargo,
                            departamento: emp.departamento,
                            turno: tObj.id,
                            nombreTurno: `${tObj.nombre} (${tObj.horaInicio} - ${tObj.horaFin})`,
                            horaEntrada: tObj.horaInicio,
                            horaSalida: tObj.horaFin,
                            fecha: fechaStr,
                            estado: 'activo',
                            ubicacionAsignada: ubicacion,
                            supervisor: 'Gerente General'
                        };
                        await window.ViasaStorage.guardarRegistro('guardias_turnos', nuevaGrd);
                    }
                }

                await this.registrarEventoAnales({
                    tipoEvento: 'asignacion_mensual',
                    empleadoId: emp.id,
                    empleadoNombre: emp.nombreCompleto || emp.nombres,
                    cargo: emp.cargo,
                    fecha: this.mesOperativo,
                    detalles: `Programación mensual completa de 4 semanas asignada a ${emp.nombreCompleto || emp.nombres}.`
                });
            }

            this.cerrarModalAsignarGuardia();
            if (window.ViasaAudio) window.ViasaAudio.playSuccess();
            this.mostrarToast(`✅ Programación guardada para ${emp.nombreCompleto || emp.nombres}.`, 'success');
            this.renderGuardiasHub();
        },

        async eliminarGuardia(guardiaId) {
            if (!confirm('¿Deseas desasignar / remover esta guardia del calendario operativo?')) return;
            const guardias = await this.obtenerGuardias();
            const index = guardias.findIndex(g => g.id === guardiaId);
            if (index >= 0) {
                const removed = guardias[index];
                guardias.splice(index, 1);
                await window.ViasaStorage.eliminarRegistro('guardias_turnos', guardiaId);

                await this.registrarEventoAnales({
                    tipoEvento: 'guardia_removida',
                    empleadoId: removed.empleadoId,
                    empleadoNombre: removed.nombreEmpleado,
                    turnoId: removed.turno,
                    fecha: removed.fecha,
                    detalles: `Guardia del día ${removed.fecha} desasignada.`
                });
            }
            if (window.ViasaAudio) window.ViasaAudio.playTrash();
            this.mostrarToast('🗑️ Guardia desasignada.', 'info');
            this.renderGuardiasHub();
        },

        // ======================================================================
        // BÓVEDA PERMANENTE: ANALES HISTÓRICOS Y DEDUCCIÓN DE BENEFICIOS LOTTT
        // ======================================================================
        async inicializarAnalesHistoricos() {
            let anales = await window.ViasaStorage.obtenerColeccion('anales_guardias_rrhh');
            if (!anales || anales.length === 0) {
                const emps = await this.obtenerEmpleados();
                const turnos = await this.obtenerTurnos();
                anales = [];
                const anioActual = 2026;

                // Generar historial estructurado de los últimos meses para la plantilla
                for (const e of emps) {
                    const depto = this.normalizarDepartamento(e.departamento, e.cargo);
                    let turnoPref = turnos[1] || { id: 'matutino', nombre: 'Turno Matutino', horaInicio: '06:30', horaFin: '14:30' };
                    if (depto === 'Fabricación') turnoPref = turnos[0] || turnoPref;
                    if (depto === 'Cocina') turnoPref = turnos[1] || turnoPref;
                    if (depto === 'Despacho') turnoPref = turnos[2] || turnoPref;

                    const infoTurno = this.calcularHorasTurnoLOTTT(turnoPref.horaInicio, turnoPref.horaFin);

                    // 10 registros históricos por empleado
                    for (let m = 1; m <= 10; m++) {
                        const mesStr = String(m).padStart(2, '0');
                        anales.push({
                            id: `ANL-${anioActual}-${mesStr}-${e.id.replace('EMP-', '')}`,
                            timestamp: `${anioActual}-${mesStr}-15T08:00:00.000Z`,
                            fecha: `${anioActual}-${mesStr}-15`,
                            tipoEvento: m % 4 === 0 ? 'feriado_trabajado' : 'guardia_cumplida',
                            empleadoId: e.id,
                            empleadoNombre: e.nombreCompleto || e.nombres,
                            cargo: e.cargo,
                            departamento: e.departamento,
                            turnoId: turnoPref.id,
                            nombreTurno: turnoPref.nombre,
                            horasDiurnas: infoTurno.horasDiurnas,
                            horasNocturnas: infoTurno.horasNocturnas,
                            horasTotales: infoTurno.duracionHoras,
                            ubicacion: 'Sede Principal (La Sabanita)',
                            operador: 'Gerencia General (Auditoría RRHH)',
                            detalles: `Guardia mensual cumplida en ${turnoPref.nombre}. Registro formal de nómina LOTTT.`
                        });
                    }
                }

                for (const a of anales) {
                    await window.ViasaStorage.guardarRegistro('anales_guardias_rrhh', a);
                }
            }
            return anales;
        },

        async obtenerAnalesHistoricos() {
            let anales = await window.ViasaStorage.obtenerColeccion('anales_guardias_rrhh');
            if (!anales || anales.length === 0) {
                anales = await this.inicializarAnalesHistoricos();
            }
            return anales.sort((a, b) => (b.timestamp || b.fecha || '').localeCompare(a.timestamp || a.fecha || ''));
        },

        async registrarEventoAnales(evento) {
            const registro = {
                id: `ANL-${Date.now().toString().slice(-7)}-${Math.floor(Math.random()*1000)}`,
                timestamp: new Date().toISOString(),
                fecha: evento.fecha || new Date().toISOString().split('T')[0],
                tipoEvento: evento.tipoEvento || 'evento_general',
                empleadoId: evento.empleadoId || 'SYS-VIASA',
                empleadoNombre: evento.empleadoNombre || 'Personal Operativo',
                cargo: evento.cargo || 'Operador',
                departamento: evento.departamento || 'General',
                turnoId: evento.turnoId || 'general',
                nombreTurno: evento.nombreTurno || 'General',
                horasDiurnas: evento.horasDiurnas || 0,
                horasNocturnas: evento.horasNocturnas || 0,
                horasTotales: evento.horasTotales || 0,
                ubicacion: evento.ubicacion || 'Sede Principal (La Sabanita)',
                operador: evento.operador || 'Administrador VIASA',
                detalles: evento.detalles || 'Operación registrada en la bóveda inmutable.'
            };
            await window.ViasaStorage.guardarRegistro('anales_guardias_rrhh', registro);
            return registro;
        },

        async abrirModalAnales() {
            const modal = document.getElementById('modal-anales-beneficios');
            if (!modal) return;

            const tasaBCV = (window.ViasaApp && window.ViasaApp.tasaBCV) || parseFloat(window.ViasaStorage?.getItem('tasa_bcv', 36.85)) || 36.85;
            const tasaUSDT = (window.ViasaApp && (window.ViasaApp.tasaUSDT || window.ViasaApp.tasaParalelo)) || parseFloat(window.ViasaStorage?.getItem('tasa_usdt', 39.50)) || 39.50;

            const bcvEl = document.getElementById('anales-tasa-bcv-val');
            const usdtEl = document.getElementById('anales-tasa-usdt-val');
            if (bcvEl) bcvEl.textContent = `Bs. ${tasaBCV.toFixed(2)}`;
            if (usdtEl) usdtEl.textContent = `Bs. ${tasaUSDT.toFixed(2)}`;

            const emps = await this.obtenerEmpleados();
            const activos = emps.filter(e => e.estado === 'activo');

            const fEmp = document.getElementById('filtro-anales-emp');
            if (fEmp) {
                fEmp.innerHTML = `<option value="todos">Todos los Trabajadores (${activos.length})</option>` +
                    activos.map(e => `<option value="${e.id}">${e.nombreCompleto || e.nombres} &bull; ${e.cargo}</option>`).join('');
            }

            const lEmp = document.getElementById('lottt-select-emp');
            if (lEmp) {
                lEmp.innerHTML = `<option value="todos">Todos los Trabajadores (Matriz Consolidada)</option>` +
                    activos.map(e => `<option value="${e.id}">${e.nombreCompleto || e.nombres} &bull; ${e.cargo}</option>`).join('');
            }

            const fMes = document.getElementById('filtro-anales-mes');
            if (fMes) fMes.value = this.mesOperativo;

            this.cambiarPestanaAnales('bitacora');
            modal.style.display = 'flex';
        },

        cerrarModalAnales() {
            const modal = document.getElementById('modal-anales-beneficios');
            if (modal) modal.style.display = 'none';
        },

        cambiarPestanaAnales(pestana) {
            this.pestanaAnalesActiva = pestana;
            const tBit = document.getElementById('tab-anales-bitacora');
            const tLot = document.getElementById('tab-anales-lottt');
            const sBit = document.getElementById('seccion-anales-bitacora');
            const sLot = document.getElementById('seccion-anales-lottt');

            if (tBit) tBit.classList.toggle('active', pestana === 'bitacora');
            if (tLot) tLot.classList.toggle('active', pestana === 'lottt');
            if (sBit) sBit.style.display = pestana === 'bitacora' ? 'block' : 'none';
            if (sLot) sLot.style.display = pestana === 'lottt' ? 'block' : 'none';

            if (pestana === 'bitacora') {
                this.renderTablaAnalesBitacora();
            } else {
                this.renderCalculosLOTTT();
            }
        },

        async renderTablaAnalesBitacora() {
            const container = document.getElementById('anales-bitacora-table-container');
            if (!container) return;

            const anales = await this.obtenerAnalesHistoricos();
            const emps = await this.obtenerEmpleados();

            const fEmp = document.getElementById('filtro-anales-emp')?.value || 'todos';
            const fMes = document.getElementById('filtro-anales-mes')?.value || '';
            const fEve = document.getElementById('filtro-anales-evento')?.value || 'todos';

            let filtrados = anales;
            if (fEmp !== 'todos') {
                filtrados = filtrados.filter(a => a.empleadoId === fEmp);
            }
            if (fMes) {
                filtrados = filtrados.filter(a => (a.fecha || '').startsWith(fMes));
            }
            if (fEve !== 'todos') {
                filtrados = filtrados.filter(a => a.tipoEvento === fEve);
            }

            if (filtrados.length === 0) {
                container.innerHTML = `
                    <div style="padding: 24px; text-align: center; color: #64748b; font-size: 0.85rem;">
                        <i class="fa-solid fa-folder-open" style="font-size: 1.8rem; display: block; margin-bottom: 8px;"></i>
                        No se encontraron registros en los Anales para los filtros seleccionados.
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <table class="table-viasa-guardias" style="width: 100%; border-collapse: collapse; font-size: 0.74rem;">
                    <thead>
                        <tr style="border-bottom: 2px solid #334155; text-align: left; color: #fbbf24;">
                            <th style="padding: 8px 10px;">ID / Fecha</th>
                            <th style="padding: 8px 10px;">Trabajador</th>
                            <th style="padding: 8px 10px;">Tipo de Evento</th>
                            <th style="padding: 8px 10px;">Turno Asignado</th>
                            <th style="padding: 8px 10px;">Horas (D / N)</th>
                            <th style="padding: 8px 10px;">Detalles Operativos</th>
                            <th style="padding: 8px 10px;">Auditoría</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filtrados.slice(0, 50).map(a => {
                            const emp = emps.find(x => x.id === a.empleadoId);
                            const foto = this.obtenerFotoEmpleado(emp);
                            return `
                                <tr style="border-bottom: 1px solid #1e293b;">
                                    <td style="padding: 8px 10px; font-family: monospace; color: #38bdf8;">
                                        <strong>${a.id}</strong>
                                        <div style="color: #94a3b8; font-size: 0.68rem;">${a.fecha || ''}</div>
                                    </td>
                                    <td style="padding: 8px 10px;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <img src="${foto}" style="width: 26px; height: 26px; border-radius: 6px; object-fit: cover;">
                                            <div>
                                                <strong style="color: #fff;">${a.empleadoNombre || 'N/A'}</strong>
                                                <div style="color: #94a3b8; font-size: 0.68rem;">${a.cargo || ''}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="padding: 8px 10px;">
                                        <span class="badge-swap-status" style="background: rgba(168,85,247,0.15); border: 1px solid #a855f7; color: #c084fc; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px;">
                                            ${(a.tipoEvento || 'evento').replace(/_/g, ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td style="padding: 8px 10px; color: #e2e8f0;">
                                        ${a.nombreTurno || 'General'}
                                    </td>
                                    <td style="padding: 8px 10px; font-weight: 700;">
                                        <span style="color: #fbbf24;">${a.horasDiurnas || 0}h D</span> / 
                                        <span style="color: #c084fc;">${a.horasNocturnas || 0}h N</span>
                                        <div style="font-size: 0.68rem; color: #4ade80;">Total: ${a.horasTotales || ((a.horasDiurnas||0)+(a.horasNocturnas||0))}h</div>
                                    </td>
                                    <td style="padding: 8px 10px; color: #cbd5e1; max-width: 240px; font-size: 0.72rem;">
                                        ${a.detalles || ''}
                                    </td>
                                    <td style="padding: 8px 10px; color: #64748b; font-size: 0.68rem;">
                                        <i class="fa-solid fa-user-shield"></i> ${a.operador || 'Sistema'}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        },

        calcularBeneficiosEmpleadoLOTTT(emp, anales) {
            const salarioBaseUSD = parseFloat(emp.salarioBase || emp.salario || 280.00);
            const salarioDiarioUSD = salarioBaseUSD / 30;
            const valorHoraDiurna = salarioDiarioUSD / 8;
            const valorHoraNocturna = valorHoraDiurna * 1.30;
            const recargoHoraNocturna = valorHoraDiurna * 0.30;

            const analesEmp = anales.filter(a => a.empleadoId === emp.id);
            const diasEfectivos = Math.max(analesEmp.length * 2, 22);
            const semanasCompletas = Math.floor(diasEfectivos / 5) || 4;

            let fechaIngreso = new Date(emp.fechaIngreso || '2026-01-15');
            if (isNaN(fechaIngreso.getTime())) fechaIngreso = new Date('2026-01-15');
            const hoy = new Date();
            const mesesServicio = Math.max(1, Math.round((hoy - fechaIngreso) / (1000 * 60 * 60 * 24 * 30.4)));
            const aniosAntiguedad = Math.floor(mesesServicio / 12);

            let horasDiurnas = 0;
            let horasNocturnas = 0;
            let feriadosTrabajados = 0;

            for (const a of analesEmp) {
                horasDiurnas += (a.horasDiurnas || 0);
                horasNocturnas += (a.horasNocturnas || 0);
                if (a.tipoEvento === 'feriado_trabajado') feriadosTrabajados++;
            }

            // Fallback razonable si hay pocos eventos
            if (horasDiurnas === 0 && horasNocturnas === 0) {
                horasDiurnas = diasEfectivos * 7;
                horasNocturnas = diasEfectivos * 1;
            }

            // 1. Bono Nocturno (+30% Art. 117 LOTTT)
            const bonoNocturnoUSD = +(horasNocturnas * recargoHoraNocturna).toFixed(2);

            // 2. Feriados y Domingos (+50% Art. 120 LOTTT)
            const recargoFeriadosUSD = +(feriadosTrabajados * salarioDiarioUSD * 1.50).toFixed(2);

            // 3. Vacaciones y Bono Vacacional (Art. 190 y 192 LOTTT)
            // 15 días hábiles remunerados primer año + 1 día por año adicional
            const diasVacaciones = Math.min(30, 15 + aniosAntiguedad);
            const vacacionesUSD = +(diasVacaciones * salarioDiarioUSD).toFixed(2);
            const bonoVacacionalUSD = +(diasVacaciones * salarioDiarioUSD).toFixed(2);

            // 4. Utilidades / Aguinaldos (Art. 131 LOTTT)
            // Mínimo 30 días, prorrateado por meses trabajados en el año
            const fraccionAnio = Math.min(12, mesesServicio) / 12;
            const diasUtilidades = +(30 * fraccionAnio).toFixed(1);
            const utilidadesUSD = +(diasUtilidades * salarioDiarioUSD).toFixed(2);

            // 5. Garantía de Prestaciones Sociales (Art. 142 LOTTT)
            // 15 días por trimestre (5 días por mes) + 2 días adicionales por año
            const diasPrestaciones = (mesesServicio * 5) + (aniosAntiguedad >= 1 ? aniosAntiguedad * 2 : 0);
            const prestacionesUSD = +(diasPrestaciones * salarioDiarioUSD).toFixed(2);

            // Bono de Vanguardia / Asistencia Perfecta
            const bonoVanguardiaUSD = +(40.00 * fraccionAnio).toFixed(2);

            const totalPasivosUSD = +(vacacionesUSD + bonoVacacionalUSD + utilidadesUSD + bonoNocturnoUSD + recargoFeriadosUSD + prestacionesUSD + bonoVanguardiaUSD).toFixed(2);

            return {
                salarioBaseUSD,
                salarioDiarioUSD,
                diasEfectivos,
                semanasCompletas,
                mesesServicio,
                aniosAntiguedad,
                horasDiurnas,
                horasNocturnas,
                bonoNocturnoUSD,
                feriadosTrabajados,
                recargoFeriadosUSD,
                diasVacaciones,
                vacacionesUSD,
                bonoVacacionalUSD,
                diasUtilidades,
                utilidadesUSD,
                diasPrestaciones,
                prestacionesUSD,
                bonoVanguardiaUSD,
                totalPasivosUSD
            };
        },

        async renderCalculosLOTTT() {
            const gridKPIs = document.getElementById('lottt-kpis-grid');
            const tableConsolidado = document.getElementById('lottt-consolidado-table-container');
            if (!gridKPIs || !tableConsolidado) return;

            const emps = await this.obtenerEmpleados();
            const activos = emps.filter(e => e.estado === 'activo');
            const anales = await this.obtenerAnalesHistoricos();

            const tasaBCV = (window.ViasaApp && window.ViasaApp.tasaBCV) || parseFloat(window.ViasaStorage?.getItem('tasa_bcv', 36.85)) || 36.85;
            const tasaUSDT = (window.ViasaApp && (window.ViasaApp.tasaUSDT || window.ViasaApp.tasaParalelo)) || parseFloat(window.ViasaStorage?.getItem('tasa_usdt', 39.50)) || 39.50;

            const empSelId = document.getElementById('lottt-select-emp')?.value || 'todos';

            // Cálculos consolidados o de un solo empleado
            let targetEmps = activos;
            if (empSelId !== 'todos') {
                targetEmps = activos.filter(e => e.id === empSelId);
            }

            let sumaDias = 0;
            let sumaHorasDiurnas = 0;
            let sumaHorasNocturnas = 0;
            let sumaVacacionesUSD = 0;
            let sumaUtilidadesUSD = 0;
            let sumaBonosRecargosUSD = 0;
            let sumaPrestacionesUSD = 0;
            let sumaTotalUSD = 0;

            const resultadosPorEmp = targetEmps.map(emp => {
                const ben = this.calcularBeneficiosEmpleadoLOTTT(emp, anales);
                sumaDias += ben.diasEfectivos;
                sumaHorasDiurnas += ben.horasDiurnas;
                sumaHorasNocturnas += ben.horasNocturnas;
                sumaVacacionesUSD += (ben.vacacionesUSD + ben.bonoVacacionalUSD);
                sumaUtilidadesUSD += ben.utilidadesUSD;
                sumaBonosRecargosUSD += (ben.bonoNocturnoUSD + ben.recargoFeriadosUSD + ben.bonoVanguardiaUSD);
                sumaPrestacionesUSD += ben.prestacionesUSD;
                sumaTotalUSD += ben.totalPasivosUSD;
                return { emp, ben };
            });

            // 1. Renderizar Tarjetas de Resumen KPI
            gridKPIs.innerHTML = `
                <div class="lottt-kpi-box">
                    <span class="lbl"><i class="fa-solid fa-business-time" style="color:#fbbf24;"></i> Días / Horas Cumplidas</span>
                    <strong class="val" style="color:#fbbf24;">${sumaDias} Días</strong>
                    <span class="sub">${sumaHorasDiurnas}h Diurnas &bull; ${sumaHorasNocturnas}h Nocturnas</span>
                </div>

                <div class="lottt-kpi-box">
                    <span class="lbl"><i class="fa-solid fa-umbrella-beach" style="color:#38bdf8;"></i> Vacaciones + Bono (Art. 190/192)</span>
                    <strong class="val" style="color:#38bdf8;">$${sumaVacacionesUSD.toFixed(2)} USD</strong>
                    <span class="sub">Bs. ${(sumaVacacionesUSD * tasaBCV).toFixed(2)} (BCV) &bull; Bs. ${(sumaVacacionesUSD * tasaUSDT).toFixed(2)} (USDT)</span>
                </div>

                <div class="lottt-kpi-box">
                    <span class="lbl"><i class="fa-solid fa-gift" style="color:#4ade80;"></i> Utilidades / Aguinaldos (Art. 131)</span>
                    <strong class="val" style="color:#4ade80;">$${sumaUtilidadesUSD.toFixed(2)} USD</strong>
                    <span class="sub">Bs. ${(sumaUtilidadesUSD * tasaBCV).toFixed(2)} (BCV)</span>
                </div>

                <div class="lottt-kpi-box">
                    <span class="lbl"><i class="fa-solid fa-moon" style="color:#c084fc;"></i> Recargos y Bonos (Art. 117/120)</span>
                    <strong class="val" style="color:#c084fc;">$${sumaBonosRecargosUSD.toFixed(2)} USD</strong>
                    <span class="sub">Nocturno (+30%) &bull; Feriados (+50%) &bull; Asistencia</span>
                </div>

                <div class="lottt-kpi-box" style="border-color:#f59e0b; background:rgba(245,158,11,0.08);">
                    <span class="lbl" style="color:#fbbf24;"><i class="fa-solid fa-vault"></i> Prestaciones Sociales (Art. 142)</span>
                    <strong class="val" style="color:#fbbf24;">$${sumaPrestacionesUSD.toFixed(2)} USD</strong>
                    <span class="sub" style="color:#fde68a;">Garantía Trimestral Acumulada</span>
                </div>

                <div class="lottt-kpi-box" style="border-color:#10b981; background:rgba(16,185,129,0.08);">
                    <span class="lbl" style="color:#34d399;"><i class="fa-solid fa-sack-dollar"></i> Pasivo Total Acumulado LOTTT</span>
                    <strong class="val" style="color:#34d399;">$${sumaTotalUSD.toFixed(2)} USD</strong>
                    <span class="sub" style="color:#a7f3d0; font-weight:800;">Bs. ${(sumaTotalUSD * tasaBCV).toFixed(2)} BCV</span>
                </div>
            `;

            // 2. Renderizar Tabla Consolidada
            tableConsolidado.innerHTML = `
                <table class="table-lottt-analitica">
                    <thead>
                        <tr>
                            <th>Trabajador</th>
                            <th>Cargo / Depto</th>
                            <th>Salario Base</th>
                            <th>Antigüedad</th>
                            <th>Vacaciones + Bono</th>
                            <th>Utilidades</th>
                            <th>Recargo Noct/Fer</th>
                            <th>Prestaciones (Garantía)</th>
                            <th>Total Acumulado ($ / Bs.)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${resultadosPorEmp.map(({ emp, ben }) => {
                            const foto = this.obtenerFotoEmpleado(emp);
                            const totalBs = (ben.totalPasivosUSD * tasaBCV).toFixed(2);
                            return `
                                <tr>
                                    <td>
                                        <div style="display:flex; align-items:center; gap:8px;">
                                            <img src="${foto}" style="width:28px; height:28px; border-radius:6px; object-fit:cover;">
                                            <div>
                                                <strong style="color:#fff;">${emp.nombreCompleto || emp.nombres}</strong>
                                                <div style="font-size:0.68rem; color:#94a3b8;">${emp.cedula || 'V-00000000'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style="color:#cbd5e1; font-weight:700;">${emp.cargo}</div>
                                        <div style="font-size:0.68rem; color:#38bdf8;">${emp.departamento}</div>
                                    </td>
                                    <td style="color:#fbbf24; font-weight:800; font-family:monospace;">
                                        $${ben.salarioBaseUSD.toFixed(2)}
                                        <div style="font-size:0.65rem; color:#94a3b8;">($${ben.salarioDiarioUSD.toFixed(2)}/día)</div>
                                    </td>
                                    <td style="color:#cbd5e1;">
                                        ${ben.mesesServicio} meses
                                        <div style="font-size:0.68rem; color:#4ade80;">${ben.diasEfectivos}d / ${ben.horasNocturnas}h noct</div>
                                    </td>
                                    <td>
                                        <strong style="color:#38bdf8;">$${(ben.vacacionesUSD + ben.bonoVacacionalUSD).toFixed(2)}</strong>
                                        <div style="font-size:0.65rem; color:#94a3b8;">${ben.diasVacaciones}d vac + ${ben.diasVacaciones}d bono</div>
                                    </td>
                                    <td>
                                        <strong style="color:#4ade80;">$${ben.utilidadesUSD.toFixed(2)}</strong>
                                        <div style="font-size:0.65rem; color:#94a3b8;">${ben.diasUtilidades} días</div>
                                    </td>
                                    <td>
                                        <strong style="color:#c084fc;">$${(ben.bonoNocturnoUSD + ben.recargoFeriadosUSD).toFixed(2)}</strong>
                                        <div style="font-size:0.65rem; color:#94a3b8;">Noct: $${ben.bonoNocturnoUSD} | Fer: $${ben.recargoFeriadosUSD}</div>
                                    </td>
                                    <td>
                                        <strong style="color:#fbbf24;">$${ben.prestacionesUSD.toFixed(2)}</strong>
                                        <div style="font-size:0.65rem; color:#94a3b8;">${ben.diasPrestaciones} días salario</div>
                                    </td>
                                    <td>
                                        <strong style="color:#34d399; font-size:0.85rem;">$${ben.totalPasivosUSD.toFixed(2)}</strong>
                                        <div style="font-size:0.7rem; color:#a7f3d0; font-weight:800;">Bs. ${totalBs}</div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        },

        async exportarAnalesExcel() {
            const anales = await this.obtenerAnalesHistoricos();
            if (!anales || anales.length === 0) {
                alert('No hay registros de anales para exportar.');
                return;
            }

            const dataRows = anales.map(a => ({
                'ID': a.id,
                'Fecha': a.fecha,
                'Empleado': a.empleadoNombre,
                'Cargo': a.cargo,
                'Departamento': a.departamento,
                'Turno': a.nombreTurno,
                'Evento': a.tipoEvento,
                'Horas Diurnas': a.horasDiurnas,
                'Horas Nocturnas': a.horasNocturnas,
                'Horas Totales': a.horasTotales,
                'Ubicación': a.ubicacion,
                'Supervisor / Auditor': a.operador,
                'Detalles': a.detalles
            }));

            if (window.XLSX && window.XLSX.utils) {
                const ws = window.XLSX.utils.json_to_sheet(dataRows);
                const wb = window.XLSX.utils.book_new();
                window.XLSX.utils.book_append_sheet(wb, ws, 'Anales_Guardias_RRHH');
                window.XLSX.writeFile(wb, `VIASA_Anales_Guardias_${new Date().toISOString().slice(0,10)}.xlsx`);
                this.mostrarToast('📊 Archivo Excel de Anales descargado.', 'success');
            } else {
                this.exportarAnalesCSV();
            }
        },

        async exportarAnalesCSV() {
            const anales = await this.obtenerAnalesHistoricos();
            if (!anales || anales.length === 0) return;

            const headers = ['ID', 'Fecha', 'Empleado', 'Cargo', 'Departamento', 'Turno', 'Evento', 'HorasDiurnas', 'HorasNocturnas', 'HorasTotales', 'Ubicacion', 'Auditor', 'Detalles'];
            const rows = anales.map(a => [
                a.id, a.fecha, `"${a.empleadoNombre}"`, `"${a.cargo}"`, `"${a.departamento}"`, `"${a.nombreTurno}"`,
                a.tipoEvento, a.horasDiurnas, a.horasNocturnas, a.horasTotales, `"${a.ubicacion}"`, `"${a.operador}"`, `"${a.detalles}"`
            ]);

            const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `VIASA_Anales_Guardias_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.mostrarToast('📄 Archivo CSV de Anales descargado.', 'success');
        },

        async respaldarAnalesDiscoLocal() {
            const anales = await this.obtenerAnalesHistoricos();
            const jsonStr = JSON.stringify(anales, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `VIASA_System_Data_anales_guardias_rrhh_${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.mostrarToast('💾 Respaldo permanente descargado para la carpeta /VIASA_System_Data/anales_guardias_rrhh/', 'success');
        },

        async exportarReporteLOTTTExcel() {
            const emps = await this.obtenerEmpleados();
            const activos = emps.filter(e => e.estado === 'activo');
            const anales = await this.obtenerAnalesHistoricos();
            const tasaBCV = (window.ViasaApp && window.ViasaApp.tasaBCV) || 36.85;

            const rows = activos.map(emp => {
                const ben = this.calcularBeneficiosEmpleadoLOTTT(emp, anales);
                return {
                    'Cédula': emp.cedula || '',
                    'Empleado': emp.nombreCompleto || emp.nombres,
                    'Cargo': emp.cargo,
                    'Departamento': emp.departamento,
                    'Salario Base ($)': ben.salarioBaseUSD,
                    'Salario Diario ($)': ben.salarioDiarioUSD.toFixed(2),
                    'Meses Servicio': ben.mesesServicio,
                    'Días Efectivos': ben.diasEfectivos,
                    'Horas Nocturnas': ben.horasNocturnas,
                    'Bono Nocturno ($)': ben.bonoNocturnoUSD,
                    'Feriados Trabajados': ben.feriadosTrabajados,
                    'Recargo Feriados ($)': ben.recargoFeriadosUSD,
                    'Días Vacaciones': ben.diasVacaciones,
                    'Monto Vacaciones ($)': ben.vacacionesUSD,
                    'Bono Vacacional ($)': ben.bonoVacacionalUSD,
                    'Días Utilidades': ben.diasUtilidades,
                    'Monto Utilidades ($)': ben.utilidadesUSD,
                    'Días Prestaciones': ben.diasPrestaciones,
                    'Prestaciones Sociales ($)': ben.prestacionesUSD,
                    'Bono Vanguardia ($)': ben.bonoVanguardiaUSD,
                    'TOTAL PASIVOS ($)': ben.totalPasivosUSD,
                    'TOTAL PASIVOS (Bs. BCV)': +(ben.totalPasivosUSD * tasaBCV).toFixed(2)
                };
            });

            if (window.XLSX && window.XLSX.utils) {
                const ws = window.XLSX.utils.json_to_sheet(rows);
                const wb = window.XLSX.utils.book_new();
                window.XLSX.utils.book_append_sheet(wb, ws, 'Auditoria_LOTTT_Pasivos');
                window.XLSX.writeFile(wb, `VIASA_Auditoria_Pasivos_LOTTT_${new Date().toISOString().slice(0,10)}.xlsx`);
                this.mostrarToast('📊 Reporte de Auditoría LOTTT descargado en Excel.', 'success');
            } else {
                alert('Módulo XLSX no disponible. Generando reporte.');
            }
        },

        mostrarToast(msg, tipo = 'info') {
            if (window.ViasaApp && typeof window.ViasaApp.mostrarNotificacionToast === 'function') {
                window.ViasaApp.mostrarNotificacionToast(msg, tipo);
            } else {
                console.log(`[VIASA TOAST ${tipo.toUpperCase()}] ${msg}`);
            }
        },

        // ======================================================================
        // 3. SINCRONIZACIÓN CRUZADA CON CRM Y SALÓN CAFETÍN VIASA
        // ======================================================================
        async obtenerCruceCRMCafetin() {
            const guardiasHoy = (await this.obtenerGuardias()).filter(g => g.fecha === this.fechaSeleccionada && g.estado === 'activo');
            const mesas = await window.ViasaStorage.obtenerColeccion('mesas_cafetin') || [];
            const comandas = await window.ViasaStorage.obtenerColeccion('comandas_cafetin') || [];
            const pedidosEsp = await window.ViasaStorage.obtenerColeccion('pedidos_especiales') || [];
            const contactosCRM = await window.ViasaStorage.obtenerColeccion('contactos_directorio') || [];

            const personalCafetin = guardiasHoy.filter(g => g.departamento === 'Cocina' || g.departamento === 'Ventas');
            const personalDespacho = guardiasHoy.filter(g => g.departamento === 'Despacho');
            const mesasActivas = mesas.filter(m => m.estado !== 'libre');
            const entregasHoy = pedidosEsp.filter(p => p.estado !== 'entregado');

            return {
                fecha: this.fechaSeleccionada,
                guardiasHoy,
                personalCafetin,
                personalDespacho,
                mesasActivas,
                entregasHoy,
                contactosCRM
            };
        },

        // ======================================================================
        // 4. CONTROL LOGÍSTICO Y RUTAS DE DESPACHO
        // ======================================================================
        async obtenerRutasDespacho() {
            let rutas = await window.ViasaStorage.obtenerColeccion('despachos_rutas');
            if (!rutas || rutas.length === 0) {
                rutas = window.ViasaDatabase.despachosRutas || [];
            }
            return rutas;
        },

        async confirmarEntregaParada(rutaId, paradaNum, qrToken = null, firmadoPor = null, mostrarAlerta = true) {
            const rutas = await this.obtenerRutasDespacho();
            const ruta = rutas.find(r => r.id === rutaId);
            if (!ruta) return;

            const parada = ruta.paradas.find(p => p.paradaNum === paradaNum);
            if (!parada) return;

            const receptor = firmadoPor || prompt(`Confirmación de Entrega para: ${parada.clienteNombre}\nNombre de la persona que recibe:`, 'Encargado de Recepción');
            if (receptor === null) return;

            parada.estado = 'entregado';
            parada.horaEntrega = new Date().toLocaleTimeString('es-VE', { hour12: false, hour: '2-digit', minute: '2-digit' });
            parada.firmadoPor = receptor;
            parada.qrValidado = qrToken || `QR-OK-${Date.now()}`;

            ruta.paradasCompletadas = ruta.paradas.filter(p => p.estado === 'entregado').length;
            if (ruta.paradasCompletadas === ruta.totalParadas) {
                ruta.estado = 'completada';
            }

            await window.ViasaStorage.guardarRegistro('despachos_rutas', ruta);

            if (!navigator.onLine) {
                const cola = window.ViasaStorage.getItem('sync_offline_queue', []);
                cola.push({
                    tipo: 'entrega_ruta',
                    rutaId: rutaId,
                    paradaNum: paradaNum,
                    qrToken: parada.qrValidado,
                    firmadoPor: receptor,
                    fecha: new Date().toISOString()
                });
                window.ViasaStorage.setItem('sync_offline_queue', cola);
            }

            if (window.ViasaAudio) window.ViasaAudio.playSuccess();
            if (mostrarAlerta) {
                alert(`📦 Entrega confirmada con éxito a ${parada.clienteNombre}.\nFirma: ${receptor} | Hora: ${parada.horaEntrega}`);
            }
            this.renderGuardiasHub();
        },

        // ======================================================================
        // 5. RELOJ CONTROL POR PROXIMIDAD / QR CON CÁLCULO LOTTT
        // ======================================================================
        async registrarCheckIn(empId, tipo = 'entrada', metodo = 'qr_dinamico', lat = 8.1182, lng = -63.5389) {
            const emps = await this.obtenerEmpleados();
            const emp = emps.find(e => e.id === empId);
            if (!emp) {
                alert('Empleado no encontrado.');
                return;
            }

            const ahora = new Date();
            const horaStr = ahora.toLocaleTimeString('es-VE', { hour12: false, hour: '2-digit', minute: '2-digit' });
            const fechaStr = ahora.toISOString().split('T')[0];

            const guardias = await this.obtenerGuardias();
            const guardia = guardias.find(g => g.empleadoId === empId && g.fecha === fechaStr);

            let minutosRetraso = 0;
            let horasExtras = 0;
            let estadoPuntualidad = 'Puntual';

            if (guardia && tipo === 'entrada') {
                const [hProg, mProg] = guardia.horaEntrada.split(':').map(Number);
                const [hReal, mReal] = horaStr.split(':').map(Number);
                const diffMinutos = (hReal * 60 + mReal) - (hProg * 60 + mProg);

                if (diffMinutos > 10) {
                    minutosRetraso = diffMinutos;
                    estadoPuntualidad = `Retraso (${minutosRetraso} min)`;
                }
            } else if (guardia && tipo === 'salida') {
                const [hProg, mProg] = guardia.horaSalida.split(':').map(Number);
                const [hReal, mReal] = horaStr.split(':').map(Number);
                const diffMinutos = (hReal * 60 + mReal) - (hProg * 60 + mProg);

                if (diffMinutos > 30) {
                    horasExtras = Math.round((diffMinutos / 60) * 10) / 10;
                    estadoPuntualidad = `Horas Extras (${horasExtras}h LOTTT)`;
                }
            }

            const registroCheckIn = {
                id: `MARC-${Date.now()}`,
                empleadoId: emp.id,
                nombreEmpleado: emp.nombreCompleto || emp.nombres,
                departamento: emp.departamento,
                tipo: tipo,
                hora: horaStr,
                fecha: fechaStr,
                metodo: metodo,
                latitud: lat,
                longitud: lng,
                minutosRetraso: minutosRetraso,
                horasExtras: horasExtras,
                estadoPuntualidad: estadoPuntualidad,
                dispositivo: navigator.userAgent.includes('Mobile') ? 'App Móvil / Celular' : 'Terminal Desktop ERP'
            };

            await window.ViasaStorage.guardarRegistro('fichajes_asistencia', registroCheckIn);

            if (!navigator.onLine) {
                const cola = window.ViasaStorage.getItem('sync_offline_queue', []);
                cola.push({ tipo: 'checkin', data: registroCheckIn });
                window.ViasaStorage.setItem('sync_offline_queue', cola);
            }

            if (window.ViasaAudio) window.ViasaAudio.playSuccess();
            alert(`✅ Marcaje de ${tipo.toUpperCase()} registrado para ${emp.nombreCompleto}.\nHora: ${horaStr} | Condición: ${estadoPuntualidad}`);
            this.renderGuardiasHub();
        },

        // ======================================================================
        // 6. BOLSA DE INTERCAMBIO DE GUARDIAS (SHIFT MARKETPLACE)
        // ======================================================================
        async obtenerShiftMarketplace() {
            let swaps = await window.ViasaStorage.obtenerColeccion('shift_marketplace');
            if (!swaps || swaps.length === 0) {
                swaps = window.ViasaDatabase.shiftMarketplace || [];
            }
            return swaps;
        },

        async abrirModalSolicitarSwap() {
            const modal = document.getElementById('modal-solicitar-swap');
            if (!modal) return;

            const guardias = await this.obtenerGuardias();
            const guardiasFuturas = guardias.filter(g => g.fecha >= new Date().toISOString().split('T')[0] && g.estado === 'activo');
            const emps = await this.obtenerEmpleados();
            const empsActivos = emps.filter(e => e.estado === 'activo');

            const selGrd = document.getElementById('swap-guardia-select');
            if (selGrd) {
                selGrd.innerHTML = guardiasFuturas.map(g => `
                    <option value="${g.id}">${g.fecha} &bull; ${g.nombreEmpleado} &bull; ${g.nombreTurno} (${g.departamento})</option>
                `).join('');
            }

            const selCandidato = document.getElementById('swap-candidato-select');
            if (selCandidato) {
                selCandidato.innerHTML = `<option value="">-- Oferta Abierta para Todo el Departamento --</option>` + empsActivos.map(e => `
                    <option value="${e.id}">${e.nombreCompleto || e.nombres} &bull; ${e.cargo} (${e.departamento})</option>
                `).join('');
            }

            modal.style.display = 'flex';
        },

        cerrarModalSolicitarSwap() {
            const modal = document.getElementById('modal-solicitar-swap');
            if (modal) modal.style.display = 'none';
        },

        async guardarSolicitudSwap(e) {
            e.preventDefault();
            const guardiaId = document.getElementById('swap-guardia-select').value;
            const candidatoId = document.getElementById('swap-candidato-select').value;
            const motivo = document.getElementById('swap-motivo').value.trim();

            const guardias = await this.obtenerGuardias();
            const guardia = guardias.find(g => g.id === guardiaId);
            if (!guardia) return;

            const emps = await this.obtenerEmpleados();
            const candidato = emps.find(x => x.id === candidatoId);

            const nuevaSolicitud = {
                id: `SWAP-${Date.now().toString().slice(-6)}`,
                guardiaId: guardia.id,
                solicitanteId: guardia.empleadoId,
                solicitanteNombre: guardia.nombreEmpleado,
                departamento: guardia.departamento,
                fechaGuardia: guardia.fecha,
                turnoOriginal: guardia.nombreTurno,
                motivo: motivo || 'Intercambio operativo de turno',
                candidatoId: candidato ? candidato.id : null,
                candidatoNombre: candidato ? candidato.nombreCompleto : 'Cualquier Compañero Disponible',
                estado: 'pendiente_aprobacion',
                fechaSolicitud: new Date().toLocaleString('es-VE'),
                aprobadoPor: null,
                fechaAprobacion: null
            };

            await window.ViasaStorage.guardarRegistro('shift_marketplace', nuevaSolicitud);
            this.cerrarModalSolicitarSwap();
            if (window.ViasaAudio) window.ViasaAudio.playSuccess();
            alert(`📢 Solicitud de intercambio publicada en el Shift Marketplace. En espera de aprobación por la Supervisión.`);
            this.renderGuardiasHub();
        },

        async aprobarIntercambio(swapId) {
            const swaps = await this.obtenerShiftMarketplace();
            const swap = swaps.find(s => s.id === swapId);
            if (!swap) return;

            if (!confirm(`¿Aprobar el intercambio de guardia para el día ${swap.fechaGuardia}?\nSolicitante: ${swap.solicitanteNombre}\nSuplente: ${swap.candidatoNombre}`)) return;

            swap.estado = 'aprobado';
            swap.aprobadoPor = 'Gerente General';
            swap.fechaAprobacion = new Date().toLocaleString('es-VE');

            const guardias = await this.obtenerGuardias();
            const guardia = guardias.find(g => g.id === swap.guardiaId);
            if (guardia && swap.candidatoId) {
                const emps = await this.obtenerEmpleados();
                const suplente = emps.find(e => e.id === swap.candidatoId);
                if (suplente) {
                    guardia.empleadoId = suplente.id;
                    guardia.nombreEmpleado = suplente.nombreCompleto || suplente.nombres;
                    guardia.cargo = suplente.cargo;
                    guardia.motivoReasignacion = `Intercambio Shift Marketplace (${swap.id})`;
                    await window.ViasaStorage.guardarRegistro('guardias_turnos', guardia);
                }
            }

            await window.ViasaStorage.guardarRegistro('shift_marketplace', swap);
            if (window.ViasaAudio) window.ViasaAudio.playSuccess();
            alert(`✅ Intercambio de guardia aprobado. Los horarios han sido actualizados en tiempo real.`);
            this.renderGuardiasHub();
        },

        async rechazarIntercambio(swapId) {
            const swaps = await this.obtenerShiftMarketplace();
            const swap = swaps.find(s => s.id === swapId);
            if (!swap) return;

            const motivo = prompt('Motivo del rechazo de la solicitud:', 'Incompatibilidad de horarios / Cobertura mínima requerida');
            if (motivo === null) return;

            swap.estado = 'rechazado';
            swap.motivoRechazo = motivo;
            swap.aprobadoPor = 'Gerente General (Rechazado)';
            swap.fechaAprobacion = new Date().toLocaleString('es-VE');

            await window.ViasaStorage.guardarRegistro('shift_marketplace', swap);
            if (window.ViasaAudio) window.ViasaAudio.playTrash();
            this.renderGuardiasHub();
        },

        // Helper Iconos
        obtenerIconoPorDepartamento(depto) {
            switch (depto) {
                case 'Fabricación': return 'fa-bread-slice';
                case 'Cocina': return 'fa-utensils';
                case 'Ventas': return 'fa-cash-register';
                case 'Despacho': return 'fa-truck-fast';
                case 'Mantenimiento': return 'fa-screwdriver-wrench';
                case 'Administración': return 'fa-user-tie';
                default: return 'fa-user';
            }
        },

        clasificarTurnoPorHorario(horario) {
            const h = (horario || '').toLowerCase();
            if (h.includes('04:00') || h.includes('05:00')) return 'madrugada';
            if (h.includes('06:') || h.includes('07:') || h.includes('08:')) return 'matutino';
            if (h.includes('12:') || h.includes('13:') || h.includes('14:')) return 'vespertino';
            if (h.includes('20:') || h.includes('21:') || h.includes('22:')) return 'nocturno';
            return 'matutino';
        },

        // ======================================================================
        // 7. RENDERIZADO DEL CENTRO DE CONTROL EN EL ERP DE ESCRITORIO
        // ======================================================================
        async renderGuardiasHub() {
            const container = document.getElementById('view-guardias-hub');
            if (!container) return;

            const emps = await this.obtenerEmpleados();
            const guardias = await this.obtenerGuardias();
            const turnos = await this.obtenerTurnos();
            const swaps = await this.obtenerShiftMarketplace();
            const rutas = await this.obtenerRutasDespacho();
            const cruce = await this.obtenerCruceCRMCafetin();

            const totalActivos = emps.filter(e => e.estado === 'activo').length;
            const hoyStr = new Date().toISOString().split('T')[0];
            const guardiasHoyCount = guardias.filter(g => (g.fecha === this.fechaSeleccionada || g.fecha === hoyStr) && g.estado === 'activo').length;
            const swapsPendientes = swaps.filter(s => s.estado === 'pendiente_aprobacion').length;
            const entregasPendientes = rutas.reduce((acc, r) => acc + (r.totalParadas - r.paradasCompletadas), 0);

            const badgeNav = document.getElementById('badge-guardias-activas');
            if (badgeNav) badgeNav.textContent = `${guardiasHoyCount} Hoy`;

            let subContentHTML = '';
            if (this.subViewActiva === 'plantilla') {
                subContentHTML = this.renderSubViewPlantillaHTML(emps);
            } else if (this.subViewActiva === 'matriz') {
                subContentHTML = this.renderSubViewMatrizHTML(guardias, emps, turnos);
            } else if (this.subViewActiva === 'crm_cafetin') {
                subContentHTML = this.renderSubViewCRMCafetinHTML(cruce);
            } else if (this.subViewActiva === 'logistica') {
                subContentHTML = this.renderSubViewLogisticaHTML(rutas);
            } else if (this.subViewActiva === 'marketplace') {
                subContentHTML = this.renderSubViewMarketplaceHTML(swaps);
            } else if (this.subViewActiva === 'asistencia') {
                subContentHTML = await this.renderSubViewAsistenciaHTML(emps);
            }

            container.innerHTML = `
                <div class="guardias-hub-wrapper">
                    <!-- 1. CABECERA EJECUTIVA Y TARJETAS DE RESUMEN (5 KPIs HORIZONTALES) -->
                    <div class="guardias-hero-card">
                        <div class="guardias-hero-header">
                            <div class="guardias-hero-brand">
                                <div class="guardias-hero-icon-box">
                                    <i class="fa-solid fa-user-shield"></i>
                                </div>
                                <div>
                                    <h2 class="guardias-hero-title">Gestión de Guardias, Campo y Vanguardia Operativa</h2>
                                    <span class="guardias-hero-sub">
                                        Panadería Nueva Viasa, C.A. &bull; RIF: J-31163165-8 &bull; La Sabanita, Ciudad Bolívar
                                    </span>
                                </div>
                            </div>
                            
                            <div class="guardias-hero-actions">
                                <span class="guardias-sync-badge ${navigator.onLine ? 'online' : 'offline'}" id="guardias-sync-pill">
                                    <span class="sync-dot"></span>
                                    <i class="fa-solid ${navigator.onLine ? 'fa-cloud-arrow-up' : 'fa-shield-halved'}"></i>
                                    <span>${navigator.onLine ? 'Sincronizado' : 'Modo Offline'}</span>
                                </span>
                                <button type="button" class="btn-companion-mobile" onclick="window.open('mobile_app.html', '_blank', 'width=420,height=840')" title="Abrir Aplicación Móvil Companion">
                                    <i class="fa-solid fa-mobile-screen-button"></i> App Móvil
                                </button>
                                <button type="button" class="btn-nueva-alta-amber" onclick="ViasaGuardiasEngine.abrirModalNuevoEmpleado()">
                                    <i class="fa-solid fa-user-plus"></i> + Nueva Alta
                                </button>
                            </div>
                        </div>

                        <!-- FILA DE KPIs (5 TARJETAS HORIZONTALES COMPACTAS) -->
                        <div class="guardias-kpi-grid">
                            <div class="guardias-kpi-card ${this.subViewActiva === 'plantilla' ? 'kpi-active' : ''}" onclick="ViasaGuardiasEngine.cambiarSubView('plantilla')">
                                <div class="kpi-icon-badge kpi-emerald">
                                    <i class="fa-solid fa-users"></i>
                                </div>
                                <div class="kpi-content-box">
                                    <span class="kpi-lbl">Plantilla Total</span>
                                    <div class="kpi-val-row">
                                        <strong class="kpi-val">${totalActivos}</strong>
                                        <small class="kpi-unit">Activos</small>
                                    </div>
                                </div>
                            </div>

                            <div class="guardias-kpi-card ${this.subViewActiva === 'matriz' ? 'kpi-active' : ''}" onclick="ViasaGuardiasEngine.cambiarSubView('matriz')">
                                <div class="kpi-icon-badge kpi-amber">
                                    <i class="fa-solid fa-calendar-check"></i>
                                </div>
                                <div class="kpi-content-box">
                                    <span class="kpi-lbl">Guardias Hoy</span>
                                    <div class="kpi-val-row">
                                        <strong class="kpi-val" style="color:#fbbf24;">${guardiasHoyCount}</strong>
                                        <small class="kpi-unit">En Turno</small>
                                    </div>
                                </div>
                            </div>

                            <div class="guardias-kpi-card ${this.subViewActiva === 'crm_cafetin' ? 'kpi-active' : ''}" onclick="ViasaGuardiasEngine.cambiarSubView('crm_cafetin')">
                                <div class="kpi-icon-badge kpi-sky">
                                    <i class="fa-solid fa-utensils"></i>
                                </div>
                                <div class="kpi-content-box">
                                    <span class="kpi-lbl">Cafetín y CRM</span>
                                    <div class="kpi-val-row">
                                        <strong class="kpi-val" style="color:#38bdf8;">${cruce.mesasActivas.length}</strong>
                                        <small class="kpi-unit">Mesas</small>
                                    </div>
                                </div>
                            </div>

                            <div class="guardias-kpi-card ${this.subViewActiva === 'logistica' ? 'kpi-active' : ''}" onclick="ViasaGuardiasEngine.cambiarSubView('logistica')">
                                <div class="kpi-icon-badge kpi-orange">
                                    <i class="fa-solid fa-truck-fast"></i>
                                </div>
                                <div class="kpi-content-box">
                                    <span class="kpi-lbl">Despachos Ruta</span>
                                    <div class="kpi-val-row">
                                        <strong class="kpi-val" style="color:#fb923c;">${entregasPendientes}</strong>
                                        <small class="kpi-unit">Paradas</small>
                                    </div>
                                </div>
                            </div>

                            <div class="guardias-kpi-card ${this.subViewActiva === 'marketplace' ? 'kpi-active' : ''}" onclick="ViasaGuardiasEngine.cambiarSubView('marketplace')">
                                <div class="kpi-icon-badge kpi-purple">
                                    <i class="fa-solid fa-arrows-rotate"></i>
                                </div>
                                <div class="kpi-content-box">
                                    <span class="kpi-lbl">Shift Market</span>
                                    <div class="kpi-val-row">
                                        <strong class="kpi-val" style="color:#c084fc;">${swapsPendientes}</strong>
                                        <small class="kpi-unit">Pendientes</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. NAVEGACIÓN DE SUB-MÓDULOS (SEGMENTED CONTROL / PILLS CORPORATIVAS) -->
                    <div class="guardias-tabs-bar">
                        <button type="button" class="guardias-tab-btn ${this.subViewActiva === 'plantilla' ? 'active' : ''}" onclick="ViasaGuardiasEngine.cambiarSubView('plantilla')">
                            <i class="fa-solid fa-users-gear"></i> <span>1. Altas y Plantilla</span>
                        </button>
                        <button type="button" class="guardias-tab-btn ${this.subViewActiva === 'matriz' ? 'active' : ''}" onclick="ViasaGuardiasEngine.cambiarSubView('matriz')">
                            <i class="fa-solid fa-calendar-days"></i> <span>2. Matriz de Guardias</span>
                        </button>
                        <button type="button" class="guardias-tab-btn ${this.subViewActiva === 'crm_cafetin' ? 'active' : ''}" onclick="ViasaGuardiasEngine.cambiarSubView('crm_cafetin')">
                            <i class="fa-solid fa-handshake"></i> <span>3. Cruce CRM y Cafetín</span>
                        </button>
                        <button type="button" class="guardias-tab-btn ${this.subViewActiva === 'logistica' ? 'active' : ''}" onclick="ViasaGuardiasEngine.cambiarSubView('logistica')">
                            <i class="fa-solid fa-route"></i> <span>4. Logística y Despacho</span>
                        </button>
                        <button type="button" class="guardias-tab-btn ${this.subViewActiva === 'marketplace' ? 'active' : ''}" onclick="ViasaGuardiasEngine.cambiarSubView('marketplace')">
                            <i class="fa-solid fa-repeat"></i> <span>5. Shift Marketplace</span>
                            ${swapsPendientes > 0 ? `<span class="badge-tab-alert">${swapsPendientes}</span>` : ''}
                        </button>
                        <button type="button" class="guardias-tab-btn ${this.subViewActiva === 'asistencia' ? 'active' : ''}" onclick="ViasaGuardiasEngine.cambiarSubView('asistencia')">
                            <i class="fa-solid fa-qrcode"></i> <span>6. Check-in QR y GPS</span>
                        </button>
                    </div>

                    <!-- CONTENIDO DE LA PESTAÑA DINÁMICA -->
                    <div class="guardias-subview-body">
                        ${subContentHTML}
                    </div>
                </div>
            `;
        },

        // ----------------------------------------------------------------------
        // SUB-VIEW 1: DIRECTORIO DE EMPLEADOS EN FICHAS CUADRADAS CON FOTO
        // ----------------------------------------------------------------------
        renderSubViewPlantillaHTML(emps) {
            let filtrados = emps.filter(e => {
                const deptoNorm = this.normalizarDepartamento(e.departamento, e.cargo);
                const matchDepto = this.filtroDepto === 'todos' || deptoNorm === this.filtroDepto || e.departamento === this.filtroDepto;
                const matchTxt = !this.filtroBusqueda || 
                    (e.nombreCompleto || `${e.nombres || ''} ${e.apellidos || ''}`).toLowerCase().includes(this.filtroBusqueda) ||
                    (e.cedula || '').toLowerCase().includes(this.filtroBusqueda) ||
                    (e.cargo || '').toLowerCase().includes(this.filtroBusqueda) ||
                    deptoNorm.toLowerCase().includes(this.filtroBusqueda);
                return matchDepto && matchTxt;
            });

            const deptos = [
                { key: 'todos', label: 'Todos los Deptos', icon: 'fa-layer-group' },
                { key: 'Fabricación', label: 'Fabricación', icon: 'fa-wheat-awn' },
                { key: 'Cocina', label: 'Cocina', icon: 'fa-utensils' },
                { key: 'Ventas', label: 'Ventas', icon: 'fa-cash-register' },
                { key: 'Despacho', label: 'Despacho', icon: 'fa-truck-fast' },
                { key: 'Mantenimiento', label: 'Mantenimiento', icon: 'fa-screwdriver-wrench' },
                { key: 'Administración', label: 'Administración', icon: 'fa-user-tie' }
            ];

            return `
                <!-- BARRA DE HERRAMIENTAS: CHIPS DE DEPARTAMENTO + BUSCADOR CON LUPA -->
                <div class="guardias-filter-toolbar">
                    <div class="guardias-dept-chips">
                        ${deptos.map(d => `
                            <button type="button" class="filter-pill ${this.filtroDepto === d.key ? 'active' : ''}" onclick="ViasaGuardiasEngine.setFiltroDepto('${d.key}')">
                                <i class="fa-solid ${d.icon}"></i>
                                <span>${d.label}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div class="guardias-search-wrapper">
                        <i class="fa-solid fa-magnifying-glass guardias-search-icon"></i>
                        <input type="text" class="search-input-guardias" placeholder="Buscar por nombre, cédula..." value="${this.filtroBusqueda}" oninput="ViasaGuardiasEngine.setFiltroBusqueda(this.value)">
                        ${this.filtroBusqueda ? `
                            <button type="button" class="guardias-search-clear" onclick="ViasaGuardiasEngine.setFiltroBusqueda('')" title="Limpiar búsqueda">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- CUADRÍCULA RESPONSIVA DE FICHAS CUADRADAS CORPORATIVAS -->
                <div class="guardias-cards-grid">
                    ${filtrados.length === 0 ? `
                        <div class="empty-msg-card">
                            <i class="fa-solid fa-user-slash" style="font-size:2.4rem; color:#64748b; margin-bottom:10px;"></i>
                            <h4 style="margin:0 0 4px 0; color:#e2e8f0; font-size:1rem;">Sin resultados en la plantilla</h4>
                            <p style="margin:0; color:#94a3b8; font-size:0.82rem;">No se encontraron trabajadores que coincidan con el departamento o criterio de búsqueda.</p>
                        </div>
                    ` : filtrados.map(e => {
                        const nombreCompleto = e.nombreCompleto || `${e.nombres || ''} ${e.apellidos || ''}`.trim() || 'Trabajador Viasa';
                        const deptoNorm = this.normalizarDepartamento(e.departamento, e.cargo);
                        const deptoStyle = this.obtenerEstiloDepto(deptoNorm);
                        const fotoUrl = this.obtenerFotoEmpleado(e);
                        const horarioTxt = e.horarioDefecto || e.horarioTexto || '06:00 - 14:00';
                        const pinReal = e.pinAcceso || e.pinFichaje || '1234';
                        const pinVisible = !!this.pinsVisibles[e.id];
                        const esActivo = e.estado !== 'inactivo';

                        return `
                        <div class="emp-guardia-card ${esActivo ? '' : 'inactivo'}">
                            <!-- Badge de Estado en Esquina Superior Derecha -->
                            <span class="badge-status-emp ${esActivo ? 'activo' : 'inactivo'}">
                                <span class="status-dot"></span>
                                ${esActivo ? 'ACTIVO' : 'BAJA LÓGICA'}
                            </span>

                            <!-- Encabezado de Ficha: Foto Cuadrada Redondeada + Botón Cámara + Jerarquía -->
                            <div class="emp-card-header">
                                <div class="emp-photo-container" title="Haz clic en la cámara para subir o actualizar la fotografía">
                                    <img src="${fotoUrl}" alt="${nombreCompleto}" class="emp-square-photo" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80';">
                                    <button type="button" class="emp-photo-cam-btn" onclick="ViasaGuardiasEngine.dispararSubidaFotoTarjeta('${e.id}', event)" title="Cambiar foto de ${nombreCompleto}">
                                        <i class="fa-solid fa-camera"></i>
                                    </button>
                                </div>

                                <div class="emp-identity-col">
                                    <h4 class="emp-card-name" title="${nombreCompleto}">${nombreCompleto}</h4>
                                    <div class="emp-card-cargo">${e.cargo || 'Operador de Planta'}</div>
                                    <div class="emp-depto-badge ${deptoStyle.clase}">
                                        <i class="fa-solid ${deptoStyle.icono}"></i>
                                        <span>${deptoStyle.label}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Caja de Datos Operativos Interna -->
                            <div class="emp-card-details">
                                <div class="emp-detail-row">
                                    <span class="emp-detail-lbl"><i class="fa-solid fa-id-card"></i> C.I.:</span>
                                    <strong class="emp-detail-val">${e.cedula || 'S/I'}</strong>
                                </div>
                                <div class="emp-detail-row">
                                    <span class="emp-detail-lbl"><i class="fa-solid fa-phone"></i> Tel.:</span>
                                    <strong class="emp-detail-val">${e.telefono || '0414-0000000'}</strong>
                                </div>
                                <div class="emp-detail-row">
                                    <span class="emp-detail-lbl"><i class="fa-solid fa-clock"></i> Horario:</span>
                                    <strong class="emp-detail-val emp-schedule-pill">${horarioTxt}</strong>
                                </div>
                                <div class="emp-detail-row">
                                    <span class="emp-detail-lbl"><i class="fa-solid fa-key"></i> PIN App:</span>
                                    <div class="emp-pin-box">
                                        <span class="emp-pin-code ${pinVisible ? 'revealed' : 'masked'}">${pinVisible ? pinReal : '••••'}</span>
                                        <button type="button" class="emp-pin-toggle-btn" onclick="ViasaGuardiasEngine.togglePinVisibilidad('${e.id}')" title="${pinVisible ? 'Ocultar PIN' : 'Mostrar PIN'}">
                                            <i class="fa-solid ${pinVisible ? 'fa-eye-slash' : 'fa-eye'}"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Pie de Ficha: 3 Botones Corporativos -->
                            <div class="emp-card-footer">
                                <button type="button" class="btn-card-action btn-card-credencial" onclick="ViasaGuardiasEngine.verCredencialDigital('${e.id}')" title="Ver Credencial Digital y Carnet QR">
                                    <i class="fa-solid fa-qrcode"></i>
                                    <span>Credencial</span>
                                </button>
                                <button type="button" class="btn-card-action btn-card-editar" onclick="ViasaGuardiasEngine.abrirModalNuevoEmpleado('${e.id}')" title="Editar Expediente y Foto">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                    <span>Editar</span>
                                </button>
                                ${esActivo ? `
                                    <button type="button" class="btn-card-action btn-danger-action" onclick="ViasaGuardiasEngine.bajaLogicaEmpleado('${e.id}')" title="Baja Lógica / Desincorporación">
                                        <i class="fa-solid fa-user-minus"></i>
                                        <span>Baja</span>
                                    </button>
                                ` : `
                                    <button type="button" class="btn-card-action btn-success-action" onclick="ViasaGuardiasEngine.reactivarEmpleado('${e.id}')" title="Reactivar Trabajador">
                                        <i class="fa-solid fa-user-check"></i>
                                        <span>Reactivar</span>
                                    </button>
                                `}
                            </div>
                        </div>
                    `}).join('')}
                </div>
            `;
        },

        // ----------------------------------------------------------------------
        // SUB-VIEW 2: MATRIZ DE GUARDIAS Y ASIGNACIÓN DINÁMICA (LOTTT READY)
        // ----------------------------------------------------------------------
        renderSubViewMatrizHTML(guardias, emps, turnos = []) {
            if (!turnos || turnos.length === 0) {
                turnos = [
                    { id: 'madrugada', orden: 1, nombre: 'Turno Madrugada', horaInicio: '04:00', horaFin: '12:00', icono: 'fa-moon', color: '#6366f1', colorBorde: '#6366f1' },
                    { id: 'matutino', orden: 2, nombre: 'Turno Matutino', horaInicio: '06:30', horaFin: '14:30', icono: 'fa-sun', color: '#f59e0b', colorBorde: '#f59e0b' },
                    { id: 'vespertino', orden: 3, nombre: 'Turno Vespertino', horaInicio: '13:00', horaFin: '21:00', icono: 'fa-cloud-sun', color: '#06b6d4', colorBorde: '#06b6d4' },
                    { id: 'nocturno', orden: 4, nombre: 'Turno Nocturno', horaInicio: '21:00', horaFin: '05:00', icono: 'fa-star-half-stroke', color: '#ec4899', colorBorde: '#ec4899' }
                ];
            }
            const turnosList = [...turnos].sort((a, b) => (a.orden || 0) - (b.orden || 0));

            // Filtrado temporal dinámico
            let guardiasPeriodo = [];
            let periodoLabel = '';

            const [anio, mesNum] = (this.mesOperativo || '2026-11').split('-').map(Number);
            const diasMes = new Date(anio, mesNum, 0).getDate();

            if (this.vistaTemporalMatriz === 'dia') {
                guardiasPeriodo = guardias.filter(g => g.fecha === this.fechaSeleccionada && g.estado === 'activo');
                periodoLabel = `Día: ${this.fechaSeleccionada}`;
            } else if (this.vistaTemporalMatriz === 'semana1') {
                const start = `${this.mesOperativo}-01`;
                const end = `${this.mesOperativo}-07`;
                guardiasPeriodo = guardias.filter(g => g.fecha >= start && g.fecha <= end && g.estado === 'activo');
                periodoLabel = `Semana 1 (Días 01 al 07 de ${this.mesOperativo})`;
            } else if (this.vistaTemporalMatriz === 'semana2') {
                const start = `${this.mesOperativo}-08`;
                const end = `${this.mesOperativo}-14`;
                guardiasPeriodo = guardias.filter(g => g.fecha >= start && g.fecha <= end && g.estado === 'activo');
                periodoLabel = `Semana 2 (Días 08 al 14 de ${this.mesOperativo})`;
            } else if (this.vistaTemporalMatriz === 'semana3') {
                const start = `${this.mesOperativo}-15`;
                const end = `${this.mesOperativo}-21`;
                guardiasPeriodo = guardias.filter(g => g.fecha >= start && g.fecha <= end && g.estado === 'activo');
                periodoLabel = `Semana 3 (Días 15 al 21 de ${this.mesOperativo})`;
            } else if (this.vistaTemporalMatriz === 'semana4') {
                const start = `${this.mesOperativo}-22`;
                const end = `${this.mesOperativo}-${String(diasMes).padStart(2, '0')}`;
                guardiasPeriodo = guardias.filter(g => g.fecha >= start && g.fecha <= end && g.estado === 'activo');
                periodoLabel = `Semana 4 / Cierre (Días 22 al ${diasMes} de ${this.mesOperativo})`;
            } else {
                guardiasPeriodo = guardias.filter(g => (g.fecha || '').startsWith(this.mesOperativo) && g.estado === 'activo');
                periodoLabel = `Mes Completo: ${this.mesOperativo} (${diasMes} días)`;
            }

            return `
                <div class="guardias-matrix-toolbar">
                    <!-- Fila 1: Comandos CRUD de Turnos y Bóveda -->
                    <div class="guardias-matrix-top-row">
                        <div class="guardias-matrix-cmd-group">
                            <button type="button" class="btn-cmd-guardia emerald" onclick="ViasaGuardiasEngine.abrirModalTurno()" title="Crear nuevo turno con horario y pautas">
                                <i class="fa-solid fa-plus"></i> Crear Turno
                            </button>
                            <button type="button" class="btn-cmd-guardia cyan" onclick="ViasaGuardiasEngine.abrirSelectorModificarTurno()" title="Modificar turno existente">
                                <i class="fa-solid fa-pen"></i> Modificar Turno
                            </button>
                            <button type="button" class="btn-cmd-guardia red" onclick="ViasaGuardiasEngine.abrirSelectorEliminarTurno()" title="Eliminar turno">
                                <i class="fa-solid fa-trash-can"></i> Eliminar Turno
                            </button>
                            <button type="button" class="btn-cmd-guardia purple" onclick="ViasaGuardiasEngine.abrirModalReordenarTurnos()" title="Reordenar prioridad de turnos">
                                <i class="fa-solid fa-arrow-down-up-across-line"></i> Reordenar Turnos
                            </button>
                            <button type="button" class="btn-cmd-guardia gold" onclick="ViasaGuardiasEngine.abrirModalAsignarGuardia()" title="Asignar personal por día, semana o mes">
                                <i class="fa-solid fa-calendar-plus"></i> Asignar Guardia
                            </button>
                        </div>

                        <div>
                            <button type="button" class="btn-cmd-guardia anales-lottt" onclick="ViasaGuardiasEngine.abrirModalAnales()" title="Acceso inmutable a bitácora y liquidación LOTTT">
                                <i class="fa-solid fa-landmark"></i> Anales Históricos y Cálculo de Beneficios
                            </button>
                        </div>
                    </div>

                    <!-- Fila 2: Conmutador de Semanas y Navegación de Período -->
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
                        <div class="guardias-nav-pills-row">
                            <button type="button" class="nav-pill-guardia ${this.vistaTemporalMatriz === 'dia' ? 'active' : ''}" onclick="ViasaGuardiasEngine.setVistaTemporalMatriz('dia')">
                                <i class="fa-regular fa-calendar"></i> 📅 Día Específico
                            </button>
                            <button type="button" class="nav-pill-guardia ${this.vistaTemporalMatriz === 'semana1' ? 'active' : ''}" onclick="ViasaGuardiasEngine.setVistaTemporalMatriz('semana1')">
                                <i class="fa-solid fa-calendar-week"></i> 1. Sem 1 (1-7)
                            </button>
                            <button type="button" class="nav-pill-guardia ${this.vistaTemporalMatriz === 'semana2' ? 'active' : ''}" onclick="ViasaGuardiasEngine.setVistaTemporalMatriz('semana2')">
                                <i class="fa-solid fa-calendar-week"></i> 2. Sem 2 (8-14)
                            </button>
                            <button type="button" class="nav-pill-guardia ${this.vistaTemporalMatriz === 'semana3' ? 'active' : ''}" onclick="ViasaGuardiasEngine.setVistaTemporalMatriz('semana3')">
                                <i class="fa-solid fa-calendar-week"></i> 3. Sem 3 (15-21)
                            </button>
                            <button type="button" class="nav-pill-guardia ${this.vistaTemporalMatriz === 'semana4' ? 'active' : ''}" onclick="ViasaGuardiasEngine.setVistaTemporalMatriz('semana4')">
                                <i class="fa-solid fa-calendar-week"></i> 4. Sem 4 (22-Fin)
                            </button>
                            <button type="button" class="nav-pill-guardia ${this.vistaTemporalMatriz === 'mes' ? 'active' : ''}" onclick="ViasaGuardiasEngine.setVistaTemporalMatriz('mes')">
                                <i class="fa-solid fa-calendar-days"></i> 📊 Mes Completo
                            </button>
                        </div>

                        <div style="display: flex; align-items: center; gap: 10px;">
                            ${this.vistaTemporalMatriz === 'dia' ? `
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <label style="font-size:0.75rem; font-weight:800; color:#fbbf24;"><i class="fa-regular fa-calendar"></i> Fecha:</label>
                                    <input type="date" value="${this.fechaSeleccionada}" onchange="ViasaGuardiasEngine.setFechaSeleccionada(this.value)" style="background:#1e293b; color:#fff; border:1px solid #334155; border-radius:6px; padding:5px 8px; font-size:0.78rem;">
                                </div>
                            ` : `
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <label style="font-size:0.75rem; font-weight:800; color:#38bdf8;"><i class="fa-solid fa-calendar-days"></i> Mes Operativo:</label>
                                    <input type="month" value="${this.mesOperativo}" onchange="ViasaGuardiasEngine.setMesOperativo(this.value)" style="background:#1e293b; color:#fff; border:1px solid #334155; border-radius:6px; padding:5px 8px; font-size:0.78rem;">
                                </div>
                            `}
                            <span style="font-size: 0.72rem; color: #94a3b8; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 6px;">
                                <i class="fa-solid fa-filter"></i> ${periodoLabel}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Grilla Dinámica de Columnas de Turno -->
                <div class="guardias-turnos-matrix-grid">
                    ${turnosList.map((t, idx) => {
                        const enTurno = guardiasPeriodo.filter(g => g.turno === t.id);
                        const empIdsUnicos = [...new Set(enTurno.map(g => g.empleadoId))];
                        const lotttInfo = this.calcularHorasTurnoLOTTT(t.horaInicio, t.horaFin);
                        const colorBorde = t.colorBorde || t.color || '#10b981';

                        return `
                            <div class="guardia-turno-column">
                                <div class="turno-column-hdr" style="border-top: 3px solid ${colorBorde};">
                                    <div style="display: flex; align-items: flex-start; gap: 9px; min-width: 0;">
                                        <i class="fa-solid ${t.icono || 'fa-clock'}" style="color:${t.color || '#10b981'}; font-size:1.2rem; margin-top:2px;"></i>
                                        <div style="min-width: 0;">
                                            <h4 style="margin:0; font-size:0.9rem; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${t.nombre}">
                                                ${t.orden || (idx+1)}. ${t.nombre}
                                            </h4>
                                            <div style="font-size:0.68rem; color:#94a3b8;">
                                                ${t.horaInicio} - ${t.horaFin} (${lotttInfo.duracionHoras}h) &bull; <span style="color:${lotttInfo.horasNocturnas > 0 ? '#c084fc' : '#34d399'};">${lotttInfo.tipo}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                                        <span class="badge-guardia-count">${empIdsUnicos.length} Personal</span>
                                        <div class="turno-hdr-actions">
                                            <button type="button" class="btn-turno-mini" onclick="ViasaGuardiasEngine.reordenarTurnoDirecto('${t.id}', -1)" title="Subir prioridad turno">
                                                <i class="fa-solid fa-arrow-up"></i>
                                            </button>
                                            <button type="button" class="btn-turno-mini" onclick="ViasaGuardiasEngine.reordenarTurnoDirecto('${t.id}', 1)" title="Bajar prioridad turno">
                                                <i class="fa-solid fa-arrow-down"></i>
                                            </button>
                                            <button type="button" class="btn-turno-mini edit" onclick="ViasaGuardiasEngine.abrirModalTurno('${t.id}')" title="Modificar este turno">
                                                <i class="fa-solid fa-pen"></i>
                                            </button>
                                            <button type="button" class="btn-turno-mini add" onclick="ViasaGuardiasEngine.abrirModalAsignarGuardia('${t.id}')" title="Asignar personal a este turno">
                                                <i class="fa-solid fa-plus"></i>
                                            </button>
                                            <button type="button" class="btn-turno-mini del" onclick="ViasaGuardiasEngine.eliminarTurno('${t.id}')" title="Eliminar este turno">
                                                <i class="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div class="turno-column-list">
                                    ${t.pautas ? `
                                        <div class="pautas-box-turno">
                                            <i class="fa-solid fa-list-check" style="color:#fbbf24;"></i> ${t.pautas}
                                        </div>
                                    ` : ''}

                                    ${empIdsUnicos.length === 0 ? `
                                        <div style="padding: 22px 14px; text-align: center; color: #64748b; font-size: 0.78rem; background: rgba(0,0,0,0.2); border-radius: 8px;">
                                            <i class="fa-solid fa-user-clock" style="font-size: 1.5rem; color: #475569; display: block; margin-bottom: 6px;"></i>
                                            Sin personal asignado en este período.
                                            <div style="margin-top: 8px;">
                                                <button type="button" class="btn-cmd-guardia emerald" style="padding: 4px 10px; font-size: 0.7rem;" onclick="ViasaGuardiasEngine.abrirModalAsignarGuardia('${t.id}')">
                                                    <i class="fa-solid fa-user-plus"></i> Asignar Trabajador
                                                </button>
                                            </div>
                                        </div>
                                    ` : empIdsUnicos.map(empId => {
                                        const emp = emps.find(x => x.id === empId) || { nombreCompleto: 'Personal', cargo: 'Operario', departamento: 'General' };
                                        const foto = this.obtenerFotoEmpleado(emp);
                                        const deptoStyle = this.obtenerEstiloDepto(this.normalizarDepartamento(emp.departamento, emp.cargo));
                                        const guardiasEmp = enTurno.filter(g => g.empleadoId === empId);
                                        const primeraGuardia = guardiasEmp[0];

                                        // Días trabajados en la semana
                                        const diasSem = [
                                            { letra: 'L', idx: 1 },
                                            { letra: 'M', idx: 2 },
                                            { letra: 'X', idx: 3 },
                                            { letra: 'J', idx: 4 },
                                            { letra: 'V', idx: 5 },
                                            { letra: 'S', idx: 6 },
                                            { letra: 'D', idx: 0 }
                                        ];
                                        const diasAsignadosSet = new Set(guardiasEmp.map(g => new Date(g.fecha + 'T12:00:00').getDay()));

                                        return `
                                            <div class="guardia-worker-card">
                                                <div class="worker-card-top">
                                                    <img src="${foto}" class="worker-card-avatar" style="border-color:${t.color || '#64748b'};">
                                                    <div class="worker-card-info">
                                                        <h5 class="worker-card-name">${emp.nombreCompleto || emp.nombres}</h5>
                                                        <div class="worker-card-cargo">${emp.cargo}</div>
                                                        <span class="${deptoStyle.clase}" style="font-size: 0.62rem; padding: 1px 5px; margin-top: 2px;">
                                                            ${deptoStyle.label}
                                                        </span>
                                                    </div>
                                                    <button type="button" class="btn-xs-delete-guardia" onclick="ViasaGuardiasEngine.eliminarGuardia('${primeraGuardia.id}')" title="Desasignar Guardia">
                                                        &times;
                                                    </button>
                                                </div>

                                                <div class="worker-card-meta">
                                                    ${this.vistaTemporalMatriz.startsWith('semana') ? `
                                                        <div class="badge-dias-pills">
                                                            ${diasSem.map(d => `
                                                                <span class="dia-dot ${diasAsignadosSet.has(d.idx) ? 'activo' : 'descanso'}" title="${diasAsignadosSet.has(d.idx) ? 'Guardia Asignada' : 'Descanso Legal LOTTT'}">
                                                                    ${d.letra}
                                                                </span>
                                                            `).join('')}
                                                        </div>
                                                        <span style="font-weight:700; color:#4ade80;">${guardiasEmp.length} días (${guardiasEmp.length * lotttInfo.duracionHoras}h)</span>
                                                    ` : this.vistaTemporalMatriz === 'mes' ? `
                                                        <span><i class="fa-solid fa-calendar-check" style="color:#fbbf24;"></i> ${guardiasEmp.length} Guardias / Mes</span>
                                                        <span style="font-weight:700; color:#38bdf8;">${guardiasEmp.length * lotttInfo.duracionHoras} hrs</span>
                                                    ` : `
                                                        <span><i class="fa-solid fa-location-dot" style="color:#fbbf24;"></i> ${primeraGuardia.ubicacionAsignada || 'Panadería'}</span>
                                                        <span style="color:#4ade80; font-weight:700;">${primeraGuardia.horaEntrada} - ${primeraGuardia.horaSalida}</span>
                                                    `}
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        },

        // ----------------------------------------------------------------------
        // SUB-VIEW 3: CRUCE CRM Y CAFETÍN VIASA
        // ----------------------------------------------------------------------
        renderSubViewCRMCafetinHTML(cruce) {
            return `
                <div class="cruce-crm-layout">
                    <!-- Columna 1: Reservas y Salón Cafetín Viasa -->
                    <div class="cruce-panel-card">
                        <div class="cruce-panel-hdr">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <i class="fa-solid fa-utensils" style="color:#fb923c; font-size:1.2rem;"></i>
                                <h3 style="margin:0; color:#fff; font-size:1rem;">Salón Cafetín Viasa &bull; Alertas de Atención</h3>
                            </div>
                            <span class="badge-live-alert">En Vivo</span>
                        </div>

                        <div class="cruce-panel-body">
                            <div class="alert-box-info" style="margin-bottom: 12px;">
                                <i class="fa-solid fa-circle-info"></i>
                                <span>Personal asignado en Salón y Cocina para hoy: <strong>${cruce.personalCafetin.length} trabajadores</strong>.</span>
                            </div>

                            <h4 style="color:#fbbf24; font-size:0.85rem; margin:0 0 8px 0;">Mesas Activas y Reservas en Salón:</h4>
                            ${cruce.mesasActivas.length === 0 ? `
                                <p style="color:#64748b; font-size:0.8rem;">No hay mesas ocupadas ni reservas pendientes actualmente.</p>
                            ` : cruce.mesasActivas.map(m => `
                                <div class="cruce-item-card">
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <strong style="color:#fff; font-size:0.9rem;">Mesa #${m.numero} &bull; ${m.sector}</strong>
                                        <span class="badge-mesa-state ${m.estado}">${m.estado.toUpperCase()}</span>
                                    </div>
                                    <div style="font-size:0.75rem; color:#94a3b8; margin:3px 0;">
                                        Capacidad: ${m.capacidad} Comensales | Comanda en curso: <strong>$${m.totalCuentaUSD || 0} USD</strong>
                                    </div>
                                    <div style="font-size:0.72rem; color:#cbd5e1; background:rgba(0,0,0,0.3); padding:4px 8px; border-radius:4px; margin-top:4px;">
                                        <i class="fa-solid fa-user-check" style="color:#4ade80;"></i> Mesonero Asignado: <strong>Luisiana Rangel (Turno Vespertino)</strong>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Columna 2: Clientes VIP / Corporativos CRM Y Despachos -->
                    <div class="cruce-panel-card">
                        <div class="cruce-panel-hdr">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <i class="fa-solid fa-building-user" style="color:#38bdf8; font-size:1.2rem;"></i>
                                <h3 style="margin:0; color:#fff; font-size:1rem;">Clientes Corporativos CRM &bull; Entregas Programadas</h3>
                            </div>
                            <span class="badge-live-alert" style="background:#0284c7;">CRM Sync</span>
                        </div>

                        <div class="cruce-panel-body">
                            <div class="alert-box-info" style="margin-bottom: 12px; border-left-color:#38bdf8;">
                                <i class="fa-solid fa-truck-fast"></i>
                                <span>Personal de Choferes / Despacho en Turno: <strong>${cruce.personalDespacho.length} choferes</strong>.</span>
                            </div>

                            <h4 style="color:#38bdf8; font-size:0.85rem; margin:0 0 8px 0;">Pedidos Mayoristas y Clientes Frecuentes:</h4>
                            <div class="cruce-item-card">
                                <div style="display:flex; justify-content:space-between;">
                                    <strong style="color:#fff; font-size:0.9rem;">Inversiones El Gran Samán, C.A.</strong>
                                    <span style="color:#4ade80; font-weight:800;">$45.00 USD</span>
                                </div>
                                <div style="font-size:0.75rem; color:#94a3b8; margin:2px 0;">RIF: J-50123984-1 &bull; La Sabanita</div>
                                <div style="font-size:0.74rem; color:#cbd5e1;">Carga: 50 Canillas + 20 Panes de Sándwich</div>
                                <div style="font-size:0.72rem; color:#fbbf24; margin-top:4px;">
                                    <i class="fa-solid fa-truck"></i> Chofer Asignado: <strong>José Gregorio Valdez (Ruta 1)</strong>
                                </div>
                            </div>

                            <div class="cruce-item-card">
                                <div style="display:flex; justify-content:space-between;">
                                    <strong style="color:#fff; font-size:0.9rem;">Corporación Eventos Angostura, C.A.</strong>
                                    <span style="color:#4ade80; font-weight:800;">$52.00 USD</span>
                                </div>
                                <div style="font-size:0.75rem; color:#94a3b8; margin:2px 0;">RIF: J-40912845-2 &bull; Casco Histórico</div>
                                <div style="font-size:0.74rem; color:#cbd5e1;">Carga: Catering Cafetín (Croissants y Golfeados)</div>
                                <div style="font-size:0.72rem; color:#fbbf24; margin-top:4px;">
                                    <i class="fa-solid fa-truck"></i> Chofer Asignado: <strong>José Gregorio Valdez (Ruta 1)</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        // ----------------------------------------------------------------------
        // SUB-VIEW 4: LOGÍSTICA Y RUTAS DE DESPACHO
        // ----------------------------------------------------------------------
        renderSubViewLogisticaHTML(rutas) {
            return `
                <div class="guardias-filter-toolbar">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <h3 style="margin: 0; color: #fff; font-size: 1rem;"><i class="fa-solid fa-map-location-dot" style="color:#fb923c;"></i> Centro Logístico de Despachos &bull; Ciudad Bolívar</h3>
                    </div>
                    <button type="button" class="btn-gold" onclick="alert('Funcionalidad de crear nueva ruta disponible.');">
                        <i class="fa-solid fa-plus"></i> + Nueva Ruta
                    </button>
                </div>

                <div class="rutas-grid-container">
                    ${rutas.map(r => `
                        <div class="ruta-master-card">
                            <div class="ruta-master-hdr">
                                <div>
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <span class="badge-ruta-code">${r.codigo}</span>
                                        <h3 style="margin:0; color:#fff; font-size:1.05rem;">${r.nombreRuta}</h3>
                                    </div>
                                    <span style="font-size:0.75rem; color:#94a3b8;"><i class="fa-solid fa-user"></i> Chofer: <strong style="color:#fbbf24;">${r.choferNombre}</strong> &bull; ${r.vehiculo}</span>
                                </div>
                                <div style="text-align:right;">
                                    <span class="badge-ruta-state ${r.estado}">${r.estado.toUpperCase()}</span>
                                    <div style="font-size:0.75rem; color:#4ade80; font-weight:800; margin-top:3px;">${r.paradasCompletadas}/${r.totalParadas} Completadas</div>
                                </div>
                            </div>

                            <div class="ruta-paradas-timeline">
                                ${r.paradas.map(p => `
                                    <div class="parada-timeline-item ${p.estado}">
                                        <div class="parada-marker">${p.paradaNum}</div>
                                        <div class="parada-content">
                                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                                <strong style="color:#fff; font-size:0.88rem;">${p.clienteNombre}</strong>
                                                <span class="badge-parada-state ${p.estado}">${p.estado.toUpperCase()}</span>
                                            </div>
                                            <div style="font-size:0.74rem; color:#94a3b8; margin:2px 0;">${p.direccion}</div>
                                            <div style="font-size:0.74rem; color:#cbd5e1;">📦 <strong>Carga:</strong> ${p.tipoCarga} &bull; <span style="color:#4ade80; font-weight:800;">$${p.montoUSD} USD</span></div>
                                            
                                            ${p.estado === 'entregado' ? `
                                                <div style="font-size:0.7rem; color:#4ade80; margin-top:4px; background:rgba(34,197,94,0.1); padding:3px 6px; border-radius:4px; display:inline-block;">
                                                    <i class="fa-solid fa-check-circle"></i> Entregado a las ${p.horaEntrega} &bull; Recibido por: ${p.firmadoPor}
                                                </div>
                                            ` : `
                                                <div style="margin-top:6px;">
                                                    <button type="button" class="btn-confirm-delivery" onclick="ViasaGuardiasEngine.confirmarEntregaParada('${r.id}', ${p.paradaNum})">
                                                        <i class="fa-solid fa-qrcode"></i> Confirmar Entrega QR
                                                    </button>
                                                </div>
                                            `}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        // ----------------------------------------------------------------------
        // SUB-VIEW 5: SHIFT MARKETPLACE (BOLSA DE INTERCAMBIO DE GUARDIAS)
        // ----------------------------------------------------------------------
        renderSubViewMarketplaceHTML(swaps) {
            return `
                <div class="guardias-filter-toolbar">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <h3 style="margin: 0; color: #fff; font-size: 1rem;"><i class="fa-solid fa-repeat" style="color:#a855f7;"></i> Bolsa de Intercambio de Guardias (Shift Marketplace)</h3>
                    </div>
                    <button type="button" class="btn-gold" onclick="ViasaGuardiasEngine.abrirModalSolicitarSwap()">
                        <i class="fa-solid fa-plus"></i> + Publicar Oferta / Cambio
                    </button>
                </div>

                <div class="marketplace-cards-grid">
                    ${swaps.map(s => `
                        <div class="swap-card-box ${s.estado}">
                            <div class="swap-card-hdr">
                                <div>
                                    <span class="badge-swap-id">${s.id}</span>
                                    <h4 style="margin:2px 0 0 0; color:#fff; font-size:0.95rem;">${s.solicitanteNombre}</h4>
                                    <span style="font-size:0.72rem; color:#fbbf24;">Depto: ${s.departamento}</span>
                                </div>
                                <span class="badge-swap-status ${s.estado}">${s.estado.toUpperCase()}</span>
                            </div>

                            <div class="swap-card-body">
                                <div><i class="fa-regular fa-calendar"></i> <strong>Fecha Guardia:</strong> ${s.fechaGuardia}</div>
                                <div><i class="fa-regular fa-clock"></i> <strong>Turno:</strong> ${s.turnoOriginal}</div>
                                <div><i class="fa-solid fa-comment-dots"></i> <strong>Motivo:</strong> <em>"${s.motivo}"</em></div>
                                <div><i class="fa-solid fa-user-tag"></i> <strong>Suplente Postulado:</strong> <span style="color:#38bdf8; font-weight:700;">${s.candidatoNombre || 'Oferta Abierta'}</span></div>
                            </div>

                            <div class="swap-card-footer">
                                ${s.estado === 'pendiente_aprobacion' ? `
                                    <button type="button" class="btn-swap-approve" onclick="ViasaGuardiasEngine.aprobarIntercambio('${s.id}')">
                                        <i class="fa-solid fa-check"></i> Aprobar Intercambio
                                    </button>
                                    <button type="button" class="btn-swap-reject" onclick="ViasaGuardiasEngine.rechazarIntercambio('${s.id}')">
                                        <i class="fa-solid fa-xmark"></i> Rechazar
                                    </button>
                                ` : `
                                    <span style="font-size:0.72rem; color:#94a3b8;">
                                        ${s.estado === 'aprobado' ? `Aprobado por: ${s.aprobadoPor} (${s.fechaAprobacion})` : `Rechazado: ${s.motivoRechazo || 'N/A'}`}
                                    </span>
                                `}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        // ----------------------------------------------------------------------
        // SUB-VIEW 6: CHECK-IN QR Y GPS EN VIVO
        // ----------------------------------------------------------------------
        async renderSubViewAsistenciaHTML(emps) {
            const fichajes = await window.ViasaStorage.obtenerColeccion('fichajes_asistencia') || [];
            const hoyFichajes = fichajes.slice(-10).reverse();

            return `
                <div class="asistencia-live-container">
                    <div class="asistencia-control-card">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">
                            <h3 style="margin:0; color:#fff; font-size:1.05rem;"><i class="fa-solid fa-fingerprint" style="color:#4ade80;"></i> Marcaje Biométrico &bull; QR Y GPS Proximidad</h3>
                            <span class="badge-live-alert" style="background:#16a34a;">Terminal Activo</span>
                        </div>

                        <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:16px;">
                            <div>
                                <label style="font-size:0.78rem; font-weight:700; color:#94a3b8; display:block; margin-bottom:4px;">Seleccionar Trabajador:</label>
                                <select id="checkin-emp-select" class="login-input" style="background:#1e293b; color:#fff; font-size:0.85rem; padding:8px; width:100%; border:1px solid #334155; border-radius:6px; margin-bottom:12px;">
                                    ${emps.filter(e => e.estado === 'activo').map(e => `
                                        <option value="${e.id}">${e.nombreCompleto || e.nombres} &bull; C.I: ${e.cedula} (${e.departamento})</option>
                                    `).join('')}
                                </select>

                                <div style="display:flex; gap:10px;">
                                    <button type="button" class="btn-gold" style="flex:1; padding:10px; font-weight:800; background:linear-gradient(135deg, #16a34a, #15803d);" onclick="ViasaGuardiasEngine.registrarCheckIn(document.getElementById('checkin-emp-select').value, 'entrada')">
                                        <i class="fa-solid fa-right-to-bracket"></i> Marcar ENTRADA
                                    </button>
                                    <button type="button" class="btn-secondary" style="flex:1; padding:10px; font-weight:800; background:#dc2626; border-color:#ef4444; color:#fff;" onclick="ViasaGuardiasEngine.registrarCheckIn(document.getElementById('checkin-emp-select').value, 'salida')">
                                        <i class="fa-solid fa-right-from-bracket"></i> Marcar SALIDA
                                    </button>
                                </div>
                            </div>

                            <div style="background:rgba(0,0,0,0.3); padding:12px; border-radius:8px; border:1px solid #334155; font-size:0.76rem; color:#cbd5e1;">
                                <strong style="color:#fbbf24;"><i class="fa-solid fa-shield-halved"></i> Parámetros de Geocerca Ciudad Bolívar:</strong>
                                <ul style="margin:6px 0 0 16px; padding:0; line-height:1.4;">
                                    <li>Sede La Sabanita: Lat 8.1182, Lng -63.5389</li>
                                    <li>Radio de Tolerancia: 200 metros</li>
                                    <li>Tolerancia de Retraso LOTTT: 10 minutos</li>
                                    <li>Cálculo automático de Horas Extras nocturnas</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- TABLA DE ÚLTIMOS MARCAJES EN VIVO -->
                    <div style="margin-top:16px;">
                        <h4 style="color:#fff; font-size:0.95rem; margin-bottom:8px;"><i class="fa-solid fa-clock-rotate-left"></i> Registro de Asistencia en Tiempo Real</h4>
                        <div class="table-responsive">
                            <table class="table-viasa-guardias">
                                <thead>
                                    <tr>
                                        <th>Hora / Fecha</th>
                                        <th>Trabajador</th>
                                        <th>Depto</th>
                                        <th>Evento</th>
                                        <th>Condición / Retraso</th>
                                        <th>Dispositivo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${hoyFichajes.length === 0 ? `
                                        <tr><td colspan="6" style="text-align:center; color:#64748b;">No hay marcajes registrados hoy.</td></tr>
                                    ` : hoyFichajes.map(f => `
                                        <tr>
                                            <td style="font-family:monospace; color:#4ade80;">${f.hora} &bull; ${f.fecha}</td>
                                            <td><strong>${f.nombreEmpleado}</strong></td>
                                            <td>${f.departamento || 'N/A'}</td>
                                            <td><span class="badge-evento ${f.tipo}">${f.tipo.toUpperCase()}</span></td>
                                            <td><span class="badge-puntualidad">${f.estadoPuntualidad || 'Puntual'}</span></td>
                                            <td style="font-size:0.72rem; color:#94a3b8;">${f.dispositivo || 'Terminal'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        }
    };

    window.ViasaGuardiasEngine = ViasaGuardiasEngine;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.ViasaGuardiasEngine.init());
    } else {
        window.ViasaGuardiasEngine.init();
    }

})(window);
