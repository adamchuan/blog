var html = "";
for(var category in article.Map){
	html += "<dl class='category-container'><dt>" + category + "</dt>";
	article.Map[category].forEach(function(content){
		var tagHTML  = "";
		content.tags.forEach(function(tag){
			tagHTML += article.TempLate['tags'].replace(/__HREF__/g,"#tags_" + tag)
						.replace(/__TAGS__/g,tag);
		});
		html += article.TempLate['category'].replace(/__TITLE__/g,content.title)
				.replace(/__HREF__/g,content.url)
				.replace(/__DATE__/g," " + content.date)
				.replace(/__TAGSCOL__/g,tagHTML);
	});
	html += "</dl>";
}

var router = {
	'home' : function(){

	},
	'empty' : function(){
		dom_articles.innerHTML = article.TempLate['empty'];
	},
	'tags' : function(tagName){
		var html = "<dl class='category-container'><dt>" + tagName + "</dt>"; 
		article.Tags[tagName].forEach(function(content){
			var tagHTML  = "";
			content.tags.forEach(function(tag){
				tagHTML += article.TempLate['tags'].replace(/__HREF__/g,"#tags_" + tag)
							.replace(/__TAGS__/g,tag);
			});
			html += article.TempLate['category'].replace(/__TITLE__/g,content.title)
					.replace(/__HREF__/g,content.url)
					.replace(/__DATE__/g,content.date)
					.replace(/__TAGSCOL__/g,tagHTML);
		});
		dom_articles.innerHTML = html;
	}
}
window.onhashchange = function(){

	try{
		var state = location.href.match(/#.*/ig)[0].replace('#','');
	}
	catch(ex){
		state =  "home";
	}
	var handlerName = state.split('_')[0],
		handlerParam = state.split('_')[1] || "";
	if(typeof router[handlerName] === 'undefined'){
		handlerName = 'empty';
	}
	$(".btn_wrap").forEach(function(div){
		div.classList.add("hide");
	});
	router[handlerName](handlerParam);
	window.scrollTo(0,0);

}
dom_articles.innerHTML = html;