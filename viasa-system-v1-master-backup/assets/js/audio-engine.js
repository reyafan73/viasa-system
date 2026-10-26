/**
 * ==============================================================================
 * VIASA SYSTEM - AUDIO ENGINE (SYNTHESIZER)
 * Panadería y Pastelería Nueva Viasa
 * ==============================================================================
 * Generador de sonidos interactivos para Punto de Venta, escaneo y alertas.
 */

(function(window) {
    'use strict';

    class ViasaAudioEngine {
        constructor() {
            this.ctx = null;
            this.enabled = true;
        }

        initContext() {
            if (!this.ctx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        /**
         * Sonido de Escaneo de Código de Barras / Agregar Producto al Carrito
         */
        playScanBeep() {
            if (!this.enabled) return;
            this.initContext();
            if (!this.ctx) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(2400, this.ctx.currentTime + 0.06);

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.08);
        }

        /**
         * Sonido de Caja Registradora / Venta Exitosa ("Cha-Ching")
         */
        playCashChime() {
            if (!this.enabled) return;
            this.initContext();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            
            // Tono 1
            const osc1 = this.ctx.createOscillator();
            const gain1 = this.ctx.createGain();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(987.77, now); // B5
            gain1.gain.setValueAtTime(0.2, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc1.connect(gain1);
            gain1.connect(this.ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.35);

            // Tono 2
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6
            gain2.gain.setValueAtTime(0.25, now + 0.08);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);
            osc2.start(now + 0.08);
            osc2.stop(now + 0.6);
        }

        /**
         * Sonido de Clic / Navegación
         */
        playClick() {
            if (!this.enabled) return;
            this.initContext();
            if (!this.ctx) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.03);

            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.03);
        }

        /**
         * Sonido de Alerta o Error
         */
        playAlert() {
            if (!this.enabled) return;
            this.initContext();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.setValueAtTime(180, now + 0.1);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(now + 0.25);
        }
    }

    window.ViasaAudio = new ViasaAudioEngine();

})(window);
