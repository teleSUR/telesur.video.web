steal("jquery/model", function() {
    $.Class('Video.Models.VideoApi',
        { // static

            /**
             * Devuelve true si el API está en un dominio diferente
             * Necesario para determinar si la consulta se hace vía JSONP
             */
            isCrossDomain : function() {
                return location.href.match(/multimedia\.tlsur\.net/) == null;
            },

            /**
             * Devuelve función
             *
             * @param xhr
             * @param textStatus
             * @param errorThrown
             */
            ajaxErrorFnc : function(xhr, textStatus, errorThrown ) {
                steal.dev.log('Error en cinsulta a API');

                if (textStatus == 'timeout' || xhr.status == 503) {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        //reintentar
                        $.ajax(this);
                        return;
                    }
                    alert("Error de red en consulta de API, reintentando..."); // ************************************************************************************************************
                    steal.dev.warn('Error de red en consulta de API. Volviendo a intentar hasta: ' + this.retryLimit + ' veces.');
                    return;
                }
                if (xhr.status == 500) {
                    alert("Error 500 en respuesta de API."); // ************************************************************************************************************
                    steal.dev.warn('Error 500 en respuesta de API.');
;                } else {
                    alert('Oops! Error: ' + textStatus);
                }
            }
        },
        { // prototype
        });
})

.then('./tipo_clip.js', './clip.js', './programa.js', './categoria.js');