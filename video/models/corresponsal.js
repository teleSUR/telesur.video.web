steal('jquery/model', './api_model.js', 'jquery/model/list/cookie', function(){

/**
 * @class Video.Models.Corresponsal
 * @parent index
 * @inherits Video.Models.ApiModel
 * Wraps backend corresponsal services.
 */
Video.Models.ApiModel('Video.Models.Corresponsal',
    /* @Static */
    {
    },
    /* @Prototype */
    {}
);

$.Model.List.Cookie("Video.Models.Corresponsal.CookieList", {days: 1});

});
