steal('funcunit').then(function(){

module("Video.Pagina", {
	setup: function(){
		S.open("//video/pagina/pagina.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Video.Pagina Demo","demo text");
});


});