steal( 'jquery/controller','jquery/view/ejs' )
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
            numPorPagina: 8
        },
        corresponsal : {
            clase: 'corresponsal',
            nombre: 'corresponsales',
            model: Video.Models.Corresponsal,
            recibirCallback: 'recibirCorresponsales',
            numPorPagina: 4
        },
        categoria : {
            clase: 'categoria',
            nombre: 'categorías',
            model: Video.Models.Categoria,
            recibirCallback: 'recibirCategorias',
            numPorPagina: 8
        },
        entrevistado : {
            clase: 'entrevistado',
            nombre: 'entrevistados',
            model: Video.Models.Entrevistado,
            recibirCallback: 'recibirEntrevistados',
            numPorPagina: 4
        },
        personaje : {
            clase: 'personaje',
            nombre: 'personaje',
            model: Video.Models.Personaje,
            recibirCallback: 'recibirPersonajes',
            numPorPagina: 4
        },
        tema : {
            clase: 'tema',
            nombre: 'temas',
            model: Video.Models.Tema,
            recibirCallback: 'recibirTemas',
            numPorPagina: 4
        },
        programa : {
            clase: 'programa',
            nombre: 'programas',
            model: Video.Models.Programa,
            recibirCallback: 'recibirProgramas',
            numPorPagina: 4
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
        var that = this;
        $.each(this.constructor.filtros, function() {
            var filtro = $('<div class="filtro '+ this.clase +'" />').html('//video/filtrador/views/filtro.ejs', {filtro: this});
            that.element.find('.filtros').append(filtro);
            this.model.findAll({ultimo: this.numPorPagina}, that.callback(this.recibirCallback));
        })
    },

    recibirCategorias : function(models){ this.recibirObjetos('categoria', models); },
    recibirCorresponsales : function(models){ this.recibirObjetos('corresponsal', models); },
    recibirPaises : function(models){ this.recibirObjetos('pais', models); },
    recibirPersonajes : function(models){ this.recibirObjetos('personaje', models); },
    recibirEntrevistados : function(models){ this.recibirObjetos('entrevistado', models); },
    recibirTemas : function(models){ this.recibirObjetos('tema', models); },
    recibirProgramas : function(models){ this.recibirObjetos('programa', models); },

    recibirObjetos : function(modelo, objetos){
        var filtrando_elem = this.find('.filtro.'+modelo + ' .filtrandos ul');
        filtrando_elem.empty();

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
//                filtrando.css({
//                    'background-image': 'url('+objeto.imagen_url + '.thumb.jpg)'
//                });
                filtrando.prepend('<img src="'+objeto.imagen_url+'.thumb.jpg" width="18" style="margin-right: 10px" />')
            }
        });
    },

    'input[type=text] keyup' : function(el, ev) {
        var busqueda = $(el).val();

//        switch (ev.which) {
//            case 8: // BACKSPACE
//                //alert('backsp');
//                busqueda = busqueda.substring(0, busqueda.length-1);
//                break;
//            case 9: // TAB
//                break;
//            default:
//                busqueda+= String.fromCharCode(ev.which);
//        }
        var filtro = $(el).parents('.filtro');

        if (filtro.hasClass('pais')) {
            Video.Models.Pais.findAll({texto: busqueda, ultimo: this.constructor.filtros['pais'].numPorPagina}, this.callback('recibirPaises'));
        } else if (filtro.hasClass('corresponsal')) {
            Video.Models.Corresponsal.findAll({texto: busqueda, ultimo: this.constructor.filtros['corresponsal'].numPorPagina}, this.callback('recibirCorresponsales'));
        } else if (filtro.hasClass('categoria')) {
            Video.Models.Categoria.findAll({texto: busqueda, ultimo: this.constructor.filtros['categoria'].numPorPagina}, this.callback('recibirCategorias'));
        } else if (filtro.hasClass('entrevistado')) {
            Video.Models.Entrevistado.findAll({texto: busqueda, ultimo: this.constructor.filtros['entrevistado'].numPorPagina}, this.callback('recibirEntrevistados'));
        } else if (filtro.hasClass('personaje')) {
            Video.Models.Personaje.findAll({texto: busqueda, ultimo: this.constructor.filtros['personaje'].numPorPagina}, this.callback('recibirPersonajes'));
        } else if (filtro.hasClass('tema')) {
            Video.Models.Tema.findAll({texto: busqueda, ultimo: this.constructor.filtros['tema'].numPorPagina}, this.callback('recibirTemas'));
        }  else if (filtro.hasClass('programa')) {
            Video.Models.Programa.findAll({texto: busqueda, ultimo: this.constructor.filtros['programa'].numPorPagina}, this.callback('recibirProgramas'));
        }
    },

    'input[type=text] focus' : function(el, ev) {
        $(el).val('');
    },

    'input[type=text] blur' : function(el, ev) {
        var filtrando = $(el);
        filtrando.val(filtrando.attr('id'));

    },

    '.filtrandos li click' : function(el, ev){

        $('#navegador .video_grupo').remove();
        var params = {};
        params[$(el).attr('class')] = $(el).attr('id');
        params['tipo'] = $(document).controller().tipo_slug;
        $('#navegador').controller().agrupadoresRecibidos('filtros', [params]);
        this.element.remove();
    }
})

});