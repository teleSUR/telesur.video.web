steal('jquery/model', './api_model.js', '../resources/jquery.dateFormat.js', function(){

/**
 * @class Video.Models.Clip
 * @parent index
 * @inherits Video.Models.ApiModel
 * Wraps backend clip services.
 */
Video.Models.ApiModel('Video.Models.Clip',
    /* @Static */
    {
        fecha_actual : new Date(),

        attributes : {
            fecha : 'date',
            duracion: 'duracion'
        },

        convert : {
            date : function(raw){
                if(typeof raw == 'string'){
                    var matches = raw.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/);
                    return new Date( matches[1], // año
                        (+matches[2])-1, // mes
                        matches[3], // día
                        matches[4], // hora
                        matches[5], // minuto
                        matches[6]); //segundo
                }else if(raw instanceof Date){
                    return raw;
                }
            },

            /**
             * Dvuelve representación de la duración en texto
             * Ejenplos: 00:02:00 -> 2m; 00:29:29 -> 30m; 00:00:15 -> 15s
             *
             * @param string
             */
            duracion : function(raw) {
                var duracion_texo = "",
                    umbral_arria = 55, // redondear arriba de 55 segundos ó minutos
                    ubral_abajo = 5, // redondear abajo de 05 segundos ó minutos
                    matches = raw.match(/(\d{2}):(\d{2}):(\d{2})/),
                    horas = parseInt(matches[1]),
                    minutos = parseInt(matches[2]),
                    segundos = parseInt(matches[3]);

                // redondear segundos
                if (segundos > umbral_arria)
                    { segundos = 0; minutos++; }
                else if (segundos < ubral_abajo && minutos > 0)
                    { segundos = 0; }

                // redondear minutos
                if (minutos > umbral_arria)
                    { minutos = 0; horas++; }
                else if (minutos < ubral_abajo && horas > 0)
                    { minutos = 0; }

                // formar cadena
                if (horas > 0) duracion_texo += horas + "h ";
                if (minutos > 0) duracion_texo += minutos + "m ";
                if (segundos > 0) duracion_texo += segundos + "s";

                return duracion_texo.replace(/^\s+|\s+$/g, '')
            }
        },

        getTimeDifference : function (desde, hasta) {
            var nTotalDiff = hasta.getTime() - desde.getTime();
            var oDiff = new Object();

            oDiff.months = Math.floor(nTotalDiff/1000/60/60/24/30);
            nTotalDiff -= oDiff.months*1000*60*60*24*30;

            oDiff.weeks = Math.floor(nTotalDiff/1000/60/60/24/7);
            nTotalDiff -= oDiff.weeks*1000*60*60*24*7;

            oDiff.days = Math.floor(nTotalDiff/1000/60/60/24);
            nTotalDiff -= oDiff.days*1000*60*60*24;

            oDiff.hours = Math.floor(nTotalDiff/1000/60/60);
            nTotalDiff -= oDiff.hours*1000*60*60;

            oDiff.minutes = Math.floor(nTotalDiff/1000/60);
            nTotalDiff -= oDiff.minutes*1000*60;

            oDiff.seconds = Math.floor(nTotalDiff/1000);

            return oDiff;
        }
    },
    /* @Prototype */
    {
        /**
         * Devuelve representación escrita de la fecha
         * si la fecha es del año actual, omitirlo
         */
        getFechaTexto : function(forzar_ano) {
            var formatoFecha = 'd de MMMM' + ((forzar_ano || this.constructor.fecha_actual.getYear() != this.fecha.getYear()) ? ', yyyy' : '');
            return $.format.date(this.fecha, formatoFecha);
        },

        getHoraTexto : function() {
            return $.format.date(this.fecha, 'HH:mm');
        },

        /**
         *
         * Devuelve cadena con una represetación legible de la edad del clip
         *
         * TODO: seguir las mismas reglas que en: https://github.com/desarrollotv/diftv/wiki/Convenciones
         * TODO: obtener fecha actual de otro lugar para tomar en cuenta diferencia de horarios
         */
        getFirmaTiempo: function() {
            // checar si hay alor en cache antes de calcularlo
            if (this.firmatiempo) return this.firmatiempo;

            var diff = this.constructor.getTimeDifference(this.fecha || new Date(), new Date()),
                firma = "hace ";

            if (diff) {
                if (diff.months > 0) {
                    firma += diff.months + ((diff.months == 1) ? " mes" : " meses");
                    this.firmatiempo = firma;
                    return firma;
                }
                if (diff.weeks > 0) {
                    firma += diff.weeks + ((diff.weeks == 1) ? " semana" : " semanas");
                    this.firmatiempo = firma;
                    return firma;
                }
                if (diff.days > 0) {
                    firma += diff.days + ((diff.days == 1) ? " día" : " días");
                    this.firmatiempo = firma;
                    return firma;
                }
                if (diff.hours > 0) {
                    firma += diff.hours + ((diff.hours == 1) ? " hora" : " horas");
                    this.firmatiempo = firma;
                    return firma;
                }
                if (diff.minutes >= 5) {
                    firma += diff.minutes + ((diff.minutes == 1) ? " minuto" : " minutos");
                    this.firmatiempo = firma;
                    return firma;
                }
                if (diff.seconds > 0) {
                    return "justo ahora";
                    firma += diff.seconds + ((diff.seconds == 1) ? " segundo" : " segundos");
                    return firma;
                }

                return firma;
            } else {
                steal.dev.warn("No se pudo obtener diferencia de tiempo para fecha: " + this.fecha + ". Diferencia: " + diff );
                return this.fecha;
            }
        }
    }
);

});
