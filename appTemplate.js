const ajax = new XMLHttpRequest();
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const content_url = 'https://api.hnpwa.com/v0/item/@id.json'



const store = { 
	currentPage: 1 
}


function getData(url) {
	ajax.open('GET', url, false);
	ajax.send();

	return JSON.parse(ajax.response);
}



const newsFeedList = document.getElementById('root') // 리스트가  있는 영역 // 

// const content_area = document.querySelector('.content_container') // 클릭한 뉴스를 보여주는 영역 // 


function newsFeed() {
 //  리스트 페이지 템플릿 기법 사용 (붕어빵틀을 제작) // 
	let template = ` 
	<div class="container mx-auto p-4">
		<h1>Hackers News</h1> 
		<ul>
			{{__news_feed__}}
		<ul>
		<div>
			<a href='#/page/{{__prev_page__}}'>이전 페이지</a>
			<a href='#/page/{{__next_page__}}'>다음 페이지</a>
		</div>
	</div>
	`
	const newslists = []; // 뉴스 리스트를 배열화 하여 dom 구조 제거 // 
	const newsFeed = getData(NEWS_URL) // JSON 객체화//
	for (let i = (store.currentPage -1)*10; i < store.currentPage *10; i++) { // 1-1 = 0  ; 하지만 조건은 10개 ; 0 부터 9 까지 10개를 맞춤 // // (2-1)*10 = 10  ; 조건은 20개  ; 인텍스 10 부터 19 까지 돌림 ////  (3-1)*10 = 20 ; 조건은 30 ; 인덱스 30 부터 29까지 돌림         
		newslists.push(`
			
				<li>
				<a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>        
				<div> Comments: ${newsFeed[i].comments_count}</div>
				</li>
			
		`);
	}
	
	template = template.replace('{{__news_feed__}}',newslists.join(''))    // 빵틀에 있는 news_feed 와 newslists 배열 교체 // 
	template = template.replace('{{__prev_page__}}',store.currentPage > 1 ? store.currentPage -1 : 1 )
	template = template.replace('{{__next_page__}}',store.currentPage < 4 ? store.currentPage +1 : 3 )
	newsFeedList.innerHTML = template; // 빵틀 dom root 안에 삽입 // 
};
newsFeed()


function newsDetail() {
	const id = location.hash.substring(7)
	const newsContents = getData(content_url.replace("@id", id))


	// newsFeedList.innerHTML = ''; // 리스트가 없어지는 기능 // 
	newsFeedList.innerHTML =
		`
    <h1>${newsContents.title}</h1> 
    <div>  
    <a href="#/page/${store.currentPage}"> Go back to news feed</a>
    </div>`
};



function router() {       //  A,B,C 에 화면 전화을 라우터라고 부른다 //
	const routePath = location.hash;

	if (routePath === '') {
		newsFeed();
	} else if(routePath.indexOf('#/page/') >=0 ){
		store.currentPage = Number(routePath.substr(7))
		newsFeed(); 
	}else{
		newsDetail()
	};
}
router();

window.addEventListener('hashchange', router)