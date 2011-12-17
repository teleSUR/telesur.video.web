steal("funcunit/qunit", "video/fixtures", "video/models/tipo_clip.js", function(){
	module("Model: Video.Models.TipoClip")
	
	test("findAll", function(){
		expect(4);
		stop();
		Video.Models.TipoClip.findAll({}, function(tipo_clips){
			ok(tipo_clips)
	        ok(tipo_clips.length)
	        ok(tipo_clips[0].name)
	        ok(tipo_clips[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Video.Models.TipoClip({name: "dry cleaning", description: "take to street corner"}).save(function(tipo_clip){
			ok(tipo_clip);
	        ok(tipo_clip.id);
	        equals(tipo_clip.name,"dry cleaning")
	        tipo_clip.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Video.Models.TipoClip({name: "cook dinner", description: "chicken"}).
	            save(function(tipo_clip){
	            	equals(tipo_clip.description,"chicken");
	        		tipo_clip.update({description: "steak"},function(tipo_clip){
	        			equals(tipo_clip.description,"steak");
	        			tipo_clip.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Video.Models.TipoClip({name: "mow grass", description: "use riding mower"}).
	            destroy(function(tipo_clip){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})