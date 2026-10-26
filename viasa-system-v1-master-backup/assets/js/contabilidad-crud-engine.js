/**
 * ============================================================================
 * VIASA SYSTEM - ENTERPRISE EDITION (v2.9.5)
 * MOTOR CRUD UNIVERSAL DE FILAS Y ASIENTOS PARA CONTABILIDAD Y SENIAT
 * Panadería Nueva Viasa, C.A. • RIF: J-31163165-8 • La Sabanita, Ciudad Bolívar
 * ============================================================================
 * Cobertura 100% en TODOS los libros Fiscales, Administrativos, Laborales y Contables:
 *  - Nivel A (Cabecera): [+ Agregar Asiento / Fila] | [✏️ Modificar Seleccionado] | [🗑️ Eliminar Seleccionado]
 *  - Nivel B (Por Fila): Casilla de selección + Columna [Acciones] con [✏️ Modificar] y [🗑️ Eliminar]
 *  - Autocompletado Matemático en Vivo (IVA 16%, Retención 75%/100%, IGTF 3%, Art. 177, Partida Doble Debe=Haber)
 *  - Modal de Confirmación Fiscal con Doble Opción:
 *      Opción A: Anular Registro (ANULADO con montos en 0,00 para conservar correlativo SENIAT)
 *      Opción B: Eliminar Fila Físicamente de la Tabla
 * ============================================================================
 */
