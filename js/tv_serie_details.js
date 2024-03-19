// Función para obtener los detalles de una serie de televisión por su ID
async function getSerieDetails(serieId) {
  const response = await fetch(`${baseUrl}/tv/${serieId}?api_key=${apiKey}&language=es-AR`);
  const data = await response.json();
  return data;
}

// Función para obtener los créditos de una serie de televisión por su ID
async function getSerieCredits(serieId) {
  const response = await fetch(`${baseUrl}/tv/${serieId}/credits?api_key=${apiKey}&language=es-AR`);
  const data = await response.json();
  return data;
}

// Función para obtener el proveedor de una serie de televisión por su ID
async function getProviderLogoURL(serieId) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${serieId}/watch/providers?api_key=${apiKey}`);
    const data = await response.json();
    
    if (data.results && data.results.AR && data.results.AR.flatrate && data.results.AR.flatrate.length > 0) {
      // Si existe "flatrate", devuelve el logo del primer elemento.
      return `https://image.tmdb.org/t/p/original${data.results.AR.flatrate[0].logo_path}`;
    } else {
      // Si no existe "flatrate", para breaking bad, solo en TW
      return `https://image.tmdb.org/t/p/original${data.results.TW.flatrate[0].logo_path}`;
    }
  } catch (error) {
    throw error;
  }
}


//-------------------PORCENT-------------------------------

// Función para dibujar la barra circular de carga
function drawCircularBar(percent) {
  const canvas = document.getElementById('circularBar');
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = (canvas.width - 10) / 2;
  const endAngle = (percent / 100) * (2 * Math.PI);

  // Dibujar el círculo de fondo
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#081c22'; // Color de fondo predeterminado
  ctx.lineWidth = 10;
  ctx.stroke();

  // Dibujar el arco de la barra de carga (siempre será verde)
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, -0.5 * Math.PI, endAngle - 0.5 * Math.PI);
  ctx.strokeStyle = '#00ff00'; // Color verde para la barra
  ctx.lineWidth = 10;
  ctx.stroke();
}






//-------------------PORCENT-------------------------------



// Función para obtener el key del trailer de la serie
async function getSerieTrailerKey(tvSerieId) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${tvSerieId}/videos?api_key=${apiKey}`);
    const data = await response.json();
    const trailers = data.results.filter(result => result.type === "Trailer" && result.site === "YouTube");
    if (trailers.length > 0) {
      return trailers[0].key;
    } else {
      throw new Error("No se encontró ningún trailer para esta serie.");
    }
  } catch (error) {
    throw error;
  }
}

// Función para abrir el modal y reproducir el trailer
function openTrailerModal(trailerKey) {
  const modal = document.getElementById("trailer-modal");
  const modalContent = modal.querySelector("#trailer-iframe");
  modalContent.src = `https://www.youtube.com/embed/${trailerKey}`;
  modal.style.display = "block";
}

// Función para cerrar el modal
function closeTrailerModal() {
  const modal = document.getElementById("trailer-modal");
  const modalContent = modal.querySelector("#trailer-iframe");
  modalContent.src = "";
  modal.style.display = "none";
}

// Función para mostrar los detalles de la serie de televisión en la página
async function renderSerieDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const serieId = urlParams.get('tvSerieId');
  
  if (!serieId) {
    console.error("No se proporcionó un ID de serie de televisión.");
    return;
  }

  try {
    const serieDetails = await getSerieDetails(serieId);
    const serieCredits = await getSerieCredits(serieId);
    const logoProviderURL = await getProviderLogoURL(serieId);

    // Fondo
    const backdropContainer = document.getElementById('backdrop');
    const backdropUrl = `https://image.tmdb.org/t/p/original${serieDetails.backdrop_path}?api_key=${apiKey}`;
    backdropContainer.style.backgroundImage = `url('${backdropUrl}')`;

    // Muestra los detalles de la serie de televisión en la página
    document.getElementById("serie-poster").src = `https://image.tmdb.org/t/p/w500${serieDetails.poster_path}`;
    document.getElementById("img-provider").src = logoProviderURL
    document.getElementById("serie-title").textContent = serieDetails.name;
    const year = new Date(serieDetails.first_air_date).getFullYear();
    document.getElementById("year").textContent = `(${year})`;
    document.getElementById("serie-release-date").textContent = `${serieDetails.first_air_date} • ${serieDetails.genres.map(genre => genre.name).join(", ")} • ${serieDetails.episode_run_time[0]}m por episodio`;
    
    // Porcentaje
    const puntuacionEnPorcentaje = Math.floor(serieDetails.vote_average * 10);

    const userScoreChart = document.querySelector('.user_score_chart');
    userScoreChart.setAttribute("data-percent",puntuacionEnPorcentaje)
    document.getElementById("span-porcent").textContent = `${puntuacionEnPorcentaje}﹪`

    // Dibujar la barra circular de carga (sin pasar colores)
    drawCircularBar(puntuacionEnPorcentaje)
    


    document.getElementById("serie-description").textContent = `${serieDetails.overview}`;
    document.getElementById("serie-tagline").textContent = `${serieDetails.tagline}`;
    
    // Busca el creador en los créditos
    const creador = serieCredits.crew.find(member => member.job === "Executive Producer");
    if (creador) {
      document.getElementById("serie-producer").textContent = `${creador.name}`;
    } else {
      document.getElementById("serie-producer").textContent = "Productor no encontrado";
    }
  } catch (error) {
    console.error("Error al obtener los detalles de la serie de televisión:", error);
  }
}

// Inicializar la página
renderSerieDetails();

// Agregar evento de clic al enlace del trailer
document.getElementById("play-trailer").addEventListener("click", async function(event) {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const tvSerieId = urlParams.get('tvSerieId');
  if (!tvSerieId) {
    console.error("No se proporcionó un ID de serie.");
    return;
  }
  try {
    const trailerKey = await getSerieTrailerKey(tvSerieId);
    openTrailerModal(trailerKey);
  } catch (error) {
    console.error("Error al obtener el trailer de la serie:", error);
  }
});

// Agregar evento de clic al botón de cierre del modal
document.querySelector(".close").addEventListener("click", closeTrailerModal);

// Cerrar el modal si el usuario hace clic fuera del área del modal
window.addEventListener("click", function(event) {
  const modal = document.getElementById("trailer-modal");
  if (event.target == modal) {
    closeTrailerModal();
  }
});

document.getElementById("closeButton").addEventListener("click", function() {
  window.location.href = "tvSeries.html";
});