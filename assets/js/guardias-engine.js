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
        filtroDepto: 'todos',
        filtroTurno: 'todos',
        filtroBusqueda: '',
        fechaSeleccionada: new Date().toISOString().split('T')[0],
        pinsVisibles: {},
        empIdSubiendoFoto: null,

        // Inicialización
        init() {
            console.log('[VIASA GUARDIAS] Inicializando Motor Tecnológico de Guardias y Operaciones de Campo...');
            this.inicializarEventosOffline();
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

            const modal = document.getElementById('modal-credencial-digital');
            if (!modal) return;

            const deptoNorm = this.normalizarDepartamento(emp.departamento, emp.cargo);
            const fotoUrl = this.obtenerFotoEmpleado(emp);

            const fotoEl = document.getElementById('cred-foto-img');
            if (fotoEl) fotoEl.src = fotoUrl;

            document.getElementById('cred-nombre').textContent = emp.nombreCompleto || `${emp.nombres || ''} ${emp.apellidos || ''}`.trim();
            document.getElementById('cred-cargo').textContent = emp.cargo || 'Personal Operativo';
            document.getElementById('cred-depto').textContent = `Departamento: ${deptoNorm}`;
            document.getElementById('cred-cedula').textContent = `C.I: ${emp.cedula || 'N/A'}`;
            document.getElementById('cred-pin').textContent = `PIN: ${emp.pinAcceso || emp.pinFichaje || '1234'}`;
            document.getElementById('cred-ingreso').textContent = `Ingreso: ${emp.fechaIngreso || '2026-01-15'}`;
            
            const qrImg = document.getElementById('cred-qr-img');
            if (qrImg) {
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(emp.qrToken || `VIASA-EMP-${emp.cedula}`)}&color=0f172a`;
                qrImg.src = qrUrl;
            }

            modal.style.display = 'flex';
        },

        cerrarModalCredencial() {
            const modal = document.getElementById('modal-credencial-digital');
            if (modal) modal.style.display = 'none';
        },

        // ======================================================================
        // 2. MATRIZ DE GUARDIAS Y ASIGNACIÓN DE TURNOS
        // ======================================================================
        async obtenerGuardias() {
            let grds = await window.ViasaStorage.obtenerColeccion('guardias_turnos');
            if (!grds || grds.length === 0) {
                grds = window.ViasaDatabase.guardiasTurnos || [];
            }
            return grds;
        },

        async abrirModalAsignarGuardia() {
            const modal = document.getElementById('modal-asignar-guardia');
            if (!modal) return;

            const selEmp = document.getElementById('asig-guardia-emp');
            if (selEmp) {
                const emps = await this.obtenerEmpleados();
                const activos = emps.filter(e => e.estado === 'activo');
                selEmp.innerHTML = activos.map(e => `
                    <option value="${e.id}">${e.nombreCompleto || e.nombres} &bull; ${e.cargo} (${e.departamento})</option>
                `).join('');
            }

            document.getElementById('asig-guardia-fecha').value = this.fechaSeleccionada;
            modal.style.display = 'flex';
        },

        cerrarModalAsignarGuardia() {
            const modal = document.getElementById('modal-asignar-guardia');
            if (modal) modal.style.display = 'none';
        },

        async guardarAsignacionGuardia(e) {
            e.preventDefault();
            const empId = document.getElementById('asig-guardia-emp').value;
            const fecha = document.getElementById('asig-guardia-fecha').value;
            const turno = document.getElementById('asig-guardia-turno').value;
            const ubicacion = document.getElementById('asig-guardia-ubicacion').value.trim() || 'Sede Principal (La Sabanita)';

            const emps = await this.obtenerEmpleados();
            const emp = emps.find(x => x.id === empId);
            if (!emp) return;

            const horariosMap = {
                'madrugada': { nombre: 'Madrugada (04:00 - 12:00)', entrada: '04:00', salida: '12:00' },
                'matutino': { nombre: 'Matutino (06:30 - 14:30)', entrada: '06:30', salida: '14:30' },
                'vespertino': { nombre: 'Vespertino (13:00 - 21:00)', entrada: '13:00', salida: '21:00' },
                'nocturno': { nombre: 'Nocturno (21:00 - 05:00)', entrada: '21:00', salida: '05:00' }
            };

            const confTurno = horariosMap[turno] || horariosMap['matutino'];

            const nuevaGuardia = {
                id: `GRD-${Date.now().toString().slice(-6)}`,
                empleadoId: emp.id,
                nombreEmpleado: emp.nombreCompleto || emp.nombres,
                cargo: emp.cargo,
                departamento: emp.departamento,
                turno: turno,
                nombreTurno: confTurno.nombre,
                horaEntrada: confTurno.entrada,
                horaSalida: confTurno.salida,
                fecha: fecha,
                estado: 'activo',
                ubicacionAsignada: ubicacion,
                supervisor: 'Gerente General'
            };

            await window.ViasaStorage.guardarRegistro('guardias_turnos', nuevaGuardia);
            this.cerrarModalAsignarGuardia();
            if (window.ViasaAudio) window.ViasaAudio.playSuccess();
            alert(`✅ Guardia asignada a ${emp.nombreCompleto} para el día ${fecha} en turno ${confTurno.nombre}.`);
            this.renderGuardiasHub();
        },

        async eliminarGuardia(guardiaId) {
            if (!confirm('¿Deseas desasignar / remover esta guardia del calendario operativo?')) return;
            const guardias = await this.obtenerGuardias();
            const index = guardias.findIndex(g => g.id === guardiaId);
            if (index >= 0) {
                guardias.splice(index, 1);
                await window.ViasaStorage.eliminarRegistro('guardias_turnos', guardiaId);
            }
            if (window.ViasaAudio) window.ViasaAudio.playTrash();
            this.renderGuardiasHub();
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
            const swaps = await this.obtenerShiftMarketplace();
            const rutas = await this.obtenerRutasDespacho();
            const cruce = await this.obtenerCruceCRMCafetin();

            const totalActivos = emps.filter(e => e.estado === 'activo').length;
            const guardiasHoyCount = guardias.filter(g => g.fecha === this.fechaSeleccionada && g.estado === 'activo').length;
            const swapsPendientes = swaps.filter(s => s.estado === 'pendiente_aprobacion').length;
            const entregasPendientes = rutas.reduce((acc, r) => acc + (r.totalParadas - r.paradasCompletadas), 0);

            const badgeNav = document.getElementById('badge-guardias-activas');
            if (badgeNav) badgeNav.textContent = `${guardiasHoyCount} Hoy`;

            let subContentHTML = '';
            if (this.subViewActiva === 'plantilla') {
                subContentHTML = this.renderSubViewPlantillaHTML(emps);
            } else if (this.subViewActiva === 'matriz') {
                subContentHTML = this.renderSubViewMatrizHTML(guardias, emps);
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
        // SUB-VIEW 2: MATRIZ DE GUARDIAS Y ASIGNACIÓN
        // ----------------------------------------------------------------------
        renderSubViewMatrizHTML(guardias, emps) {
            const guardiasFecha = guardias.filter(g => g.fecha === this.fechaSeleccionada);
            const turnosList = ['madrugada', 'matutino', 'vespertino', 'nocturno'];

            return `
                <div class="guardias-filter-toolbar">
                    <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                        <label style="font-size:0.8rem; font-weight:800; color:#fbbf24;"><i class="fa-regular fa-calendar"></i> Fecha Operativa:</label>
                        <input type="date" class="date-input-guardias" value="${this.fechaSeleccionada}" onchange="ViasaGuardiasEngine.setFechaSeleccionada(this.value)">
                    </div>

                    <div style="display: flex; gap: 10px;">
                        <button type="button" class="btn-gold" onclick="ViasaGuardiasEngine.abrirModalAsignarGuardia()">
                            <i class="fa-solid fa-calendar-plus"></i> Asignar Guardia
                        </button>
                    </div>
                </div>

                <div class="guardias-turnos-matrix-grid">
                    ${turnosList.map(t => {
                        const enTurno = guardiasFecha.filter(g => g.turno === t);
                        const titlesMap = {
                            'madrugada': { title: '1. Turno Madrugada (04:00 - 12:00)', icon: 'fa-moon', color: '#6366f1' },
                            'matutino': { title: '2. Turno Matutino (06:30 - 14:30)', icon: 'fa-sun', color: '#f59e0b' },
                            'vespertino': { title: '3. Turno Vespertino (13:00 - 21:00)', icon: 'fa-cloud-sun', color: '#38bdf8' },
                            'nocturno': { title: '4. Turno Nocturno (21:00 - 05:00)', icon: 'fa-star-half-stroke', color: '#ec4899' }
                        };
                        const info = titlesMap[t];

                        return `
                            <div class="guardia-turno-column">
                                <div class="turno-column-hdr" style="border-top: 3px solid ${info.color};">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <i class="fa-solid ${info.icon}" style="color:${info.color}; font-size:1.1rem;"></i>
                                        <h4 style="margin:0; font-size:0.92rem; color:#fff;">${info.title}</h4>
                                    </div>
                                    <span class="badge-guardia-count">${enTurno.length} Personal</span>
                                </div>

                                <div class="turno-column-list">
                                    ${enTurno.length === 0 ? `
                                        <div style="padding: 16px; text-align: center; color: #64748b; font-size: 0.78rem;">
                                            Sin personal asignado en este turno.
                                        </div>
                                    ` : enTurno.map(g => `
                                        <div class="guardia-card-item">
                                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                                <div>
                                                    <strong style="color: #ffffff; font-size: 0.85rem;">${g.nombreEmpleado}</strong>
                                                    <div style="font-size: 0.72rem; color: #94a3b8; margin: 1px 0;">${g.cargo}</div>
                                                </div>
                                                <button type="button" class="btn-xs-delete-guardia" onclick="ViasaGuardiasEngine.eliminarGuardia('${g.id}')" title="Quitar Guardia">
                                                    &times;
                                                </button>
                                            </div>
                                            
                                            <div style="margin-top: 6px; font-size: 0.7rem; color: #cbd5e1; display: flex; justify-content: space-between; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 4px;">
                                                <span><i class="fa-solid fa-location-dot" style="color:#fbbf24;"></i> ${g.ubicacionAsignada || 'Panadería'}</span>
                                                <span style="color:#4ade80; font-weight:700;">${g.horaEntrada} - ${g.horaSalida}</span>
                                            </div>
                                        </div>
                                    `).join('')}
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
