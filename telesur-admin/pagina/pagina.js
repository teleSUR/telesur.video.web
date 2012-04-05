steal('video/pagina' ) // controlador base
.then('telesur-admin/navegador') // redefinir navegador
.then('./pagina.less') // CSS

.then('telesur-admin/resources/fileuploader.js')
.then('telesur-admin/resources/fileuploader.js')

.then(function() {

/**
 * @class Video.Pagina
 */
delete $.fn['video_pagina']; // permite volver a registrar el jquery plugin generado
Video.Pagina('Video.Pagina',
/** @Static */
{
},
/** @Prototype */
{
    init : function() {
        this._super();

        $("#pagina").append('<div class="nuevo_boton" />');
        $("#cabeza").empty();
        $("#abajo").remove();
    },

    toggleMenuIdioma : function() {
        // nada
    },

//    init : function() {
//        steal.dev.log('inicializando Video.Pagina');
//
//        this.idioma = 'es';
//
//        // cargar estructura inicial de la página
//        this.element.find('body').html("//video/pagina/views/init.ejs", {});
//        $("#pagina").append('<div class="nuevo_boton" />');
//        $("#cabeza, #abajo").empty();
//
//        this.idioma = 'es';
//
//        // rutas
//        $.route('es/:vista/:v1/:v2');
//        $.route('es/:vista/:v1');
//        $.route('es/:vista');
////        $.route('es/:idioma');
//
////        $.route.delegate('idioma', 'set', this.callback('idiomaSeleccionado'));
//        $.route.delegate('vista', 'set', this.callback('vistaSeleccionada'));
//        $.route.delegate('v1', 'set', this.callback('v1Callback'));
//
//        $.route.ready(true);
//
////        if (!$.route.attr('idioma')) {
////            $.route.attrs({'idioma': 'es'});
////        }
//
//        if (!$.route.attr('vista')) {
//            //alert('mi '+$.route.attrs().toSource());
//            $.route.attrs({'vista': 'lista' });
//            //alert('aaa' + $.route.attrs().toSource());
//        }
//
//        //  alert($.route.attr('idioma'));
//        //$.route.bind('change', this.callback('navegacionCambiada'));
//    },

    '.nuevo_boton click' : function(el, ev) {
        var element = this.element,
            modal = $('<div class="nuevo_form editar_form" />')
                .append('//telesur-admin/clip/views/nuevo_form.ejs', {}).hide()
                .mxui_layout_modal({
                    overlay: true,
                    destroyOnHide: true
                })
                .appendTo('#centro');

        var self = this;
        this.uploader = new qq.FileUploader({
            element: document.getElementById('uploader'),
            action: "/upload/",

            onStart: function() {
                $('.nuevo_form .archivo_status').empty().removeClass('success').removeClass('error');
            },

            onComplete: function(id, fileName, responseJSON){

                if (responseJSON.error) {
                    $('.nuevo_form .archivo_status').html("<h5>ERROR: "+responseJSON.error).addClass('error').removeClass('success');
                    $('.qq-upload-fail').empty();
                }
                if (self && responseJSON.id) {
                    self.archivo_id = responseJSON.id;
                    $('.nuevo_form .archivo_status').html("Archivo válido").addClass('success').removeClass('error');
                    $('.nuevo_form button.guardar').removeAttr('disabled');
                    $('#uploader').hide();
                }

            }
            // additional data to send, name-value pairs
        });

//        modal.controller().original_hide = modal.controller().hide;
//        modal.controller().hide = function(){
//            this.original_hide();
//            if (element) {
//                element.css({background: 'inherit'});
//            }
//        }
    },

    '.nuevo_form button.cancelar click' : function(el, ev) {
        $(el).parents('.nuevo_form').trigger('hide');
    },

    '.nuevo_form button.guardar click' : function(el, ev) {
        //$(el).parents('.nuevo_form').trigger('hide');

        $.ajax({
            url: 'http://captura.tlsur.net/crear/',
            dataType: 'json',
            type: 'POST',
            data: {
                archivo_id: this.archivo_id,
                titulo: $('#titulo').val(),
                descripcion: $('#descripcion').val(),
                categoria: $('#categoria').val(),
                programa: $('#programa').val(),
                ciudad: $('#ciudad').val(),
                pais: $('#pais').val(),
                tipo: $('#tipo').val()
            },
            success: this.callback('clipCreado'),
            error: this.callback('clipCreadoError')
        });

        $('.nuevo_form .procesando').html("Procesando...");

        $(el).attr('disabled', 'disabled');

    },

    clipCreado : function(json) {
        alert("Video agregado corectamente. Puede tardar unos minutos en procesarse según la cola de trabajo.");
        $('.nuevo_form').trigger('hide');
        delete this.archivo_id;
    },

    clipCreadoError : function() {
        return this.clipCreado();
        //alert("error al crear nuevo clip");
    },

    '.nuevo_form input#archivo change' : function(el, ev) {

        var uploader = new qq.FileUploader({
            element: document.getElementById('archivo'),
            action: '/upload/'
            // additional data to send, name-value pairs
        });
//
//        $.ajaxFileUpload({
//            url: "/upload/",
//            //url: "http://telesur.kgdesignes.net/files/",
//            secureuri: false,
//            fileElementId:'archivo',
//            dataType: 'text',
//            success: function (data, status) {
//                alert(data);
//            },
//            error: function (data, status, e)
//            {
//                alert(data);
//            }
//        });
    }
}
);
});
