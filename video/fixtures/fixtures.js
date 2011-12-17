// map fixtures for this application

steal({ src: "jquery/dom/fixture", ignore: true}, function(){
	$.fixture.make("clip", 5, function(i, clip){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "clip "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("programa", 5, function(i, programa){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "programa "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("categoria", 5, function(i, categoria){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "categoria "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("tipo_clip", 5, function(i, tipo_clip){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "tipo_clip "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
});