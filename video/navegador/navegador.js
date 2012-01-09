// recursos
steal('../resources/jquery.dateFormat.js')
// Estilos
.then('steal/less').then('./navegador.less')


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

    pagina_controller : $("#pagina").controller(),
    navegador_controller : $("#navegador").controller(),
    current_date: new Date(),

    cargarGruposEnPasos : 2,
    ultimoMostradoDefault: 4,

    tipos: {
        'noticia': ['secciones', 'regiones', 'fechas', 'popularidad'],
        'entrevista': ['secciones', 'regiones', 'fechas', 'popularidad'],
        'programa': ['programa', 'fechas'],
        'documental': ['secciones', 'fechas'],
        'reportaje': ['secciones', 'fechas']
    },

    modos: {
        secciones: { nombre: 'secciones' },
        regiones: { nombre: 'regiones' },
        fechas: { nombre: 'cronología'},
        programa: { nombre: 'programas'},
        popularidad: { nombre: 'populares'}
    },

    regiones: ['america-latina', 'america', 'europa', 'asia', 'africa', 'oceania'],

    fecha_params: {
        hoy: {
            nombre : 'Hoy',
            params : { tiempo: 'dia' },
            dias_diff : { hasta: 0  }
        },
        ayer: {
            nombre : 'Ayer',
            params : { tiempo: 'dia' },
            dias_diff : { hasta: 1 }
        },
        ultima_semana: {
            nombre : 'Última semana',
            params : { tiempo: 'semana' },
            dias_diff : { hasta: 2 }
        },
        ultimo_mes: {
            nombre : 'Último mes',
            params : { tiempo: 'mes' },
            dias_diff : { hasta: 9 }
        },
        ultimo_ano: {
            nombre : 'Último año',
            params : { tiempo: 'ano' },
            dias_diff : { hasta: 39 }
        },
        siempre: {
            nombre : 'Siempre',
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

        this.paginacion = {
            primeroMostrado: 1,
            ultimoMostrado: this.constructor.ultimoMostradoDefault
        };

        this.options.modo = $.route.attr("modo");

        // detectar cuando el scroll llega al final
        // para cargar más grupos automáticamente
        var self = this;
        $(window).scroll(function(){
            if  ($(window).scrollTop() == $(document).height() - $(window).height()){
                if (self) {
                    self.element.find('.mas_grupos').addClass('cargando');
                    self.mostrarMasGrupos();
                }
            }
        });

        // callbacks de rutas
        $.route.delegate('v2', 'set', this.callback('modoSeleccionado'));
        //$.route.delegate('v2', 'remove', this.callback('modoSeleccionado'));

        // inicia proceso para llenar los datos en el navegador,
        // trae los grupos a mostrar y éstos los clips a mostrar
        this.cambiarTipo(this.options.tipo_clip);
	},


    cambiarTipo : function(tipo_clip) {
        this.options.tipo_clip = tipo_clip;
        this.options.modo = $.route.attr('v2');

        var menu_modos = this.element.find('.menu_modos');

        // actualizar botón con el nombre del tipo en plural
        menu_modos.find('.tipo').html(tipo_clip.nombre_plural);

        // Consturir menú de modos
        menu_modos.empty();

        var modos = this.constructor.modos;
        $.each(this.constructor.tipos[tipo_clip.slug], function(i, modo) {
            $('<a>').attr('href', $.route.url({vista: Video.Pagina.vistas.lista.nombre, v1: tipo_clip.slug, v2: modo}))
                .html(modos[modo].nombre.toUpperCase())
                .addClass(modo)
                .appendTo(menu_modos);
        });


        // Si ya había un modo seleccionado, checar si el nuevo tipo soporta
        // el mismo modo, si no, cambiar el modo al default (el primero)
        var modos_disponibles = this.constructor.tipos[tipo_clip.slug];
        var modo_adecuado = (!this.options.modo || modos_disponibles.indexOf(this.options.modo) == -1) ? modos_disponibles[0] : this.options.modo;

        // Cambiar la ruta si es necesario (puede activar callbacks en $.route)
        $.route.attrs({vista : Video.Pagina.vistas.lista.nombre, v1 : tipo_clip.slug, v2: modo_adecuado});
    },

    cargarModoSecciones : function() {
        // crear e intentar poblar store de cookie para categorias
        this.categorias = new Video.Models.Categoria.CookieList([]).retrieve("categorias");
        // solicitar tipos en caso de que no estén en cache
        // en cualquier caso el control pasa a this.tiposRecibidos
        if (this.categorias.length > 0) {
            steal.dev.log('{naegador} usando categorías en store de cookie');
            this.agrupadoresRecibidos('secciones', this.categorias);
        } else {
            steal.dev.log('{naegador} sin categorías en store de cookie, solicitando a servicio');
            var self = this;
            Video.Models.Categoria.findAll({}, function(categorias) {
                if (self) {
                    steal.dev.log('{naegador} añadiendo categorías recibidos a store de cookie');
                    self.categorias = new Video.Models.Categoria.CookieList(categorias).store("categorias");
                    self.agrupadoresRecibidos('secciones', self.categorias);
                } else {
                    steal.dev.log('{naegador} No se pudieron recibir categorías, no existe objeto navegador');
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
            steal.dev.log('{naegador} usando categorías en store de cookie');
            this.agrupadoresRecibidos('programas', this.programas);
        } else {
            steal.dev.log('{naegador} sin programas en store de cookie, solicitando a servicio');
            var self = this;
            Video.Models.Programa.findAll({}, function(programas) {
                if (self) {
                    steal.dev.log('{naegador} añadiendo programas recibidos a store de cookie');
                    self.programas = new Video.Models.Programa.CookieList(programas).store("programas");
                    self.agrupadoresRecibidos('programas', self.programas);
                } else {
                    steal.dev.log('{naegador} No se pudieron recibir programas, no existe objeto navegador');
                }
            });
        }
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
            console.log('se acaba de crear controlador para grupo: '+ grupo);
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
            base_options = { titulo : 'grupo', params : { tipo: tipo.slug }};

        switch (modo) {
            case 'programas':
                optionsFnc = function(programa) {
                    return $.extend(true, {}, base_options, {
                        titulo: programa.nombre,
                        params: { programa: programa.slug }
                    });
                };
                break;

            case 'regiones':
                optionsFnc = function(region) {
                    return $.extend(true, {}, base_options, {
                        titulo : region,
                        params : { region: region }
                    });
                };
                break;

            case 'fechas':
                optionsFnc = function(fecha) {
                    return $.extend(true, {}, base_options, {
                        titulo : fecha_params[fecha].nombre,
                        params : $.extend({}, getFechaParamsFnc(fecha))
                    });
                };
                break;

            case 'popularidad':
                optionsFnc = function(tiempo) {
                    return $.extend(true, {}, base_options, {
                        titulo : fecha_params[tiempo].nombre,
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
            $.route.attr("v2", this.constructor.tipos[this.options.tipo_clip.slug][0]);
            return;
        }

        this.element.find('.grupos').empty();

        this.options.modo = modo;

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
            case 'regiones':
                this.agrupadoresRecibidos(modo, this.constructor.regiones);
                break;
            case 'fechas':
                this.agrupadoresRecibidos(modo, Object.keys(this.constructor.fecha_params));
                break;
            case 'popularidad':
                this.agrupadoresRecibidos(modo, Object.keys(this.constructor.fecha_params));
                break;
            default:
                steal.dev.warn('Modo no reconocido: ' + modo);
        }
    }

})

});