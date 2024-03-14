document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    if (query) {
        await getMoviesBySearch(query);
    }
});

function createMovies(movies, container) {
    container.innerHTML = '';

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        movieContainer.addEventListener('click', () => {
            window.location.href = `movie_details.html?movieId=${movie.id}`;
        });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);

        // Verificar si poster_path no es null antes de establecer la src del elemento img
        if (movie.poster_path) {
            movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);
        } else {
            // Si poster_path es null, puedes establecer una imagen de relleno o dejarla en blanco
            movieImg.setAttribute('src', 'imagen_de_relleno.jpg'); // Cambia 'imagen_de_relleno.jpg' por la ruta de tu imagen de relleno
        }

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
}


const genericSection = document.getElementById('genericList');

async function getMoviesBySearch(query) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
        if (!response.ok) {
            throw new Error('No se pudo realizar la búsqueda de películas');
        }
        const data = await response.json();
        const movies = data.results;
        
        // Llama a la función createMovies para mostrar las películas encontradas
        createMovies(movies, genericSection);
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById("closeButtonSearch").addEventListener("click", function() {
    window.location.href = "index.html";
  });