steal('funcunit').then(function(){

module("Video.Filtrador", { 
	setup: function(){
		S.open("//video/filtrador/filtrador.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Video.Filtrador Demo","demo text");
});


});