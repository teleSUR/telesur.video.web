steal('funcunit').then(function(){

module("Video.Navegador", { 
	setup: function(){
		S.open("//video/navegador/navegador.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Video.Navegador Demo","demo text");
});


});