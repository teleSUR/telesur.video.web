// recursos
steal('../resources/jquery.dateFormat.js')
// Estilos
.then('steal/less').then('./navegador.less')


.then('video/grupo')



// Controlador
.then('jquery/controller','jquery/view/ejs')
	.then( './views/init.ejs', function($) {

Object.keys = Object.keys || function(o) {
    var result = [];
    for(var name in o) {
        if (o.hasOwnProperty(name))
            result.push(name);
    }
    return result;
};

if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
}

/**
 * @class Video.Navegador
 */
$.Controller('Video.Navegador',
/** @Static */
{
	defaults : {
        tipo_clip: new Video.Models.TipoClip({slug: 'noticia', nombre_plural: 'noticias'}),
        modo: 'secciones'
    },

    pagina_controller : $("#pagina").controller(),
    navegador_controller : $("#navegador").controller(),
    current_date: new Date(),

    cargarGruposEnPasos : 2,
    ultimoMostradoDefault: 4,

    tipos: {
        'noticia': ['fechas', 'secciones', 'regiones', 'corresponsales', 'popularidad'],
        'entrevista': ['fechas', 'secciones', 'regiones', 'popularidad'],
        'programa': ['programa', 'fechas'],
        'documental': ['secciones', 'fechas'],
        'reportaje': ['secciones', 'fechas']
    },

    modos: {
        secciones: { nombre: {es: 'secciones', en: 'categories', pt: 'seções'} },
        regiones: { nombre: {es: 'regiones', en: 'regions', pt: 'regiões'} },
        fechas: { nombre: {es: 'cronología', en: 'timeline', pt: 'cronologia'} },
        programa: { nombre: {es: 'programas', en: 'shows', pt: 'programas'} },
        popularidad: { nombre: {es: 'populares', en: 'popular', pt: 'populares'} },
        corresponsales: { nombre: {es: 'corresponsales', en: 'correspondants', pt: 'correspondentes'} }
    },

    regiones: ['america-latina', 'america', 'europa', 'asia', 'africa', 'oceania'],

    regiones_nombres: [
        { es: 'Latinoamérica', en: 'Latin America', pt: 'américa latina' },
        { es: 'América', en: 'America', pt: 'América' },
        { es: 'Europa', en: 'Europe', pt: 'Europa' },
        { es: 'Asia', en: 'Asia', pt: 'Ásia' },
        { es: 'África', en: 'Africa', pt: 'África' },
        { es: 'Oceanía', en: 'Australia', pt: 'Oceania' }
    ],

    fecha_params: { // $(document).controller().idioma
        hoy: {
            nombre : {es: 'Hoy', en: 'Today', pt: 'Hoy'},
            params : { tiempo: 'dia' },
            dias_diff : { hasta: 0  }
        },
        ayer: {
            nombre : {es: 'Ayer', en: 'Yesterday', pt: 'Ayer'},
            params : { tiempo: 'dia' },
            dias_diff : { hasta: 1 }
        },
        ultima_semana: {
            nombre : {es: 'Última semana', en: 'Last week', pt: 'Última semana'},
            params : { tiempo: 'semana' },
            dias_diff : { hasta: 2 }
        },
        ultimo_mes: {
            nombre : {es: 'Último mes', en: 'Last month', pt: 'Último mês'},
            params : { tiempo: 'mes' },
            dias_diff : { hasta: 9 }
        },
        ultimo_ano: {
            nombre : {es: 'Último año', en: 'Last year', pt: 'Último ano'},
            params : { tiempo: 'ano' },
            dias_diff : { hasta: 39 }
        },
        siempre: {
            nombre : {es: 'Siempre', en: 'Always', pt: 'sempre'},
            params : { },
            dias_diff : { hasta: 0 }
        }
    },

    fecha_params_cache : { },
    getFechaParams : function(tiempo) {
        if (!this.fecha_params_cache[tiempo]) {
            var date = new Date();
            date.setDate(date.getDate()-this.fecha_params[tiempo].dias_diff.hasta);
            this.fecha_params_cache[tiempo] = $.extend(this.fecha_params[tiempo].params, { hasta: $.format.date(date, 'yyyy-MM-dd')})
        }

        return this.fecha_params_cache[tiempo];
    }
},
/** @Prototype */
{
	init : function() {

        steal.dev.log('{naegador} Inicializando Video.Navegador para tipo: ' + this.options.tipo_clip.slug);
        this.element.html("//video/navegador/views/init.ejs", {});

        // this.paginacion = {
        //          primeroMostrado: 1,
        //          ultimoMostrado: this.constructor.ultimoMostradoDefault
        //      };
     

        if (this.options.tipo_clip != 'busqueda') {
            // detectar cuando el scroll llega al final
            // para cargar más grupos automáticamente
            var self = this;
            $(window).scroll(function(){
                if (!$('#abajo').is(':visible')) {
                    $('#abajo').fadeIn('slow');
                }
                if ($(window).scrollTop() == $(document).height() - $(window).height()){
                    if (self) {
                        self.element.find('.mas_grupos').addClass('cargando');
                        self.mostrarMasGrupos();
                    } else {alert('no self en window/scroll')}
                }
            });


        } else {

        }


        // callbacks de rutas

        //$.route.delegate('v2', 'remove', this.callback('modoSeleccionado'));

        // inicia proceso para llenar los datos en el navegador,
        // trae los grupos a mostrar y éstos los clips a mostrar
        $.route.delegate('v2', 'set', this.callback('modoSeleccionado'));
        //this.options.modo = $.route.attr("v2");

        this.cambiarTipo(this.options.tipo_clip);


	},


    cambiarTipo : function(tipo_clip) {
        this.options.tipo_clip = tipo_clip;
        this.options.modo = $.route.attr('v2');

        if (tipo_clip != 'busqueda') {

            var menu_modos = this.element.find('.menu_modos');

            // actualizar botón con el nombre del tipo en plural
            menu_modos.find('.tipo').html(tipo_clip.nombre_plural);

            // Consturir menú de modos
            menu_modos.empty();


            //alert($.route.url({vista: Video.Pagina.vistas.lista.nombre, v1: tipo_clip.slug, v2: modo}));
            var modos = this.constructor.modos;
            $.each(this.constructor.tipos[tipo_clip.slug], function(i, modo) {
                $('<a>').attr('href', $.route.url({idioma: $(document).controller().idioma, vista: Video.Pagina.vistas.lista.nombre, v1: tipo_clip.slug, v2: modo}))
                    .html(modos[modo].nombre[$(document).controller().idioma].toUpperCase())
                    .addClass(modo)
                    .appendTo(menu_modos);
            });



            // Si ya había un modo seleccionado, checar si el nuevo tipo soporta
            // el mismo modo, si no, cambiar el modo al default (el primero)
            var modos_disponibles = this.constructor.tipos[tipo_clip.slug];
            var modo_adecuado = (!this.options.modo || modos_disponibles.indexOf(this.options.modo) == -1) ? modos_disponibles[0] : this.options.modo;

            // Cambiar la ruta si es necesario (puede activar callbacks en $.route)

            //location.hash = $.route.url({idioma: $(document).controller().idioma, vista : Video.Pagina.vistas.lista.nombre, v1 : tipo_clip.slug, v2: modo_adecuado});
            $.route.attrs({idioma: $(document).controller().idioma, vista : Video.Pagina.vistas.lista.nombre, v1 : tipo_clip.slug, v2: modo_adecuado});
        } else {
            //location.hash = $.route.url({idioma: $(document).controller().idioma, vista : Video.Pagina.vistas.lista.nombre, v1 : 'busqueda', v2: this.options.modo});
            $.route.attrs({idioma: $(document).controller().idioma, vista : Video.Pagina.vistas.lista.nombre, v1 : 'busqueda', v2: this.options.modo});
        }

        // ********** READY último **********
        $.route.ready(true);
    },

    cargarModoSecciones : function() {
        // crear e intentar poblar store de cookie para categorias
//        this.categorias = new Video.Models.Categoria.CookieList([]).retrieve("categorias");
        // solicitar tipos en caso de que no estén en cache
        // en cualquier caso el control pasa a this.tiposRecibidos
//        if (this.categorias.length > 0) {
//            steal.dev.log('{naegador} usando categorías en store de cookie');
//            this.agrupadoresRecibidos('secciones', this.categorias);
//        } else {
//            steal.dev.log('{naegador} sin categorías en store de cookie, solicitando a servicio');
//            var self = this;
//            Video.Models.Categoria.findAll({}, function(categorias) {
//                if (self) {
//                    steal.dev.log('{naegador} añadiendo categorías recibidos a store de cookie');
////                    self.categorias = new Video.Models.Categoria.CookieList(categorias).store("categorias");
//                    self.categorias = categorias;
//                    self.agrupadoresRecibidos('secciones', self.categorias);
//                } else {
//                    steal.dev.log('{naegador} No se pudieron recibir categorías, no existe objeto navegador');
//                }
//            });
////        }

        var categorias_nombres = {
            'politica': { es: 'política', en: 'politics', pt: 'política' },
            'economia': { es: 'economía', en: 'economy', pt: 'economia' },
            'medio-ambiente': { es: 'medio ambiente', en: 'environment', pt: 'meio ambiente' },
            'ciencia': { es: 'ciencia', en: 'science', pt: 'ciência' },
            'cultura': { es: 'cultura', en: 'culture', pt: 'cultura' },
            'deportes': { es: 'deportes', en: 'sports', pt: 'esporte' }
        }, idioma = $(document).controller().idioma;
        this.categorias = [
            new Video.Models.Categoria({ slug: 'politica', nombre: categorias_nombres['politica'][idioma]}),
            new Video.Models.Categoria({ slug: 'economia', nombre: categorias_nombres['economia'][idioma]}),
            new Video.Models.Categoria({ slug: 'medio-ambiente', nombre: categorias_nombres['medio-ambiente'][idioma]}),
            new Video.Models.Categoria({ slug: 'ciencia', nombre: categorias_nombres['ciencia'][idioma]}),
            new Video.Models.Categoria({ slug: 'cultura', nombre: categorias_nombres['cultura'][idioma]}),
            new Video.Models.Categoria({ slug: 'deportes', nombre: categorias_nombres['deportes'][idioma]})
        ];

        this.agrupadoresRecibidos('secciones', this.categorias);
    },

    cargarModoProgramas : function() {
        // crear e intentar poblar store de cookie para categorias
//        this.programas = new Video.Models.Categoria.CookieList([]).retrieve("programas");
        // solicitar tipos en caso de que no estén en cache
        // en cualquier caso el control pasa a this.tiposRecibidos
//        if (this.programas.length > 0) {
//            steal.dev.log('{naegador} usando categorías en store de cookie');
//            this.agrupadoresRecibidos('programas', this.programas);
//        } else {
            steal.dev.log('{naegador} sin programas en store de cookie, solicitando a servicio');
            var self = this;
            Video.Models.Programa.findAll({}, function(programas) {
                if (self) {
                    steal.dev.log('{naegador} añadiendo programas recibidos a store de cookie');
//                    self.programas = new Video.Models.Programa.CookieList(programas).store("programas");
                    self.programas = programas;
                    self.agrupadoresRecibidos('programas', self.programas);
                } else {
                    steal.dev.log('{naegador} No se pudieron recibir programas, no existe objeto navegador');
                }
            });
//        }
    },

    cargarModoCorresponsales : function() {
        // crear e intentar poblar store de cookie para categorias
//      this.corresponsales = new Video.Models.Corresponsal.CookieList([]).retrieve('corresponsales');
        // solicitar tipos en caso de que no estén en cache
        // en cualquier caso el control pasa a this.tiposRecibidos
//        if (this.corresponsales.length > 0) {
//            steal.dev.log('{naegador} usando corresponsales en store de cookie');
//            this.agrupadoresRecibidos('corresponsales', this.corresponsales);
//        } else {
            steal.dev.log('{naegador} sin corresponsales en store de cookie, solicitando a servicio');
            var self = this;
            Video.Models.Corresponsal.findAll({ultimo:200}, function(corresponsales) {
                if (self) {
                    steal.dev.log('{naegador} añadiendo corresponsales recibidos a store de cookie');
//                    self.corresponsales = new Video.Models.Corresponsal.CookieList(corresponsales).store('corresponsales');
                    self.corresponsales = corresponsales;
                    self.agrupadoresRecibidos('corresponsales', self.corresponsales);
                } else {
                    steal.dev.log('{naegador} No se pudieron recibir corresponsales, no existe objeto navegador');
                }
            });
//        }
    },

    /**
     *
     * @param grupos
     * @param paramsFnc
     */
    crearGrupos : function(grupos, paramsFnc){
        var grupos_container = this.element.find('.grupos'),
            paginacion = this.paginacion;

        this.key = Math.random()*100000 + grupos[0] + (new Date().getTime());

        // Agregar grupos "desactivados" al DOM, estos se cargarán hasta el evento show() )
        steal.dev.log('{naegador} Creando y agregando '+grupos.length+' controladores de grupo');
        $.each(grupos, function(i, grupo) {
            steal.dev.log('se acaba de crear controlador para grupo: '+ grupo);
            var grupo_el = $('<div>').hide().video_grupo(paramsFnc(grupo));

            // si el agrupamiento es con algún modelo, guardarlo en .model()
            if (typeof grupo.identity != 'undefined') grupo_el.model(grupo);

            // Si está fuera de la paginación, ocultarlo (no cargará info)
            if (i+1 >= paginacion.ultimoMostrado) grupo_el.hide();

            // Agregar al DOM
            grupos_container.append(grupo_el);
        });

        var self = this;
        // incializar sólo los grupos necesarios y en orden
        (function loopShowGrupos(steps, key) {
            var i = 0;
            doLoop($(grupos_container.children()[i]));
            function doLoop(siguiente) {
                if (key != self.key || !siguiente.length > 0) { return; }

                var promises = [];

                for (k=0 ; k<steps && siguiente.length>0 ; k++ ) {
                    if (k>0) { siguiente = siguiente.next() }
                    if (!siguiente.length > 0) { break; }

                   // alert(siguiente.index());
                    if (siguiente.index() < paginacion.ultimoMostrado ) {
                        siguiente.trigger("show").show();
                    }

                    // asegurarse de que el controlador no a sido removido antes de establecer la promesa
                    if (siguiente.controller()) promises.push(siguiente.controller().promise);
                }

                // esperar a que los grupos temrinen de cargarse para avanzar loop
                steal.dev.log('{naegador} agregando callback vía $.when');
                $.when.apply(null, promises).done(function() {
                    steal.dev.log('{naegador} se resuelen grupos con -done- i='+i);
                    if (siguiente.next().length > 0) doLoop(siguiente.next());
                });
            }
        })(this.constructor.cargarGruposEnPasos, this.key);
    },

    /**
     *
     * @param objs
     */
    agrupadoresRecibidos : function(modo, objs) {
        var optionsFnc,
            tipo = this.options.tipo_clip,
            fecha_params = this.constructor.fecha_params,
            getFechaParamsFnc = this.constructor.callback('getFechaParams'),// this.constructor.getFechaParams,
            base_options = { titulo : 'grupo', params : { tipo: tipo.slug }},
            self = this;

        switch (modo) {
            case 'programas':
                optionsFnc = function(programa) {
                    return $.extend(true, {}, base_options, {
                        titulo: programa.nombre,
                        params: { programa: programa.slug }
                    });
                };
                break;

            case 'corresponsales':
                optionsFnc = function(corresponsal) {
                    return $.extend(true, {}, base_options, {
                        titulo: corresponsal.nombre,
                        params: { corresponsal: corresponsal.slug }
                    });
                };
                break;

            case 'regiones':
                optionsFnc = function(region) {
                    return $.extend(true, {}, base_options, {
                        titulo :  self.constructor.regiones_nombres[self.constructor.regiones.indexOf(region)][$(document).controller().idioma],
                        params : { region: region }
                    });
                };
                break;

            case 'fechas':
                optionsFnc = function(fecha) {
                    return $.extend(true, {}, base_options, {
                        titulo : fecha_params[fecha].nombre[$(document).controller().idioma],
                        params : $.extend({}, getFechaParamsFnc(fecha))
                    });
                };
                break;

            case 'popularidad':
                optionsFnc = function(tiempo) {
                    return $.extend(true, {}, base_options, {
                        titulo : fecha_params[tiempo].nombre[$(document).controller().idioma],
                        params : $.extend({ orden: 'popularidad'}, getFechaParamsFnc(tiempo))
                    });
                };
                break;

            case 'secciones':
                optionsFnc = function(categoria) {
                    return $.extend(true, {}, base_options, {
                        titulo : categoria.nombre,
                        params : { categoria: categoria.slug }
                    });
                };
                break;
            case 'busqueda':
                optionsFnc = function(texto) {
                    return $.extend(true, {}, {
                        titulo : 'Búsqueda: ' + texto,
                        numFilasMostradasDefault: 5,
                        params : { texto: texto }
                    });
                };
                break;
            case 'todos':
                optionsFnc = function() {
                    return $.extend(true, {}, base_options, {
                        titulo : 'todos',
                        numFilasMostradasDefault: 10

                    });
                };
                break;
            case 'cargados':
                optionsFnc = function() {
                    return $.extend(true, {}, base_options, {
                        titulo : 'cargados',
                        numFilasMostradasDefault: 10

                    });
                };
                break;
        }

        // crear grupos
        this.crearGrupos(objs, optionsFnc);

        // primer corrida
        if (this.paginacion.ultimoMostrado == this.constructor.ultimoMostradoDefault ) {
            this.element.find('.mas_grupos').show();
        }
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

    /**
     * Se llama cuando cambia la ruta en el hash #!/tipo/modo o cuando se elimina
     * @param ev
     * @param modo
     * @param modo_anterior
     */
    modoSeleccionado : function(ev, modo, modo_anterior) {
        // si no hay un modo especificado, usar default para el tipo
        if (!modo) {
            $.route.attrs({idioma: $(document).controller().idioma, vista: 'lista', v1:this.options.tipo_clip, v2: this.constructor.tipos[this.options.tipo_clip.slug][0]});
            return;
        }

        $(document).controller().modo = modo;

        this.element.find('.grupos').empty();
        this.options.modo = modo;

        if (this.options.tipo_clip != 'busqueda'){

            // ajustar menú a nuevo estado
            this.element.find('.menu_modos a.'+modo).addClass('activo').siblings().removeClass('activo');

            this.paginacion = {
                primeroMostrado: 1,
                ultimoMostrado: this.constructor.ultimoMostradoDefault
            };

            switch (modo) {
                case 'secciones':
                    this.cargarModoSecciones();
                    break;
                case 'programa':
                    this.cargarModoProgramas();
                    break;
                case 'corresponsales':
                    this.cargarModoCorresponsales();
                    break;
                case 'regiones':
                    this.agrupadoresRecibidos(modo, this.constructor.regiones);
                    break;
                case 'fechas':
                    this.agrupadoresRecibidos(modo, Object.keys(this.constructor.fecha_params));
                    break;
                case 'popularidad':
                    this.agrupadoresRecibidos(modo, Object.keys(this.constructor.fecha_params));
                    break;
                case 'todos':
                    this.agrupadoresRecibidos(modo, ['todos']);
                    break;
                case 'cargados':
                    this.agrupadoresRecibidos(modo, ['cargados']);
                    break;
                default:
                    steal.dev.warn('Modo no reconocido: ' + modo);
            }
        } else {
            // búsqueda
            this.agrupadoresRecibidos('busqueda', [$.route.attr('v2')]);
        }

    }

})

});
