let data;
let movies;
const personUrl = 'https://api.themoviedb.org/3/person/';
const apiKey = '27809cd3d050286c48cd91432f2c19e7';
const movieUrl = 'https://api.themoviedb.org/3/movie/';
const imageUrl = 'https://image.tmdb.org/t/p/original';

import('./moviesPlay.js')
    .then(res => {
        console.log('data imported into data constant');
        data = res;
        run();
    });

let selectedCategory = "hindi";
let selectedDecade;
let selectedGenres = [];

function run() {
    switch (selectedCategory) {
        case "hindi":
            movies = data.hindiMovies;
            break;
        case "international":
            movies = data.movies;
            break;
        default:
            movies = data.movies;
    }
    addDecadeSelects();
    addGenreCheckboxes();
}

function getDecadeFromDate(date) {
    const year = new Date(date).getFullYear();
    return `${Math.floor(year / 10) * 10}-${Math.floor(year / 10) * 10 + 9}`;
}


async function addDecadeSelects() {
    const select = document.getElementById('decades');
    select.innerHTML = '';

    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.text = "Select decade";
    select.add(defaultOpt);

    const decades = [...new Set(movies.map(movie => getDecadeFromDate(movie.releaseDate)))];
    decades.sort().reverse();

    decades.forEach(decade => {
        const opt = document.createElement("option");
        opt.value = decade;
        opt.text = `${decade}s`;
        select.add(opt);
    });

    selectedDecade = decades[0];
    refreshMovieList(); 
}

function addGenreCheckboxes() {
    const genresSet = new Set();
    movies.forEach(movie => {
        movie.genres.forEach(genre => {
            genresSet.add(genre.name);
        });
    });
    const genres = [...genresSet];
    const genreDiv = document.getElementById('genreSelection');
    genreDiv.innerHTML = ''; 
    genres.forEach(genre => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = genre;
        checkbox.id = genre;
        checkbox.addEventListener('change', updateSelectedGenres);

        const label = document.createElement('label');
        label.htmlFor = genre;
        label.appendChild(document.createTextNode(genre));

        genreDiv.appendChild(checkbox);
        genreDiv.appendChild(label);
        genreDiv.appendChild(document.createElement('br'));
    });
}


function updateSelectedGenres(event) {
    if (event.target.checked) {
        selectedGenres.push(event.target.value);
    } else {
        const index = selectedGenres.indexOf(event.target.value);
        if (index > -1) {
            selectedGenres.splice(index, 1);
        }
    }
    refreshMovieList();
}

function refreshMovieList() {
    const filteredMovies = movies.filter(movie => {
        const movieDecade = getDecadeFromDate(movie.releaseDate);
        return movieDecade === selectedDecade && (selectedGenres.length === 0 || movie.genres.some(genre => selectedGenres.includes(genre.name)));
    });
    displayMovies(filteredMovies);
}

function displayMovies(moviesToDisplay) {
    const select = document.getElementById('movies');
    select.innerHTML = '';

    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.text = "Select a movie";
    select.add(defaultOpt);

    moviesToDisplay.sort(sortByTitle);

    moviesToDisplay.forEach(movie => {
        const opt = document.createElement("option");
        opt.value = movie.tmdbId;
        opt.text = `${movie.title} (${movie.releaseDate})`;
        select.add(opt);
    });
}

document.getElementById("hindiRadio").addEventListener("change", function() {
    selectedCategory = "hindi";
    run();
});

document.getElementById("internationalRadio").addEventListener("change", function() {
    selectedCategory = "international";
    run();
});

document.getElementById("allRadio").addEventListener("change", function() {
    selectedCategory = "allmovies";
    run();
});

document.getElementById('decades').addEventListener('change', function() {
    selectedDecade = this.value;
    refreshMovieList();
});

async function movieSelected() {
    const movieId = document.getElementById('movies').value;

    const movie = movies.find(movie => movieId === movie.tmdbId);

    const fetchArray = movie.cast.map(cm => {
        return fetch(`${personUrl}${cm.id}?api_key=${apiKey}`)
            .then(response => response.json());
    });

    fetchArray.unshift(fetch(`${movieUrl}${movieId}?api_key=${apiKey}`)
        .then(response => response.json()));

    const fetchResponse = await Promise.all(fetchArray);
    const movieInfo = {
        title: fetchResponse[0].title,
        overview: fetchResponse[0].overview,
        posterPath: fetchResponse[0].poster_path,
        cast: []
    };

    for (let i = 1; i < fetchResponse.length; i++) {
        movieInfo.cast.push({
            name: fetchResponse[i].name,
            profileImage: fetchResponse[i].profile_path,
            birthDate: fetchResponse[i].birthday
        });
    }

    populateMovieHtml(movieInfo);
}

function applyFilters() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filteredMovies = movies.filter(movie => {
        // Check movie title
        if (movie.title.toLowerCase().includes(searchText)) return true;

        // Check cast members
        return movie.cast.some(cm => 
            cm.name.toLowerCase().includes(searchText) || 
            cm.character.toLowerCase().includes(searchText)
        );
    });

    displayMovies(filteredMovies);
}


function populateMovieHtml(movieInfo) {
    document.getElementById('title').innerHTML = movieInfo.title;
    document.getElementById('overview').innerHTML = movieInfo.overview;
    document.getElementById('moviePoster').innerHTML = `<img src='${imageUrl}${movieInfo.posterPath}' />`;
    document.getElementById('castInfo').innerHTML = getCastHtml(movieInfo.cast);
}

function getCastHtml(cast) {
    let castHtml = '<div class="ui cards">';
    cast.forEach(cm => {
        castHtml += `
            <div class="card">
                <div class="content">
                    <img class="right floated mini ui image" src="${imageUrl}${cm.profileImage}">
                    <div class="header">
                        ${cm.name}
                    </div>
                    <div class="meta">
                        ${cm.birthDate}
                    </div>
                </div>
            </div>`;
    });
    castHtml += '</div>';
    return castHtml;
}

function sortByTitle(a, b) {
    if (a.title < b.title) {
        return -1;
    } else if (b.title < a.title) {
        return 1;
    } else {
        return 0;
    }
}
