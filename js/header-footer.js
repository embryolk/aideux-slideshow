var Header = function(container){
	this.$container = $(container);

	$("<a/>",{ 
		"class" : "logo",
		"href": (window.location.host === "www.aideux.com" ? '/' : '/aideux-slideshow')
	}).appendTo(this.$container);
	
	var links = $("<div/>",{ "class": "links" });
	for( var i in Header.LINKS ){
		var linkObj = Header.LINKS[i];
		var url = (window.location.host === "www.aideux.com" ? linkObj.url : '/aideux-slideshow'+linkObj.url);
		$("<a/>",{ 
			"class": "link", 
			"text": linkObj.title, 
			"href": url
		}).appendTo(links);
	}
	links.appendTo(this.$container);
	
	// responsive
	$("<div/>",{ "class": "navButton fa fa-bars fa-2x" }).
			appendTo(this.$container).
			click(function(ev){
				links.toggleClass("responsive-show");
			});
};

Header.LINKS = [
	{title:"Collections", url:"/collections"},
	{title:"Ordering Process", "url": "/ordering"},
	//{title:"Stockists", "url": "/stockists"},
	{title:"About", "url": "/about"},
	//{title:"Press", "url": "/press"},
	//{title:"Blog", "url": "/blog"},
	{title:"Contact", "url": "/contact"}
];



var Footer = function(container){
	this.$container = $(container);
	
	for( var i in Footer.LINKS ){
		var linkObj = Footer.LINKS[i];
		$("<a/>",{
			"class":"fa fa-lg "+linkObj.icon,
			"href": linkObj.url,
			"target": '_blank'
		}).appendTo(container);
	}
};

Footer.LINKS = [
	{icon:"fa-pinterest-p", url: "https://www.pinterest.com/aideux/"},
	{icon:"fa-facebook", url: "https://www.facebook.com/aideux"},
	{icon:"fa-instagram", url: "https://instagram.com/aideuxny/"}
];