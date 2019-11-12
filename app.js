const searchTitle = document.querySelector(".search-bar");
const button = document.querySelector(".search-button");
const homePage = document.querySelector("#homepage");
const movies = document.querySelector(".movies");
const moviesPage = document.querySelector(".movies-page");
const card = document.querySelector(".card");
const back = document.querySelector(".backbutton");
const loadBtn = document.querySelector("#load");
const loadMoreBtn = document.querySelector(".loadmore");
const bgImage = document.querySelector(".bgimage");
const imageid = document.querySelectorAll(".card-image");
const movieName = document.querySelectorAll("p");
const cardHidden = document.querySelectorAll(".card-hidden");
const movieDescp = document.querySelector(".movie-information");
let poster = "";
let movieTitle = "";
let imdb = "";
let currentPage = "";

//load DOM content
document.addEventListener("DOMContentLoaded", loadContent);

function loadContent() {
  //Add event listeners for search button and search box(ENTER key)
  button.addEventListener("click", listMovies);
  searchTitle.addEventListener("keyup", function(e) {
    if (e.keyCode === 13) {
      listMovies();
      e.preventDefault();
    }
  });

  function listMovies() {
    //Get value from search box
    const title = document.getElementById("title-search-bar").value;

    //if no value then alert to enter some value
    if (title === "") {
      alert("Enter any movie name to search");
    }

    //Otherwise fetch omdbAPI and show the movie posters and title in the grid form
    else {
      fetch(`http://www.omdbapi.com/?apikey=c520c1&s=${title}`, {
        method: "GET"
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          const movieslist = data.Search;
          console.log(movieslist);

          if (typeof movieslist === "undefined") {
            alert("NO such movies or series is found");
            window.location.reload();
          } else {
            homePage.style.display = "none";
            let len = movieslist.length;
            for (let i = 0; i < len; i++) {
              //Get the poster and movie title one by one
              poster = movieslist[i].Poster;
              movieTitle = movieslist[i].Title;
              imdb = movieslist[i].imdbID;

              //Show list of movies, back button and load more button.
              //Hide the background image
              currentPage = 1;
              movies.style.display = "grid";
              moviesPage.style.display = "block";
              back.style.display = "block";
              loadMoreBtn.style.display = "block";
              bgImage.style.display = "none";

              console.log(poster);

              //First Create and insert image <img> and title <p> into card <div>.
              const div = document.createElement("div");
              div.className = "card";

              //Only show eight cards initially
              if (i > 7) {
                div.className = "card-hidden";
              }
              const image = document.createElement("img");
              image.src = poster;
              image.alt = "Movie poster";
              image.className = "card-image";

              const p = document.createElement("p");
              p.className = "movie-title";
              const t = document.createTextNode(`${movieTitle}`);

              const pImdb = document.createElement("p");
              pImdb.className = "imdb-number";
              const t1 = document.createTextNode(`${imdb}`);

              pImdb.appendChild(t1);
              p.appendChild(t);
              div.appendChild(image);
              div.appendChild(p);
              div.appendChild(pImdb);

              //Then insert card <div> into movies <div> to form grid structure
              movies.appendChild(div);
            }

            //Load more movies using load more button
            loadBtn.addEventListener("click", loadMoreMovies);
            function loadMoreMovies() {
              let m = movies.children;
              for (let i = 0; i < m.length; i++) {
                if (m[i].className === "card-hidden") {
                  console.log(m[i]);
                  m[i].className = "card";
                }
              }
              loadBtn.style.display = "none";
            }

            // Show the complete plot of the selected poster
            let m = movies.children;
            for (let i = 0; i < m.length; i++) {
              console.log(m[i]);
              m[i].addEventListener("click", () => {
                console.log(m[i].children[2].textContent);
                let imdbid = m[i].children[2].textContent;
                console.log(imdbid);
                fetch(`http://www.omdbapi.com/?apikey=c520c1&i=${imdbid}`, {
                  method: "GET"
                })
                  .then(response => {
                    return response.json();
                  })
                  .then(data => {
                    currentPage = 2;
                    movies.style.display = "none";
                    back.style.display = "block";
                    movieDescp.style.display = "block";
                    loadMoreBtn.style.display = "none";

                    const _title = data.Title,
                      _year = data.Year,
                      _genre = data.Genre,
                      _plot = data.Plot,
                      _poster = data.Poster;

                    const div1 = document.createElement("div");
                    div1.className = "descp-div";

                    const p0 = document.createElement("img");
                    p0.className = "__poster des";
                    p0.src = _poster;

                    const p1 = document.createElement("p");
                    p1.className = "__title des";
                    const t1 = document.createTextNode(`Title: ${_title}`);
                    p1.appendChild(t1);

                    const p2 = document.createElement("p");
                    p2.className = "__year des";
                    const t2 = document.createTextNode(`Year: ${_year}`);
                    p2.appendChild(t2);

                    const p3 = document.createElement("p");
                    p3.className = "__genre des";
                    const t3 = document.createTextNode(`Genre: ${_genre}`);
                    p3.appendChild(t3);

                    const p4 = document.createElement("p");
                    p4.className = "__plot des";
                    const t4 = document.createTextNode(`Plot: ${_plot}`);
                    p4.appendChild(t4);

                    div1.appendChild(p0);
                    div1.appendChild(p1);
                    div1.appendChild(p2);
                    div1.appendChild(p3);
                    div1.appendChild(p4);

                    movieDescp.appendChild(div1);
                  })
                  .catch(error => console.log(error));
              });
            }
          }
        })
        .catch(error => console.log(error));
    }
  }

  //back button event
  back.addEventListener("click", goBack);

  function goBack() {
    if (currentPage === 1) {
      homePage.style.display = "flex";
      movies.style.display = "none";
      moviesPage.style.display = "none";
      back.style.display = "none";
      bgImage.style.display = "block";
      window.location.reload();
    } else {
      currentPage = 1;
      movies.style.display = "grid";
      moviesPage.style.display = "block";
      back.style.display = "block";
      loadMoreBtn.style.display = "block";
      bgImage.style.display = "none";
      console.log(movieDescp.children[0]);
    }
  }
}
