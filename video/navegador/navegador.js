// Estilos
steal('steal/less').then('./navegador.less')

.then('video/grupo')

// Controlador
.then('jquery/controller','jquery/view/ejs')
	.then( './views/init.ejs', function($) {

/**
 * @class Video.Navegador
 */
$.Controller('Video.Navegador',
/** @Static */
{
	defaults : {
    },
    modos: {
        'noticia': ['secciones', 'regiones', 'fechas', 'programa', 'populares'],
        'entrevista': ['secciones', 'regiones', 'fechas', 'programa', 'populares'],
        'programa': ['programa', 'fechas'],
        'documental': ['fechas'],
        'reportaje': ['fechas']
    },

    fecha_params: {
             hoy: { tiempo: 'dia' },
             ayer: { tiempo: 'dia', hasta: '2011-11-10'},
             semana_actual: { tiempo: 'semana', hasta: '2011-11-08' },
             mes_actual: { tiempo: 'mes', hasta: '2011-11-01' },
             mes_anterior: { tiempo: 'mes', hasta: '2011-10-01'},
             ano_actual: { tiempo: 'ano', hasta: '2011-09-05'},
             ano_anterior: { tiempo: 'ano', hasta: '2010-09-04'}
        },

    ultimoMostradoDefault: 4
},
/** @Prototype */
{
	init : function() {
        steal.dev.log('Inicializando Video.Navegador para tipo: ' + this.options.tipo_clip.slug);
        this.element.html("//video/navegador/views/init.ejs", {});

        // detectar cuando el scroll llega al final
        // para cargar más grupos automáticamente
        var that = this;
        $(window).scroll(function(){
            if  ($(window).scrollTop() == $(document).height() - $(window).height()){
                if (that) {
                    that.element.find('.mas_grupos').addClass('cargando');
                    that.mostrarMasGrupos();
                }
            }
        });

        this.paginacion = {
            primeroMostrado: 1,
            ultimoMostrado: this.constructor.ultimoMostradoDefault
        };

        // rutas
        //$.route.ready(false);
        $.route(':tipo/:modo');
        $.route.delegate('modo', 'set', this.callback('modoSeleccionado'));
        //$.route.delegate('modo', 'remove', this.callback('modoSeleccionado')); // TODO: con esto se cargaba doble al cambiar de tipo, porque lanzaba dos eventos, primero al quitar modo y después al poner el nuevo default
//        $.route.delegate('tipo', 'set', this.callback('tipoSeleccionado'));
//        $.route.delegate('tipo', 'remove', this.callback('tipoSeleccionado'));

        this.cambiarTipo(this.options.tipo_clip);
	},

    cambiarTipo : function(tipo_clip) {
        this.options.tipo_clip = tipo_clip;

        var menu_modos = this.element.find('.menu_modos');

        // actualizar botón con el nombre del tipo en plural
        menu_modos.find('.tipo').html(tipo_clip.nombre_plural);

        // Consturir menú de modos
        menu_modos.empty();
        $.each(this.constructor.modos[tipo_clip.slug], function(i, modo) {
            $('<a>').attr('href', $.route.url({'tipo': tipo_clip.slug, 'modo': modo}))
                .html('por ' + modo)
                .addClass(modo)
                .appendTo(menu_modos);
        });

        // Si ya había un modo seleccionado, checar si el nuevo tipo soporta
        // el mismo modo, si no, cambiar el modo al default (el primero)
        var modos_disponibles = this.constructor.modos[tipo_clip.slug];
        if (!$.route.attr('modo') || modos_disponibles.indexOf($.route.attr('modo')) == -1) {
            //alert('no había' + $.route.attr('modo')); // ******************************************************************************************
            $.route.attr('modo', modos_disponibles[0]);
            //alert('no había' + $.route.attr('modo')); // ******************************************************************************************
        }

      //  $.route.attr('modo', this.options.modo);
      //  this.cambiarModo();
    },

    cargarModoSecciones : function() {
        // crear e intentar poblar store de cookie para categorias
        this.categorias = new Video.Models.Categoria.CookieList([]).retrieve("categorias");
        // solicitar tipos en caso de que no estén en cache
        // en cualquier caso el control pasa a this.tiposRecibidos
        if (this.categorias.length > 0) {
            steal.dev.log('usando categorías en store de cookie');
            this.categoriasRecibidas();
        } else {
            steal.dev.log('sin categorías en store de cookie, solicitando a servicio');
            var self = this;
            Video.Models.Categoria.findAll({}, function(categorias) {
                if (self) {
                    steal.dev.log('añadiendo categorías recibidos a store de cookie');
                    self.categorias = new Video.Models.Categoria.CookieList(categorias).store("categorias");
                    self.categoriasRecibidas();
                } else {
                    steal.dev.log('No se pudieron recibir categorías, no existe objeto navegador');
                }

            });
        }
    },

    cargarModoProgramas : function() {
        // crear e intentar poblar store de cookie para categorias
        this.programas = new Video.Models.Categoria.CookieList([]).retrieve("programas");
        // solicitar tipos en caso de que no estén en cache
        // en cualquier caso el control pasa a this.tiposRecibidos
        if (this.programas.length > 0) {
            steal.dev.log('usando categorías en store de cookie');
            this.programasRecibidos();
        } else {
            steal.dev.log('sin programas en store de cookie, solicitando a servicio');
            var self = this;
            Video.Models.Programa.findAll({}, function(programas) {
                if (self) {
                    steal.dev.log('añadiendo programas recibidos a store de cookie');
                    self.programas = new Video.Models.Programa.CookieList(programas).store("programas");
                    self.programasRecibidos();
                } else {
                    steal.dev.log('No se pudieron recibir programas, no existe objeto navegador');
                }

            });
        }
    },

    programasRecibidos : function() {
        var grupos_div = this.element.find('.grupos');

        var self = this;
        this.programas.each(function(i, programa){
            steal.dev.log('por agregar nuevo grupo para el progrma: ' + programa.slug);
            grupos_div.append($('<div>').model(programa).hide().video_grupo({
                titulo: programa.nombre,
                params: {
                    tipo: self.options.tipo_clip.slug,
                    programa: programa.slug
                }
            }));
        });

        // primer corrida
        if (this.paginacion.ultimoMostrado == this.constructor.ultimoMostradoDefault ) {
            this.element.find('.mas_grupos').show();
            grupos_div.children().slice(0, this.paginacion.ultimoMostrado).trigger('show').show();
        }

    },

    cargarModoRegiones : function() {
        var regiones = ['america-latina', 'europa', 'asia', 'africa', 'oceania'];

        var grupos_div = this.element.find('.grupos');

        var self = this;
        $.each(regiones, function(i, region){
            steal.dev.log('por agregar nuevo grupo para la región: ' + region);
            grupos_div.append($('<div>').hide().video_grupo({
                titulo: region,
                params: { tipo: self.options.tipo_clip.slug, region: region }
            }));
        });

        // primer corrida
        if (this.paginacion.ultimoMostrado == this.constructor.ultimoMostradoDefault ) {
            this.element.find('.mas_grupos').show();
            grupos_div.children().slice(0, this.paginacion.ultimoMostrado).trigger('show').show();
        }
    },

    cargarModoPopulares : function() {
        var tiempos = ['dia', 'semana_actual', 'mes_actual', 'ano_actual', 'ano_anterior'];

        var grupos_div = this.element.find('.grupos');

        var self = this;
        $.each(tiempos, function(i, tiempo){
            steal.dev.log('por agregar nuevo grupo para populares: ' + tiempo);
            grupos_div.append($('<div>').hide().video_grupo({
                titulo: tiempo,
                params: $.extend(self.constructor.fecha_params[tiempo], {
                    tipo: self.options.tipo_clip.slug,
                    orden: 'popularidad'
                })
            }));
        });

        // primer corrida
        if (this.paginacion.ultimoMostrado == this.constructor.ultimoMostradoDefault ) {
            this.element.find('.mas_grupos').show();
            grupos_div.children().slice(0, this.paginacion.ultimoMostrado).trigger('show').show();
        }
    },

    cargarModoFechas : function() {
        var fechas = ['hoy', 'ayer', 'semana_actual', 'mes_actual', 'mes_anterior', 'ano_actual', 'ano_anterior'];

        var grupos_div = this.element.find('.grupos');

        var self = this;
        $.each(fechas, function(i, fecha){
            steal.dev.log('por agregar nuevo grupo para fecha: ' + fecha);
            grupos_div.append($('<div>').hide().video_grupo({
                titulo: fecha,
                params: $.extend(self.constructor.fecha_params[fecha], {
                    tipo: self.options.tipo_clip.slug
                })
            }));
        });

        // primer corrida
        if (this.paginacion.ultimoMostrado == this.constructor.ultimoMostradoDefault ) {
            this.element.find('.mas_grupos').show();
            grupos_div.children().slice(0, this.paginacion.ultimoMostrado).trigger('show').show();
        }
    },

    cambiarModo : function(modo) {


    },

    categoriasRecibidas : function() {
        var grupos_div = this.element.find('.grupos');

        var self = this;
        this.categorias.each(function(i, categoria){
            steal.dev.log('por agregar nuevo grupo para categoría: ' + categoria.slug);
            grupos_div.append($('<div>').model(categoria).hide().video_grupo({
                titulo: categoria.nombre,
                params: {
                    tipo: self.options.tipo_clip.slug,
                    categoria: categoria.slug
                }
            }));
        });

        // primer corrida
        if (this.paginacion.ultimoMostrado == this.constructor.ultimoMostradoDefault ) {
            this.element.find('.mas_grupos').show();
            grupos_div.children().slice(0, this.paginacion.ultimoMostrado).trigger('show').show();
        }

    },

    '{window} scroll' : function() {
       // if  (window.scrollTop() == $(document).height() - $(window).height()){
      //     this.cargarMasGrupos();
      //  }
    },

    'div.mas_grupos a click' : function(el, ev) {
        ev.preventDefault();
        this.mostrarMasGrupos();
    },

    mostrarMasGrupos : function(num) {
        // default: agregar dos grupos extra
        if (!num) num = 2;
        this.paginacion.ultimoMostrado += num;

        var grupos = this.element.find('.grupos').children();

        if (this.paginacion.ultimoMostrado >= grupos.length)
            this.element.find('.mas_grupos').hide();

        grupos.slice(this.paginacion.primeroMostrado-1, this.paginacion.ultimoMostrado).not(':visible').trigger('show').show();
    },

    modoSeleccionado : function(ev, modo, modo_anterior) {
        //if (modo != modo_anterior) {
            this.element.find('.grupos').empty();
            this.paginacion = {
                primeroMostrado: 1,
                ultimoMostrado: this.constructor.ultimoMostradoDefault
            };

            switch (modo) {
                case 'secciones':
                    this.cargarModoSecciones();
                    break;
                case 'populares':
                    this.cargarModoPopulares();
                    break;
                case 'programa':
                    this.cargarModoProgramas();
                    break;
                case 'fechas':
                    this.cargarModoFechas();
                    break;
                case 'regiones':
                    this.cargarModoRegiones();
                    break;
                default:
                    steal.dev.warn('Modo no reconocido: ' + modo);
            }
        this.element.find('.menu_modos a.'+modo).addClass('activo').siblings().removeClass('activo');
        //}
    }



})

});