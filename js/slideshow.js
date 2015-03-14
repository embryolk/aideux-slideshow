var Slideshow = function(outfits, container){
	this.outfits = outfits;
	this.container = container;
	
	var slideshowBox = $("<div/>",{"class":"slideshowBox"}).
			appendTo(container).
			css("width", (outfits.length * 100) + "%");
	
	this.images = [];
	var self = this;
	$.each(outfits, function(i, outfit){
		//var div = $("<div/>",{"class": 'slide'}).appendTo(container);
		var div = $("<img/>",{"class": 'slide',"src": outfit.large}).appendTo(slideshowBox);
		//$("<img/>",{"src": outfits[i].large}).appendTo(div);
				
		//ornaments
		var ornaments = $("<div/>",{"class":"ornaments"}).appendTo(slideshowBox);
		
		/*
		$("<a/>",{"class": 'fa fa-facebook'}).
				click(function(){ self.facebook(outfit); }).
				appendTo(ornaments);
		*/
		$("<a/>",{"class": 'fa fa-pinterest-p'}).
				click(function(){ self.pinterest(i); }).
				appendTo(ornaments);
				
		if( outfits[i].top ){
			var ribbonTop = $("<div/>",{"class": 'ribbon top'}).appendTo(ornaments);
			$("<div/>",{class:"phrase type",text:"The Top"}).appendTo(ribbonTop);
			$("<div/>",{class:"phrase title",text:outfit.top}).appendTo(ribbonTop);
		}
		if( outfits[i].bottom ){
			var ribbonBottom = $("<div/>",{"class": 'ribbon bottom'}).appendTo(ornaments);
			$("<div/>",{class:"phrase type",text:"The Bottom"}).appendTo(ribbonBottom);
			$("<div/>",{class:"phrase title",text:outfit.bottom}).appendTo(ribbonBottom);
		}
		
		self.images.push({ src: outfit, div: div });
		
		div.click(function(idx){ return function(ev){ self.goto(idx); }; }(i) );
	});
	
	
	var imgIdx = Slideshow.getQueryVariable("image");
	if( imgIdx ){
		var imgIdxInt = parseInt(imgIdx);
		if( imgIdxInt < this.images.length && imgIdxInt > -1 ){
			this.currentLocation = imgIdxInt;
		} else {
			this.currentLocation = 0;
		}
	} else {
		this.currentLocation = 0;
	}
	
	$(container).load(function(ev){
		if( self.currentLocation === 0 ){
			self.constrainLeft();
		} else {
			self.goto(self.currentLocation);
		}
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
	},
	facebook: function(idx){
		var outfit = this.outfits[idx];
		FB.ui({
			method: 'share_open_graph',
			action_type: 'og.likes',
			action_properties: JSON.stringify({
				object: "http://www.aideux.com/collections/" + "?image="+idx,
				image: "http://www.aideux.com/collections/" + outfit.medium
			})
		  }, function(response){});
	},
	pinterest: function(idx){
		var outfit = this.outfits[idx];
		
		var pinterestUrl = 'http://www.pinterest.com/pin/create/button/'+
				'?url='+encodeURI("http://www.aideux.com/collections/"+"?image="+idx)+
				'&media='+encodeURI("http://www.aideux.com/collections/" + outfit.medium)+
				'&description='+encodeURI(Slideshow.describeOutfit(outfit) + " from @Aideux");
		window.open(pinterestUrl, 'Aideux | Pin It', 'resizable,scrollbars,status');
	}
};

Slideshow.getQueryVariable = function(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
			if(pair[0] === variable){
				return pair[1];
			}
	}
	return(false);
};
Slideshow.describeOutfit = function(outfit){
	var ret = '';
	if( outfit.cape ){
		ret = outfit.cape;
	}
	if( outfit.top ){
		if( outfit.cape ){
			if( outfit.bottom ){
				ret += ", ";
			} else {
				ret += " and ";
			}
		}
		ret += outfit.top;
	}
	if( outfit.bottom ){
		if( outfit.cape && outfit.top ){
			ret += ', and ';
		} else if( outfit.cape || outfit.top ){
			ret += ' and ';
		}
		ret += outfit.bottom;
	}
	return ret;
};


// Facebook
  window.fbAsyncInit = function() {
	FB.init({
	  appId      : '1024906594204931',
	  xfbml      : true,
	  version    : 'v2.1'
	});
  };

  (function(d, s, id){
	 var js, fjs = d.getElementsByTagName(s)[0];
	 if (d.getElementById(id)) {return;}
	 js = d.createElement(s); js.id = id;
	 js.src = "//connect.facebook.net/en_US/sdk.js";
	 fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
   
// Pinterest
   (function(d){
    var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
    p.type = 'text/javascript';
    p.async = true;
    p.src = '//assets.pinterest.com/js/pinit.js';
    f.parentNode.insertBefore(p, f);
}(document));