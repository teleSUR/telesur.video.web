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
    is_crossdomain : location.href.match(/multimedia\.(telesurtv|tlsur)\.net/) === null,

    /**
     * Devuelve jQuery.Model.List o objeto en cache
     * Devuelve un deferred o lista/arreglo para usarse con jQuery.when()
     *
     * @param params
     */
    cache_activado : true,
    cache: [],
    getDeferredModels : function(params, no_cache){
        // si no se quiere guardar en cache, devolver directamente el deferred
        if (no_cache || !this.cache_activado) return this.findAll(params);

        if (!this.cache[this._shortName]) this.cache[this._shortName] = [];

        var key = $.param(params), that = this;
        return this.cache[this._shortName][key] || this.findAll(params, function(model_list) {
            that.cache[ that._shortName ][ key ] = model_list;
        });
    },

    /**
     *  Opciones predeterminadas para $.ajax
     */
    getAjaxOptions : function(id) {
        return {
            url : (this.is_crossdomain ? 'http://multimedia.tlsur.net/' : '/') + 'api/' + this._shortName + '/' + ((typeof id != 'undefined') ? id + '/' : ''),
            dataType: (this.is_crossdomain ? 'jsonp ' : 'json ') + this._shortName + '.models',
            error: this.is_cross_domain && this.ajaxErrorFnc, tryCount: 0, retryLimit: 3
        }
    },

    findAll : function(params, success, error) {
        return $.ajax($.extend(this.getAjaxOptions(), {
            data: params,
            success: success
        }));
    },

    findOne : function(params, success, error) {
        var id = params.id;
        delete params.id;
        return $.ajax($.extend(this.getAjaxOptions(id), {
            data: params,
            success: success
        }));
    },

    /**
     * jQuery.Model espera un arreglo de objetos, incluso para findOne(), donde el servicio devuelve un objeto.
     * Intercepta la respuesta del servicio y cuando ésta no es un arreglo,
     * lo encierra en uno antes de crear la lista de modelos
     *
     * @param data
     */
    models : function(data){
        return this._super((typeof data.length != 'undefined') ? data : [data]);
    },

    /**
     * Devuelve función para manejar error
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