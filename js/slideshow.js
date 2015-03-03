var Slideshow = function(outfits, container){
	this.container = container;
	this.container.css("width", (outfits.length * 100) + "%");
	
	this.images = [];
	for( var i in outfits ){
		//var div = $("<div/>",{"class": 'slide'}).appendTo(container);
		var div = $("<img/>",{"class": 'slide',"src": outfits[i].large}).appendTo(container);
		//$("<img/>",{"src": outfits[i].large}).appendTo(div);
		
		// ribbons
		var ribbons = $("<div/>",{"class":"ribbons"}).appendTo(container);
		$("<div/>",{"class": 'ribbon top','text': outfits[i].top}).appendTo(ribbons);
		$("<div/>",{"class": 'ribbon bottom', 'text': outfits[i].bottom}).appendTo(ribbons);
		
		this.images.push({
			src: outfits[i],
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

