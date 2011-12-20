steal('jquery/model', function(){

/*
 * @class Video.Models.ApiModel
 * @parent index
 * @inherits jQuery.Model
 * Servicios de API REST de teleSUR
 */
$.Model('Video.Models.ApiModel',
/* @Static */
{
    id : 'slug',
    is_crossdomain : location.href.match(/multimedia\.tlsur\.net/) === null,

    /**
     *  Opciones predeterminadas para $.ajax
     */
    getAjaxOptions : function() {
        return {
            url : (this.is_crossdomain ? 'http://multimedia.tlsur.net/' : '/') + 'api/' + this._shortName + '/',
            dataType: (this.is_crossdomain ? 'jsonp ' : 'json ') + this._shortName + '.models',
            error: this.ajaxErrorFnc, tryCount: 0, retryLimit: 3
        }
    },

    findAll : function(params, success, error) {
        return $.ajax($.extend(this.getAjaxOptions(), {
            data: params,
            success: success
        }));
    },
    //findOne : "/clips/{id}.json",
    //create : "/clips.json",
    //update : "/clips/{id}.json",
    //destroy : "/clips/{id}.json"

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
                alert("Error de red en consulta de API, reintentando..."); // ************************************************************************************************************
                steal.dev.warn('Error de red en consulta de API. Volviendo a intentar hasta: ' + this.retryLimit + ' veces.');
                //reintentar
                $.ajax(this);
                return;
            }
        }
        steal.dev.warn('Error en respuesta de API: (' + xhr.status + ') ' + textStatus);
    }
},
/* @Prototype */
{}

)});