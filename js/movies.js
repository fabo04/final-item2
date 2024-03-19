// Función para obtener las películas mejor puntuadas
async function getTopRatedMovies() {
    const response = await fetch(`${baseUrl}/movie/top_rated?api_key=${apiKey}&language=es-AR`);
    const data = await response.json();
    console.log(data.results)
    return data.results;
}

// Función para mostrar todas las películas en la interfaz sin paginación
function renderAllMovies(movies) {
    // Obtener el contenedor donde se mostrarán las películas
    const movieContainer = document.getElementById("top-rated-movies");
    movieContainer.innerHTML = "";
  
    // Iterar sobre todas las películas y renderizarlas en el contenedor
    movies.forEach(movie => {
      const movieDiv = document.createElement("div");
      movieDiv.classList.add("movie");
      movieDiv.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
        <div class="movie-title">${movie.title}</div>
      `;
      movieDiv.addEventListener("click", () => showMovieDetails(movie.id));
      movieContainer.appendChild(movieDiv);
    });
}

// Función para mostrar detalles de película en una nueva ventana
function showMovieDetails(movieId) {
    window.location.href = `movie_details.html?movieId=${movieId}`;
  }

async function initializePage() {
    const topRatedMovies = await getTopRatedMovies();
    renderAllMovies(topRatedMovies);
}

initializePage()


// Agregar evento de clic al botón de cierre de la vista de detalle
document.getElementById("closeButton").addEventListener("click", function() {
  window.location.href = "index.html";
});