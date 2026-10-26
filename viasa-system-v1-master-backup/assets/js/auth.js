/**
 * ==============================================================================
 * VIASA SYSTEM - MOTOR DE SEGURIDAD, AUTENTICACIÓN Y CONTROL RBAC 5 NIVELES
 * Panadería y Pastelería Nueva Viasa, C.A. (RIF: J-31163165-8)
 * Ciudad Bolívar, Estado Bolívar, Venezuela
 * ==============================================================================
 */

(function(window) {
    'use strict';

    /**
     * Algoritmo Criptográfico SHA-256 Puro (Self-Contained y Determinístico)
     * Proporciona soporte universal síncrono e inmutable sin depender de HTTPS.
     */
    function sha256Pure(ascii) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        }

        const mathPow = Math.pow;
        const maxWord = mathPow(2, 32);
        const lengthProperty = 'length';
        let i, j;
        const result = '';

        const words = [];
        const asciiBitLength = ascii[lengthProperty] * 8;

        let hash = sha256Pure.h = sha256Pure.h || [];
        const k = sha256Pure.k = sha256Pure.k || [];
        let primeCounter = k[lengthProperty];

        const isComposite = {};
        for (let candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 300; i += candidate) {
                    isComposite[i] = candidate;
                }
                hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
                k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            }
        }

        ascii += '\x80';
        while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
        for (i = 0; i < ascii[lengthProperty]; i++) {
            j = ascii.charCodeAt(i);
            if (j >> 8) return; // Caracteres no-ASCII
            words[i >> 2] |= j << ((3 - i) % 4) * 8;
        }
        words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
        words[words[lengthProperty]] = (asciiBitLength | 0);

        for (j = 0; j < words[lengthProperty];) {
            const w = words.slice(j, j += 16);
            const oldHash = hash;
            hash = hash.slice(0, 8);

            for (i = 0; i < 64; i++) {
                const w15 = w[i - 15], w2 = w[i - 2];
                const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
                const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
                const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
                const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
                const temp1 = hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0);
                const temp2 = (rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj;

                hash = [(temp1 + temp2) | 0].concat(hash);
                hash[4] = (hash[4] + temp1) | 0;
            }

            for (i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i]) | 0;
            }
        }

        let hexResult = '';
        for (i = 0; i < 8; i++) {
            for (j = 3; j >= 0; j--) {
                const b = (hash[i] >> (8 * j)) & 255;
                hexResult += ((b < 16) ? '0' : '') + b.toString(16);
            }
        }
        return hexResult;
    }

    class ViasaAuthService {
        constructor() {
            this.currentUser = null;
            this.sessionKey = 'current_session';
            this.timeoutKey = 'viasa_inactivity_timeout_min';
            this.inactivityTimer = null;
            this.isLocked = false;
            this.inactivityMinutes = 10; // Default 10 minutos
            this.initialized = false;
        }

        /**
         * Inicializa la sesión guardada y el monitor de inactividad
         */
        init() {
            if (this.initialized) return this.currentUser;

            // Recuperar configuración de timeout
            const savedTimeout = window.ViasaStorage.getItem(this.timeoutKey, 10);
            this.inactivityMinutes = parseInt(savedTimeout, 10) || 10;

            // Migrar / inicializar usuarios con hash y salt
            this.asegurarIntegridadUsuarios();

            const savedSession = window.ViasaStorage.getItem(this.sessionKey, null);
            if (savedSession && savedSession.id) {
                this.currentUser = savedSession;
                console.log(`[VIASA Auth] Sesión restaurada: ${this.currentUser.nombreCompleto} (${this.currentUser.rol})`);
            }

            this.iniciarMonitorInactividad();
            this.initialized = true;
            return this.currentUser;
        }

        /**
         * Genera un Salt criptográfico determinístico y seguro para el usuario
         */
        generarSalt(user) {
            const uid = user.id || 'USR_' + Math.random().toString(36).substring(2, 8);
            const uname = (user.username || 'user').toLowerCase().trim();
            return `${uid}_${uname}_VIASA_SALT_2026_CB`;
        }

        /**
         * Calcula el hash SHA-256 de una contraseña + salt
         */
        hashearPassword(password, salt) {
            const str = `${String(password).trim()}::${String(salt).trim()}`;
            return sha256Pure(str);
        }

        /**
         * Asegura que todos los usuarios en storage tengan salt y passwordHash
         */
        asegurarIntegridadUsuarios() {
            try {
                const catalogoDefecto = window.ViasaDatabase?.usuarios || [];
                const usuarios = window.ViasaStorage.getItem('usuarios', catalogoDefecto);
                let modificado = false;

                // Asegurar que la cuenta de Gerente Administrativa (USR-007) esté presente si fue agregada al catálogo base
                catalogoDefecto.forEach(defUser => {
                    const existe = usuarios.some(u => u.id === defUser.id || (u.username || '').toLowerCase() === (defUser.username || '').toLowerCase());
                    if (!existe) {
                        usuarios.push({ ...defUser });
                        modificado = true;
                    }
                });

                usuarios.forEach(u => {
                    if (!u.salt) {
                        u.salt = this.generarSalt(u);
                        modificado = true;
                    }
                    if (u.pin && !u.passwordHash) {
                        u.passwordHash = this.hashearPassword(u.pin, u.salt);
                        delete u.pin; // Eliminamos el pin en plano
                        modificado = true;
                    }
                    if (u.activo === undefined) {
                        u.activo = true;
                        modificado = true;
                    }
                    // Normalizar rol antiguo
                    if (u.rol === 'admin') u.rol = 'master_senior';
                    if (u.rol === 'caja') u.rol = 'kappa';
                    if (u.rol === 'panadero') u.rol = 'sigma';
                });

                if (modificado) {
                    window.ViasaStorage.setItem('usuarios', usuarios);
                }
            } catch (err) {
                console.warn('[VIASA Auth] Error asegurando integridad de usuarios:', err);
            }
        }

        /**
         * Valida las credenciales ingresadas contra la base de datos
         */
        verificarPassword(user, passwordInput) {
            if (!user) return false;
            const input = String(passwordInput).trim();

            // Si tiene hash y salt
            if (user.passwordHash && user.salt) {
                const inputHash = this.hashearPassword(input, user.salt);
                return inputHash === user.passwordHash;
            }

            // Si aún conserva pin en plano (migración inmediata)
            if (user.pin && String(user.pin).trim() === input) {
                user.salt = this.generarSalt(user);
                user.passwordHash = this.hashearPassword(input, user.salt);
                delete user.pin;
                this.guardarUsuarioEnStorage(user);
                return true;
            }

            return false;
        }

        /**
         * Inicio de sesión con usuario y contraseña/PIN
         */
        login(username, password) {
            const usuarios = this.obtenerUsuarios();
            const cleanUser = String(username || '').toLowerCase().trim();
            const user = usuarios.find(u => (u.username || '').toLowerCase().trim() === cleanUser);

            if (!user) {
                if (window.ViasaAudio) window.ViasaAudio.playAlert();
                this.registrarEventoSeguridad('LOGIN_FALLIDO', `Intento de acceso con usuario inexistente: "${username}"`, cleanUser);
                return { success: false, message: 'Usuario no encontrado en el sistema.' };
            }

            if (user.activo === false) {
                if (window.ViasaAudio) window.ViasaAudio.playAlert();
                this.registrarEventoSeguridad('LOGIN_RECHAZADO', `Acceso denegado: cuenta desactivada para "${user.username}"`, user.username);
                return { success: false, message: 'Esta cuenta de usuario ha sido desactivada. Contacte a la Gerencia o Master Senior.' };
            }

            const passwordValido = this.verificarPassword(user, password);
            if (!passwordValido) {
                if (window.ViasaAudio) window.ViasaAudio.playAlert();
                this.registrarEventoSeguridad('LOGIN_FALLIDO', `Contraseña o PIN incorrecto para "${user.username}"`, user.username);
                return { success: false, message: 'Clave o PIN de acceso incorrecto. Verifique sus credenciales.' };
            }

            // Normalizar rol
            let rolNormalizado = user.rol;
            if (rolNormalizado === 'admin') rolNormalizado = 'master_senior';
            if (rolNormalizado === 'caja') rolNormalizado = 'kappa';
            if (rolNormalizado === 'panadero') rolNormalizado = 'sigma';

            this.currentUser = {
                id: user.id,
                username: user.username,
                nombreCompleto: user.nombreCompleto,
                rol: rolNormalizado,
                cargo: user.cargo || 'Funcionario Viasa',
                departamento: user.departamento || 'Operaciones',
                avatar: user.avatar || 'fa-user',
                loginTime: new Date().toISOString()
            };

            window.ViasaStorage.setItem(this.sessionKey, this.currentUser);
            this.isLocked = false;
            this.reiniciarTemporizadorInactividad();

            this.registrarEventoSeguridad('LOGIN_EXITOSO', `Inicio de sesión exitoso desde estación principal (${this.currentUser.cargo})`, user.username);

            if (window.ViasaAudio) window.ViasaAudio.playCashChime();
            return { success: true, user: this.currentUser };
        }

        /**
         * Acceso Rápido por Rol
         */
        quickLoginByRole(roleId) {
            const usuarios = this.obtenerUsuarios();
            let targetRole = roleId;
            if (targetRole === 'admin') targetRole = 'master_senior';
            if (targetRole === 'caja') targetRole = 'kappa';
            if (targetRole === 'panadero') targetRole = 'sigma';

            const user = usuarios.find(u => (u.rol === targetRole || u.rol === roleId) && u.activo !== false);
            if (user) {
                // Preset pins para agilidad en testing/desarrollo
                const defaultPins = {
                    master_senior: 'viasa2026',
                    admin: 'viasa2026',
                    omega: 'gerente2026',
                    sigma: 'sigma2026',
                    panadero: 'harina123',
                    kappa: 'caja123',
                    caja: 'caja123',
                    alfa: 'alfa2026'
                };
                const testPin = defaultPins[targetRole] || '1234';
                return this.login(user.username, testPin);
            }
            return { success: false, message: `No se encontró usuario activo para el rol "${roleId}".` };
        }

        /**
         * Cerrar sesión del sistema
         */
        logout() {
            if (this.currentUser) {
                this.registrarEventoSeguridad('LOGOUT', `Cierre de sesión voluntario por ${this.currentUser.nombreCompleto}`, this.currentUser.username);
            }
            this.currentUser = null;
            this.isLocked = false;
            if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
            window.ViasaStorage.removeItem(this.sessionKey);
            if (window.ViasaAudio) window.ViasaAudio.playClick();
        }

        /**
         * Obtener nivel numérico de un rol (1..5)
         */
        getNivelJerarquico(rolId) {
            const rol = rolId || (this.currentUser ? this.currentUser.rol : 'alfa');
            if (rol === 'master_senior' || rol === 'admin') return 1;
            if (rol === 'omega') return 2;
            if (rol === 'sigma' || rol === 'panadero') return 3;
            if (rol === 'kappa' || rol === 'caja') return 4;
            if (rol === 'alfa') return 5;
            return 5;
        }

        /**
         * Verificar si el usuario autenticado tiene permiso para una vista o acción
         */
        hasPermission(permiso) {
            if (!this.currentUser) return false;
            
            // Nivel 1: Master Senior tiene potestad absoluta sobre todo el sistema
            if (this.currentUser.rol === 'master_senior' || this.currentUser.rol === 'admin') return true;

            const rolInfo = this.getRoleInfo(this.currentUser.rol);
            if (!rolInfo || !rolInfo.permisos) return false;

            if (rolInfo.permisos.includes('*')) return true;

            // Productos Nueva Viasa: accesible para roles operativos y administrativos relacionados
            if (permiso === 'productos-nueva-viasa') {
                return ['productos-nueva-viasa', 'inventario', 'produccion', 'pos', 'contabilidad', 'caja', 'reportes']
                    .some(p => rolInfo.permisos.includes(p));
            }

            // Carnets y Control de Personal: accesible para RRHH, administración, guardias y roles operativos
            if (permiso === 'carnets-personal') {
                return ['carnets-personal', 'rrhh', 'guardias-hub', 'configuracion', 'reportes', 'usuarios']
                    .some(p => rolInfo.permisos.includes(p));
            }
            return rolInfo.permisos.includes(permiso);
        }

        /**
         * Verifica si el usuario actual puede administrar usuarios (Master Senior u Omega)
         */
        canManageUsers() {
            if (!this.currentUser) return false;
            const nivel = this.getNivelJerarquico(this.currentUser.rol);
            return nivel <= 2; // Solo Nivel 1 (Master) y Nivel 2 (Omega)
        }

        /**
         * Verifica si el usuario actual puede ejecutar el Guardado General y acceder al Casillero de Respaldos
         * Exclusivo para: Master Senior, Gerente General y Gerente Administrativa
         */
        canManageBackups() {
            if (!this.currentUser) return false;
            const nivel = this.getNivelJerarquico(this.currentUser.rol);
            if (nivel <= 2) return true; // Nivel 1 (Master Senior) y Nivel 2 (Omega: Gerente General / Gerente Administrativa)
            const cargoLower = String(this.currentUser.cargo || '').toLowerCase();
            return (
                cargoLower.includes('master senior') ||
                cargoLower.includes('gerente general') ||
                cargoLower.includes('gerente administrativ') ||
                cargoLower.includes('administradora')
            );
        }

        /**
         * Verifica si el usuario actual puede modificar o eliminar a un usuario destino
         */
        canEditTargetUser(targetUser) {
            if (!this.canManageUsers()) return false;
            const myLevel = this.getNivelJerarquico(this.currentUser.rol);
            const targetLevel = this.getNivelJerarquico(targetUser.rol);

            // Nivel 1 Master puede gestionar a todos
            if (myLevel === 1) return true;

            // Nivel 2 Omega puede gestionar a niveles >= 2, pero NO puede modificar a Nivel 1 Master Senior
            if (myLevel === 2) {
                return targetLevel >= 2;
            }

            return false;
        }

        /**
         * Obtener catálogo de usuarios desde almacenamiento
         */
        obtenerUsuarios() {
            const catalogoDefecto = window.ViasaDatabase?.usuarios || [];
            return window.ViasaStorage.getItem('usuarios', catalogoDefecto);
        }

        /**
         * Guardar un usuario individual actualizado en storage
         */
        guardarUsuarioEnStorage(usuarioActualizado) {
            const usuarios = this.obtenerUsuarios();
            const index = usuarios.findIndex(u => u.id === usuarioActualizado.id);
            if (index !== -1) {
                usuarios[index] = usuarioActualizado;
            } else {
                usuarios.push(usuarioActualizado);
            }
            window.ViasaStorage.setItem('usuarios', usuarios);
        }

        /**
         * Crear un nuevo usuario en el sistema
         */
        crearUsuario(datos) {
            if (!this.canManageUsers()) {
                return { success: false, message: 'No tiene privilegios jerárquicos para crear usuarios.' };
            }

            const { username, nombreCompleto, rol, cargo, departamento, pin, avatar, cedula, telefono, correo, activo } = datos;
            if (!username || !nombreCompleto || !rol || !pin) {
                return { success: false, message: 'Debe completar todos los campos obligatorios.' };
            }

            const cleanUname = String(username).toLowerCase().trim();
            const usuarios = this.obtenerUsuarios();
            if (usuarios.some(u => (u.username || '').toLowerCase().trim() === cleanUname)) {
                return { success: false, message: `El nombre de usuario "${cleanUname}" ya está en uso.` };
            }

            // Validar que Omega no cree un Master Senior
            const targetNivel = this.getNivelJerarquico(rol);
            const myLevel = this.getNivelJerarquico(this.currentUser?.rol);
            if (myLevel > 1 && targetNivel === 1) {
                return { success: false, message: 'Solo un Master Senior puede designar cuentas de Nivel 1.' };
            }

            // Generar ID único secuencial sin colisión
            let maxNum = usuarios.reduce((max, u) => {
                const m = String(u.id || '').match(/USR-(\d+)/);
                return m ? Math.max(max, parseInt(m[1], 10)) : max;
            }, 0);
            const nuevoId = `USR-${String(maxNum + 1).padStart(3, '0')}`;
            const tempUser = { id: nuevoId, username: cleanUname };
            const salt = this.generarSalt(tempUser);
            const passwordHash = this.hashearPassword(pin, salt);

            const nuevoUsuario = {
                id: nuevoId,
                username: cleanUname,
                nombreCompleto: String(nombreCompleto).trim(),
                cedula: String(cedula || '').trim(),
                telefono: String(telefono || '').trim(),
                correo: String(correo || '').trim(),
                rol: rol,
                cargo: String(cargo || 'Funcionario Viasa').trim(),
                departamento: String(departamento || 'Operaciones').trim(),
                avatar: avatar || 'fa-user',
                salt: salt,
                passwordHash: passwordHash,
                activo: activo !== undefined ? !!activo : true,
                fechaCreacion: new Date().toISOString()
            };

            usuarios.push(nuevoUsuario);
            window.ViasaStorage.setItem('usuarios', usuarios);

            this.registrarEventoSeguridad(
                'USUARIO_CREADO',
                `Nuevo usuario registrado: ${nuevoUsuario.nombreCompleto} (usuario: ${nuevoUsuario.username}) con nivel [${rol.toUpperCase()}]`,
                nuevoUsuario.username
            );

            return { success: true, user: nuevoUsuario };
        }

        /**
         * Actualizar datos de un usuario existente
         */
        actualizarUsuario(id, datos) {
            if (!this.canManageUsers()) {
                return { success: false, message: 'No tiene privilegios para modificar usuarios.' };
            }

            const usuarios = this.obtenerUsuarios();
            const user = usuarios.find(u => u.id === id);
            if (!user) {
                return { success: false, message: 'Usuario no encontrado.' };
            }

            if (!this.canEditTargetUser(user)) {
                return { success: false, message: 'Su nivel jerárquico no le permite modificar esta cuenta.' };
            }

            // Validar cambio de username si fue modificado
            if (datos.username) {
                const nuevoUname = String(datos.username).toLowerCase().trim();
                if (nuevoUname !== (user.username || '').toLowerCase().trim()) {
                    if (usuarios.some(u => u.id !== id && (u.username || '').toLowerCase().trim() === nuevoUname)) {
                        return { success: false, message: `El nombre de usuario "${nuevoUname}" ya está asignado a otra cuenta.` };
                    }
                    user.username = nuevoUname;
                }
            }

            // Validar que Omega no promueva a Master Senior
            if (datos.rol) {
                const targetNivel = this.getNivelJerarquico(datos.rol);
                const myLevel = this.getNivelJerarquico(this.currentUser?.rol);
                if (myLevel > 1 && targetNivel === 1) {
                    return { success: false, message: 'Solo un Master Senior puede otorgar el Nivel 1.' };
                }
                user.rol = datos.rol;
            }

            if (datos.nombreCompleto) user.nombreCompleto = String(datos.nombreCompleto).trim();
            if (datos.cedula !== undefined) user.cedula = String(datos.cedula).trim();
            if (datos.telefono !== undefined) user.telefono = String(datos.telefono).trim();
            if (datos.correo !== undefined) user.correo = String(datos.correo).trim();
            if (datos.cargo !== undefined) user.cargo = String(datos.cargo).trim();
            if (datos.departamento !== undefined) user.departamento = String(datos.departamento).trim();
            if (datos.avatar) user.avatar = datos.avatar;
            if (datos.activo !== undefined) user.activo = !!datos.activo;

            // Si se suministró una nueva contraseña/PIN en la edición, actualizar su hash SHA-256
            if (datos.pin && String(datos.pin).trim().length >= 4) {
                const pinLimpio = String(datos.pin).trim();
                const nuevoSalt = this.generarSalt(user);
                user.salt = nuevoSalt;
                user.passwordHash = this.hashearPassword(pinLimpio, nuevoSalt);
                delete user.pin;
                user.fechaCambioClave = new Date().toISOString();
            }

            user.fechaModificacion = new Date().toISOString();

            window.ViasaStorage.setItem('usuarios', usuarios);

            // Si el usuario modificado es el actual en sesión, actualizar sesión
            if (this.currentUser && this.currentUser.id === user.id) {
                this.currentUser.username = user.username;
                this.currentUser.nombreCompleto = user.nombreCompleto;
                this.currentUser.rol = user.rol;
                this.currentUser.cargo = user.cargo;
                this.currentUser.departamento = user.departamento;
                this.currentUser.avatar = user.avatar;
                window.ViasaStorage.setItem(this.sessionKey, this.currentUser);
            }

            this.registrarEventoSeguridad(
                'USUARIO_MODIFICADO',
                `Datos actualizados para ${user.username}: Nivel [${user.rol}], Cargo [${user.cargo}]`,
                user.username
            );

            return { success: true, user: user };
        }

        /**
         * Resetear / Cambiar contraseña o PIN de un usuario
         */
        cambiarPasswordUsuario(id, nuevoPin) {
            if (!this.canManageUsers()) {
                return { success: false, message: 'No tiene privilegios para restablecer claves.' };
            }

            const pinLimpio = String(nuevoPin || '').trim();
            if (pinLimpio.length < 4) {
                return { success: false, message: 'La nueva clave/PIN debe contener al menos 4 caracteres.' };
            }

            const usuarios = this.obtenerUsuarios();
            const user = usuarios.find(u => u.id === id);
            if (!user) {
                return { success: false, message: 'Usuario no encontrado.' };
            }

            if (!this.canEditTargetUser(user)) {
                return { success: false, message: 'Su nivel jerárquico no le autoriza a cambiar la clave de este usuario.' };
            }

            const salt = user.salt || this.generarSalt(user);
            user.salt = salt;
            user.passwordHash = this.hashearPassword(pinLimpio, salt);
            delete user.pin;
            user.fechaCambioClave = new Date().toISOString();

            window.ViasaStorage.setItem('usuarios', usuarios);

            this.registrarEventoSeguridad(
                'CLAVE_RESETEADA',
                `Credencial de acceso SHA-256 actualizada exitosamente para ${user.username}`,
                user.username
            );

            return { success: true, message: `Contraseña/PIN de ${user.username} restablecida con éxito.` };
        }

        /**
         * Alternar estado Activo / Inactivo (Baja lógica)
         */
        alternarEstadoUsuario(id) {
            if (!this.canManageUsers()) {
                return { success: false, message: 'No tiene privilegios para cambiar el estado de usuarios.' };
            }

            const usuarios = this.obtenerUsuarios();
            const user = usuarios.find(u => u.id === id);
            if (!user) {
                return { success: false, message: 'Usuario no encontrado.' };
            }

            if (this.currentUser && this.currentUser.id === user.id) {
                return { success: false, message: 'No puede desactivar su propia cuenta en sesión.' };
            }

            if (!this.canEditTargetUser(user)) {
                return { success: false, message: 'No tiene autorización para cambiar el estado de este usuario.' };
            }

            user.activo = !user.activo;
            window.ViasaStorage.setItem('usuarios', usuarios);

            const accion = user.activo ? 'USUARIO_ACTIVADO' : 'USUARIO_DESACTIVADO';
            this.registrarEventoSeguridad(
                accion,
                `Cuenta ${user.username} marcada como ${user.activo ? 'ACTIVA' : 'INACTIVA/SUSPENDIDA'}`,
                user.username
            );

            return { success: true, activo: user.activo };
        }

        /**
         * Eliminar usuario definitivamente
         */
        eliminarUsuario(id) {
            if (!this.canManageUsers()) {
                return { success: false, message: 'No tiene privilegios para eliminar cuentas.' };
            }

            const usuarios = this.obtenerUsuarios();
            const user = usuarios.find(u => u.id === id);
            if (!user) {
                return { success: false, message: 'Usuario no encontrado.' };
            }

            if (this.currentUser && this.currentUser.id === user.id) {
                return { success: false, message: 'No puede eliminar su propia cuenta activa.' };
            }

            if (!this.canEditTargetUser(user)) {
                return { success: false, message: 'No tiene privilegios para eliminar a este usuario.' };
            }

            // Evitar eliminar al último Master Senior
            if (this.getNivelJerarquico(user.rol) === 1) {
                const masters = usuarios.filter(u => this.getNivelJerarquico(u.rol) === 1);
                if (masters.length <= 1) {
                    return { success: false, message: 'Acción rechazada: Debe existir al menos una cuenta de Master Senior activa en el sistema.' };
                }
            }

            const nuevosUsuarios = usuarios.filter(u => u.id !== id);
            window.ViasaStorage.setItem('usuarios', nuevosUsuarios);

            this.registrarEventoSeguridad(
                'USUARIO_ELIMINADO',
                `Eliminación permanente de la cuenta ${user.username} (${user.nombreCompleto})`,
                user.username
            );

            return { success: true, message: `Usuario ${user.username} eliminado del sistema.` };
        }

        /**
         * =========================================================================
         * MONITOR DE INACTIVIDAD Y PANTALLA DE BLOQUEO (AUTO-LOCK SCREEN)
         * =========================================================================
         */

        iniciarMonitorInactividad() {
            const eventos = ['mousemove', 'keydown', 'touchstart', 'pointerdown', 'click', 'wheel'];
            const resetActivity = () => {
                if (!this.isLocked && this.currentUser) {
                    this.reiniciarTemporizadorInactividad();
                }
            };

            eventos.forEach(evt => {
                window.addEventListener(evt, resetActivity, { passive: true });
            });

            this.reiniciarTemporizadorInactividad();
        }

        reiniciarTemporizadorInactividad() {
            if (this.inactivityTimer) {
                clearTimeout(this.inactivityTimer);
            }

            if (this.inactivityMinutes <= 0 || !this.currentUser || this.isLocked) {
                return; // Timeout desactivado
            }

            const ms = this.inactivityMinutes * 60 * 1000;
            this.inactivityTimer = setTimeout(() => {
                this.bloquearSesion('Inactividad prolongada del operador');
            }, ms);
        }

        bloquearSesion(motivo = 'Bloqueo manual por el usuario') {
            if (!this.currentUser || this.isLocked) return;

            this.isLocked = true;
            if (this.inactivityTimer) clearTimeout(this.inactivityTimer);

            const lockModal = document.getElementById('modal-lock-screen');
            if (lockModal) {
                const lockName = document.getElementById('lock-screen-user-name');
                const lockRole = document.getElementById('lock-screen-user-role');
                const lockAvatar = document.getElementById('lock-screen-user-avatar');
                const lockPinInput = document.getElementById('lock-screen-pin');

                if (lockName) lockName.textContent = this.currentUser.nombreCompleto;
                if (lockRole) {
                    const rInfo = this.getRoleInfo(this.currentUser.rol);
                    lockRole.textContent = rInfo ? rInfo.badge : this.currentUser.rol.toUpperCase();
                    lockRole.style.color = rInfo ? rInfo.color : '#f59e0b';
                }
                if (lockAvatar) lockAvatar.className = `fa-solid ${this.currentUser.avatar || 'fa-user-lock'}`;
                if (lockPinInput) {
                    lockPinInput.value = '';
                    setTimeout(() => lockPinInput.focus(), 150);
                }

                lockModal.classList.remove('hidden');
                lockModal.style.display = 'flex';
            }

            if (window.ViasaAudio) window.ViasaAudio.playAlert();
            this.registrarEventoSeguridad('SESION_BLOQUEADA', `Pantalla bloqueada por motivo: ${motivo}`, this.currentUser.username);
        }

        desbloquearSesion(passwordInput) {
            if (!this.currentUser || !this.isLocked) return { success: true };

            const usuarios = this.obtenerUsuarios();
            const user = usuarios.find(u => u.id === this.currentUser.id);
            if (!user) {
                return { success: false, message: 'Usuario no encontrado.' };
            }

            const esValido = this.verificarPassword(user, passwordInput);
            if (esValido) {
                this.isLocked = false;
                const lockModal = document.getElementById('modal-lock-screen');
                if (lockModal) {
                    lockModal.classList.add('hidden');
                    lockModal.style.display = 'none';
                }

                this.reiniciarTemporizadorInactividad();
                this.registrarEventoSeguridad('SESION_DESBLOQUEADA', `Terminal desbloqueado exitosamente por ${this.currentUser.username}`, this.currentUser.username);
                if (window.ViasaAudio) window.ViasaAudio.playCashChime();
                return { success: true };
            }

            if (window.ViasaAudio) window.ViasaAudio.playAlert();
            this.registrarEventoSeguridad('DESBLOQUEO_FALLIDO', `Intento fallido de desbloqueo para ${this.currentUser.username}`, this.currentUser.username);
            return { success: false, message: 'Clave o PIN incorrecto.' };
        }

        configurarTimeoutInactividad(minutos) {
            const min = parseInt(minutos, 10);
            this.inactivityMinutes = isNaN(min) ? 10 : min;
            window.ViasaStorage.setItem(this.timeoutKey, this.inactivityMinutes);
            this.reiniciarTemporizadorInactividad();
            return this.inactivityMinutes;
        }

        /**
         * =========================================================================
         * REGISTRO DE AUDITORÍA CRIPTOGRÁFICA INMUTABLE (SHA-256)
         * =========================================================================
         */
        async registrarEventoSeguridad(accion, detalles, usuarioAfectado) {
            try {
                const logs = await window.ViasaStorage.obtenerColeccion('audit_logs_crypto');
                const prevLog = logs.length > 0 ? logs[logs.length - 1] : null;
                const prevHash = prevLog ? (prevLog.hashRegistro || 'GENESIS_HASH_VIASA_000000000000000000') : 'GENESIS_HASH_VIASA_000000000000000000';

                const timestamp = new Date().toISOString();
                const usuarioResp = this.currentUser ? this.currentUser.username : 'SISTEMA_AUTO';
                const nivelResp = this.currentUser ? this.currentUser.rol : 'SISTEMA';

                const payloadParaHash = `${prevHash}|${timestamp}|${accion}|${usuarioResp}|${usuarioAfectado || 'N/A'}|${detalles}`;
                const hashRegistro = sha256Pure(payloadParaHash);

                const logEntry = {
                    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    timestamp: timestamp,
                    modulo: 'SEGURIDAD_ACCESO',
                    accion: accion,
                    usuarioResponsable: usuarioResp,
                    nivelResponsable: nivelResp,
                    usuarioAfectado: usuarioAfectado || 'N/A',
                    detalles: detalles,
                    hashPrevio: prevHash,
                    hashRegistro: hashRegistro,
                    integridad: 'VERIFICADO_SHA256'
                };

                await window.ViasaStorage.guardarRegistro('audit_logs_crypto', logEntry);
            } catch (e) {
                console.warn('[VIASA Auth Audit] Error registrando auditoría:', e);
            }
        }

        /**
         * Obtener datos del usuario actual
         */
        getCurrentUser() {
            return this.currentUser;
        }

        /**
         * Obtener información del rol
         */
        getRoleInfo(roleId) {
            const rId = roleId || (this.currentUser ? this.currentUser.rol : 'alfa');
            const catalogoRoles = window.ViasaDatabase?.roles || {};
            return catalogoRoles[rId] || catalogoRoles['alfa'] || {
                id: rId,
                nombre: rId,
                badge: rId.toUpperCase(),
                color: '#94a3b8',
                permisos: []
            };
        }
    }

    window.ViasaAuth = new ViasaAuthService();

})(window);
