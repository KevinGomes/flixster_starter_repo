API_KEY="029a844db2b842de0aef20f9b5c5d489"
page = 1

const header = document.querySelector("#header")
const searchTerm = document.querySelector("#search-input")
const searchButton = document.querySelector("#searchButton")
const gridContainer = document.querySelector("#movies-grid")
const showMore = document.querySelector("#load-more-movies-btn")
const clearButton = document.querySelector("#close-search-btn")
const modal = document.querySelector(".modal")

async function getResults() {
    console.log(page)
    let url = `https://api.themoviedb.org/3/`
    if("" != searchTerm.value){
        console.log("first")
        url += `search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm.value}&page=${page}&include_adult=false`
        clearButton.classList.remove("hidden")
    }
    else{
        console.log("second")
        url += `movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`
    }

    console.log(url)

    const response = await fetch(url)
    const responseData = await response.json()
    const results = responseData.results
    
    console.log(responseData)
    console.log(results)

    displayResults(results)
}

function displayResults(results){
    results.forEach((id,i) => {
        gridContainer.innerHTML += `
        <div onclick= "getInfo(${results[i].id})"class="movie-card">
            <img  class="movie-poster" src = "https://www.themoviedb.org/t/p/original${results[i].poster_path}" alt = "${results[i].title}">
            <h2 class="movie-title"> ${results[i].title} </h2>
            <h4 class="movie-votes"> &#11088 ${results[i].vote_average}/10 </h4>
        </div>
        `
    });
    
}

async function getInfo(movieId){

    let url=`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=videos`
    
    const response = await fetch(url)
    const responseData = await response.json()

    console.log(response)
    console.log(responseData)
    displayModal(responseData)
}

function displayModal(responseData){
    modal.innerHTML = ``
    modal.style.display = "block"
    modal.style.backgroundImage = `url(https://www.themoviedb.org/t/p/original${responseData.backdrop_path})`
    modal.innerHTML += `
    <div class="modal-content">    
        <span onclick="closeModal()" class="close">&times;</span>
        <div class="modal-title">${responseData.title}</div>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${responseData.videos[-1]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <div>${responseData.overview}</div>
        
        <div>Released:${responseData.release_date}</div>
        
        <div>Movie Site:${responseData.homepage}</div>    
    </div>
    `
}

function clearPage(){
    page=1
    gridContainer.innerHTML = ``
    clearButton.classList.add("hidden")
}

// Get the offset position of the navbar
let sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function stickyHeader() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } 
  else {
    header.classList.remove("sticky");
  }
}

// When the user scrolls the page, execute myFunction
window.onscroll = function() {stickyHeader()};

function closeModal() {
    modal.style.display = "none";
}

clearButton.addEventListener("click", (event) => {
    event.preventDefault()
    searchTerm.value = ``
    clearPage()
    getResults()})

showMore.addEventListener("click", (event) => {
    event.preventDefault()
    page++
    getResults()})

searchButton.addEventListener("click", (event) => {
    event.preventDefault()
    clearPage()
    getResults()})

window.onload = function(){
    getResults()
}