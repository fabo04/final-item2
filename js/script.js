const searchForm = document.getElementById('searchForm');

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = document.querySelector('#searchInput').value;
    window.location.href = `search.html?query=${query}`;
});

// Función para obtener las películas mejor puntuadas
async function getTopRatedMovies() {
  const response = await fetch(`${baseUrl}/movie/top_rated?api_key=${apiKey}&language=es-AR`);
  const data = await response.json();
  return data.results;
}

// Función para obtener las series de TV paginadas
async function getTVSeries() {
  const response = await fetch(`${baseUrl}/tv/top_rated?api_key=${apiKey}&language=es-AR`);
  const data = await response.json();
  return data.results;
}

// Declaración de variables globales para el número de página actual para películas y series de TV, y el tamaño de página.
let moviePageNumber = 1; // Página actual para películas
let tvSeriesPageNumber = 1; // Página actual para series de TV
const pageSize = 5; // Tamaño de página

// Función para mostrar las películas en la interfaz con paginación
function renderMovies(movies) {
  // Obtener el contenedor donde se mostrarán las películas
  const movieContainer = document.getElementById("top-rated-movies");
  movieContainer.innerHTML = "";

  // Calcular el índice de inicio y fin de las películas a mostrar en la página actual
  const startIndex = (moviePageNumber - 1) * pageSize;
  const endIndex = moviePageNumber * pageSize;

  // Obtener las películas a mostrar en la página actual
  const moviesToShow = movies.slice(startIndex, endIndex);

  // Iterar sobre las películas y renderizarlas en el contenedor
  moviesToShow.forEach(movie => {
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie");
    movieDiv.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
      <div class="movie-title">${movie.title}</div>
    `;
    movieDiv.addEventListener("click", () => showMovieDetails(movie.id));
    movieContainer.appendChild(movieDiv);
  });
  const moviePagination = document.getElementById('moviesPagination')
  moviePagination.innerHTML = "";
  // Renderizar los botones de paginación para las películas
  renderPaginationButtons(movies.length, moviePagination, "movie");
}

// Función para mostrar las series de TV en la interfaz con paginación
function renderTVSeries(series) {
  // Obtener el contenedor donde se mostrarán las series de TV
  const seriesContainer = document.getElementById("tv-series");
  seriesContainer.innerHTML = "";

  // Calcular el índice de inicio y fin de las series de TV a mostrar en la página actual
  const startIndex = (tvSeriesPageNumber - 1) * pageSize;
  const endIndex = tvSeriesPageNumber * pageSize;

  // Obtener las series de TV a mostrar en la página actual
  const seriesToShow = series.slice(startIndex, endIndex);

  // Iterar sobre las series de TV y renderizarlas en el contenedor
  seriesToShow.forEach(serie => {
    const serieDiv = document.createElement("div");
    serieDiv.classList.add("serie");
    serieDiv.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${serie.poster_path}" alt="${serie.name}">
      <div class="serie-title">${serie.name}</div>
    `;
    serieDiv.addEventListener("click", () => showTVSerieDetails(serie.id));
    seriesContainer.appendChild(serieDiv);
  });
  const seriePagination = document.getElementById('seriesPagination')
  seriePagination.innerHTML = "";
  // Renderizar los botones de paginación para las series de TV
  renderPaginationButtons(series.length, seriePagination, "tvSeries");
}

// Función para renderizar botones de paginación
function renderPaginationButtons(totalItems, container, type) {
  // Calcular el número total de páginas
  const totalPages = Math.ceil(totalItems / pageSize);

  // Crear un contenedor para los botones de paginación
  const paginationContainer = document.createElement("div");
  paginationContainer.classList.add("pagination");

  // Crear el botón de página anterior
  const prevButton = document.createElement("button");
  prevButton.classList.add("button-pagination");
  prevButton.innerHTML = '<i id="arrow-pagination" class="bi bi-arrow-left-square-fill bi-4x"></i>';
  prevButton.disabled = type === "movie" ? moviePageNumber === 1 : tvSeriesPageNumber === 1;
  prevButton.addEventListener("click", () => {
    if (type === "movie" && moviePageNumber > 1) {
      moviePageNumber--;
      initializePage();
    } else if (type === "tvSeries" && tvSeriesPageNumber > 1) {
      tvSeriesPageNumber--;
      initializePage();
    }
  });
  paginationContainer.appendChild(prevButton);

  // Crear el botón de página siguiente
  const nextButton = document.createElement("button");
  nextButton.classList.add("button-pagination");
  nextButton.innerHTML = '<i id="arrow-pagination" class="bi bi-arrow-right-square-fill bi-4x"></i>';
  nextButton.disabled = type === "movie" ? moviePageNumber === totalPages : tvSeriesPageNumber === totalPages;
  nextButton.addEventListener("click", () => {
    if (type === "movie" && moviePageNumber < totalPages) {
      moviePageNumber++;
      initializePage();
    } else if (type === "tvSeries" && tvSeriesPageNumber < totalPages) {
      tvSeriesPageNumber++;
      initializePage();
    }
  });
  paginationContainer.appendChild(nextButton);

  // Agregar el contenedor de paginación al contenedor principal
  container.appendChild(paginationContainer);
}


// Función para mostrar detalles de película en una nueva ventana
function showMovieDetails(movieId) {
  window.location.href = `movie_details.html?movieId=${movieId}`;
}

// Función para redirigir a la página de detalles de la serie de televisión
function showTVSerieDetails(tvSerieId) {
  window.location.href = `tv_serie_details.html?tvSerieId=${tvSerieId}`;
}

// Inicializar la página
async function initializePage() {
  const topRatedMovies = await getTopRatedMovies();
  renderMovies(topRatedMovies);

  const tvSeries = await getTVSeries();
  renderTVSeries(tvSeries);
}

initializePage();

