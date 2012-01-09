steal( 'jquery/controller','jquery/view/ejs' )
	.then( './views/init.ejs', function($){

/**
 * @class Video.Buscador
 */
$.Controller('Video.Buscador',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html("//video/buscador/views/init.ejs",{
			message: "Hello World"
		});
	}
})

});