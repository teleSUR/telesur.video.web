steal("funcunit/qunit", "video/fixtures", "video/models/programa.js", function(){
	module("Model: Video.Models.Programa")
	
	test("findAll", function(){
		expect(4);
		stop();
		Video.Models.Programa.findAll({}, function(programas){
			ok(programas)
	        ok(programas.length)
	        ok(programas[0].name)
	        ok(programas[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Video.Models.Programa({name: "dry cleaning", description: "take to street corner"}).save(function(programa){
			ok(programa);
	        ok(programa.id);
	        equals(programa.name,"dry cleaning")
	        programa.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Video.Models.Programa({name: "cook dinner", description: "chicken"}).
	            save(function(programa){
	            	equals(programa.description,"chicken");
	        		programa.update({description: "steak"},function(programa){
	        			equals(programa.description,"steak");
	        			programa.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Video.Models.Programa({name: "mow grass", description: "use riding mower"}).
	            destroy(function(programa){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})