(function (window) {
    'use strict';

    const MathCRUD = {
        round2(v) {
            const n = Number(v);
            if (!Number.isFinite(n)) return 0;
            return Math.round((n + Number.EPSILON) * 100) / 100;
        },
        add(...vals) {
            const cents = vals.reduce((acc, val) => acc + Math.round(this.round2(val) * 100), 0);
            return Math.round(cents) / 100;
        },
        sub(a, b) {
            return Math.round(Math.round(this.round2(a) * 100) - Math.round(this.round2(b) * 100)) / 100;
        },
        mul(a, b) {
            return this.round2(Number(a || 0) * Number(b || 0));
        },
        div(a, b) {
            const den = Number(b);
            if (!den) return 0;
            return this.round2(Number(a || 0) / den);
        },
        fmtNum(v) {
            return this.round2(v).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        fmtBs(v) {
            return 'Bs. ' + this.fmtNum(v);
        },
        fmtUSD(v) {
            return '$ ' + this.fmtNum(v);
        }
    };

    // ==========================================================================
    // METADATOS DE LOS 17 LIBROS DEL MÓDULO CONTABILIDAD Y SENIAT
    // ==========================================================================
    const CATALOGO_LIBROS = {
        libroVentas: {
            prop: 'libroVentas',
            nombreLibro: 'Libro Oficial de Ventas (Art. 72 Regl. IVA)',
            singular: 'Factura / Cierre Z de Venta',
            esFiscalCorrelativo: true
        },
        libroCompras: {
            prop: 'libroCompras',
            nombreLibro: 'Libro Oficial de Compras (Art. 70 Regl. IVA)',
            singular: 'Factura de Compra',
            esFiscalCorrelativo: true
        },
        libroInventario177: {
            prop: 'libroInventario177',
            nombreLibro: 'Libro de Entrada y Salida de Inventario (Art. 177 ISLR)',
            singular: 'Ítem de Inventario Fiscal',
            esFiscalCorrelativo: false
        },
        retencionesIVA: {
            prop: 'retencionesIVA',
            nombreLibro: 'Registro de Comprobantes de Retención de IVA',
            singular: 'Comprobante de Retención IVA',
            esFiscalCorrelativo: true
        },
        retencionesISLR: {
            prop: 'retencionesISLR',
            nombreLibro: 'Relación Mensual de Retenciones de ISLR (Decreto 1.808)',
            singular: 'Retención de ISLR',
            esFiscalCorrelativo: true
        },
        partidasConciliacion: {
            prop: 'partidasConciliacion',
            nombreLibro: 'Conciliación Bancaria Inteligente',
            singular: 'Movimiento de Extracto Bancario',
            esFiscalCorrelativo: false
        },
        cajaArqueos: {
            prop: 'cajaArqueos',
            nombreLibro: 'Libro de Caja y Arqueo Diario',
            singular: 'Arqueo de Caja Diario',
            esFiscalCorrelativo: false
        },
        bancosAuxiliar: {
            prop: 'bancosAuxiliar',
            nombreLibro: 'Libro Auxiliar de Bancos',
            singular: 'Cuenta / Movimiento Bancario',
            esFiscalCorrelativo: false
        },
        cuentasPorPagar: {
            prop: 'cuentasPorPagar',
            nombreLibro: 'Libro de Cuentas por Pagar (Proveedores)',
            singular: 'Cuenta por Pagar',
            esFiscalCorrelativo: false
        },
        cuentasPorCobrar: {
            prop: 'cuentasPorCobrar',
            nombreLibro: 'Libro de Cuentas por Cobrar (Clientes / CRM)',
            singular: 'Cuenta por Cobrar',
            esFiscalCorrelativo: false
        },
        mermasAutoconsumo: {
            prop: 'mermasAutoconsumo',
            nombreLibro: 'Libro de Mermas y Autoconsumo (Art. 177 ISLR)',
            singular: 'Acta de Merma / Autoconsumo',
            esFiscalCorrelativo: false
        },
        libroHorasExtras: {
            prop: 'libroHorasExtras',
            nombreLibro: 'Libro de Horas Extras y Bono Nocturno (LOTTT)',
            singular: 'Registro de Horas Extras / Bono Nocturno',
            esFiscalCorrelativo: false
        },
        libroVacaciones: {
            prop: 'libroVacaciones',
            nombreLibro: 'Libro Oficial de Vacaciones y Bono Vacacional (LOTTT)',
            singular: 'Registro de Vacaciones',
            esFiscalCorrelativo: false
        },
        libroAsistenciaLOTTT: {
            prop: 'libroAsistenciaLOTTT',
            nombreLibro: 'Registro de Asistencia y Guardias (LOTTT / INPSASEL)',
            singular: 'Registro de Asistencia Laboral',
            esFiscalCorrelativo: false
        },
        libroDiario: {
            prop: 'libroDiario',
            nombreLibro: 'Libro Diario (Asientos Contables de Partida Doble)',
            singular: 'Asiento Contable',
            esFiscalCorrelativo: true
        },
        libroMayor: {
            prop: 'libroDiario',
            nombreLibro: 'Libro Mayor Analítico (Pases Contables)',
            singular: 'Pase al Libro Mayor / Diario',
            esFiscalCorrelativo: false
        },
        partidasBalances: {
            prop: 'partidasBalances',
            nombreLibro: 'Libro de Inventarios y Balances (VEN-NIF)',
            singular: 'Partida de Balance / Resultados',
            esFiscalCorrelativo: false
        },
        costosRecetas: {
            prop: 'costosRecetas',
            nombreLibro: 'Centro de Costos por Tanda y Receta (SUNDDE)',
            singular: 'Estructura de Costo de Producto',
            esFiscalCorrelativo: false
        }
    };

    // ==========================================================================
    // 2. MOTOR PRINCIPAL DE GESTIÓN CRUD E INYECCIÓN DE BOTONERAS
    // ==========================================================================
    const ViasaContabilidadCRUD = {
        seleccionPorLibro: {}, // { libroKey: indiceSeleccionado }
        modalActivo: null, // { modo: 'add'|'edit', libroKey, idxFila, draft }

        mostrarToast(mensaje, tipo = 'success') {
            const colores = {
                success: { bg: '#065F46', border: '#10B981', icon: 'fa-circle-check' },
                edit: { bg: '#1E3A8A', border: '#3B82F6', icon: 'fa-pen-to-square' },
                delete: { bg: '#7F1D1D', border: '#EF4444', icon: 'fa-trash-can' }
            };
            const cfg = colores[tipo] || colores.success;

            const prev = document.getElementById('cnt-crud-toast');
            if (prev) prev.remove();

            const toast = document.createElement('div');
            toast.id = 'cnt-crud-toast';
            toast.style.cssText = `
                position: fixed;
                top: 22px;
                right: 24px;
                z-index: 10050;
                background: #FFFFFF;
                color: #0F172A;
                border: 1.5px solid #CBD5E1;
                border-left: 5px solid ${cfg.border};
                padding: 13px 18px;
                border-radius: 12px;
                box-shadow: 0 14px 32px rgba(15, 23, 42, 0.18);
                font-family: 'Inter', 'Outfit', sans-serif;
                font-size: 0.84rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: fadeIn 0.2s ease;
            `;
            toast.innerHTML = `
                <i class="fa-solid ${cfg.icon}" style="color:${cfg.border}; font-size:1.1rem;"></i>
                <span>${mensaje}</span>
            `;
            document.body.appendChild(toast);
            setTimeout(() => {
                if (toast && toast.parentNode) toast.remove();
            }, 4000);
        },

        getMotor() {
            return window.ViasaContabilidadEngine;
        },

        getTasaBCV() {
            const m = this.getMotor();
            return (m && Number(m.tasaBCV)) ? Number(m.tasaBCV) : 886.23;
        },

        detectarLibroActivo() {
            const m = this.getMotor();
            if (!m) return null;

            if (m.tabPrincipal === 'tab1_seniat') {
                if (m.subTabSeniat === 'ventas') return 'libroVentas';
                if (m.subTabSeniat === 'compras') return 'libroCompras';
                if (m.subTabSeniat === 'inventario177') return 'libroInventario177';
                return null;
            }
            if (m.tabPrincipal === 'tab2_retenciones') {
                return m.subTabRetenciones === 'iva' ? 'retencionesIVA' : 'retencionesISLR';
            }
            if (m.tabPrincipal === 'tab3_ia_conciliacion') {
                return 'partidasConciliacion';
            }
            if (m.tabPrincipal === 'tab4_tesoreria') {
                if (m.subTabTesoreria === 'caja_arqueo') return 'cajaArqueos';
                if (m.subTabTesoreria === 'bancos') return 'bancosAuxiliar';
                if (m.subTabTesoreria === 'cxp') return 'cuentasPorPagar';
                if (m.subTabTesoreria === 'cxc') return 'cuentasPorCobrar';
                if (m.subTabTesoreria === 'mermas') return 'mermasAutoconsumo';
            }
            if (m.tabPrincipal === 'tab5_laboral') {
                if (m.subTabLaboral === 'horas_extras') return 'libroHorasExtras';
                if (m.subTabLaboral === 'vacaciones') return 'libroVacaciones';
                if (m.subTabLaboral === 'asistencia') return 'libroAsistenciaLOTTT';
            }
            if (m.tabPrincipal === 'tab6_contadora') {
                if (m.subTabContadora === 'libros_principales') {
                    if (m.vistaLibroContadora === 'diario') return 'libroDiario';
                    if (m.vistaLibroContadora === 'mayor') return 'libroMayor';
                    if (m.vistaLibroContadora === 'balances') return 'partidasBalances';
                }
                if (m.subTabContadora === 'centro_costos') return 'costosRecetas';
            }
            return null;
        },

        seleccionarFila(libroKey, idxFila, checked) {
            if (checked) {
                this.seleccionPorLibro[libroKey] = idxFila;
            } else if (this.seleccionPorLibro[libroKey] === idxFila) {
                delete this.seleccionPorLibro[libroKey];
            }
            const m = this.getMotor();
            if (m) m.render();
        },

        modificarSeleccionado(libroKey) {
            const idx = this.seleccionPorLibro[libroKey];
            if (idx === undefined || idx === null) {
                this.mostrarToast('⚠️ Primero seleccione una fila marcando su casilla de verificación a la izquierda.', 'edit');
                return;
            }
            this.abrirModalFormulario(libroKey, 'edit', idx);
        },

        eliminarSeleccionado(libroKey) {
            const idx = this.seleccionPorLibro[libroKey];
            if (idx === undefined || idx === null) {
                this.mostrarToast('⚠️ Primero seleccione una fila marcando su casilla de verificación a la izquierda.', 'delete');
                return;
            }
            this.abrirModalConfirmarEliminacion(libroKey, idx);
        },

        // ======================================================================
        // DECORADOR AUTOMÁTICO DE CABECERAS Y FILAS EN TODAS LAS TABLAS
        // ======================================================================
        decorarVistaActiva() {
            const container = document.getElementById('contabilidad-content');
            if (!container) return;
            const libroKey = this.detectarLibroActivo();
            if (!libroKey || !CATALOGO_LIBROS[libroKey]) return;

            const meta = CATALOGO_LIBROS[libroKey];
            const idxSel = this.seleccionPorLibro[libroKey];
            const tieneSel = idxSel !== undefined && idxSel !== null;

            // Caso especial: Libro Diario (compuesto por tarjetas de asientos individuales)
            if (libroKey === 'libroDiario') {
                this.decorarVistaLibroDiario(container, meta, idxSel, tieneSel);
                return;
            }

            // Encontrar la tarjeta principal que contiene la tabla del libro
            const cards = Array.from(container.querySelectorAll('.cnt-tab-content .cnt-card'));
            const targetCard = cards.reverse().find(c => c.querySelector('table.cnt-table'));
            if (!targetCard) return;

            // 1. Inyectar la Barra de Herramientas CRUD Superior en .cnt-card-header
            let header = targetCard.querySelector('.cnt-card-header');
            if (header && !header.querySelector('.cnt-crud-toolbar')) {
                const toolbar = document.createElement('div');
                toolbar.className = 'cnt-crud-toolbar';
                toolbar.innerHTML = `
                    <button type="button" class="cnt-crud-btn-add" onclick="ViasaContabilidadCRUD.abrirModalFormulario('${libroKey}', 'add', null)" title="Insertar un nuevo registro o asiento en ${meta.nombreLibro}">
                        <i class="fa-solid fa-plus"></i> + Agregar ${meta.singular}
                    </button>
                    <button type="button" class="cnt-crud-btn-sel-edit ${tieneSel ? 'has-selection' : ''}" onclick="ViasaContabilidadCRUD.modificarSeleccionado('${libroKey}')" title="Modificar la fila seleccionada en ${meta.nombreLibro}">
                        <i class="fa-solid fa-pen-to-square"></i> Modificar Seleccionado ${tieneSel ? `(#${idxSel + 1})` : ''}
                    </button>
                    <button type="button" class="cnt-crud-btn-sel-del ${tieneSel ? 'has-selection' : ''}" onclick="ViasaContabilidadCRUD.eliminarSeleccionado('${libroKey}')" title="Anular o eliminar la fila seleccionada en ${meta.nombreLibro}">
                        <i class="fa-solid fa-trash-can"></i> Eliminar Seleccionado ${tieneSel ? `(#${idxSel + 1})` : ''}
                    </button>
                `;
                header.appendChild(toolbar);
            }

            // 2. Inyectar Columna Izquierda (Checkbox Sel.) y Columna Derecha Fija (Acciones) en la tabla
            const table = targetCard.querySelector('table.cnt-table');
            if (!table || table.dataset.crudDecorated === 'true') return;
            table.dataset.crudDecorated = 'true';

            const theadRow = table.querySelector('thead tr');
            if (theadRow) {
                const thSel = document.createElement('th');
                thSel.style.cssText = 'width:38px; text-align:center;';
                thSel.innerHTML = '<i class="fa-solid fa-check-square" title="Seleccionar fila"></i>';
                theadRow.insertBefore(thSel, theadRow.firstChild);

                const thAcc = document.createElement('th');
                thAcc.style.cssText = 'text-align:center; min-width:168px;';
                thAcc.textContent = 'Acciones (CRUD)';
                theadRow.appendChild(thAcc);
            }

            const tbodyRows = Array.from(table.querySelectorAll('tbody tr'));
            const m = this.getMotor();
            const coleccion = (m && Array.isArray(m[meta.prop])) ? m[meta.prop] : [];

            tbodyRows.forEach((tr, rowIdx) => {
                // Ignorar filas subtítulo de una sola celda con colspan
                if (tr.children.length <= 1) return;

                const itemObj = coleccion[rowIdx];
                if (itemObj && itemObj.anulado) {
                    tr.classList.add('cnt-row-anulado');
                }
                if (idxSel === rowIdx) {
                    tr.classList.add('cnt-row-selected');
                }

                // Celda izquierda: Checkbox de selección
                const tdSel = document.createElement('td');
                tdSel.style.cssText = 'text-align:center;';
                tdSel.innerHTML = `
                    <input type="checkbox" ${idxSel === rowIdx ? 'checked' : ''}
                           style="width:15px; height:15px; cursor:pointer; accent-color:#2563EB;"
                           onchange="ViasaContabilidadCRUD.seleccionarFila('${libroKey}', ${rowIdx}, this.checked)">
                `;
                tr.insertBefore(tdSel, tr.firstChild);

                // Celda derecha fija: Botones Modificar y Eliminar
                const tdAcc = document.createElement('td');
                tdAcc.style.cssText = 'text-align:center;';
                tdAcc.innerHTML = `
                    <div class="cnt-crud-row-actions">
                        <button type="button" class="cnt-crud-row-edit"
                                onclick="ViasaContabilidadCRUD.abrirModalFormulario('${libroKey}', 'edit', ${rowIdx})"
                                title="Modificar este registro y recalcular totales al instante">
                            <i class="fa-solid fa-pen-to-square"></i> Modificar
                        </button>
                        <button type="button" class="cnt-crud-row-del"
                                onclick="ViasaContabilidadCRUD.abrirModalConfirmarEliminacion('${libroKey}', ${rowIdx})"
                                title="Anular o eliminar este registro del libro">
                            <i class="fa-solid fa-trash-can"></i> Eliminar
                        </button>
                    </div>
                `;
                tr.appendChild(tdAcc);
            });

            // Ajustar tfoot para compensar las 2 nuevas columnas (Sel. y Acciones)
            const tfootRows = Array.from(table.querySelectorAll('tfoot tr'));
            tfootRows.forEach(tfRow => {
                const firstTd = tfRow.querySelector('td');
                if (firstTd) {
                    const currentColspan = parseInt(firstTd.getAttribute('colspan') || '1', 10);
                    firstTd.setAttribute('colspan', String(currentColspan + 1));
                }
                const tdEnd = document.createElement('td');
                tfRow.appendChild(tdEnd);
            });
        },

        decorarVistaLibroDiario(container, meta, idxSel, tieneSel) {
            const tabContent = container.querySelector('.cnt-tab-content');
            if (!tabContent) return;

            // Barra superior de acciones del Libro Diario
            const topBar = tabContent.querySelector('div[style*="justify-content:space-between"]');
            if (topBar && !topBar.querySelector('.cnt-crud-toolbar')) {
                const toolbar = document.createElement('div');
                toolbar.className = 'cnt-crud-toolbar';
                toolbar.innerHTML = `
                    <button type="button" class="cnt-crud-btn-add" onclick="ViasaContabilidadCRUD.abrirModalFormulario('libroDiario', 'add', null)">
                        <i class="fa-solid fa-plus"></i> + Agregar Asiento Contable (Partida Doble)
                    </button>
                    <button type="button" class="cnt-crud-btn-sel-edit ${tieneSel ? 'has-selection' : ''}" onclick="ViasaContabilidadCRUD.modificarSeleccionado('libroDiario')">
                        <i class="fa-solid fa-pen-to-square"></i> Modificar Asiento Seleccionado ${tieneSel ? `(#${idxSel + 1})` : ''}
                    </button>
                    <button type="button" class="cnt-crud-btn-sel-del ${tieneSel ? 'has-selection' : ''}" onclick="ViasaContabilidadCRUD.eliminarSeleccionado('libroDiario')">
                        <i class="fa-solid fa-trash-can"></i> Eliminar Asiento Seleccionado ${tieneSel ? `(#${idxSel + 1})` : ''}
                    </button>
                `;
                topBar.appendChild(toolbar);
            }

            // Cada tarjeta de Asiento Contable en el Libro Diario
            const asientoCards = Array.from(tabContent.querySelectorAll('.cnt-card')).filter(c => c.querySelector('table.cnt-table'));
            asientoCards.forEach((card, idx) => {
                const headerLine = card.querySelector('div[style*="border-bottom:1px solid"]');
                if (!headerLine || headerLine.dataset.crudDecorated === 'true') return;
                headerLine.dataset.crudDecorated = 'true';

                const leftDiv = headerLine.children[0];
                if (leftDiv) {
                    const chk = document.createElement('input');
                    chk.type = 'checkbox';
                    chk.checked = idxSel === idx;
                    chk.style.cssText = 'width:15px; height:15px; cursor:pointer; accent-color:#2563EB; margin-right:8px; vertical-align:middle;';
                    chk.onchange = (e) => this.seleccionarFila('libroDiario', idx, e.target.checked);
                    leftDiv.insertBefore(chk, leftDiv.firstChild);
                }

                const rightDiv = headerLine.children[1];
                if (rightDiv) {
                    const actionsSpan = document.createElement('span');
                    actionsSpan.className = 'cnt-crud-row-actions';
                    actionsSpan.style.marginLeft = '8px';
                    actionsSpan.innerHTML = `
                        <button type="button" class="cnt-crud-row-edit" onclick="ViasaContabilidadCRUD.abrirModalFormulario('libroDiario', 'edit', ${idx})" title="Modificar cuentas y montos Debe/Haber de este asiento">
                            <i class="fa-solid fa-pen-to-square"></i> Modificar Asiento
                        </button>
                        <button type="button" class="cnt-crud-row-del" onclick="ViasaContabilidadCRUD.abrirModalConfirmarEliminacion('libroDiario', ${idx})" title="Anular o eliminar este asiento contable">
                            <i class="fa-solid fa-trash-can"></i> Eliminar
                        </button>
                    `;
                    rightDiv.appendChild(actionsSpan);
                }
            });
        },

        // ======================================================================
        // 3. MODAL CORPORATIVO PARA + AGREGAR Y ✏️ MODIFICAR (CON CÁLCULO EN VIVO)
        // ======================================================================
        crearBorradorPorDefecto(libroKey) {
            const hoy = new Date().toISOString().slice(0, 10);
            const tasa = this.getTasaBCV();

            switch (libroKey) {
                case 'libroVentas':
                    return {
                        id: `LV-2026-00${(this.getMotor().libroVentas.length || 0) + 1}`,
                        fecha: hoy,
                        rifCedula: 'V-00000000-0',
                        razonSocial: 'RESUMEN DIARIO DE VENTAS AL DETAL (REPORTE Z)',
                        tipoContribuyente: 'No Contribuyente / Consumidor Final',
                        numReporteZ: String((this.getMotor().libroVentas.length || 0) + 484).padStart(6, '0'),
                        serialMaquinaFiscal: 'Z1B8045912',
                        numFactura: '00084689 - 00084950',
                        numControl: 'FISCAL-HKA80',
                        notaDebitoCredito: '-',
                        tasaBCV: tasa,
                        ventasExentasUSD: 680.00,
                        baseImponible16USD: 490.00,
                        alicuotaPorc: 16,
                        ivaCausadoUSD: 78.40,
                        ivaRetenidoPorClienteUSD: 0.00,
                        baseIGTFDivisasUSD: 150.00,
                        igtfPercibidoUSD: 4.50,
                        totalVentasConIVAUSD: 1248.40
                    };
                case 'libroCompras':
                    return {
                        id: `LC-2026-00${(this.getMotor().libroCompras.length || 0) + 1}`,
                        fecha: hoy,
                        rifProveedor: 'J-00024511-3',
                        razonSocial: 'MOLINOS NACIONALES, C.A. (MONACA)',
                        rubro: 'Harina de Trigo Panadera Extra Fuerte (Sacos 45 kg)',
                        numFactura: '0095810',
                        numControl: '00-0958101',
                        comprobanteRetencionIVA: `2026100000000${(this.getMotor().retencionesIVA.length || 0) + 1}`,
                        tasaBCV: tasa,
                        comprasExentasUSD: 450.00,
                        baseImponible16USD: 320.00,
                        alicuotaPorc: 16,
                        ivaCreditoFiscalUSD: 51.20,
                        porcentajeRetencionIVA: 75,
                        ivaRetenidoUSD: 38.40,
                        igtfPagadoUSD: 0.00,
                        totalCompraConIVAUSD: 821.20
                    };
                case 'libroInventario177':
                    return {
                        codigo: `MP-PAN-00${(this.getMotor().libroInventario177.length || 0) + 1}`,
                        descripcion: 'Harina de Trigo Panadero Extra Fuerte (Sacos 45 kg)',
                        categoria: 'Materia Prima Exenta',
                        unidad: 'Sacos 45 kg',
                        costoUnitUSD: 42.00,
                        invInicialUnid: 50,
                        entradasUnid: 30,
                        salidasVentasProdUnid: 22,
                        mermasAutoconsumoUnid: 1
                    };
                case 'retencionesIVA':
                    return {
                        numComprobante: `2026100000000${(this.getMotor().retencionesIVA.length || 0) + 1}`,
                        fechaEmision: hoy,
                        rifProveedor: 'J-30114892-6',
                        nombreProveedor: 'DISTRIBUIDORA DE GRASAS Y LEVADURAS GUAYANA, C.A.',
                        numFactura: '0014890',
                        numControl: '00-0089912',
                        tasaBCV: tasa,
                        exentoUSD: 0.00,
                        baseImponibleUSD: 400.00,
                        alicuota: 16,
                        ivaCausadoUSD: 64.00,
                        porcentajeRetencion: 75,
                        ivaRetenidoUSD: 48.00,
                        totalConIVAUSD: 464.00
                    };
                case 'retencionesISLR':
                    return {
                        id: `ISLR-202610-00${(this.getMotor().retencionesISLR.length || 0) + 1}`,
                        fecha: hoy,
                        rifRetenido: 'J-30991122-4',
                        nombreRetenido: 'SERVICIOS TÉCNICOS DE REFRIGERACIÓN INDUSTRIAL BOLÍVAR, C.A.',
                        numFactura: '0004512',
                        numControl: '00-0004512',
                        codigoConcepto: '053',
                        concepto: 'Contratistas y Servicios de Mantenimiento (Persona Jurídica)',
                        baseImponibleUSD: 350.00,
                        porcentajeRetencion: 2,
                        sustraendoBs: 0,
                        montoRetenidoUSD: 7.00,
                        tasaBCV: tasa
                    };
                case 'partidasConciliacion':
                    return {
                        id: `CONC-00${(this.getMotor().partidasConciliacion.length || 0) + 1}`,
                        fecha: hoy,
                        banco: 'Banesco Banco Universal',
                        canal: 'Punto de Venta / Biopago',
                        refUltimos6: '849201',
                        conceptoBanco: 'LIQUIDACIÓN LOTE TDD/TDC COMERCIO AFILIADO VIASA',
                        montoUSD: 420.00,
                        refCajaPOS: 'ARQ-2026-002',
                        estado: 'conciliado'
                    };
                case 'cajaArqueos':
                    return {
                        id: `ARQ-2026-00${(this.getMotor().cajaArqueos.length || 0) + 1}`,
                        fecha: hoy,
                        turno: 'Turno Mañana (06:00 a 14:00)',
                        cajera: 'María Fernanda Gómez (Caja Principal)',
                        posBiopagoUSD: 520.00,
                        pagoMovilUSD: 190.00,
                        efectivoBsUSD: 45.00,
                        divisasEfectivoUSD: 140.00,
                        zelleUSD: 60.00,
                        igtfRecaudadoUSD: 6.00,
                        totalRecaudadoUSD: 961.00,
                        tasaBCV: tasa,
                        estado: 'Cuadrado Exacto'
                    };
                case 'bancosAuxiliar':
                    return {
                        codigo: '1.1.02.05',
                        banco: 'Banco Nacional de Crédito (BNC)',
                        cuenta: '0191-0098-44-2100984120',
                        moneda: 'VES (Bs.)',
                        saldoUSD: 1850.00,
                        lotesPendientesUSD: 210.00
                    };
                case 'cuentasPorPagar':
                    return {
                        id: `CXP-00${(this.getMotor().cuentasPorPagar.length || 0) + 1}`,
                        proveedor: 'MOLINOS NACIONALES, C.A. (MONACA)',
                        rif: 'J-00024511-3',
                        factura: '0095810',
                        fechaEmision: hoy,
                        fechaVencimiento: hoy,
                        saldoPendienteUSD: 650.00,
                        tasaInicialBCV: MathCRUD.sub(tasa, 4.50)
                    };
                case 'cuentasPorCobrar':
                    return {
                        id: `CXC-00${(this.getMotor().cuentasPorCobrar.length || 0) + 1}`,
                        cliente: 'HOTEL Laja Real & Convenciones, C.A.',
                        rif: 'J-08501294-1',
                        factura: '00084710',
                        fechaEmision: hoy,
                        fechaVencimiento: hoy,
                        saldoPendienteUSD: 380.00,
                        tasaInicialBCV: MathCRUD.sub(tasa, 3.20),
                        estado: 'Vigente (Crédito Corporativo)'
                    };
                case 'mermasAutoconsumo':
                    return {
                        id: `MER-2026-00${(this.getMotor().mermasAutoconsumo.length || 0) + 1}`,
                        fecha: hoy,
                        codigoItem: 'MP-HAR-001',
                        producto: 'Pan Canilla y Francés (Merma de Cocción / Descarte)',
                        tipo: 'Merma de Producción Auditada',
                        cantidad: 25,
                        unidad: 'Unidades',
                        costoUnitUSD: 0.36,
                        costoTotalUSD: 9.00,
                        tasaBCV: tasa,
                        autorizadoPor: 'Maestro Panadero / Administradora'
                    };
                case 'libroHorasExtras':
                    return {
                        fecha: hoy,
                        cedula: 'V-17.892.104',
                        trabajador: 'Carlos Eduardo Mendoza',
                        cargo: 'Maestro Hornero Principal',
                        salarioBaseUSD: 360.00,
                        horasExtrasDiurnas: 4,
                        horasBonoNocturno: 6
                    };
                case 'libroVacaciones':
                    return {
                        id: `VAC-2026-00${(this.getMotor().libroVacaciones.length || 0) + 1}`,
                        cedula: 'V-19.410.285',
                        trabajador: 'José Gregorio Rivas (Maestro Pastelero)',
                        fechaIngreso: '2021-03-15',
                        anosServicio: 5,
                        periodoCausado: '2025 - 2026',
                        diasDisfruteLey: 19,
                        diasBonoVacacional: 19,
                        montoBonoUSD: 285.00,
                        estatusFirma: 'Firmado y Pagado en Nómina'
                    };
                case 'libroAsistenciaLOTTT':
                    return {
                        id: `ASIS-00${((this.getMotor().libroAsistenciaLOTTT || []).length || 0) + 1}`,
                        cedula: 'V-20.118.492',
                        trabajador: 'Luis Alberto Bolívar',
                        cargo: 'Operador de Amasado y Horno',
                        departamento: 'Fabricación',
                        horario: '06:00 - 14:00',
                        estatus: '100% Asistencia Verificada QR'
                    };
                case 'libroDiario':
                case 'libroMayor':
                    return {
                        id: `ASI-2026-00${(this.getMotor().libroDiario.length || 0) + 1}`,
                        fecha: hoy,
                        referencia: 'COMP-MAN-01',
                        descripcion: 'Asiento contable registrado en Libro Diario (VEN-NIF)',
                        origen: 'Libro Diario Contadora',
                        tasaBCV: tasa,
                        lineas: [
                            { codigo: '1.1.03.01', cuenta: 'Inventario de Materia Prima y Harinas (Art. 177)', debeUSD: 500.00, haberUSD: 0.00 },
                            { codigo: '1.1.04.01', cuenta: 'IVA Crédito Fiscal (16% Compras)', debeUSD: 80.00, haberUSD: 0.00 },
                            { codigo: '2.1.01.01', cuenta: 'Cuentas por Pagar Proveedores Nacionales', debeUSD: 0.00, haberUSD: 580.00 }
                        ]
                    };
                case 'partidasBalances':
                    return {
                        id: `BAL-0${((this.getMotor().partidasBalances || []).length || 0) + 1}`,
                        seccion: 'Activo Corriente',
                        rubro: 'Inversiones Temporales y Fondo Operativo en Custodia',
                        montoUSD: 1250.00
                    };
                case 'costosRecetas':
                    return {
                        codigo: `REC-0${((this.getMotor().costosRecetas || []).length || 0) + 1}`,
                        producto: 'Pan Sobado Guayanés Especial (500g)',
                        linea: 'Panadería Exenta',
                        costoMPUSD: 0.52,
                        costoMODyCIFUSD: 0.23,
                        precioVentaSinIVAUSD: 0.97,
                        exento: true
                    };
                default:
                    return {};
            }
        },

        abrirModalFormulario(libroKey, modo = 'add', idxFila = null) {
            const m = this.getMotor();
            if (!m) return;
            const meta = CATALOGO_LIBROS[libroKey];
            if (!meta) return;

            let coleccion = m[meta.prop] || [];
            let draft;

            if (modo === 'edit' && idxFila !== null && coleccion[idxFila]) {
                draft = JSON.parse(JSON.stringify(coleccion[idxFila]));
            } else {
                draft = this.crearBorradorPorDefecto(libroKey);
            }

            this.modalActivo = { modo, libroKey, idxFila, draft };
            this.renderizarDOMModalFormulario();
        },

        cerrarModal() {
            this.modalActivo = null;
            const el = document.getElementById('cnt-crud-modal-root');
            if (el) el.remove();
        },

        renderizarDOMModalFormulario() {
            if (!this.modalActivo) return;
            const { modo, libroKey, draft } = this.modalActivo;
            const meta = CATALOGO_LIBROS[libroKey];

            let root = document.getElementById('cnt-crud-modal-root');
            if (!root) {
                root = document.createElement('div');
                root.id = 'cnt-crud-modal-root';
                root.className = 'cnt-crud-modal-overlay';
                document.body.appendChild(root);
            }

            const tituloModal = modo === 'add'
                ? `+ Agregar ${meta.singular} — ${meta.nombreLibro}`
                : `✏️ Modificar ${meta.singular} — ${meta.nombreLibro}`;

            root.innerHTML = `
                <div class="cnt-crud-modal-box">
                    <div class="cnt-crud-modal-header">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="width:36px; height:36px; border-radius:9px; background:${modo === 'add' ? '#DBEAFE' : '#FEF3C7'}; color:${modo === 'add' ? '#1D4ED8' : '#B45309'}; display:inline-flex; align-items:center; justify-content:center; font-size:1rem;">
                                <i class="fa-solid ${modo === 'add' ? 'fa-plus' : 'fa-pen-to-square'}"></i>
                            </span>
                            <div>
                                <div style="font-size:0.96rem; font-weight:900; color:#0F172A;">${tituloModal}</div>
                                <div style="font-size:0.74rem; color:#64748B;">
                                    Panadería Nueva Viasa, C.A. (RIF: J-31163165-8) &bull; Recálculo Matemático Automático en Vivo
                                </div>
                            </div>
                        </div>
                        <button type="button" class="cnt-btn cnt-btn-outline" style="padding:5px 10px;" onclick="ViasaContabilidadCRUD.cerrarModal()">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div class="cnt-crud-modal-body">
                        ${this.renderCamposModalPorLibro(libroKey, draft)}
                    </div>

                    <div class="cnt-crud-modal-footer">
                        <button type="button" class="cnt-btn cnt-btn-outline" onclick="ViasaContabilidadCRUD.cerrarModal()">
                            Cancelar
                        </button>
                        <button type="button" class="cnt-btn cnt-btn-primary" onclick="ViasaContabilidadCRUD.guardarModalFormulario()">
                            <i class="fa-solid fa-floppy-disk"></i> ${modo === 'add' ? 'Guardar e Insertar en el Libro' : 'Guardar Cambios y Recalcular Saldos'}
                        </button>
                    </div>
                </div>
            `;
        },

        renderCamposModalPorLibro(libroKey, d) {
            const tasa = d.tasaBCV || this.getTasaBCV();

            // 1. LIBRO DE VENTAS (Art. 72 IVA)
            if (libroKey === 'libroVentas') {
                const totalBs = MathCRUD.mul(d.totalVentasConIVAUSD, tasa);
                return `
                    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;">
                        <div><label class="cnt-label">Fecha de Operación:</label><input type="date" id="crud-f-fecha" class="cnt-input" style="width:100%;" value="${d.fecha}"></div>
                        <div><label class="cnt-label">RIF / Cédula Cliente:</label><input type="text" id="crud-f-rif" class="cnt-input" style="width:100%;" value="${d.rifCedula}"></div>
                        <div><label class="cnt-label">N.º Reporte Z:</label><input type="text" id="crud-f-repz" class="cnt-input" style="width:100%;" value="${d.numReporteZ}"></div>
                        <div style="grid-column: span 2;"><label class="cnt-label">Nombre o Razón Social / Resumen Z:</label><input type="text" id="crud-f-razon" class="cnt-input" style="width:100%;" value="${d.razonSocial}"></div>
                        <div><label class="cnt-label">Serial Máquina Fiscal:</label><input type="text" id="crud-f-serial" class="cnt-input" style="width:100%;" value="${d.serialMaquinaFiscal}"></div>
                        <div><label class="cnt-label">N.º Factura(s):</label><input type="text" id="crud-f-fac" class="cnt-input" style="width:100%;" value="${d.numFactura}"></div>
                        <div><label class="cnt-label">N.º Control:</label><input type="text" id="crud-f-ctrl" class="cnt-input" style="width:100%;" value="${d.numControl}"></div>
                        <div><label class="cnt-label">Tasa Oficial BCV (Bs./$):</label><input type="number" step="0.01" id="crud-f-tasa" class="cnt-input" style="width:100%;" value="${tasa}" oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()"></div>
                        <div><label class="cnt-label">Ventas Exentas Pan (USD):</label><input type="number" step="0.01" id="crud-f-exento" class="cnt-input" style="width:100%;" value="${d.ventasExentasUSD}" oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()"></div>
                        <div><label class="cnt-label">Base Imponible 16% (USD):</label><input type="number" step="0.01" id="crud-f-base16" class="cnt-input" style="width:100%;" value="${d.baseImponible16USD}" oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()"></div>
                        <div><label class="cnt-label">Débito Fiscal IVA 16% (USD):</label><input type="number" step="0.01" id="crud-f-iva" class="cnt-input" style="width:100%; background:#EFF6FF !important;" value="${d.ivaCausadoUSD}" readonly></div>
                        <div><label class="cnt-label">IVA Retenido por Cliente ($):</label><input type="number" step="0.01" id="crud-f-retiva" class="cnt-input" style="width:100%;" value="${d.ivaRetenidoPorClienteUSD || 0}" oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()"></div>
                        <div><label class="cnt-label">IGTF Percibido 3% Divisas ($):</label><input type="number" step="0.01" id="crud-f-igtf" class="cnt-input" style="width:100%;" value="${d.igtfPercibidoUSD || 0}" oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()"></div>
                    </div>
                    <div class="cnt-crud-live-box" id="crud-live-summary">
                        <div><strong>Total Venta Calculado en Vivo (Exento + Base 16% + IVA):</strong></div>
                        <div class="cnt-mono" style="font-size:1.05rem; font-weight:900; color:#1E40AF;">
                            ${MathCRUD.fmtBs(totalBs)} &nbsp;|&nbsp; ${MathCRUD.fmtUSD(d.totalVentasConIVAUSD)}
                        </div>
                    </div>
                `;
            }

            // 2. LIBRO DE COMPRAS (Art. 70 IVA)
            if (libroKey === 'libroCompras') {
                const totalBs = MathCRUD.mul(d.totalCompraConIVAUSD, tasa);
                return `
                    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;">
                        <div><label class="cnt-label">Fecha de Factura:</label><input type="date" id="crud-f-fecha" class="cnt-input" style="width:100%;" value="${d.fecha}"></div>
                        <div><label class="cnt-label">RIF Proveedor (SENIAT):</label><input type="text" id="crud-f-rif" class="cnt-input" style="width:100%;" value="${d.rifProveedor}"></div>
                        <div><label class="cnt-label">N.º Factura:</label><input type="text" id="crud-f-fac" class="cnt-input" style="width:100%;" value="${d.numFactura}"></div>
                        <div style="grid-column: span 2;"><label class="cnt-label">Razón Social del Proveedor:</label><input type="text" id="crud-f-razon" class="cnt-input" style="width:100%;" value="${d.razonSocial}"></div>
                        <div><label class="cnt-label">N.º de Control Fiscal:</label><input type="text" id="crud-f-ctrl" class="cnt-input" style="width:100%;" value="${d.numControl}"></div>
                        <div style="grid-column: span 2;"><label class="cnt-label">Concepto / Rubro de Compra:</label><input type="text" id="crud-f-rubro" class="cnt-input" style="width:100%;" value="${d.rubro || ''}"></div>
                        <div><label class="cnt-label">Tasa Oficial BCV (Bs./$):</label><input type="number" step="0.01" id="crud-f-tasa" class="cnt-input" style="width:100%;" value="${tasa}" oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()"></div>
                        <div><label class="cnt-label">Compras Exentas (USD):</label><input type="number" step="0.01" id="crud-f-exento" class="cnt-input" style="width:100%;" value="${d.comprasExentasUSD}" oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()"></div>
                        <div><label class="cnt-label">Base Imponible 16% (USD):</label><input type="number" step="0.01" id="crud-f-base16" class="cnt-input" style="width:100%;" value="${d.baseImponible16USD}" oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()"></div>
                        <div><label class="cnt-label">Crédito Fiscal IVA 16% ($):</label><input type="number" step="0.01" id="crud-f-iva" class="cnt-input" style="width:100%; background:#EFF6FF !important;" value="${d.ivaCreditoFiscalUSD}" readonly></div>
                        <div>
                            <label class="cnt-label">% Retención de IVA:</label>
                            <select id="crud-f-porcret" class="cnt-select" style="width:100%;" onchange="ViasaContabilidadCRUD.recalcularModalEnVivo()">
                                <option value="75" ${d.porcentajeRetencionIVA === 75 ? 'selected' : ''}>75% (Ordinario)</option>
                                <option value="100" ${d.porcentajeRetencionIVA === 100 ? 'selected' : ''}>100% (Especial)</option>
                                <option value="0" ${d.porcentajeRetencionIVA === 0 ? 'selected' : ''}>0% (Exento)</option>
                            </select>
                        </div>
                        <div><label class="cnt-label">IVA Retenido ($):</label><input type="number" step="0.01" id="crud-f-retiva" class="cnt-input" style="width:100%; background:#FEF3C7 !important;" value="${d.ivaRetenidoUSD}" readonly></div>
                        <div><label class="cnt-label">IGTF Pagado 3% No Deduc. ($):</label><input type="number" step="0.01" id="crud-f-igtf" class="cnt-input" style="width:100%;" value="${d.igtfPagadoUSD || 0}" oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()"></div>
                    </div>
                    <div class="cnt-crud-live-box" id="crud-live-summary">
                        <div><strong>Total Compra Calculado en Vivo (Exento + Base 16% + IVA):</strong></div>
                        <div class="cnt-mono" style="font-size:1.05rem; font-weight:900; color:#059669;">
                            ${MathCRUD.fmtBs(totalBs)} &nbsp;|&nbsp; ${MathCRUD.fmtUSD(d.totalCompraConIVAUSD)} (Ret. IVA: ${MathCRUD.fmtUSD(d.ivaRetenidoUSD)})
                        </div>
                    </div>
                `;
            }

            // 3. LIBRO DE INVENTARIO FISCAL CONTINUO (Art. 177 ISLR)
            if (libroKey === 'libroInventario177') {
                const finUnid = MathCRUD.sub(MathCRUD.add(d.invInicialUnid, d.entradasUnid), MathCRUD.add(d.salidasVentasProdUnid, d.mermasAutoconsumoUnid));
                const finUSD = MathCRUD.mul(finUnid, d.costoUnitUSD);
                const finBs = MathCRUD.mul(finUSD, this.getTasaBCV());
                return `
                    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;">
                        <div><label class="cnt-label">Código del Ítem:</label><input type="text" id="crud-f-cod" class="cnt-input" style="width:100%;" value="${d.codigo}"></div>
                        <div style="grid-column: span 2;"><label class="cnt-label">Descripción de Materia Prima / Producto:</label><input type="text" id="crud-f-desc" class="cnt-input" style="width:100%;" value="${d.descripcion}"></div>
                        <div><label class="cnt-label">Categoría Fiscal:</label><input type="text" id="crud-f-cat" class="cnt-input" style="width:100%;" value="${d.categoria}"></div>
                        <div><label class="cnt-label">Unidad de Medida:</label><input type="text" id="crud-f-unid" class="cnt-input" style="width:100%;" value="${d.unidad}"></div>
                        <div><label class="cnt-label">Costo Unitario (USD BCV):</label><input type="number" step="0.01" id="crud-f-costo" class="cnt-input" style="width:100%;" value="${d.costoUnitUSD}" oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()"></div>
                        <div><label class="cnt-label">Inventario Inicial (Unid.):</label><input type="number" step="0.01" id="crud-f-ini" class="cnt-input" style="width:100%;" value="${d.invInicialUnid}" oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()"></div>
                        <div><label class="cnt-label">Entradas / Compras (Unid.):</label><input type="number" step="0.01" id="crud-f-ent" class="cnt-input" style="width:100%;" value="${d.entradasUnid}" oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()"></div>
                        <div><label class="cnt-label">Salidas / Producción (Unid.):</label><input type="number" step="0.01" id="crud-f-sal" class="cnt-input" style="width:100%;" value="${d.salidasVentasProdUnid}" oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()"></div>
                        <div><label class="cnt-label">Mermas / Autoconsumo (Unid.):</label><input type="number" step="0.01" id="crud-f-mer" class="cnt-input" style="width:100%;" value="${d.mermasAutoconsumoUnid}" oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()"></div>
                    </div>
                    <div class="cnt-crud-live-box" id="crud-live-summary">
                        <div><strong>Ecuación Art. 177 ISLR (Inicial + Entradas − Salidas = Final):</strong></div>
                        <div class="cnt-mono" style="font-size:1rem; font-weight:900; color:#1E40AF;">
                            Inv. Final: ${finUnid} ${d.unidad} &nbsp;|&nbsp; ${MathCRUD.fmtBs(finBs)} (${MathCRUD.fmtUSD(finUSD)})
                        </div>
                    </div>
                `;
            }

            // 4. LIBRO DIARIO Y MAYOR (PARTIDA DOBLE DEBE = HABER)
            if (libroKey === 'libroDiario' || libroKey === 'libroMayor') {
                const lineas = Array.isArray(d.lineas) ? d.lineas : [];
                let sumD = 0, sumH = 0;
                const filasLinHTML = lineas.map((l, idxL) => {
                    sumD = MathCRUD.add(sumD, l.debeUSD);
                    sumH = MathCRUD.add(sumH, l.haberUSD);
                    return `
                        <tr>
                            <td><input type="text" class="cnt-input" style="width:110px;" value="${l.codigo}" oninput="ViasaContabilidadCRUD.modalActivo.draft.lineas[${idxL}].codigo=this.value"></td>
                            <td><input type="text" class="cnt-input" style="width:100%;" value="${l.cuenta}" oninput="ViasaContabilidadCRUD.modalActivo.draft.lineas[${idxL}].cuenta=this.value"></td>
                            <td><input type="number" step="0.01" class="cnt-input" style="width:115px;" value="${l.debeUSD}" oninput="ViasaContabilidadCRUD.modalActivo.draft.lineas[${idxL}].debeUSD=parseFloat(this.value)||0; ViasaContabilidadCRUD.recalcularModalEnVivo()"></td>
                            <td><input type="number" step="0.01" class="cnt-input" style="width:115px;" value="${l.haberUSD}" oninput="ViasaContabilidadCRUD.modalActivo.draft.lineas[${idxL}].haberUSD=parseFloat(this.value)||0; ViasaContabilidadCRUD.recalcularModalEnVivo()"></td>
                            <td style="text-align:center;">
                                <button type="button" class="cnt-crud-row-del" onclick="ViasaContabilidadCRUD.eliminarLineaDiarioModal(${idxL})"><i class="fa-solid fa-trash-can"></i></button>
                            </td>
                        </tr>
                    `;
                }).join('');

                const dif = MathCRUD.sub(sumD, sumH);
                const cuadrado = Math.abs(dif) === 0 && sumD > 0;

                return `
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:12px; margin-bottom:12px;">
                        <div><label class="cnt-label">ID del Asiento:</label><input type="text" id="crud-f-id" class="cnt-input" style="width:100%;" value="${d.id}"></div>
                        <div><label class="cnt-label">Fecha Contable:</label><input type="date" id="crud-f-fecha" class="cnt-input" style="width:100%;" value="${d.fecha}"></div>
                        <div><label class="cnt-label">Referencia / Documento:</label><input type="text" id="crud-f-ref" class="cnt-input" style="width:100%;" value="${d.referencia}"></div>
                        <div style="grid-column: span 3;"><label class="cnt-label">Glosa / Concepto Explicativo del Asiento:</label><input type="text" id="crud-f-desc" class="cnt-input" style="width:100%;" value="${d.descripcion || d.concepto || ''}"></div>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <strong style="font-size:0.8rem; color:#0F172A;">Líneas del Asiento Contable (VEN-NIF):</strong>
                        <div style="display:flex; gap:8px;">
                            <button type="button" class="cnt-btn cnt-btn-outline" style="padding:5px 10px; font-size:0.74rem;" onclick="ViasaContabilidadCRUD.cuadrarPartidaDobleModal()">
                                <i class="fa-solid fa-scale-balanced"></i> Cuadrar Partida Doble Automáticamente
                            </button>
                            <button type="button" class="cnt-btn cnt-btn-emerald" style="padding:5px 10px; font-size:0.74rem;" onclick="ViasaContabilidadCRUD.agregarLineaDiarioModal()">
                                <i class="fa-solid fa-plus"></i> + Añadir Línea Contable
                            </button>
                        </div>
                    </div>

                    <div class="cnt-table-wrap">
                        <table class="cnt-table">
                            <thead>
                                <tr>
                                    <th>Código VEN-NIF</th>
                                    <th>Denominación de la Cuenta</th>
                                    <th class="num">Debe (USD BCV)</th>
                                    <th class="num">Haber (USD BCV)</th>
                                    <th style="text-align:center;">Quitar</th>
                                </tr>
                            </thead>
                            <tbody>${filasLinHTML}</tbody>
                        </table>
                    </div>

                    <div class="cnt-crud-live-box" id="crud-live-summary" style="border-left-color:${cuadrado ? '#059669' : '#DC2626'};">
                        <div>
                            <strong style="color:${cuadrado ? '#065F46' : '#991B1B'};">
                                ${cuadrado ? '✅ PARTIDA DOBLE CUADRADA EXACTA (∑ Debe = ∑ Haber)' : `⚠️ DESCUADRE DETECTADO: Diferencia de ${MathCRUD.fmtUSD(dif)}`}
                            </strong>
                        </div>
                        <div class="cnt-mono" style="font-size:0.95rem; font-weight:900;">
                            ∑ Debe: ${MathCRUD.fmtUSD(sumD)} (${MathCRUD.fmtBs(MathCRUD.mul(sumD, tasa))}) &nbsp;|&nbsp;
                            ∑ Haber: ${MathCRUD.fmtUSD(sumH)} (${MathCRUD.fmtBs(MathCRUD.mul(sumH, tasa))})
                        </div>
                    </div>
                `;
            }

            // 5. FORMULARIO DINÁMICO UNIVERSAL PARA LOS DEMÁS LIBROS (Retenciones, Tesorería, LOTTT, Balances, Costos)
            const camposHTML = Object.keys(d).filter(k => k !== 'anulado' && typeof d[k] !== 'object').map(k => {
                const val = d[k];
                const esNum = typeof val === 'number';
                const esFecha = String(k).toLowerCase().includes('fecha');
                const labelLimpio = k
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, s => s.toUpperCase())
                    .replace('U S D', '(USD BCV)')
                    .replace('B C V', 'BCV');
                return `
                    <div>
                        <label class="cnt-label">${labelLimpio}:</label>
                        <input type="${esFecha ? 'date' : (esNum ? 'number' : 'text')}"
                               ${esNum ? 'step="0.01"' : ''}
                               data-crud-key="${k}"
                               class="cnt-input crud-generic-input"
                               style="width:100%;"
                               value="${val}"
                               oninput="ViasaContabilidadCRUD.recalcularModalEnVivo()">
                    </div>
                `;
            }).join('');

            return `
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;">
                    ${camposHTML}
                </div>
                <div class="cnt-crud-live-box" id="crud-live-summary">
                    <div><strong>Conversión Bimonetaria Automática Activa (Tasa BCV: Bs. ${MathCRUD.fmtNum(this.getTasaBCV())} / USD):</strong></div>
                    <div style="font-size:0.8rem; color:#047857; font-weight:800;">Los subtotales y saldos del libro se actualizarán al guardar.</div>
                </div>
            `;
        },

        recalcularModalEnVivo() {
            if (!this.modalActivo) return;
            const { libroKey, draft } = this.modalActivo;
            const summaryBox = document.getElementById('crud-live-summary');

            if (libroKey === 'libroVentas') {
                const tasa = parseFloat(document.getElementById('crud-f-tasa')?.value) || this.getTasaBCV();
                const exento = MathCRUD.round2(parseFloat(document.getElementById('crud-f-exento')?.value) || 0);
                const base16 = MathCRUD.round2(parseFloat(document.getElementById('crud-f-base16')?.value) || 0);
                const iva = MathCRUD.round2(base16 * 0.16);
                const totalUSD = MathCRUD.add(exento, base16, iva);
                const totalBs = MathCRUD.mul(totalUSD, tasa);

                const inputIva = document.getElementById('crud-f-iva');
                if (inputIva) inputIva.value = iva.toFixed(2);
                if (summaryBox) {
                    summaryBox.innerHTML = `
                        <div><strong>Total Venta Calculado en Vivo (Exento + Base 16% + IVA):</strong></div>
                        <div class="cnt-mono" style="font-size:1.05rem; font-weight:900; color:#1E40AF;">
                            ${MathCRUD.fmtBs(totalBs)} &nbsp;|&nbsp; ${MathCRUD.fmtUSD(totalUSD)}
                        </div>
                    `;
                }
                return;
            }

            if (libroKey === 'libroCompras') {
                const tasa = parseFloat(document.getElementById('crud-f-tasa')?.value) || this.getTasaBCV();
                const exento = MathCRUD.round2(parseFloat(document.getElementById('crud-f-exento')?.value) || 0);
                const base16 = MathCRUD.round2(parseFloat(document.getElementById('crud-f-base16')?.value) || 0);
                const porcRet = parseInt(document.getElementById('crud-f-porcret')?.value || '75', 10);
                const iva = MathCRUD.round2(base16 * 0.16);
                const retIva = MathCRUD.round2(iva * (porcRet / 100));
                const totalUSD = MathCRUD.add(exento, base16, iva);
                const totalBs = MathCRUD.mul(totalUSD, tasa);

                const inputIva = document.getElementById('crud-f-iva');
                const inputRet = document.getElementById('crud-f-retiva');
                if (inputIva) inputIva.value = iva.toFixed(2);
                if (inputRet) inputRet.value = retIva.toFixed(2);
                if (summaryBox) {
                    summaryBox.innerHTML = `
                        <div><strong>Total Compra Calculado en Vivo (Exento + Base 16% + IVA):</strong></div>
                        <div class="cnt-mono" style="font-size:1.05rem; font-weight:900; color:#059669;">
                            ${MathCRUD.fmtBs(totalBs)} &nbsp;|&nbsp; ${MathCRUD.fmtUSD(totalUSD)} (Ret. IVA: ${MathCRUD.fmtUSD(retIva)})
                        </div>
                    `;
                }
                return;
            }

            if (libroKey === 'libroInventario177') {
                const ini = MathCRUD.round2(parseFloat(document.getElementById('crud-f-ini')?.value) || 0);
                const ent = MathCRUD.round2(parseFloat(document.getElementById('crud-f-ent')?.value) || 0);
                const sal = MathCRUD.round2(parseFloat(document.getElementById('crud-f-sal')?.value) || 0);
                const mer = MathCRUD.round2(parseFloat(document.getElementById('crud-f-mer')?.value) || 0);
                const costo = MathCRUD.round2(parseFloat(document.getElementById('crud-f-costo')?.value) || 0);
                const finUnid = MathCRUD.sub(MathCRUD.add(ini, ent), MathCRUD.add(sal, mer));
                const finUSD = MathCRUD.mul(finUnid, costo);
                const finBs = MathCRUD.mul(finUSD, this.getTasaBCV());
                if (summaryBox) {
                    summaryBox.innerHTML = `
                        <div><strong>Ecuación Art. 177 ISLR (Inicial + Entradas − Salidas = Final):</strong></div>
                        <div class="cnt-mono" style="font-size:1rem; font-weight:900; color:#1E40AF;">
                            Inv. Final: ${finUnid} unid. &nbsp;|&nbsp; ${MathCRUD.fmtBs(finBs)} (${MathCRUD.fmtUSD(finUSD)})
                        </div>
                    `;
                }
                return;
            }

            if (libroKey === 'libroDiario' || libroKey === 'libroMayor') {
                const tasa = draft.tasaBCV || this.getTasaBCV();
                let sumD = 0, sumH = 0;
                (draft.lineas || []).forEach(l => {
                    sumD = MathCRUD.add(sumD, l.debeUSD);
                    sumH = MathCRUD.add(sumH, l.haberUSD);
                });
                const dif = MathCRUD.sub(sumD, sumH);
                const cuadrado = Math.abs(dif) === 0 && sumD > 0;
                if (summaryBox) {
                    summaryBox.style.borderLeftColor = cuadrado ? '#059669' : '#DC2626';
                    summaryBox.innerHTML = `
                        <div>
                            <strong style="color:${cuadrado ? '#065F46' : '#991B1B'};">
                                ${cuadrado ? '✅ PARTIDA DOBLE CUADRADA EXACTA (∑ Debe = ∑ Haber)' : `⚠️ DESCUADRE DETECTADO: Diferencia de ${MathCRUD.fmtUSD(dif)}`}
                            </strong>
                        </div>
                        <div class="cnt-mono" style="font-size:0.95rem; font-weight:900;">
                            ∑ Debe: ${MathCRUD.fmtUSD(sumD)} (${MathCRUD.fmtBs(MathCRUD.mul(sumD, tasa))}) &nbsp;|&nbsp;
                            ∑ Haber: ${MathCRUD.fmtUSD(sumH)} (${MathCRUD.fmtBs(MathCRUD.mul(sumH, tasa))})
                        </div>
                    `;
                }
            }
        },

        agregarLineaDiarioModal() {
            if (!this.modalActivo || !Array.isArray(this.modalActivo.draft.lineas)) return;
            this.sincronizarCabeceraDiarioModal();
            this.modalActivo.draft.lineas.push({
                codigo: '5.1.01.01',
                cuenta: 'Gastos Operativos y Administrativos Generales',
                debeUSD: 0.00,
                haberUSD: 0.00
            });
            this.renderizarDOMModalFormulario();
        },

        eliminarLineaDiarioModal(idxLinea) {
            if (!this.modalActivo || !Array.isArray(this.modalActivo.draft.lineas)) return;
            if (this.modalActivo.draft.lineas.length <= 2) {
                this.mostrarToast('⚠️ Todo asiento contable de partida doble requiere al menos 2 líneas (Debe y Haber).', 'edit');
                return;
            }
            this.sincronizarCabeceraDiarioModal();
            this.modalActivo.draft.lineas.splice(idxLinea, 1);
            this.renderizarDOMModalFormulario();
        },

        cuadrarPartidaDobleModal() {
            if (!this.modalActivo || !Array.isArray(this.modalActivo.draft.lineas)) return;
            this.sincronizarCabeceraDiarioModal();
            const lineas = this.modalActivo.draft.lineas;
            let sumD = 0, sumH = 0;
            lineas.forEach(l => {
                sumD = MathCRUD.add(sumD, l.debeUSD);
                sumH = MathCRUD.add(sumH, l.haberUSD);
            });
            const dif = MathCRUD.sub(sumD, sumH);
            if (Math.abs(dif) === 0) return;
            const ultima = lineas[lineas.length - 1];
            if (dif > 0) {
                ultima.haberUSD = MathCRUD.add(ultima.haberUSD, dif);
            } else {
                ultima.debeUSD = MathCRUD.add(ultima.debeUSD, Math.abs(dif));
            }
            this.renderizarDOMModalFormulario();
        },

        sincronizarCabeceraDiarioModal() {
            if (!this.modalActivo) return;
            const d = this.modalActivo.draft;
            d.id = document.getElementById('crud-f-id')?.value || d.id;
            d.fecha = document.getElementById('crud-f-fecha')?.value || d.fecha;
            d.referencia = document.getElementById('crud-f-ref')?.value || d.referencia;
            d.descripcion = document.getElementById('crud-f-desc')?.value || d.descripcion;
        },

        guardarModalFormulario() {
            if (!this.modalActivo) return;
            const { modo, libroKey, idxFila, draft } = this.modalActivo;
            const m = this.getMotor();
            if (!m) return;
            const meta = CATALOGO_LIBROS[libroKey];

            // Leer valores actualizados según el tipo de libro
            if (libroKey === 'libroVentas') {
                draft.fecha = document.getElementById('crud-f-fecha')?.value || draft.fecha;
                draft.rifCedula = (document.getElementById('crud-f-rif')?.value || draft.rifCedula).trim().toUpperCase();
                draft.numReporteZ = (document.getElementById('crud-f-repz')?.value || draft.numReporteZ).trim();
                draft.razonSocial = (document.getElementById('crud-f-razon')?.value || draft.razonSocial).trim().toUpperCase();
                draft.serialMaquinaFiscal = (document.getElementById('crud-f-serial')?.value || draft.serialMaquinaFiscal).trim();
                draft.numFactura = (document.getElementById('crud-f-fac')?.value || draft.numFactura).trim();
                draft.numControl = (document.getElementById('crud-f-ctrl')?.value || draft.numControl).trim();
                draft.tasaBCV = MathCRUD.round2(parseFloat(document.getElementById('crud-f-tasa')?.value) || this.getTasaBCV());
                draft.ventasExentasUSD = MathCRUD.round2(parseFloat(document.getElementById('crud-f-exento')?.value) || 0);
                draft.baseImponible16USD = MathCRUD.round2(parseFloat(document.getElementById('crud-f-base16')?.value) || 0);
                draft.ivaCausadoUSD = MathCRUD.round2(draft.baseImponible16USD * 0.16);
                draft.ivaRetenidoPorClienteUSD = MathCRUD.round2(parseFloat(document.getElementById('crud-f-retiva')?.value) || 0);
                draft.igtfPercibidoUSD = MathCRUD.round2(parseFloat(document.getElementById('crud-f-igtf')?.value) || 0);
                draft.totalVentasConIVAUSD = MathCRUD.add(draft.ventasExentasUSD, draft.baseImponible16USD, draft.ivaCausadoUSD);
                delete draft.anulado;
            } else if (libroKey === 'libroCompras') {
                draft.fecha = document.getElementById('crud-f-fecha')?.value || draft.fecha;
                draft.rifProveedor = (document.getElementById('crud-f-rif')?.value || draft.rifProveedor).trim().toUpperCase();
                draft.numFactura = (document.getElementById('crud-f-fac')?.value || draft.numFactura).trim();
                draft.razonSocial = (document.getElementById('crud-f-razon')?.value || draft.razonSocial).trim().toUpperCase();
                draft.numControl = (document.getElementById('crud-f-ctrl')?.value || draft.numControl).trim();
                draft.rubro = (document.getElementById('crud-f-rubro')?.value || draft.rubro).trim();
                draft.tasaBCV = MathCRUD.round2(parseFloat(document.getElementById('crud-f-tasa')?.value) || this.getTasaBCV());
                draft.comprasExentasUSD = MathCRUD.round2(parseFloat(document.getElementById('crud-f-exento')?.value) || 0);
                draft.baseImponible16USD = MathCRUD.round2(parseFloat(document.getElementById('crud-f-base16')?.value) || 0);
                draft.porcentajeRetencionIVA = parseInt(document.getElementById('crud-f-porcret')?.value || '75', 10);
                draft.ivaCreditoFiscalUSD = MathCRUD.round2(draft.baseImponible16USD * 0.16);
                draft.ivaRetenidoUSD = MathCRUD.round2(draft.ivaCreditoFiscalUSD * (draft.porcentajeRetencionIVA / 100));
                draft.igtfPagadoUSD = MathCRUD.round2(parseFloat(document.getElementById('crud-f-igtf')?.value) || 0);
                draft.totalCompraConIVAUSD = MathCRUD.add(draft.comprasExentasUSD, draft.baseImponible16USD, draft.ivaCreditoFiscalUSD);
                delete draft.anulado;
            } else if (libroKey === 'libroInventario177') {
                draft.codigo = (document.getElementById('crud-f-cod')?.value || draft.codigo).trim().toUpperCase();
                draft.descripcion = (document.getElementById('crud-f-desc')?.value || draft.descripcion).trim();
                draft.categoria = (document.getElementById('crud-f-cat')?.value || draft.categoria).trim();
                draft.unidad = (document.getElementById('crud-f-unid')?.value || draft.unidad).trim();
                draft.costoUnitUSD = MathCRUD.round2(parseFloat(document.getElementById('crud-f-costo')?.value) || 0);
                draft.invInicialUnid = MathCRUD.round2(parseFloat(document.getElementById('crud-f-ini')?.value) || 0);
                draft.entradasUnid = MathCRUD.round2(parseFloat(document.getElementById('crud-f-ent')?.value) || 0);
                draft.salidasVentasProdUnid = MathCRUD.round2(parseFloat(document.getElementById('crud-f-sal')?.value) || 0);
                draft.mermasAutoconsumoUnid = MathCRUD.round2(parseFloat(document.getElementById('crud-f-mer')?.value) || 0);
                delete draft.anulado;
            } else if (libroKey === 'libroDiario' || libroKey === 'libroMayor') {
                this.sincronizarCabeceraDiarioModal();
                let sumD = 0, sumH = 0;
                draft.lineas.forEach(l => {
                    sumD = MathCRUD.add(sumD, l.debeUSD);
                    sumH = MathCRUD.add(sumH, l.haberUSD);
                });
                if (Math.abs(MathCRUD.sub(sumD, sumH)) > 0.01) {
                    alert('⚠️ El asiento contable debe cumplir estrictamente la Partida Doble (∑ Debe = ∑ Haber). Haga clic en "Cuadrar Partida Doble Automáticamente" antes de guardar.');
                    return;
                }
                delete draft.anulado;
            } else {
                const inputs = Array.from(document.querySelectorAll('.crud-generic-input'));
                inputs.forEach(inp => {
                    const key = inp.getAttribute('data-crud-key');
                    if (!key) return;
                    if (typeof draft[key] === 'number') {
                        draft[key] = MathCRUD.round2(parseFloat(inp.value) || 0);
                    } else {
                        draft[key] = inp.value;
                    }
                });
                delete draft.anulado;
            }

            if (!Array.isArray(m[meta.prop])) {
                m[meta.prop] = [];
            }

            if (modo === 'add') {
                m[meta.prop].unshift(draft);
                // Propagación contable automática al Libro Diario si se insertó una Compra o Venta
                if (libroKey === 'libroCompras') {
                    m.libroDiario.unshift({
                        id: `ASI-2026-00${m.libroDiario.length + 1}`,
                        fecha: draft.fecha,
                        referencia: `FAC-${draft.numFactura}`,
                        descripcion: `Compra según Factura #${draft.numFactura} — ${draft.razonSocial}`,
                        origen: 'Libro de Compras SENIAT',
                        tasaBCV: draft.tasaBCV,
                        lineas: [
                            { codigo: '1.1.03.01', cuenta: 'Inventario de Materia Prima y Harinas (Art. 177)', debeUSD: MathCRUD.add(draft.comprasExentasUSD, draft.baseImponible16USD), haberUSD: 0 },
                            { codigo: '1.1.04.01', cuenta: 'IVA Crédito Fiscal (16%)', debeUSD: draft.ivaCreditoFiscalUSD, haberUSD: 0 },
                            { codigo: '2.1.01.01', cuenta: 'Cuentas por Pagar Proveedores Nacionales', debeUSD: 0, haberUSD: MathCRUD.sub(draft.totalCompraConIVAUSD, draft.ivaRetenidoUSD) },
                            { codigo: '2.1.02.02', cuenta: 'Retenciones de IVA por Enterar SENIAT (75%)', debeUSD: 0, haberUSD: draft.ivaRetenidoUSD }
                        ]
                    });
                } else if (libroKey === 'libroVentas') {
                    m.libroDiario.unshift({
                        id: `ASI-2026-00${m.libroDiario.length + 1}`,
                        fecha: draft.fecha,
                        referencia: `Z-${draft.numReporteZ}`,
                        descripcion: `Ingreso Diario Ventas — ${draft.razonSocial}`,
                        origen: 'Libro de Ventas SENIAT',
                        tasaBCV: draft.tasaBCV,
                        lineas: [
                            { codigo: '1.1.01.01', cuenta: 'Caja Principal y Bancos POS Recaudación', debeUSD: draft.totalVentasConIVAUSD, haberUSD: 0 },
                            { codigo: '4.1.01.01', cuenta: 'Ingresos por Ventas de Panadería Exenta', debeUSD: 0, haberUSD: draft.ventasExentasUSD },
                            { codigo: '4.1.01.02', cuenta: 'Ingresos por Ventas Gravadas Pastelería (16%)', debeUSD: 0, haberUSD: draft.baseImponible16USD },
                            { codigo: '2.1.02.01', cuenta: 'IVA Débito Fiscal (16%)', debeUSD: 0, haberUSD: draft.ivaCausadoUSD }
                        ]
                    });
                }
                this.mostrarToast(`✅ Asiento / fila agregado correctamente en ${meta.nombreLibro} y totales actualizados.`, 'success');
            } else {
                m[meta.prop][idxFila] = draft;
                this.mostrarToast(`✏️ Registro modificado con éxito en ${meta.nombreLibro} y saldos recalculados.`, 'edit');
            }

            m.guardarEstado();
            this.cerrarModal();
            m.render();
        },

        // ======================================================================
        // 4. MODAL DE CONFIRMACIÓN DE ELIMINACIÓN / ANULACIÓN FISCAL SENIAT
        // ======================================================================
        abrirModalConfirmarEliminacion(libroKey, idxFila) {
            const m = this.getMotor();
            if (!m) return;
            const meta = CATALOGO_LIBROS[libroKey];
            if (!meta) return;
            const coleccion = m[meta.prop] || [];
            const item = coleccion[idxFila];
            if (!item) return;

            const identificador = item.numFactura || item.numComprobante || item.id || item.codigo || item.trabajador || item.rubro || `Fila #${idxFila + 1}`;

            let root = document.getElementById('cnt-crud-modal-root');
            if (!root) {
                root = document.createElement('div');
                root.id = 'cnt-crud-modal-root';
                root.className = 'cnt-crud-modal-overlay';
                document.body.appendChild(root);
            }

            root.innerHTML = `
                <div class="cnt-crud-modal-box" style="max-width:600px;">
                    <div class="cnt-crud-modal-header" style="background:#FEF2F2; border-bottom-color:#FECACA;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="width:38px; height:38px; border-radius:10px; background:#FEE2E2; color:#DC2626; display:inline-flex; align-items:center; justify-content:center; font-size:1.1rem;">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                            </span>
                            <div>
                                <div style="font-size:0.96rem; font-weight:900; color:#991B1B;">
                                    Confirmación de Seguridad Contable — ${meta.nombreLibro}
                                </div>
                                <div style="font-size:0.74rem; color:#7F1D1D;">
                                    Registro seleccionado: <strong>${identificador}</strong> (Fila #${idxFila + 1})
                                </div>
                            </div>
                        </div>
                        <button type="button" class="cnt-btn cnt-btn-outline" style="padding:5px 10px;" onclick="ViasaContabilidadCRUD.cerrarModal()">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div class="cnt-crud-modal-body">
                        <p style="margin:0 0 14px 0; font-size:0.86rem; color:#1E293B; line-height:1.5;">
                            ¿Está seguro de que desea eliminar o anular este registro/asiento contable del <strong>${meta.nombreLibro}</strong>?
                            <strong>Los totales generales, saldos y tarjetas KPI se recalcularán automáticamente.</strong>
                        </p>

                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <div style="background:#FFFBEB; border:1px solid #FDE68A; border-left:4px solid #D97706; border-radius:10px; padding:12px;">
                                <div style="font-size:0.8rem; font-weight:800; color:#92400E; margin-bottom:4px;">
                                    <i class="fa-solid fa-file-shield"></i> Opción A (Normativa Fiscal SENIAT): Anular Registro
                                </div>
                                <div style="font-size:0.74rem; color:#78350F; margin-bottom:8px;">
                                    Conserva la fila en el libro con la etiqueta <strong>ANULADO</strong> y todos sus montos en <code>0,00</code> para no romper la secuencia de correlativos fiscales.
                                </div>
                                <button type="button" class="cnt-btn cnt-btn-amber" style="width:100%; justify-content:center;" onclick="ViasaContabilidadCRUD.ejecutarEliminacionOAnulacion('${libroKey}', ${idxFila}, 'anular')">
                                    <i class="fa-solid fa-ban"></i> Opción A: Anular Registro (Dejar en 0,00 conservando correlativo)
                                </button>
                            </div>

                            <div style="background:#FEF2F2; border:1px solid #FECACA; border-left:4px solid #DC2626; border-radius:10px; padding:12px;">
                                <div style="font-size:0.8rem; font-weight:800; color:#991B1B; margin-bottom:4px;">
                                    <i class="fa-solid fa-trash-can"></i> Opción B: Eliminar Fila Físicamente de la Tabla
                                </div>
                                <div style="font-size:0.74rem; color:#7F1D1D; margin-bottom:8px;">
                                    Remueve el registro por completo del libro (ideal para depurar errores de tipeo o cargas de prueba).
                                </div>
                                <button type="button" class="cnt-btn" style="width:100%; justify-content:center; background:#DC2626; color:#FFFFFF; border:none;" onclick="ViasaContabilidadCRUD.ejecutarEliminacionOAnulacion('${libroKey}', ${idxFila}, 'eliminar')">
                                    <i class="fa-solid fa-trash-can"></i> Opción B: Eliminar Fila Físicamente Ahora
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="cnt-crud-modal-footer">
                        <button type="button" class="cnt-btn cnt-btn-outline" onclick="ViasaContabilidadCRUD.cerrarModal()">
                            Cancelar Operación
                        </button>
                    </div>
                </div>
            `;
        },

        ejecutarEliminacionOAnulacion(libroKey, idxFila, accion = 'eliminar') {
            const m = this.getMotor();
            if (!m) return;
            const meta = CATALOGO_LIBROS[libroKey];
            if (!meta) return;
            const coleccion = m[meta.prop];
            if (!Array.isArray(coleccion) || !coleccion[idxFila]) return;

            if (accion === 'anular') {
                const reg = coleccion[idxFila];
                reg.anulado = true;
                Object.keys(reg).forEach(k => {
                    if (typeof reg[k] === 'number' && k !== 'tasaBCV' && k !== 'tasaInicialBCV' && k !== 'alicuotaPorc' && k !== 'alicuota') {
                        reg[k] = 0;
                    }
                });
                if (reg.razonSocial && !String(reg.razonSocial).startsWith('[ANULADO]')) {
                    reg.razonSocial = `[ANULADO] ${reg.razonSocial}`;
                } else if (reg.nombreProveedor && !String(reg.nombreProveedor).startsWith('[ANULADO]')) {
                    reg.nombreProveedor = `[ANULADO] ${reg.nombreProveedor}`;
                } else if (reg.descripcion && !String(reg.descripcion).startsWith('[ANULADO]')) {
                    reg.descripcion = `[ANULADO] ${reg.descripcion}`;
                } else if (reg.trabajador && !String(reg.trabajador).startsWith('[ANULADO]')) {
                    reg.trabajador = `[ANULADO] ${reg.trabajador}`;
                }
                if (Array.isArray(reg.lineas)) {
                    reg.lineas.forEach(l => {
                        l.debeUSD = 0;
                        l.haberUSD = 0;
                    });
                }
                this.mostrarToast(`⚠️ Registro marcado como ANULADO (montos en 0,00) y saldos recalculados.`, 'edit');
            } else {
                coleccion.splice(idxFila, 1);
                delete this.seleccionPorLibro[libroKey];
                this.mostrarToast(`🗑️ Fila eliminada físicamente de ${meta.nombreLibro} y saldos recalculados.`, 'delete');
            }

            m.guardarEstado();
            this.cerrarModal();
            m.render();
        },

        // ======================================================================
        // 5. ENLACE AUTOMÁTICO CON ViasaContabilidadEngine.render()
        // ======================================================================
        instalarHookEnMotorContable() {
            const m = window.ViasaContabilidadEngine;
            if (!m || m._crudHookInstalled) return;

            // Sobrescribir renderVistaLibroBalances para usar m.partidasBalances editable
            m.renderVistaLibroBalances = function () {
                const kpi = this.calcularResumenEjecutivo();
                const valorInvUSD = this.libroInventario177.reduce((acc, i) => {
                    const finUnid = MathCRUD.sub(MathCRUD.add(i.invInicialUnid, i.entradasUnid), MathCRUD.add(i.salidasVentasProdUnid, i.mermasAutoconsumoUnid));
                    return MathCRUD.add(acc, MathCRUD.mul(finUnid, i.costoUnitUSD));
                }, 0);
                const totalCxCUSD = this.cuentasPorCobrar.reduce((acc, c) => MathCRUD.add(acc, c.saldoPendienteUSD), 0);
                const totalCxPUSD = this.cuentasPorPagar.reduce((acc, c) => MathCRUD.add(acc, c.saldoPendienteUSD), 0);

                if (!Array.isArray(this.partidasBalances) || this.partidasBalances.length === 0) {
                    this.partidasBalances = [
                        { id: 'BAL-01', seccion: 'Activo Corriente', rubro: 'Efectivo en Caja, Bancos y Custodia Divisas', montoUSD: kpi.saldoBancosTotalUSD },
                        { id: 'BAL-02', seccion: 'Activo Corriente', rubro: 'Cuentas por Cobrar Comerciales', montoUSD: totalCxCUSD },
                        { id: 'BAL-03', seccion: 'Activo Corriente', rubro: 'Inventario Valorizado Art. 177 ISLR', montoUSD: valorInvUSD },
                        { id: 'BAL-04', seccion: 'Activo Corriente', rubro: 'IVA Crédito Fiscal Acumulado', montoUSD: kpi.totalCreditoFiscalUSD },
                        { id: 'BAL-05', seccion: 'Activo No Corriente', rubro: 'Propiedad, Planta y Equipo (Hornos y Amasadoras)', montoUSD: 18500.00 },
                        { id: 'BAL-06', seccion: 'Pasivo Corriente', rubro: 'Cuentas por Pagar Proveedores Nacionales', montoUSD: totalCxPUSD },
                        { id: 'BAL-07', seccion: 'Pasivo Tributario', rubro: 'IVA Débito Fiscal y Retenciones por Enterar al SENIAT', montoUSD: MathCRUD.add(kpi.totalDebitoFiscalUSD, kpi.totalRetencionesIVAProveedoresUSD, kpi.totalRetencionesISLRUSD) },
                        { id: 'BAL-08', seccion: 'Patrimonio / Resultados', rubro: 'Capital Social Suscrito y Utilidades del Ejercicio', montoUSD: 21450.00 }
                    ];
                }

                let sumActivosUSD = 0;
                const filasHTML = this.partidasBalances.map(p => {
                    const montoBs = MathCRUD.mul(p.montoUSD, this.tasaBCV);
                    if (String(p.seccion).includes('Activo')) {
                        sumActivosUSD = MathCRUD.add(sumActivosUSD, p.montoUSD);
                    }
                    return `
                        <tr>
                            <td class="cnt-mono" style="text-align:left !important;"><strong>${p.id}</strong></td>
                            <td><span class="cnt-badge ${String(p.seccion).includes('Activo') ? 'cnt-badge-blue' : (String(p.seccion).includes('Pasivo') ? 'cnt-badge-amber' : 'cnt-badge-emerald')}">${p.seccion}</span></td>
                            <td><strong>${p.rubro}</strong></td>
                            <td class="num"><strong>${MathCRUD.fmtBs(montoBs)}</strong></td>
                            <td class="num" style="background:#F8FAFC; font-weight:800;">${MathCRUD.fmtUSD(p.montoUSD)}</td>
                        </tr>
                    `;
                }).join('');

                return `
                    <div class="cnt-card">
                        <div class="cnt-card-header">
                            <div>
                                <h3 class="cnt-card-title"><i class="fa-solid fa-building-shield" style="color:#2563EB;"></i> Libro Oficial de Inventarios y Balances (Estado de Situación Financiera y Resultados VEN-NIF)</h3>
                                <div class="cnt-card-sub">Partidas patrimoniales de Activo, Pasivo, Patrimonio y Resultados con gestión interactiva completa (Agregar, Modificar y Eliminar).</div>
                            </div>
                        </div>
                        <div class="cnt-table-wrap">
                            <table class="cnt-table">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Clasificación Patrimonial</th>
                                        <th>Denominación del Rubro / Partida de Balance</th>
                                        <th class="num">Monto Valorizado (Bs.)</th>
                                        <th class="num">Equivalente (USD BCV)</th>
                                    </tr>
                                </thead>
                                <tbody>${filasHTML}</tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="3" style="text-align:right;"><strong>TOTAL ACTIVOS PATRIMONIALES EN LIBRO DE BALANCES:</strong></td>
                                        <td class="num" style="color:#1D4ED8;">${MathCRUD.fmtBs(MathCRUD.mul(sumActivosUSD, this.tasaBCV))}</td>
                                        <td class="num">${MathCRUD.fmtUSD(sumActivosUSD)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                `;
            };

            const originalRender = m.render.bind(m);
            m.render = function () {
                originalRender();
                ViasaContabilidadCRUD.decorarVistaActiva();
            };

            m._crudHookInstalled = true;
        }
    };

    window.ViasaContabilidadCRUD = ViasaContabilidadCRUD;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ViasaContabilidadCRUD.instalarHookEnMotorContable());
    } else {
        ViasaContabilidadCRUD.instalarHookEnMotorContable();
    }

})(window);
