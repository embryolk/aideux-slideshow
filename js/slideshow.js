var Slideshow = function(images, container){
	this.container = container;
	this.container.css("width", (images.length * 100) + "%");
	
	this.images = [];
	for( var i in images ){
		var div = $("<img/>",{
			class: 'slide',
			src: images[i].large
		}).appendTo(container);
		this.images.push({
			src: images[i],
			div: div
		});
	}
	
	this.currentLocation = 0;
	
	var self = this;
	$(container).keydown(function(ev){
		var move = false;
		if( ev.which === 37 ) { // left
			self.retreat();
		} else if (ev.which === 39) { // right
			self.advance();
		}
	}).click(function(ev){
		if( ev.pageX < ($(window).width()/2) ){
			self.retreat();
		} else {
			self.advance();
		}
	});
	
};

Slideshow.prototype = {
	advance: function(){
		if( this.currentLocation < this.images.length-1 ){
			this.currentLocation++;
		} else {
			this.currentLocation = 0;
		}
		this.goto(this.images[this.currentLocation]);
	},
	retreat: function(){
		if( this.currentLocation > 0 ){
			this.currentLocation--;
			this.goto(this.images[this.currentLocation]);
		}
	},
	goto: function(image){
		this.container.animate({
			"left": -image.div.position().left
		}, 500);
	}
};

