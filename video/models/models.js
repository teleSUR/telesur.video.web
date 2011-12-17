steal("jquery/model", function() {
    $.Class('Video.Models.VideoApi',
        { // static
            ajaxErrorFnc : function(xhr, textStatus, errorThrown ) {
                alert('a');
                steal.dev.log('Error en la respuesta');
                if (textStatus == 'timeout' || xhr.status == 503) {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        //try again
                        $.ajax(this);
                        return;
                    }
                    alert('Error... Volviendo a intentar hasta: ' + this.retryLimit + ' veces.');
                    return;
                }
                if (xhr.status == 500) {
                    alert('Oops! Error interno en la respuesta del API, RPEORTAR!!');
                } else {
                    alert('Oops! Error: ' + textStatus);
                }
            }
        },
        { // prototype
        });
});
steal('./tipo_clip.js', './clip.js', './programa.js', './categoria.js');