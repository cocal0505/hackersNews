const ajax = new XMLHttpRequest();
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const content_url = 'https://api.hnpwa.com/v0/item/@id.json'



const store = { 
	currentPage: 1 , 
  feed:[]
}


function getData(url) {
	ajax.open('GET', url, false);
	ajax.send();

	return JSON.parse(ajax.response);
}

function makeFeed (feed){
  for(let i=0; i<feed.length; i++ ){
    feed[i].read = false; 
  }
  return feed;
}



const newsFeedList = document.getElementById('root') // 리스트가  있는 영역 // 

// const content_area = document.querySelector('.content_container') // 클릭한 뉴스를 보여주는 영역 // 


function newsFeed() {

  const newslists = []; // 뉴스 리스트를 배열화 하여 dom 구조 제거 // 

	let newsFeed = store.feed
 //  리스트 페이지 템플릿 기법 사용 (붕어빵틀을 제작) // 
	let template = ` 
  <div class="bg-gray-600 min-h-screen">
     <div class="bg-white text-xl">
       <div class="mx-auto px-4">
         <div class="flex justify-between items-center py-6">
           <div class="flex justify-start">
            <h1 class="font-extrabold">Hackers News</h1>
           </div>
           <div class="items-center justify-end">
            <a href='#/page/{{__prev_page__}}' class="text-gray-500">Previous</a>
            <a href='#/page/{{__next_page__}}' class="text-gray-500">Next</a>
           </div>
         </div>
       </div>
     </div>
    <div class="p-4 text-2xl text-gary-700">
      {{__news_feed__}}
    </div>
    </div>
	`
  if(newsFeed.length === 0){
    newsFeed = store.feed = makeFeed(getData(NEWS_URL))
  }

	
	for (let i = (store.currentPage -1)*10; i < store.currentPage *10; i++) { // 1-1 = 0  ; 하지만 조건은 10개 ; 0 부터 9 까지 10개를 맞춤 // // (2-1)*10 = 10  ; 조건은 20개  ; 인텍스 10 부터 19 까지 돌림 ////  (3-1)*10 = 20 ; 조건은 30 ; 인덱스 30 부터 29까지 돌림         
		newslists.push(`
        <div class="p-6 ${newsFeed[i].read ? 'bg-green-50': 'bg-white'} mt-6 rounded-lg shadow-md transition-all duration-2000 hover:bg-green-100">
          <div class="flex">
            <div class="flex-auto">
              <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a> 
            </div>
            <div class="text-center text-sm">
              <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>     
            </div>
          </div>  
          <div class="mt-6 flex">
            <div class="grid grid-cols-3 text-gary-500 text-sm">
              <div><i class="far fa-user mr-1"></i>${newsFeed[i].user}</div>
              <div><i class="far fa-heart mr-1 "></i>${newsFeed[i].points}</div>
              <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
            </div>
          </div>
        </div>
			
		`);
	}
	
	template = template.replace('{{__news_feed__}}',newslists.join(''))    // 빵틀에 있는 news_feed 와 newslists 배열 교체 // 
	template = template.replace('{{__prev_page__}}',store.currentPage > 1 ? store.currentPage -1 : 1 )
	template = template.replace('{{__next_page__}}',store.currentPage < 3 ? store.currentPage +1 : 3 )
	newsFeedList.innerHTML = template; // 빵틀 dom root 안에 삽입 // 
};
newsFeed()


function newsDetail() {
	const id = location.hash.substring(7)
	const newsContents = getData(content_url.replace("@id", id))


  let template = 
  ` <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
             <h1 class="font-extrabold">Hackers News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage} class="text-gary-500>
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
        
      <div class="h-full border rounded-xl bg-white m-6 p-4">
        <a href="${newsContents.url}" target="_blank" class="text-2xl transition-all duration-2000 hover:text-blue-500">${newsContents.title}<br>click the title to read artical</a>
        <div class="text-gary-400 h-20">
        ${newsContents.content}
        </div>

        {{__comments__}}
      </div>

    </div>
`


for(let i=0; i<store.feed.length;i++){
  if(store.feed[i].id === Number(id)){
    store.feed[i].read =true;
    break;
  }
}


  function makeComments(comments, called= 0){
    const commentString = []

    for(let i=0; i < comments.length; i++){
      commentString.push(` 
        <div style="padding-left: ${called *40}px;" class="mt-4">
          <div class="text-gary-400">
            <i class="fa fa-sort-up mr-2"> </i>
            <strong>${comments[i].user}</strong>
            ${comments[i].time_ago}
          </div>
          <p class="text-gray-700">${comments[i].content}</p>
        </div>
      `)

      if(comments[i].comments.length >0) {
       commentString.push( makeComments(comments[i].comments,called + 1))    //재귀 호출 // 
      }
    }
    return commentString.join("")
  }

	newsFeedList.innerHTML = template.replace('{{__comments__}}',makeComments(newsContents.comments))

	
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



