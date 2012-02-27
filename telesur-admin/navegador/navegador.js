steal('video/navegador') // controlador base
.then('telesur-admin/grupo') // redefinir controlador
.then('./navegador.less') // CSS

.then(function() {

/**
 * @class Video.Navegador
 */
delete $.fn['video_navegador']; // permite volver a registrar el jquery plugin generado
Video.Navegador('Video.Navegador',
    /** @Static */
    {
        init : function() {
            $.extend(this.modos, {
                'todos' : { nombre: {es: 'todos', en: 'all', pt: 'todos' } },
                'cargados' : { nombre: {es: 'cargados', en: 'cargados', pt: 'cargados' } }
            });

            var self = this;
            $.each(this.tipos, function(tipo, modos) {
                self.tipos[tipo].unshift('cargados');
                self.tipos[tipo].unshift('todos');
            });
        }

    },
    /** @Prototype */
    {
    }
)
});
