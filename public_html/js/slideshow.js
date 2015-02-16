var Slideshow = function(images, container){
	this.container = container;
	this.container.css("width", (images.length * 100) + "%");
	
	this.images = [];
	for( var i in images ){
		var div = $("<div/>",{
			class: 'slide',
			style: 'background-image: url('+images[i]+');'
		}).appendTo(container);
		this.images.push({
			src: images[i],
			div: div
		});
	}
	
	this.currentLocation = 0;
	
	var self = this;
	$(document).keydown(function(ev){
		var move = false;
		if( ev.which === 37 ) { // left
			self.retreat();
		} else if (ev.which === 39) { // right
			self.advance();
		}
	}).click(function(ev){
		if( ev.pageX < $(window).width() ){
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
			this.container.animate({
				"left": -(this.currentLocation*100)+"vw"
			}, 300);
		}
	},
	retreat: function(){
		if( this.currentLocation > 0 ){
			this.currentLocation--;
			this.container.animate({
				"left": -(this.currentLocation*100)+"vw"
			}, 300);
		}
	}
};

