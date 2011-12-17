steal("funcunit/qunit", "video/fixtures", "video/models/tipo.js", function(){
	module("Model: Video.Models.Tipo")
	
	test("findAll", function(){
		expect(4);
		stop();
		Video.Models.Tipo.findAll({}, function(tipos){
			ok(tipos)
	        ok(tipos.length)
	        ok(tipos[0].name)
	        ok(tipos[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Video.Models.Tipo({name: "dry cleaning", description: "take to street corner"}).save(function(tipo){
			ok(tipo);
	        ok(tipo.id);
	        equals(tipo.name,"dry cleaning")
	        tipo.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Video.Models.Tipo({name: "cook dinner", description: "chicken"}).
	            save(function(tipo){
	            	equals(tipo.description,"chicken");
	        		tipo.update({description: "steak"},function(tipo){
	        			equals(tipo.description,"steak");
	        			tipo.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Video.Models.Tipo({name: "mow grass", description: "use riding mower"}).
	            destroy(function(tipo){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})