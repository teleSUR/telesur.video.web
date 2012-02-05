steal('video/clip') // controlador base
.then('./clip.less') // CSS

.then( './views/init.ejs', 'mxui/layout/modal', function($){

/**
 * @class Video.Clip
 */
delete $.fn['video_clip']; // permite volver a registrar el jquery plugin generado
Video.Clip('Video.Clip',
    /** @Static */
    {
        clip_template: '//telesur-admin/clip/views/init.ejs'
    },
    /** @Prototype */
    {
        '.despublicar click' : function(el, ev) {
            ev.preventDefault();

            this.element.css({background: 'yellow'});
            if (confirm('Confirme si desea despublicar este clip')) {
                $.ajax({
                    url: 'http://captura.tlsur.net/despublicar/',
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        slug: this.options.clip.slug
                    },
                    success: this.callback('clipDespublicado'),
                    error: this.callback('clipDespublicadoError')
                });

            } else {

            }

            this.element.css({background: 'inherit'});
        },

        clipDespublicado : function() {
            this.element.slideUp();
        },

        clipDespublicadoError : function() {
            this.clipDespublicado();
        },



        '.editar click' : function(el, ev) {
            ev.preventDefault();

            this.element.css({background: 'yellow'});

            var element = this.element,
                modal = $('<div class="editar_form" />')
                    .append('//telesur-admin/clip/views/editar_form.ejs', {clip: this.options.clip}).hide()
                    .mxui_layout_modal({
                        overlay: true,
                        destroyOnHide: true
                    })
                    .appendTo(this.element);


            modal.controller().original_hide = modal.controller().hide;
            modal.controller().hide = function(){
                this.original_hide();
                if (element) {
                    element.css({background: 'inherit'});
                }
            };

            //this.element.css({background: 'inherit'});
            //$('<div />').hide().appendTo(this.element).
        },


        '.editar_form button.cancelar click' : function(el, ev) {
            $('.editar_form').controller().hide();
        },

        '.editar_form button.guardar click' : function(el, ev) {

            $.ajax({
                url: 'http://captura.tlsur.net/editar/',
                dataType: 'json',
                type: 'POST',
                data: {
                    slug: this.options.clip.slug,
                    titulo: $('#titulo').val(),
                    descripcion: $('#descripcion').val()
                },
                success: this.callback('clipEditado'),
                error: this.callback('clipEditadoError')
            });

            $(el).attr('disabled', 'disabled');
        },

        clipEditado : function() {
            this.element.find('.titulo').html($('#titulo').val());
            this.element.find('.descripcion').html($('#descripcion').val());
            $('.editar_form').controller().hide();
        },

        clipEditadoError : function() {
            return this.clipEditado();
            //$('.editar_form').controller().hide();
        }

    }
);
});
