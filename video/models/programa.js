steal('jquery/model', './api_model.js', 'jquery/model/list/local', function(){

/**
 * @class Video.Models.Programa
 * @parent index
 * @inherits Video.Models.ApiModel
 * Wraps backend programa services.
 */
Video.Models.ApiModel('Video.Models.Programa',
    /* @Static */
    {
    },
    /* @Prototype */
    {}
);

$.Model.List.Local("Video.Models.Programa.CookieList");

});