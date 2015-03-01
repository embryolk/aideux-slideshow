var Heading = function(container){
	this.$container = $(container);

	$("<div/>",{ "class" : "logo" }).appendTo(this.$container);
	
	var links = $("<div/>",{ "class": "links" });
	for( var i in Heading.LINKS ){
		var linkObj = Heading.LINKS[i];
		$("<a/>",{ 
			"class": "link", 
			"text": linkObj.title, 
			"href": linkObj.url 
		}).appendTo(links);
	}
	
	links.appendTo(this.$container);
};

Heading.LINKS = [
	{title:"Collections", url:"/collections"},
	{title:"Ordering Process", "url": "/ordering"},
	//{title:"Stocklists", "url": "/stocklists"},
	{title:"About", "url": "/about"},
	//{title:"Press", "url": "/press"},
	{title:"Contact", "url": "/contact"}
];