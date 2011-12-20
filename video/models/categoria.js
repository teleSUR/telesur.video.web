steal('jquery/model', './api_model.js', 'jquery/model/list/cookie', function(){

/**
 * @class Video.Models.Categoria
 * @parent index
 * @inherits Video.Models.ApiModel
 * Wraps backend categoria services.
 */
Video.Models.ApiModel('Video.Models.Categoria',
    /* @Static */
    {
    },
    /* @Prototype */
    {}
);

$.Model.List.Cookie("Video.Models.Categoria.CookieList", {days: 1});

});