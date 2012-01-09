steal("funcunit", function(){
	module("telesur-admin test", { 
		setup: function(){
			S.open("//telesur-admin/telesur-admin.html");
		}
	});
	
	test("Copy Test", function(){
		equals(S("h1").text(), "Welcome to JavaScriptMVC 3.2!","welcome text");
	});
})