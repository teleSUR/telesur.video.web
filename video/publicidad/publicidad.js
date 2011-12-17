steal( 'jquery/controller','jquery/view/ejs' )
	.then( './views/init.ejs', function($){

/**
 * @class Video.Publicidad
 */
$.Controller('Video.Publicidad',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html("//video/publicidad/views/init.ejs",{
			message: "Hello World"
		});
	}
})

});