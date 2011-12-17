steal("funcunit", function(){
	module("video test", { 
		setup: function(){
			S.open("//video/video.html");
		}
	});
	
	test("Copy Test", function(){
		equals(S("h1").text(), "Welcome to JavaScriptMVC 3.2!","welcome text");
	});
})