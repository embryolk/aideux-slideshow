var Header = function(container){
	this.$container = $(container);

	$("<a/>",{ 
		"class" : "logo",
		"href": '/aideux-slideshow'
	}).appendTo(this.$container);
	
	var links = $("<div/>",{ "class": "links" });
	for( var i in Header.LINKS ){
		var linkObj = Header.LINKS[i];
		$("<a/>",{ 
			"class": "link", 
			"text": linkObj.title, 
			"href": linkObj.url 
		}).appendTo(links);
	}
	
	links.appendTo(this.$container);
};

Header.LINKS = [
	{title:"Collections", url:"/aideux-slideshow/collections"},
	{title:"Ordering Process", "url": "/aideux-slideshow/ordering"},
	//{title:"Stocklists", "url": "stocklists"},
	{title:"About", "url": "/aideux-slideshow/about"},
	//{title:"Press", "url": "press"},
	{title:"Contact", "url": "/aideux-slideshow/contact"}
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