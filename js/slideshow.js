var Slideshow = function(outfits, container){
	this.container = container;
	
	var slideshowBox = $("<div/>",{"class":"slideshowBox"}).
			appendTo(container).
			css("width", (outfits.length * 100) + "%");
	
	this.images = [];
	var self = this;
	for( var i in outfits ){
		//var div = $("<div/>",{"class": 'slide'}).appendTo(container);
		var div = $("<img/>",{"class": 'slide',"src": outfits[i].large}).appendTo(slideshowBox);
		//$("<img/>",{"src": outfits[i].large}).appendTo(div);
				
		//ornaments
		var ornaments = $("<div/>",{"class":"ornaments"}).appendTo(slideshowBox);
		$("<a/>",{"class": 'fa fa-facebook','href': outfits[i].top}).appendTo(ornaments);
		$("<a/>",{"class": 'fa fa-pinterest-p', 'href': outfits[i].bottom}).appendTo(ornaments);
		if( outfits[i].top ){
			var ribbonTop = $("<div/>",{"class": 'ribbon top'}).appendTo(ornaments);
			$("<div/>",{class:"phrase type",text:"The Top"}).appendTo(ribbonTop);
			$("<div/>",{class:"phrase title",text:outfits[i].top}).appendTo(ribbonTop);
		}
		if( outfits[i].bottom ){
			var ribbonBottom = $("<div/>",{"class": 'ribbon bottom'}).appendTo(ornaments);
			$("<div/>",{class:"phrase type",text:"The Bottom"}).appendTo(ribbonBottom);
			$("<div/>",{class:"phrase title",text:outfits[i].bottom}).appendTo(ribbonBottom);
		}
		
		this.images.push({ src: outfits[i], div: div });
		
		div.click(function(idx){ return function(ev){ self.goto(idx); }; }(i) );
	}
	
	this.currentLocation = 0;
	$(container).load(function(ev){
		self.constrainLeft();
	});
	
	$(document).keydown(function(ev){
		if( ev.which === 37 ) { // left
			self.retreat();
		} else if (ev.which === 39) { // right
			self.advance();
		}
	}).click(function(ev){
		/*
		if( ev.pageX < ($(window).width()/2) ){
			self.retreat();
		} else {
			self.advance();
		}
		*/
	});
	
	$( window ).resize(function() {
		self.center(self.currentLocation);
	});
};

Slideshow.prototype = {
	advance: function(){
		if( this.currentLocation < this.images.length-1 ){
			this.currentLocation++;
		} else {
			this.currentLocation = 0;
		}
		this.goto(this.currentLocation);
	},
	retreat: function(){
		if( this.currentLocation > 0 ){
			this.currentLocation--;
			this.goto(this.currentLocation);
		}
	},
	leftiness: function(location){
		var image = this.images[location];
		var leftiness = -image.div.position().left;
		leftiness += $(window).width()/2;
		leftiness -= image.div.width()/2;
		return leftiness;
	},
	goto: function(location){
		this.currentLocation = location;
		var leftiness = this.leftiness(location);
		leftiness = Math.min(leftiness,0);
		this.container.animate({
			"left": leftiness
		}, 500);
	},
	center: function(location){
		this.currentLocation = location;
		this.container.css({
			"left": this.leftiness(location)
		});
	},
	constrainLeft: function(){
		this.container.css({
			"left": 0
		});
	}
};

