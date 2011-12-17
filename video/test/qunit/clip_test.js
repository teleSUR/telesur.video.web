steal("funcunit/qunit", "video/fixtures", "video/models/clip.js", function(){
	module("Model: Video.Models.Clip")
	
	test("findAll", function(){
		expect(4);
		stop();
		Video.Models.Clip.findAll({}, function(clips){
			ok(clips)
	        ok(clips.length)
	        ok(clips[0].name)
	        ok(clips[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Video.Models.Clip({name: "dry cleaning", description: "take to street corner"}).save(function(clip){
			ok(clip);
	        ok(clip.id);
	        equals(clip.name,"dry cleaning")
	        clip.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Video.Models.Clip({name: "cook dinner", description: "chicken"}).
	            save(function(clip){
	            	equals(clip.description,"chicken");
	        		clip.update({description: "steak"},function(clip){
	        			equals(clip.description,"steak");
	        			clip.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Video.Models.Clip({name: "mow grass", description: "use riding mower"}).
	            destroy(function(clip){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})