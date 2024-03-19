// Función para obtener las series de TV paginadas
async function getTVSeries() {
    const response = await fetch(`${baseUrl}/tv/top_rated?api_key=${apiKey}&language=es-AR`);
    const data = await response.json();
    return data.results;
}


// Declaración de variable global para el paginador
let tvSeriesPageNumber = 1;
const pageSize = 5;

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

  // Renderizar los botones de paginación para las series de TV
  renderPaginationButtons(series.length, "tvSeries");
}

// Función para renderizar botones de paginación
function renderPaginationButtons(totalItems, type) {
  // Calcular el número total de páginas
  const totalPages = Math.ceil(totalItems / pageSize);

  // Obtener el contenedor de paginación
  const paginationContainer = document.getElementById('seriesPagination');
  paginationContainer.innerHTML = "";

  // Crear la lista de paginación
  const paginationList = document.createElement("ul");
  paginationList.classList.add("pagination");

  // Crear el botón de página anterior
  const prevButton = document.createElement("li");
  prevButton.classList.add("page-item");
  prevButton.classList.add("btn-prev");
  if (tvSeriesPageNumber === 1) {
    prevButton.classList.add("disabled");
  }
  const prevLink = document.createElement("a");
  prevLink.classList.add("page-link");
  prevLink.innerText = "Previous";
  prevLink.href = "#";
  prevLink.addEventListener("click", () => {
    if (tvSeriesPageNumber > 1) {
      tvSeriesPageNumber--;
      initializePage();
    }
  });
  prevButton.appendChild(prevLink);
  paginationList.appendChild(prevButton);

  // Crear los botones de números de página
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("li");
    pageButton.classList.add("page-item");
    if (i === tvSeriesPageNumber) {
      pageButton.classList.add("active");
    }
    const pageLink = document.createElement("a");
    pageLink.classList.add("page-link");
    pageLink.innerText = i;
    pageLink.href = "#";
    pageLink.addEventListener("click", () => {
      tvSeriesPageNumber = i;
      initializePage();
    });
    pageButton.appendChild(pageLink);
    paginationList.appendChild(pageButton);
  }

  // Crear el botón de página siguiente
  const nextButton = document.createElement("li");
  nextButton.classList.add("page-item");
  nextButton.classList.add("btn-prev");
  if (tvSeriesPageNumber === totalPages) {
    nextButton.classList.add("disabled");
  }
  const nextLink = document.createElement("a");
  nextLink.classList.add("page-link");
  nextLink.innerText = "Next";
  nextLink.href = "#";
  nextLink.addEventListener("click", () => {
    if (tvSeriesPageNumber < totalPages) {
      tvSeriesPageNumber++;
      initializePage();
    }
  });
  nextButton.appendChild(nextLink);
  paginationList.appendChild(nextButton);

  paginationContainer.appendChild(paginationList);
}


// Inicializar la página
async function initializePage() {
  const tvSeries = await getTVSeries();
  renderTVSeries(tvSeries);
}

initializePage();


// Función para redirigir a la página de detalles de la serie de televisión
function showTVSerieDetails(tvSerieId) {
    window.location.href = `tv_serie_details.html?tvSerieId=${tvSerieId}`;
  }

// Agregar evento de clic al botón de cierre de la vista de detalle
document.getElementById("closeButton").addEventListener("click", function() {
    window.location.href = "index.html";
  });