steal("jquery/model", './api_model.js')
.then('./tipo_clip.js', './clip.js', './programa.js', './categoria.js', './corresponsal.js', './tema.js', './pais.js', './entrevistado.js', './personaje')
.then(function(){
    jQuery.ajaxSetup({ cache: false });
});
