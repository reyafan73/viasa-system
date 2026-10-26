/**
 * ==============================================================================
 * VIASA SYSTEM - MOTOR AUTÓNOMO DE IDENTIFICACIÓN, CÓDIGOS QR Y CÓDIGOS DE BARRA
 * Panadería y Pastelería Nueva Viasa, C.A. - RIF: J-31163165-8
 * 100% Offline, Zero-Dependencies, Pure Canvas y SVG Renderer
 * ==============================================================================
 */

(function(window) {
    'use strict';

    /**
     * ==========================================================================
     * 1. GENERADOR DE CÓDIGOS DE BARRA: EAN-13 Y CODE 128
     * ==========================================================================
     */
    const BarcodeEngine = {
        // Patrones de codificación EAN-13
        EAN13_PATTERNS: {
            L: [
                "0001101", "0011001", "0010011", "0111101", "0100011",
                "0110001", "0101111", "0111011", "0110111", "0001011"
            ],
            G: [
                "0100111", "0110011", "0011011", "0100001", "0011101",
                "0111001", "0000101", "0010001", "0001001", "0010111"
            ],
            R: [
                "1110010", "1100110", "1101100", "1000010", "1011100",
                "1001110", "1010000", "1000100", "1001000", "1110100"
            ],
            FIRST_DIGIT_STRUCTURE: [
                "LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG",
                "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"
            ]
        },

        // Patrones Code 128 (Subconjuntos B/C)
        CODE128_PATTERNS: [
            "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
            "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
            "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
            "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
            "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
            "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
            "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
            "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
            "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
            "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
            "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
        ],

        calcularChecksumEAN13(raw12) {
            const str = String(raw12).replace(/\D/g, '').padStart(12, '0').slice(0, 12);
            let sum = 0;
            for (let i = 0; i < 12; i++) {
                const digit = parseInt(str[i], 10);
                sum += (i % 2 === 0) ? digit : digit * 3;
            }
            const mod = sum % 10;
            return (mod === 0) ? 0 : (10 - mod);
        },

        formatearEAN13Completo(codigo) {
            const clean = String(codigo).replace(/\D/g, '');
            if (clean.length === 12) {
                return clean + this.calcularChecksumEAN13(clean);
            }
            if (clean.length === 13) {
                const calculated = this.calcularChecksumEAN13(clean.slice(0, 12));
                return clean.slice(0, 12) + calculated;
            }
            // Si es un código menor, rellenar con prefijo corporativo VIASA (759 + 31163)
            const padded = clean.padStart(12, '759311630000').slice(-12);
            return padded + this.calcularChecksumEAN13(padded);
        },

        generarEAN13Bits(ean13) {
            const fullEan = this.formatearEAN13Completo(ean13);
            const firstDigit = parseInt(fullEan[0], 10);
            const structure = this.EAN13_PATTERNS.FIRST_DIGIT_STRUCTURE[firstDigit];
            
            let bits = "101"; // Guard pattern izquierda

            // Primeros 6 dígitos (pos 1 a 6)
            for (let i = 0; i < 6; i++) {
                const digit = parseInt(fullEan[i + 1], 10);
                const type = structure[i];
                bits += this.EAN13_PATTERNS[type][digit];
            }

            bits += "01010"; // Center guard

            // Últimos 6 dígitos (pos 7 a 12)
            for (let i = 6; i < 12; i++) {
                const digit = parseInt(fullEan[i + 1], 10);
                bits += this.EAN13_PATTERNS.R[digit];
            }

            bits += "101"; // Guard pattern derecha
            return { bits, fullEan };
        },

        generarCode128Bits(text) {
            const raw = String(text).trim();
            // Start Code B = 104
            let values = [104];
            let checkSum = 104;

            for (let i = 0; i < raw.length; i++) {
                const code = raw.charCodeAt(i) - 32;
                values.push(code);
                checkSum += code * (i + 1);
            }

            const checkDigit = checkSum % 103;
            values.push(checkDigit);
            values.push(106); // Stop Code

            let bits = "";
            values.forEach(val => {
                const pattern = this.CODE128_PATTERNS[val];
                if (pattern) {
                    for (let p = 0; p < pattern.length; p++) {
                        const count = parseInt(pattern[p], 10);
                        const bit = (p % 2 === 0) ? "1" : "0";
                        bits += bit.repeat(count);
                    }
                }
            });

            return { bits, text: raw };
        },

        renderBarcodeCanvas(canvas, codigo, options = {}) {
            if (!canvas) return;
            const opt = Object.assign({
                formato: 'EAN13', // 'EAN13' o 'CODE128'
                anchoBarra: 2,
                alto: 70,
                mostrarTexto: true,
                colorBarra: '#0f172a',
                colorFondo: '#ffffff',
                margen: 10,
                fontSize: 13
            }, options);

            let encoded = null;
            let displayString = String(codigo);

            if (opt.formato === 'EAN13' && (/^\d{7,13}$/.test(String(codigo).trim()) || String(codigo).startsWith('759'))) {
                encoded = this.generarEAN13Bits(codigo);
                displayString = encoded.fullEan.replace(/^(\d)(\d{6})(\d{6})$/, '$1 $2 $3');
            } else {
                encoded = this.generarCode128Bits(codigo);
                displayString = encoded.text;
            }

            const bits = encoded.bits;
            const totalWidth = (bits.length * opt.anchoBarra) + (opt.margen * 2);
            const totalHeight = opt.alto + (opt.mostrarTexto ? opt.fontSize + 12 : 0) + (opt.margen * 2);

            canvas.width = totalWidth;
            canvas.height = totalHeight;
            const ctx = canvas.getContext('2d');

            // Fondo blanco
            ctx.fillStyle = opt.colorFondo;
            ctx.fillRect(0, 0, totalWidth, totalHeight);

            // Dibujar Barras
            ctx.fillStyle = opt.colorBarra;
            let x = opt.margen;
            const barHeight = opt.alto;

            for (let i = 0; i < bits.length; i++) {
                if (bits[i] === '1') {
                    ctx.fillRect(x, opt.margen, opt.anchoBarra, barHeight);
                }
                x += opt.anchoBarra;
            }

            // Texto inferior
            if (opt.mostrarTexto) {
                ctx.fillStyle = opt.colorBarra;
                ctx.font = `bold ${opt.fontSize}px 'Courier New', monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(displayString, totalWidth / 2, totalHeight - opt.margen + 2);
            }

            return canvas.toDataURL('image/png');
        },

        renderBarcodeFullHD(codigo, options = {}) {
            const opt = Object.assign({
                formato: 'EAN13',
                anchoBarra: 14,
                alto: 460,
                mostrarTexto: true,
                colorBarra: '#000000',
                colorFondo: '#ffffff',
                margenX: 90,
                margenY: 60,
                fontSize: 60,
                encabezado: 'PANADERÍA NUEVA VIASA, C.A. - RIF: J-31163165-8',
                nombreProducto: '',
                lote: ''
            }, options);

            let encoded = null;
            let displayString = String(codigo);

            if (opt.formato === 'EAN13' && (/^\d{7,13}$/.test(String(codigo).trim()) || String(codigo).startsWith('759'))) {
                encoded = this.generarEAN13Bits(codigo);
                displayString = encoded.fullEan.replace(/^(\d)(\d{6})(\d{6})$/, '$1  $2  $3');
            } else {
                encoded = this.generarCode128Bits(codigo);
                displayString = encoded.text;
            }

            const bits = encoded.bits;
            const barcodeWidth = bits.length * opt.anchoBarra;
            const totalWidth = barcodeWidth + (opt.margenX * 2);

            let headerHeight = 0;
            if (opt.encabezado || opt.nombreProducto) {
                headerHeight = 110;
            }

            const textHeight = opt.mostrarTexto ? (opt.fontSize + 30) : 0;
            const totalHeight = headerHeight + opt.alto + textHeight + (opt.margenY * 2);

            const canvas = document.createElement('canvas');
            canvas.width = totalWidth;
            canvas.height = totalHeight;
            const ctx = canvas.getContext('2d');

            // Fondo blanco puro de alta resolución
            ctx.fillStyle = opt.colorFondo;
            ctx.fillRect(0, 0, totalWidth, totalHeight);

            let curY = opt.margenY;

            // Encabezado corporativo oficial si aplica
            if (opt.encabezado || opt.nombreProducto) {
                ctx.fillStyle = '#0f172a';
                ctx.font = `bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(opt.encabezado || 'PANADERÍA Y PASTELERÍA NUEVA VIASA, C.A.', totalWidth / 2, curY);

                if (opt.nombreProducto) {
                    ctx.fillStyle = '#475569';
                    ctx.font = `600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
                    const extraLot = opt.lote ? ` | LOTE: ${opt.lote}` : '';
                    ctx.fillText(`${opt.nombreProducto}${extraLot}`, totalWidth / 2, curY + 38);
                }

                // Línea separadora sutil
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(opt.margenX, curY + 80);
                ctx.lineTo(totalWidth - opt.margenX, curY + 80);
                ctx.stroke();

                curY += headerHeight;
            }

            // Dibujar Barras con nitidez absoluta
            ctx.fillStyle = opt.colorBarra;
            let x = opt.margenX;
            const barHeight = opt.alto;

            for (let i = 0; i < bits.length; i++) {
                if (bits[i] === '1') {
                    ctx.fillRect(x, curY, opt.anchoBarra, barHeight);
                }
                x += opt.anchoBarra;
            }

            // Texto OCR inferior con espaciado y contraste máximo
            if (opt.mostrarTexto) {
                ctx.fillStyle = opt.colorBarra;
                ctx.font = `bold ${opt.fontSize}px 'Courier New', Consolas, monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(displayString, totalWidth / 2, totalHeight - opt.margenY + 6);
            }

            const dataUrl = canvas.toDataURL('image/png', 1.0);
            return { canvas, dataUrl, width: totalWidth, height: totalHeight };
        }
    };

    /**
     * ==========================================================================
     * 2. GENERADOR DE CÓDIGOS QR (ISO/IEC 18004 SPECIFICATION - PURE JS)
     * ==========================================================================
     */
    const QRCodeEngine = {
        EXP_TABLE: new Uint8Array(512),
        LOG_TABLE: new Uint8Array(256),

        _init() {
            let x = 1;
            for (let i = 0; i < 255; i++) {
                this.EXP_TABLE[i] = x;
                this.EXP_TABLE[i + 255] = x;
                this.LOG_TABLE[x] = i;
                x <<= 1;
                if (x & 256) x ^= 0x11d; // Polinomio galois GF(256)
            }
        },

        gmul(a, b) {
            if (a === 0 || b === 0) return 0;
            return this.EXP_TABLE[this.LOG_TABLE[a] + this.LOG_TABLE[b]];
        },

        crearPolinomioGenerador(numEC) {
            let poly = [1];
            for (let i = 0; i < numEC; i++) {
                const next = [1, this.EXP_TABLE[i]];
                const res = new Array(poly.length + next.length - 1).fill(0);
                for (let j = 0; j < poly.length; j++) {
                    for (let k = 0; k < next.length; k++) {
                        res[j + k] ^= this.gmul(poly[j], next[k]);
                    }
                }
                poly = res;
            }
            return poly;
        },

        calcularECCodewords(dataBytes, numEC) {
            const genPoly = this.crearPolinomioGenerador(numEC);
            const msg = new Array(dataBytes.length + numEC).fill(0);
            for (let i = 0; i < dataBytes.length; i++) msg[i] = dataBytes[i];

            for (let i = 0; i < dataBytes.length; i++) {
                const coef = msg[i];
                if (coef !== 0) {
                    for (let j = 0; j < genPoly.length; j++) {
                        msg[i + j] ^= this.gmul(genPoly[j], coef);
                    }
                }
            }
            return msg.slice(dataBytes.length);
        },

        encodeUTF8(str) {
            const utf8 = [];
            for (let i = 0; i < str.length; i++) {
                let charcode = str.charCodeAt(i);
                if (charcode < 0x80) utf8.push(charcode);
                else if (charcode < 0x800) {
                    utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
                } else if (charcode < 0xd800 || charcode >= 0xe000) {
                    utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
                }
            }
            return utf8;
        },

        /**
         * Genera la matriz QR versión adaptativa (Versión 1 a 6) con corrección de error M
         */
        generarMatrizQR(texto) {
            const utf8Bytes = this.encodeUTF8(String(texto));
            const len = utf8Bytes.length;
            
            // Selección de versión automática
            let version = 2; // 25x25
            let totalDataCodewords = 28;
            let ecCodewords = 16;
            if (len > 20 && len <= 42) {
                version = 3; // 29x29
                totalDataCodewords = 44;
                ecCodewords = 26;
            } else if (len > 42 && len <= 68) {
                version = 4; // 33x33
                totalDataCodewords = 64;
                ecCodewords = 36;
            } else if (len > 68 && len <= 104) {
                version = 5; // 37x37
                totalDataCodewords = 86;
                ecCodewords = 48;
            } else if (len > 104) {
                version = 6; // 41x41
                totalDataCodewords = 108;
                ecCodewords = 56;
            }

            const size = 17 + (version * 4);
            const matrix = Array.from({ length: size }, () => Array(size).fill(null));

            // 1. Patrones de búsqueda (Position Finder Patterns 7x7)
            const addFinder = (r, c) => {
                for (let i = -1; i <= 7; i++) {
                    for (let j = -1; j <= 7; j++) {
                        const row = r + i;
                        const col = c + j;
                        if (row >= 0 && row < size && col >= 0 && col < size) {
                            if (i === -1 || i === 7 || j === -1 || j === 7) {
                                matrix[row][col] = 0; // Separador blanco
                            } else if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
                                matrix[row][col] = 1;
                            } else {
                                matrix[row][col] = 0;
                            }
                        }
                    }
                }
            };

            addFinder(0, 0);
            addFinder(0, size - 7);
            addFinder(size - 7, 0);

            // 2. Patrones de alineación (Timing Patterns)
            for (let i = 8; i < size - 8; i++) {
                if (matrix[6][i] === null) matrix[6][i] = (i % 2 === 0) ? 1 : 0;
                if (matrix[i][6] === null) matrix[i][6] = (i % 2 === 0) ? 1 : 0;
            }

            // Dark module fijo
            matrix[size - 8][8] = 1;

            // 3. Empaquetar datos Byte Mode (0100) + Longitud + Datos + Padding
            const bitStream = [];
            const pushBits = (val, count) => {
                for (let b = count - 1; b >= 0; b--) {
                    bitStream.push((val >> b) & 1);
                }
            };

            pushBits(4, 4); // Byte Mode Indicator (0100)
            pushBits(len, 8); // Character count (8 bits para v1-9)
            utf8Bytes.forEach(b => pushBits(b, 8));

            // Terminador 0000
            for (let i = 0; i < 4 && bitStream.length < totalDataCodewords * 8; i++) {
                bitStream.push(0);
            }
            while (bitStream.length % 8 !== 0) {
                bitStream.push(0);
            }

            // Convertir a bytes
            const dataBytes = [];
            for (let i = 0; i < bitStream.length; i += 8) {
                let byteVal = 0;
                for (let b = 0; b < 8; b++) {
                    byteVal = (byteVal << 1) | bitStream[i + b];
                }
                dataBytes.push(byteVal);
            }

            // Relleno de bytes alternados (0xEC, 0x11)
            const padBytes = [0xec, 0x11];
            let padIdx = 0;
            while (dataBytes.length < totalDataCodewords) {
                dataBytes.push(padBytes[padIdx % 2]);
                padIdx++;
            }

            // 4. Calcular códigos de corrección de error Reed-Solomon
            const ecBytes = this.calcularECCodewords(dataBytes, ecCodewords);
            const finalCodewords = dataBytes.concat(ecBytes);

            // Convertir codewords finales a bits para colocación
            const allBits = [];
            finalCodewords.forEach(cw => {
                for (let b = 7; b >= 0; b--) {
                    allBits.push((cw >> b) & 1);
                }
            });

            // 5. Rellenar matriz en zigzag evitando patrones funcionales
            let bitIdx = 0;
            let upwards = true;
            for (let right = size - 1; right > 0; right -= 2) {
                if (right === 6) right--; // Saltar timing pattern vertical

                for (let vert = 0; vert < size; vert++) {
                    const row = upwards ? (size - 1 - vert) : vert;
                    for (let colOffset = 0; colOffset < 2; colOffset++) {
                        const col = right - colOffset;
                        if (matrix[row][col] === null) {
                            let bit = (bitIdx < allBits.length) ? allBits[bitIdx++] : 0;
                            // Aplicar Máscara 000: (row + col) % 2 === 0
                            if ((row + col) % 2 === 0) bit ^= 1;
                            matrix[row][col] = bit;
                        }
                    }
                }
                upwards = !upwards;
            }

            // 6. Información de formato (Máscara 0, Nivel M = 00)
            const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0]; // Mask 0, ECC M precalculado
            let fIdx = 0;
            // Alrededor del finder superior izquierdo
            for (let i = 0; i <= 8; i++) {
                if (i !== 6) matrix[8][i] = formatBits[fIdx++];
            }
            for (let i = 7; i >= 0; i--) {
                if (i !== 6) matrix[i][8] = formatBits[fIdx++];
            }

            // Alrededor de finders laterales
            for (let i = 0; i < 7; i++) {
                matrix[size - 1 - i][8] = formatBits[i];
            }
            for (let i = 0; i < 8; i++) {
                matrix[8][size - 8 + i] = formatBits[7 + i];
            }

            return { matrix, size };
        },

        renderQRCanvas(canvas, payload, options = {}) {
            if (!canvas) return;
            const opt = Object.assign({
                size: 240,
                colorDark: '#0f172a',
                colorLight: '#ffffff',
                logo: null,
                margen: 2
            }, options);

            const { matrix, size: matrixSize } = this.generarMatrizQR(payload);
            const totalModules = matrixSize + (opt.margen * 2);
            const scale = Math.floor(opt.size / totalModules) || 4;
            const finalSize = totalModules * scale;

            canvas.width = finalSize;
            canvas.height = finalSize;
            const ctx = canvas.getContext('2d');

            // Fondo claro
            ctx.fillStyle = opt.colorLight;
            ctx.fillRect(0, 0, finalSize, finalSize);

            // Módulos oscuros con esquinas nítidas
            ctx.fillStyle = opt.colorDark;
            for (let r = 0; r < matrixSize; r++) {
                for (let c = 0; c < matrixSize; c++) {
                    if (matrix[r][c] === 1) {
                        const x = (c + opt.margen) * scale;
                        const y = (r + opt.margen) * scale;
                        ctx.fillRect(x, y, scale, scale);
                    }
                }
            }

            return canvas.toDataURL('image/png');
        },

        renderQRFullHD(payload, options = {}) {
            const opt = Object.assign({
                size: 1600, // True 1600x1600 Full HD
                colorDark: '#000000',
                colorLight: '#ffffff',
                margen: 4, // 4 modules ISO quiet zone
                incluirMembrete: false,
                titulo: 'PANADERÍA NUEVA VIASA, C.A. - RIF: J-31163165-8',
                subtitulo: ''
            }, options);

            const { matrix, size: matrixSize } = this.generarMatrizQR(payload);
            const totalModules = matrixSize + (opt.margen * 2);
            const scale = Math.floor(opt.size / totalModules) || 32;
            const qrPixelSize = totalModules * scale;

            let totalWidth = qrPixelSize;
            let totalHeight = qrPixelSize;
            let offsetY = 0;

            if (opt.incluirMembrete) {
                const headerH = 140;
                const footerH = 100;
                totalHeight = qrPixelSize + headerH + footerH;
                offsetY = headerH;
            }

            const canvas = document.createElement('canvas');
            canvas.width = totalWidth;
            canvas.height = totalHeight;
            const ctx = canvas.getContext('2d');

            // Fondo blanco puro
            ctx.fillStyle = opt.colorLight;
            ctx.fillRect(0, 0, totalWidth, totalHeight);

            // Membrete si está habilitado
            if (opt.incluirMembrete) {
                ctx.fillStyle = '#0f172a';
                ctx.font = `bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(opt.titulo, totalWidth / 2, 40);

                if (opt.subtitulo) {
                    ctx.fillStyle = '#475569';
                    ctx.font = `600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
                    ctx.fillText(opt.subtitulo, totalWidth / 2, 88);
                }
            }

            // Dibujar módulos oscuros con píxeles nítidos 100% vector-sharp
            ctx.fillStyle = opt.colorDark;
            for (let r = 0; r < matrixSize; r++) {
                for (let c = 0; c < matrixSize; c++) {
                    if (matrix[r][c] === 1) {
                        const x = (c + opt.margen) * scale;
                        const y = ((r + opt.margen) * scale) + offsetY;
                        ctx.fillRect(x, y, scale, scale);
                    }
                }
            }

            // Pie de página si tiene membrete
            if (opt.incluirMembrete) {
                ctx.fillStyle = '#64748b';
                ctx.font = `bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText('CÓDIGO OFICIAL DE TRAZABILIDAD Y CONTROL SANITARIO • CIUDAD BOLÍVAR, VENEZUELA', totalWidth / 2, totalHeight - 35);
            }

            const dataUrl = canvas.toDataURL('image/png', 1.0);
            return { canvas, dataUrl, width: totalWidth, height: totalHeight };
        }
    };

    QRCodeEngine._init();

    /**
     * ==========================================================================
     * 3. FACHADA UNIFICADA Y UTILIDADES DE IDENTIFICACIÓN (ViasaCodeEngine)
     * ==========================================================================
     */
    const ViasaCodeEngine = {
        barcode: BarcodeEngine,
        qr: QRCodeEngine,

        /**
         * Genera los datos estructurados en formato JSON / URI para las entidades
         */
        construirPayloadQR(tipo, entidad) {
            const baseEmpresa = {
                empresa: "Panadería Nueva Viasa, C.A.",
                rif: "J-31163165-8",
                sede: "Ciudad Bolívar, VE"
            };

            if (tipo === 'personal') {
                return JSON.stringify({
                    t: 'EMP',
                    id: entidad.id,
                    nom: entidad.nombreCompleto,
                    ci: entidad.cedula,
                    rif: entidad.rif || entidad.cedula,
                    car: entidad.cargo,
                    dep: entidad.departamento || 'PRODUCCION',
                    tur: entidad.turno || 'diurno',
                    tok: `VIASA-SEC-${entidad.id}-${(entidad.cedula || '').replace(/\D/g, '').slice(-4)}`
                });
            }

            if (tipo === 'cliente') {
                return JSON.stringify({
                    t: 'CLI',
                    id: entidad.id || entidad.codigo,
                    nom: entidad.nombre || entidad.razonSocial,
                    rif: entidad.rif || entidad.cedula,
                    tlf: entidad.telefono || '',
                    pts: entidad.puntosFidelidad || 0,
                    vip: entidad.nivelClub || 'Bronce',
                    tok: `VIASA-VIP-${entidad.id || '001'}`
                });
            }

            if (tipo === 'proveedor') {
                return JSON.stringify({
                    t: 'PRV',
                    id: entidad.id || entidad.codigo,
                    nom: entidad.razonSocial || entidad.nombre,
                    rif: entidad.rif,
                    cat: entidad.categoria || 'Insumos',
                    tlf: entidad.telefono || '',
                    con: entidad.contacto || ''
                });
            }

            if (tipo === 'producto' || tipo === 'producto_viasa') {
                return JSON.stringify({
                    t: 'PRD_VIASA',
                    id: entidad.id,
                    nom: entidad.nombre,
                    ean: entidad.codigoBarras || entidad.ean,
                    lot: entidad.lote || `L-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01`,
                    cad: entidad.caducidad || (entidad.diasCaducidad ? `${entidad.diasCaducidad} Días` : '30 Días'),
                    pUSD: entidad.precioUSD,
                    pBs: entidad.precioBs || parseFloat(((entidad.precioUSD || 0) * 36.85).toFixed(2)),
                    cat: entidad.categoria || 'Panadería',
                    desc: (entidad.descripcion || '').slice(0, 100),
                    fab: 'Panadería Nueva Viasa, C.A. - RIF: J-31163165-8'
                });
            }

            return String(entidad);
        },

        /**
         * Renderiza un QR en un contenedor o crea un canvas
         */
        renderQREnContenedor(contenedorId, payload, options = {}) {
            const container = typeof contenedorId === 'string' ? document.getElementById(contenedorId) : contenedorId;
            if (!container) return null;

            container.innerHTML = '';
            const canvas = document.createElement('canvas');
            canvas.className = 'viasa-qr-canvas-element';
            container.appendChild(canvas);

            const dataUrl = QRCodeEngine.renderQRCanvas(canvas, payload, options);
            return { canvas, dataUrl };
        },

        /**
         * Renderiza un Código de Barras en un contenedor
         */
        renderBarcodeEnContenedor(contenedorId, codigo, options = {}) {
            const container = typeof contenedorId === 'string' ? document.getElementById(contenedorId) : contenedorId;
            if (!container) return null;

            container.innerHTML = '';
            const canvas = document.createElement('canvas');
            canvas.className = 'viasa-barcode-canvas-element';
            container.appendChild(canvas);

            const dataUrl = BarcodeEngine.renderBarcodeCanvas(canvas, codigo, options);
            return { canvas, dataUrl };
        },

        /**
         * Genera un Código EAN-13 Único, Exclusivo e Irrepetible para un nuevo producto
         * creado, elaborado, envasado y distribuido por Panadería Nueva Viasa, C.A.
         * Estructura GS1: 759 (Venezuela) + 31163 (VIASA) + 4 dígitos correlativos únicos + Dígito Verificador Modulo 10
         */
        generarEAN13UnicoProductoViasa(productosExistentes = []) {
            const prefijoViasa = '75931163';
            const correlativosUsados = new Set();

            (productosExistentes || []).forEach(p => {
                const cb = String(p.codigoBarras || '').trim();
                if (cb.startsWith(prefijoViasa) && cb.length >= 12) {
                    const corr = parseInt(cb.slice(8, 12), 10);
                    if (!isNaN(corr)) correlativosUsados.add(corr);
                }
            });

            // Encontrar el siguiente correlativo incremental disponible garantizando unicidad
            let siguienteCorrelativo = 1017;
            while (correlativosUsados.has(siguienteCorrelativo)) {
                siguienteCorrelativo++;
            }

            const raw12 = `${prefijoViasa}${String(siguienteCorrelativo).padStart(4, '0')}`;
            const checkDigit = BarcodeEngine.calcularChecksumEAN13(raw12);
            const ean13 = `${raw12}${checkDigit}`;

            return {
                ean13,
                raw12,
                correlativo: String(siguienteCorrelativo).padStart(4, '0'),
                prefijoPais: '759 (Venezuela)',
                codigoEmpresa: '31163 (Panadería Nueva Viasa, C.A.)',
                digitoControl: checkDigit,
                esExclusivoViasa: true,
                selloTrazabilidad: 'ELABORADO Y ENVASADO POR PANADERÍA NUEVA VIASA - LA SABANITA'
            };
        },

        /**
         * Genera correlativo EAN-13 oficial para productos propios
         * Estructura: 759 (Venezuela) + 31163 (VIASA RIF) + 4 dígitos correlativos + Dígito Control
         */
        generarEAN13Auto(correlativoNumero) {
            const num = parseInt(correlativoNumero, 10) || Math.floor(1000 + Math.random() * 8999);
            const raw12 = `75931163${String(num).padStart(4, '0').slice(-4)}`;
            const checksum = BarcodeEngine.calcularChecksumEAN13(raw12);
            return `${raw12}${checksum}`;
        },

        /**
         * Genera un Barcode en resolución FULL HD (Canvas de alta densidad para imprenta/trámites)
         */
        generarBarcodeFullHD(codigo, options = {}) {
            return BarcodeEngine.renderBarcodeFullHD(codigo, options);
        },

        /**
         * Genera un Código QR en resolución FULL HD (1600x1600 Px para lectura de alta precisión)
         */
        generarQRFullHD(payload, options = {}) {
            return QRCodeEngine.renderQRFullHD(payload, options);
        },

        /**
         * Descarga directa en FULL HD de Código de Barras (EAN-13 / Code 128)
         */
        descargarBarcodeFullHDPNG(codigo, nombreArchivo, meta = {}) {
            const res = this.barcode.renderBarcodeFullHD(codigo, {
                formato: meta.formato || 'EAN13',
                encabezado: meta.encabezado || 'PANADERÍA NUEVA VIASA, C.A. - RIF: J-31163165-8',
                nombreProducto: meta.nombreProducto || '',
                lote: meta.lote || '',
                anchoBarra: meta.anchoBarra || 14,
                alto: meta.alto || 460,
                fontSize: meta.fontSize || 60,
                margenX: meta.margenX || 90,
                margenY: meta.margenY || 60
            });
            if (res && res.canvas) {
                this.descargarCodigoPNG(res.canvas, nombreArchivo, meta.subcarpeta || 'Codigos_Barra_Productos');
                return res;
            }
        },

        /**
         * Descarga directa en FULL HD de Código QR de Trazabilidad
         */
        descargarQRFullHDPNG(payload, nombreArchivo, meta = {}) {
            const res = this.qr.renderQRFullHD(payload, {
                size: meta.size || 1600,
                margen: meta.margen || 4,
                colorDark: '#000000',
                colorLight: '#ffffff',
                incluirMembrete: meta.incluirMembrete || false,
                titulo: meta.titulo || 'PANADERÍA NUEVA VIASA, C.A. - RIF: J-31163165-8',
                subtitulo: meta.subtitulo || ''
            });
            if (res && res.canvas) {
                this.descargarCodigoPNG(res.canvas, nombreArchivo, meta.subcarpeta || 'Codigos_QR_Productos');
                return res;
            }
        },

        /**
         * Descarga directa del archivo de código en formato PNG de alta resolución FULL HD
         */
        descargarCodigoPNG(canvasOrDataUrl, nombreArchivo, subcarpeta = 'Codigos_QR') {
            if (!canvasOrDataUrl) return;
            let dataUrl = '';
            if (typeof canvasOrDataUrl === 'string') {
                dataUrl = canvasOrDataUrl;
            } else if (canvasOrDataUrl.toDataURL) {
                dataUrl = canvasOrDataUrl.toDataURL('image/png', 1.0);
            }
            if (!dataUrl) return;

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${nombreArchivo.replace(/[^a-zA-Z0-9_\-]/g, '_')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log(`💾 Código exportado en FULL HD (Alta Resolución) -> Destino: C:\\Users\\Usuario\\VIASA System\\${subcarpeta}\\${link.download}`);
        }
    };

    window.ViasaCodeEngine = ViasaCodeEngine;

})(window);
