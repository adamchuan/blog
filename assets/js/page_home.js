var BASE_URL = self.location.host,
	PAGE_INDEX = 1,
	PAGE_SIZE = 5, //每页显示文章数
	PAGE_COUNT = article.List.length, //文章总数  ,必须在加载文章后再计算
	PAGE_TYPE , //当前页的类型
	PAGE_LENGTH = Math.ceil(article.List.length / PAGE_SIZE) - 1; //必须在加载文章后再计算

$(".btn_prev").addEventListener('click',function(){
	var newIndex = --PAGE_INDEX;
	if(PAGE_INDEX <= 0 ){
		newIndex = PAGE_LENGTH;
	}
	PAGE_INDEX = newIndex;
	pageChange( PAGE_INDEX );
});
$(".btn_next").addEventListener('click',function(){
	var newIndex = ++PAGE_INDEX;
	if(PAGE_INDEX > PAGE_LENGTH ){
		newIndex = 1;
	}
	PAGE_INDEX = newIndex;	
	pageChange( PAGE_INDEX );
});

pageChange(PAGE_INDEX);

function pageChange(pageindex){
		var html = "",
			content;
		if( /^-?\d+$/.test(pageindex) ){ //判断是不是数字
			pageindex = parseInt(pageindex); //转化成数字
		}else{
			pageindex = 1;
		}
		$(".btn_wrap").forEach(function(div){
			div.classList.remove("hide");
		});
		PAGE_INDEX = pageindex;
		for(var i = (PAGE_INDEX - 1) * PAGE_SIZE ; i < PAGE_INDEX  * PAGE_SIZE & i < PAGE_COUNT ; i++){
				content = article.List[i];
				html  +=  article.TempLate.summary.replace(/__TITLE__/g,content.title)
							.replace(/__HREF__/g,content.url)
							.replace(/__DATE__/g," "+content.date)
							.replace(/__POSTS__/g,content.summary);
		}
		dom_articles.innerHTML = html;
		window.scrollTo(0,0);
}