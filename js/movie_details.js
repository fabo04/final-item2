// Función para obtener los detalles
async function getMovieDetails(movieId) {
  const response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=es-AR`);
  const data = await response.json();
  return data;
}

// Función para obtener los créditos
async function getMovieCredits(movieId) {
  const response = await fetch(`${baseUrl}/movie/${movieId}/credits?api_key=${apiKey}&language=es-AR`);
  const data = await response.json();
  return data;
}

// Función para obtener el proveedor
async function getProviderLogoURL(movieId) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`);
    const data = await response.json();

    let logoPath;

    // Verificar si hay datos para AR, si no, usar cualquier país
    if (data.results.AR && data.results.AR.flatrate && data.results.AR.flatrate.length > 0) {
      logoPath = `https://image.tmdb.org/t/p/original${data.results.AR.flatrate[0].logo_path}`;
    } else {
      for (let countryCode in data.results) {
        const providers = data.results[countryCode];
        if (providers.flatrate && providers.flatrate.length > 0) {
          logoPath = `https://image.tmdb.org/t/p/original${providers.flatrate[0].logo_path}`;
          break;
        } else if (providers.buy && providers.buy.length > 0) {
          logoPath = `https://image.tmdb.org/t/p/original${providers.buy[0].logo_path}`;
          break;
        }
      }
    }

    if (!logoPath) {
      throw new Error('No se encontró información de proveedores para esta película.');
    }

    return logoPath;
  } catch (error) {
    throw error;
  }
}

// Funcion para convertir fecha
function convertDate(dateString) {
  if (!dateString) {
      return '';
  }

  var dateObject = new Date(dateString);
  var day = dateObject.getUTCDate().toString().padStart(2, '0');
  var month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0');
  var year = dateObject.getUTCFullYear();
  return day + '/' + month + '/' + year;
}

// Función para obtener las certificaciones
async function getCertification(movieId) {
  try {
    const response = await fetch(`${baseUrl}/movie/${movieId}/release_dates?api_key=${apiKey}&language=es-AR`);
    const data = await response.json();
    
    // Filtrar los resultados para obtener solo la información de Argentina, sino de Us, sino vacio.
    const releaseInfoArgentina = data.results.find(result => result.iso_3166_1 === 'AR');
    const certificationAr = releaseInfoArgentina ? releaseInfoArgentina.release_dates[0].certification : null;

    const releaseInfoUs = data.results.find(result => result.iso_3166_1 === 'US');
    const certificationUs = releaseInfoUs ? releaseInfoUs.release_dates[0].certification : null;

    if (certificationAr) {
      return certificationAr
    } else if (certificationUs) {
      return certificationUs
    } else {
      return '';
    }
  } catch (error) {
    throw new Error('Error al obtener la información de certificación: ' + error.message);
  }
}

