steal('jquery/model', './api_model.js', 'jquery/model/list/cookie', function(){

/**
 * @class Video.Models.TipoClip
 * @parent index
 * @inherits Video.Models.ApiModel
 * Wraps backend tipo_clip services.
 */
Video.Models.ApiModel('Video.Models.TipoClip',
    /* @Static */
    {
    },
    /* @Prototype */
    {}
);

$.Model.List.Cookie("Video.Models.TipoClip.CookieList", {days: 5});

});