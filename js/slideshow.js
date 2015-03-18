var Slideshow = function(outfits, container){
	this.outfits = outfits;
	this.container = container;
	
	this.minLeft = 0;
	this.canCreep = 0;
	this.atEnd = false;
	this.scrolled = 0;
	this.concernWidth = 0;
	
	var self = this;
	
	this.slideshowBox = $("<div/>",{"class":"slideshowBox"}).
			css("width", (outfits.length * 100) + "%");
	/*
	this.movers = {
		advance: $("<div/>",{"class":"mover advance"}).
				appendTo(container).
				click(function(ev){ self.advance(); }),
		retreat: $("<div/>",{"class":"mover retreat"}).
				appendTo(container).
				click(function(ev){ self.retreat(); })
	};
	*/
	
	this.images = [];
	$.each(outfits, function(i, outfit){
		//var div = $("<div/>",{"class": 'slide'}).appendTo(container);
		var div = $("<img/>",{
			"class": 'slide',
			"src": outfit.large
		}).appendTo(self.slideshowBox).
		on("load", function(ev){
			self.refreshMinLeft();
		});
		//$("<img/>",{"src": outfits[i].large}).appendTo(div);
				
		//ornaments
		var ornaments = $("<div/>",{"class":"ornaments"}).appendTo(self.slideshowBox);
		
		/*
		$("<a/>",{"class": 'fa fa-facebook'}).
				click(function(){ self.facebook(outfit); }).
				appendTo(ornaments);
		*/
		$("<a/>",{"class": 'fa fa-pinterest-p'}).
				click(function(){ self.pinterest(i); }).
				appendTo(ornaments);
				
		if( outfit.top ){
			var ribbonTop = $("<div/>",{"class": 'ribbon top'}).appendTo(ornaments);
			$("<div/>",{class:"phrase type",text:"The Top"}).appendTo(ribbonTop);
			$("<div/>",{class:"phrase title",text:outfit.top.name}).appendTo(ribbonTop);
			ribbonTop.click(function(ev){
				if( ribbonTop.hasClass("chosen") ){
					self.undescribe(ornaments);
				} else {
					self.describe(outfit.top, ornaments, ribbonTop);
				}
			});
		}
		if( outfit.bottom ){
			var ribbonBottom = $("<div/>",{"class": 'ribbon bottom'}).appendTo(ornaments);
			$("<div/>",{class:"phrase type",text:"The Bottom"}).appendTo(ribbonBottom);
			$("<div/>",{class:"phrase title",text:outfit.bottom.name}).appendTo(ribbonBottom);
			ribbonBottom.click(function(ev){
				if( ribbonBottom.hasClass("chosen") ){
					self.undescribe(ornaments);
				} else {
					self.describe(outfit.bottom, ornaments, ribbonBottom);
				}
			});
		}
		
		self.images.push({ src: outfit, div: div });
		
		//div.click(function(idx){ return function(ev){ self.goto(idx); }; }(i) );
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
	
	/*
	// Creeping
	$(container).mousemove(function(ev){
		if( self.canCreep ){
			var creepThreshLeft = document.documentElement.clientWidth * 0.2;
			var creepThreshRight = document.documentElement.clientWidth * 0.8;

			if( ev.pageX < creepThreshLeft ){
				self.creepStep = (ev.pageX - creepThreshLeft) / 20;
			} else if( ev.pageX > creepThreshRight ){
				self.creepStep = (ev.pageX - creepThreshRight) / 20;
			} else {
				self.stopCreeping();
			}
			
			if( self.creepStep !== 0 && !self.creepInterval ){
				self.creepInterval = setInterval( function(){ 
					self.creep(); 
				}, 20 );
			}
		}
	}).mouseover(function(ev){
		self.canCreep = true;
	}).mouseout(function(ev){
		self.stopCreeping();
		self.canCreep = false;
	});

	$(document).mouseleave(function(ev){
		self.stopCreeping();
		self.canCreep = false;
	});
	*/
   
   $(container).bind('mousewheel', function(e){
		self.inch(-e.originalEvent.wheelDelta);
	});
		
	this.slideshowBox.load(function(ev){
		if( self.currentLocation === 0 ){
			self.constrainLeft();
		} else {
			self.goto(self.currentLocation);
		}
	}); // isn't working really well
	
	$( window ).resize(function() {
		self.refreshMinLeft();
		self.center();
	});
	
	this.slideshowBox.appendTo(container);
};

Slideshow.prototype = {
	creep: function(){
		var newLeft = parseInt(this.slideshowBox.css("left")) - this.creepStep;
		if( newLeft > 0 ){
			newLeft = 0;
		} else if( newLeft < this.minLeft ) {
			newLeft = this.minLeft;
		}
		this.container.css("left", newLeft );
	},
	stopCreeping: function(){
		if( this.creepInterval ){
			clearInterval(this.creepInterval);
			this.creepInterval = null;
		}
		this.creepStep = 0;
	},
	inch: function(amt){
		this.container.scrollLeft(this.container.scrollLeft() + amt);
		this.scrolled = this.container.scrollLeft();
	},
	advance: function(){
		if( this.currentLocation < this.images.length-1 ){
			this.goto(this.currentLocation+1);
		} else {
			this.goto(0);
		}
	},
	retreat: function(){
		if( this.currentLocation > 0 ){
			this.goto(this.currentLocation-1);
		}
	},
	leftiness: function(location){
		var image = this.images[location];
		var leftiness = -image.div.position().left;
		leftiness += 3; // padding
		return leftiness;
	},
	centeriness: function(location){
		var image = this.images[location];
		var leftiness = -image.div.position().left;
		leftiness += $(window).width()/2;
		leftiness -= image.div.width()/2;
		return leftiness;
	},
	goto: function(location){
		var leftiness = this.leftiness(location);
		if( leftiness > 0 ){
			leftiness = 0;
			this.currentLocation = 0;
			this.movers.retreat.css({"opacity": 0});
			this.movers.advance.css({"opacity": 1});
			this.atEnd = false;
		} else if (leftiness < this.minLeft){
			leftiness = this.minLeft;
			if( !this.atEnd ){
				this.currentLocation = location;
			}
			this.movers.advance.css({"opacity": 0});
			this.movers.retreat.css({"opacity": 1});
			this.atEnd = true;
		} else {
			this.currentLocation = location;
			this.movers.retreat.css({"opacity": 1});
			this.movers.advance.css({"opacity": 1});
			this.atEnd = false;
		}
		
		this.slideshowBox.animate({"left": leftiness}, Slideshow.STANDARD_ANIMATION_TIME);
	},
	describe: function(item, ornaments, ribbon){
		var self = this;
		
		ribbon.addClass("chosen");
		
		ornaments.find(".describer").remove();
		ornaments.addClass("open");
		var describer = $("<div/>",{"class": "describer"}).appendTo(ornaments);
		
		$("<div/>", {"class":"closer"}).click(function(ev){
			self.undescribe(ornaments);
		}).appendTo(describer);
		$("<h3/>", {"text": item.name}).appendTo(describer);
		$("<p/>", {"text": item.description}).appendTo(describer);
		if( item.note ){
			$("<p/>", {"text": item.note}).appendTo(describer);
		}
		
		$("<p/>", {"class":"metadata","text": "Composition: "+item.composition}).appendTo(describer);
		//$("<p/>", {"class":"metadata","text": "Turnaround Time: "+item.availability}).appendTo(describer);
		
		$("<label/>", {"class":"breathe","text": "Alternate Views"}).appendTo(describer);
		var grid = $("<div/>",{"class": "grid"}).appendTo(describer);
		for( var i=0; i<3; i++ ){
			var thumbnail = $("<img/>",{"src":"http://placekitten.com/g/54/54"}).appendTo(grid);
			if( i===0 ){
				thumbnail.addClass("chosen");
			}
		}
		
		$("<div/>",{"class":"price", "text":"$1,350.00"}).appendTo(describer);
		//$("<div/>",{"class":"button", "text":"Check Availiability"}).appendTo(describer);
		
		$("<div/>", {"class":"quote", "text": item.quote}).appendTo(describer);
		
		var staples = $("<div/>", {"class":"staples"}).appendTo(describer);
		/*
		$("<a/>",{"text": "Returns & Exchanges"}).click(function(ev){
			self.returnsModal();
		}).appendTo(staples);
		*/
		$("<div/>",{"class":"ditch"}).appendTo(staples);
		$("<a/>",{"text": "Sizing Guide"}).click(function(ev){
			self.sizingModal();
		}).appendTo(staples);
		
		this.concernWidth += 270;
		this.refreshMinLeft();
		if( ornaments.is(':last-child') ){
			this.inch(270);
		}
	},
	undescribe: function(ornaments){
		ornaments.find(".ribbon.chosen").removeClass("chosen");
		ornaments.removeClass("open");
		this.concernWidth -= 270;
		this.refreshMinLeft();
	},
	center: function(location){
		/*
		this.currentLocation = location;
		this.slideshowBox.css({
			"left": this.leftiness(location)
		});
		*/
	   this.container.scrollLeft(this.scrolled);
	},
	constrainLeft: function(){
		this.slideshowBox.css({
			"left": 0
		});
	},
	refreshMinLeft: function(){
		var fullWidth = this.concernWidth;
		for( var i in this.images ){
			fullWidth += this.images[i].div.width() + 2;
		}
		//console.log(fullWidth);
		this.minLeft = -fullWidth + this.container.width();
		this.slideshowBox.css("width", fullWidth );
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
	},
	returnsModal: function(){
		
	},
	sizingModal: function(){
		
	},
	modal: function(){
		
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
Slideshow.STANDARD_ANIMATION_TIME = 360;


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