// Función para obtener la fecha de lanzamiento
async function getReleaseDate(movieId) {
  try {
    const response = await fetch(`${baseUrl}/movie/${movieId}/release_dates?api_key=${apiKey}&language=es-AR`);
    const data = await response.json();
    
    // Filtrar los resultados para obtener solo la información de Argentina o España
    const releaseInfoArgentina = data.results.find(result => result.iso_3166_1 === 'AR');
    const releaseInfoEspaña = data.results.find(result => result.iso_3166_1 === 'ES');

    if (releaseInfoArgentina) {
      return releaseInfoArgentina.release_dates[0].release_date;
    } else if (releaseInfoEspaña) {
      return releaseInfoEspaña.release_dates[0].release_date;
    } else {
      return '';
    }
  } catch (error) {
    throw new Error('Error al obtener la fecha de lanzamiento: ' + error.message);
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

// Función para obtener el key del trailer de la película
async function getMovieTrailerKey(movieId) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`);
    const data = await response.json();
    const trailers = data.results.filter(result => result.type === "Trailer" && result.site === "YouTube");
    if (trailers.length > 0) {
      return trailers[0].key;
    } else {
      throw new Error("No se encontró ningún trailer para esta película.");
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

//---------no se pudo aplicar ya 
//Funcion para obtener el color dominante
function getColorDominant(imageElementId) {
  const imageElement = document.getElementById(imageElementId);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const image = new Image();

  image.onload = function() {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    // Extraer datos de píxeles
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Inicializar contadores de color
    let totalRed = 0;
    let totalGreen = 0;
    let totalBlue = 0;
    let totalPixels = 0;

    // Calcular suma de los componentes de color para cada píxel
    for (let i = 0; i < pixels.length; i += 4) {
      const red = pixels[i];
      const green = pixels[i + 1];
      const blue = pixels[i + 2];

      // Descartar píxeles transparentes
      if (pixels[i + 3] === 255) {
        totalRed += red;
        totalGreen += green;
        totalBlue += blue;
        totalPixels++;
      }
    }

    // Calcular promedio de color
    const avgRed = Math.round(totalRed / totalPixels);
    const avgGreen = Math.round(totalGreen / totalPixels);
    const avgBlue = Math.round(totalBlue / totalPixels);


    //asignacion
    const div = document.getElementById('capa-opaca');
    //yo
    div.style.backgroundColor = `rgba(${avgRed},${avgGreen},${avgBlue},0.8)`;
    //yo
    console.log(`rgba(${avgRed},${avgGreen},${avgBlue},0.8);`)
    
    console.log('Color dominante RGB:', avgRed + ',' + avgGreen + ',' + avgBlue);
  };
  
  image.src = imageElement.src;

}


// Función para mostrar los detalles
async function renderMovieDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get('movieId');
  
  if (!movieId) {
    console.error("No se proporcionó un ID de película.");
    return;
  }

  try {
    const movieDetails = await getMovieDetails(movieId);
    const movieCredits = await getMovieCredits(movieId);
    const logoProviderURL = await getProviderLogoURL(movieId);
    const certification = await getCertification(movieId);
    const releaseDateAr = await getReleaseDate(movieId);
    const formatDate = convertDate(releaseDateAr);


    const posterPath = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;
    

    

    // Muestra los detalles de la película en la página
    document.getElementById("movie-poster").src = posterPath;
    document.getElementById("img-provider").src = logoProviderURL;
    document.getElementById("movie-title").textContent = movieDetails.title;
    const year = new Date(movieDetails.release_date).getFullYear();
    document.getElementById("year").textContent = `(${year})`;

    document.getElementById("certification").textContent = certification;

    const hours = Math.floor(movieDetails.runtime / 60);
    const minutes = movieDetails.runtime % 60;
    const date = formatDate ? formatDate : movieDetails.release_date
    document.getElementById("movie-release-date").textContent = `${date} (AR) • ${movieDetails.genres.map(genre => genre.name).join(", ")} • ${hours}h ${minutes}m`;
    


    //getColorDominant('movie-poster');

        // Fondo
    const backdropContainer = document.getElementById('backdrop');
    const backdropUrl = `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}?api_key=${apiKey}`;
    backdropContainer.style.backgroundColor = "rgba(200, 0, 0, 1)";
    backdropContainer.style.backgroundImage = `url('${backdropUrl}')`;

    // Porcentaje
    const puntuacionEnPorcentaje = Math.floor(movieDetails.vote_average * 10);
   
    const userScoreChart = document.querySelector('.user_score_chart');
    userScoreChart.setAttribute("data-percent",puntuacionEnPorcentaje)
    document.getElementById("span-porcent").textContent = `${puntuacionEnPorcentaje}﹪`

    // Dibujar la barra circular de carga (sin pasar colores)
    drawCircularBar(puntuacionEnPorcentaje);




    document.getElementById("movie-description").textContent = `${movieDetails.overview}`;
    document.getElementById("movie-tagline").textContent = `${movieDetails.tagline}`;
    
    // Busca el director en los créditos
    const director = movieCredits.crew.find(member => member.job === "Director");
    if (director) {
      document.getElementById("movie-director").textContent = `${director.name}`;
    } else {
      document.getElementById("movie-director").textContent = "Director no encontrado";
    }
  } catch (error) {
    console.error("Error al obtener los detalles de la película:", error);
  }
}


// Inicializar la página
renderMovieDetails();

// Agregar evento de clic al enlace del trailer
document.getElementById("play-trailer").addEventListener("click", async function(event) {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get('movieId');
  if (!movieId) {
    console.error("No se proporcionó un ID de película.");
    return;
  }
  try {
    const trailerKey = await getMovieTrailerKey(movieId);
    openTrailerModal(trailerKey);
  } catch (error) {
    console.error("Error al obtener el trailer de la película:", error);
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

// Agregar evento de clic al botón de cierre de la vista de detalle
document.getElementById("closeButton").addEventListener("click", function() {
  window.location.href = "index.html";
});

