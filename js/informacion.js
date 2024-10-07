const PELICULAS = "https://japceibal.github.io/japflix_api/movies-data.json"
let todasLasPeliculas = [];

document.addEventListener('DOMContentLoaded', function() {
  fetch(PELICULAS)
    .then(response => response.json())
    .then(data => {
      todasLasPeliculas = data;
    })
    .catch(error => console.error('Error al cargar las películas:', error, '. Intente nuevamente.'));
});


document.getElementById('btnBuscar').addEventListener('click', function() {
  const campoBusqueda = document.getElementById('inputBuscar').value.trim().toLowerCase();
  const lista = document.getElementById('lista');
  lista.innerHTML = '';

  if (campoBusqueda) {
    const resultadosBusqueda = todasLasPeliculas.filter(pelicula =>
      [pelicula.title, pelicula.tagline, pelicula.genres.join(', '), pelicula.overview]
        .some(text => text.toLowerCase().includes(campoBusqueda))
    );

    resultadosBusqueda.forEach(pelicula => {
      const listita = document.createElement('li');
      listita.classList.add('list-group-item', 'bg-dark', 'text-light');
      listita.innerHTML = `
        <div class="text-container">
        <h5>${pelicula.title}</h5>
        <p>${pelicula.tagline}</p>
        </div>
        <div>${getEstrellas(pelicula.vote_average)}</div>
      `;
      listita.addEventListener('click', () => mostrarTodosLosDetalles(pelicula));
      lista.appendChild(listita);
    });
  }
});

function mostrarTodosLosDetalles({ title, overview, genres, release_date, runtime, budget, revenue }) {
    const detalles = document.getElementById('detallesPelicula');
    detalles.style.display = 'block';

    const generos = genres.map(genre => genre.name).join(', ');
    const añoLanzamiento = release_date.split('-')[0];

    detalles.innerHTML = `
      <div class="detalles-header">
        <h3>${title}</h3>
      </div>
      <p>${overview}</p>
      <p><strong>Géneros:</strong> ${generos}</p>
      <button id="btnMas" class="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#detallesExtra">
        Ver más
      </button>
      <div id="detallesExtra" class="collapse mt-3">
        <p><strong>Año de lanzamiento:</strong> ${añoLanzamiento}</p>
        <p><strong>Duración:</strong> ${runtime} minutos</p>
        <p><strong>Presupuesto:</strong> $${formatoNumero(budget)}</p>
        <p><strong>Ganancias:</strong> $${formatoNumero(revenue)}</p>
      </div>
    `;
}

function formatoNumero(numero) {
    return new Intl.NumberFormat('es-ES').format(numero);
}

    

function getEstrellas(vote) {
  const estrellas = Math.round(vote / 2);
  let estrellasHTML = '<div class="estrella-container">';

  for (let i = 1; i <= 5; i++) {
    estrellasHTML += `<i class="fa fa-star${i <= estrellas ? '' : '-o'} estrella estrella-${i}"></i>`;
  }

  estrellasHTML += '</div>';
  return estrellasHTML;
}
