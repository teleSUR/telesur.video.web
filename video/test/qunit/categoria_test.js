steal("funcunit/qunit", "video/fixtures", "video/models/categoria.js", function(){
	module("Model: Video.Models.Categoria")
	
	test("findAll", function(){
		expect(4);
		stop();
		Video.Models.Categoria.findAll({}, function(categorias){
			ok(categorias)
	        ok(categorias.length)
	        ok(categorias[0].name)
	        ok(categorias[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Video.Models.Categoria({name: "dry cleaning", description: "take to street corner"}).save(function(categoria){
			ok(categoria);
	        ok(categoria.id);
	        equals(categoria.name,"dry cleaning")
	        categoria.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Video.Models.Categoria({name: "cook dinner", description: "chicken"}).
	            save(function(categoria){
	            	equals(categoria.description,"chicken");
	        		categoria.update({description: "steak"},function(categoria){
	        			equals(categoria.description,"steak");
	        			categoria.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Video.Models.Categoria({name: "mow grass", description: "use riding mower"}).
	            destroy(function(categoria){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})