var Fadeshow = function(images, container){
	this.container = container;
	this.container.css("width", (images.length * 100) + "%");
	
	var opaque = '1';
	this.images = [];
	for( var i in images ){
		var div = $("<div/>",{
			class: 'slide',
			style: 'background-image: url('+images[i]+'); opacity: '+opaque+';'
		}).appendTo(container);
		this.images.push({
			src: images[i],
			div: div
		});
		opaque = '0';
	}
	
	this.currentLocation = 0;
	
	var self = this;
	this.interval = setInterval( function(){ self.advance(); }, 7000);
	
};

Fadeshow.FADE_SPEED = 800;

Fadeshow.prototype = {
	advance: function(){
		this.images[this.currentLocation].div.animate({
			"opacity": 0
		}, Fadeshow.FADE_SPEED);
		
		if( this.currentLocation < this.images.length-1 ){
			this.currentLocation++;
		} else {
			this.currentLocation = 0;
		}
		this.images[this.currentLocation].div.animate({
			"opacity": 1
		}, Fadeshow.FADE_SPEED);
	},
	retreat: function(){
		if( this.currentLocation > 0 ){
			this.currentLocation--;
			this.container.animate({
				"opacity": 1
			}, 300);
		}
	}
};

