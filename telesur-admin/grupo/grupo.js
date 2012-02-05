steal('video/grupo') // controlador base
.then('telesur-admin/clip') // redefinir controlador
.then('./grupo.less') // CSS

.then(function() {
/**
 * @class Video.Grupo
 */
delete $.fn['video_grupo']; // permite volver a registrar el jquery plugin generado
Video.Grupo('Video.Grupo',
    /** @Static */
    {
        alturaFile : 175,

        paramsDefault : { detalle: 'completo' },

        init : function() {
          //  this._super();

            $.extend(this.defaults, {
                numClipsPorFila : 1,
                numFilasMostradasDefault : 5,
                numFilasMaximo: 5,
                numFilasAlVerMas: 2,
                numFilasCache : 2
            });

        }
    },
    /** @Prototype */
    {

    }
)
});