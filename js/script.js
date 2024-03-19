// Busqueda
const searchForm = document.getElementById('searchForm');

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = document.querySelector('#searchInput').value;
    window.location.href = `search.html?query=${query}`;
});

