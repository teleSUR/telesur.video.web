steal('funcunit').then(function(){

module("Video.Clip", {
	setup: function(){
		S.open("//video/clip/clip.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Video.Clip Demo","demo text");
});


});