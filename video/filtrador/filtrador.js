steal( 'jquery/controller','jquery/view/ejs' )
    .then('video/resources/date.js', 'video/resources/date_es.js', 'video/resources/jquery.datePicker.js', 'video/resources/datePicker.css')
    .then('steal/less').then('./filtrador.less')
	.then( './views/init.ejs', function($){

/**
 * @class Video.Filtrador
 */
$.Controller('Video.Filtrador',
/** @Static */
{
	defaults : {
        modo : null
    },
    listensTo: ['show'],

    filtros : {
        pais : {
            clase: 'pais',
            nombre: 'países',
            model: Video.Models.Pais,
            recibirCallback: 'recibirPaises',
            numPorPagina: 8,
            tipos: ['noticia', 'entrevista', 'reportaje']
        },
        corresponsal : {
            clase: 'corresponsal',
            nombre: 'corresponsales',
            model: Video.Models.Corresponsal,
            recibirCallback: 'recibirCorresponsales',
            numPorPagina: 4,
            tipos: ['noticia', 'entrevista']
        },
        categoria : {
            clase: 'categoria',
            nombre: 'categorías',
            model: Video.Models.Categoria,
            recibirCallback: 'recibirCategorias',
            numPorPagina: 10,
            tipos: ['noticia', 'entrevista', 'reportaje', 'documental']
        },
        entrevistado : {
            clase: 'entrevistado',
            nombre: 'entrevistados',
            model: Video.Models.Entrevistado,
            recibirCallback: 'recibirEntrevistados',
            numPorPagina: 4,
            tipos: ['entrevista']
        },
        personaje : {
            clase: 'personaje',
            nombre: 'personaje',
            model: Video.Models.Personaje,
            recibirCallback: 'recibirPersonajes',
            numPorPagina: 4,
            tipos: ['noticia']
        },
        tema : {
            clase: 'tema',
            nombre: 'temas',
            model: Video.Models.Tema,
            recibirCallback: 'recibirTemas',
            numPorPagina: 4,
            tipos: ['noticia', 'entrevista']
        },
        programa : {
            clase: 'programa',
            nombre: 'programas',
            model: Video.Models.Programa,
            recibirCallback: 'recibirProgramas',
            numPorPagina: 4,
            tipos: ['programa']
        },
        fecha : {
            clase: 'fecha',
            nombre: 'fecha',
            model: {
                'findAll' : function(params, callback) {
                    callback.apply();
                }
            },
            recibirCallback: 'recibirFechas',
            numPorPagina: 4,
            tipos: ['noticia', 'entrevista', 'programa', 'documental', 'reportaje']
        }
    }
},
/** @Prototype */
{
	init : function(){
        steal.dev.log('{filtrados} Inicializando Video.Filtrador');
        this.element.html("//video/filtrador/views/init.ejs",{});
	},

    'show' : function(){
        var that = this,
            tipo_slug = $(document).controller().tipo_slug;
        $.each(this.constructor.filtros, function() {
            if (this.tipos.indexOf(tipo_slug) > -1) {
                if (tipo_slug == 'programa' && this.clase == 'programa') {
                    this.numPorPagina*= 3;
                }
                var template = (this.clase == 'fecha') ? '//video/filtrador/views/filtro_fecha.ejs' : '//video/filtrador/views/filtro.ejs';
                var filtro = $('<div class="filtro '+ this.clase +'" />').html(template, {filtro: this});
                filtro.data('filtro', this);
                that.element.find('.filtros').append(filtro);
                this.model.findAll({limit: this.numPorPagina}, that.callback(this.recibirCallback));
            }
        })
    },

    recibirCategorias : function(models){ this.recibirObjetos('categoria', models); },
    recibirCorresponsales : function(models){ this.recibirObjetos('corresponsal', models); },
    recibirPaises : function(models){ this.recibirObjetos('pais', models); },
    recibirPersonajes : function(models){ this.recibirObjetos('personaje', models); },
    recibirEntrevistados : function(models){ this.recibirObjetos('entrevistado', models); },
    recibirTemas : function(models){ this.recibirObjetos('tema', models); },
    recibirProgramas : function(models){ this.recibirObjetos('programa', models); },
    recibirFechas : function() {

        $('.filtro.fecha input.date').datePicker();
    },

    recibirObjetos : function(modelo, objetos){

        if (!this.element) return;

        var filtro_elem = this.find('.filtro.' + modelo);
        var filtrando_elem = filtro_elem.find('.filtrandos ul');
        filtrando_elem.empty();

        var filtro = filtro_elem.data('filtro');

        if (objetos.length < filtro.numPorPagina) {
            filtro_elem.find('.siguiente').css('opacity', 0.3);
        } else {
            filtro_elem.find('.siguiente').css('opacity', 1);
        }

        if (!filtro.params || filtro.params.primero == 1) {
            filtro_elem.find('.anterior').css('opacity', 0.3);
        } else {
            filtro_elem.find('.anterior').css('opacity', 1);
        }

        var tipo_slug = $(document).controller().tipo_slug;

        objetos.each(function(i, objeto) {
            filtrando_elem.append('//video/filtrador/views/filtrando.ejs', {modelo: modelo, objeto: objeto});
            if (modelo == 'pais') {
                var filtrando = filtrando_elem.children(':last');
                filtrando.css({
                    'background-image': 'url(http://media.tlsur.net/img/banderas/'+objeto.codigo.toLowerCase()+'.png)',
                    'float': 'left',
                    'width': '70px'
                });
            } else if (modelo == 'categoria') {
                var filtrando = filtrando_elem.children(':last');
                filtrando.css({
                    'float': 'left',
                    'width': '70px'
                });
            } else if (modelo == 'programa') {
                var filtrando = filtrando_elem.children(':last');
                filtrando.prepend('<img src="'+objeto.imagen_url+'.thumb.jpg" width="18" style="margin-right: 10px" />')
                if (tipo_slug == 'programa') {
                    filtrando.css({
                        'float': 'left',
                        'width': '120px',
                        'padding-left': '10px',
                        'margin-left': 0
                    });
                    filtrando_elem.parents('.filtro').css('width', '400px');
                }
            }
        });
    },

    'input[type=text] keyup' : function(el, ev) {
        var busqueda = $(el).val().replace(/^\s+|\s+$/g,"");
        if (busqueda == this.busqueda_anterior) {
            return;
        }
        this.busqueda_anterior = busqueda;
        var filtro_data = $(el).parents('.filtro').data('filtro'),
            params = {texto: busqueda, primero: 1, limit: filtro_data.numPorPagina};

        filtro_data['params'] = params;

        filtro_data.model.findAll(params, this.callback(filtro_data.recibirCallback));


    },

    'input[type=text] focus' : function(el, ev) {
        $(el).val('');
    },

    'input[type=text] blur' : function(el, ev) {
        var filtrando = $(el);
        filtrando.val(filtrando.attr('id'));

    },

    '.filtrandos li click' : function(el, ev){

        var filtrador = $(el);

        filtrador.toggleClass('seleccionado');

//        $('#navegador .video_grupo').remove();
//        var params = {};
//        params[$(el).attr('class')] = $(el).attr('id');
//        params['tipo'] = $(document).controller().tipo_slug;
//        $('#navegador').controller().agrupadoresRecibidos('filtros', [params]);
//        this.element.remove();
    },

    '.filtrandos li dblclick' : function(el, ev){
        $('#navegador .video_grupo').remove();
        var params = {};
        params[$(el).attr('class')] = $(el).attr('id');
        params['tipo'] = $(document).controller().tipo_slug;

        $('#navegador').controller().agrupadoresRecibidos('filtros', [params]);
        this.element.remove();
        $('.grupos').css('opacity', 1);

        $('.menu_modos a').removeClass('activo');
        $('a.toggle_filtros').addClass('activo')
    },

    '.acciones click' : function(el, ev) {

        var filtrandos_seleccionados = $('.filtrandos li.seleccionado');

        var params = {};
        params['tipo'] = $(document).controller().tipo_slug;

        $.each(filtrandos_seleccionados, function() {
            $(this).removeClass('seleccionado');
            params[$(this).attr('class')] = $(this).attr('id');
        });

        $('#navegador .video_grupo').remove();

        $('.menu_modos a').removeClass('activo');
        $('a.toggle_filtros').addClass('activo');
        $('#navegador').controller().agrupadoresRecibidos('filtros', [params]);

        this.element.remove();
        $('.grupos').css('opacity', 1);
    },

    '.anterior click' : function(el, ev) {
        var filtro = $(el).parents('.filtro'),
            filtro_data = filtro.data('filtro'),
            params = filtro_data.params ? filtro_data.params : { primero: 1, limit: filtro_data.numPorPagina }

        params.primero -= filtro_data.numPorPagina;

        if (params.primero < 1) params.primero = 1;

        filtro_data.params = params;

        filtro_data.model.findAll(params, this.callback(filtro_data.recibirCallback));
    },

    '.siguiente click' : function(el, ev) {
        var filtro = $(el).parents('.filtro'),
            filtro_data = filtro.data('filtro'),
            params = filtro_data.params ? filtro_data.params : { primero: 1, limit: filtro_data.numPorPagina }

        params.primero += filtro_data.numPorPagina;

        if (params.primero < 1) params.primero = 1;

        filtro_data.params = params;

        filtro_data.model.findAll(params, this.callback(filtro_data.recibirCallback));

    }
})

});