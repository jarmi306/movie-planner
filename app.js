const genBtn = document.getElementById('generate-btn');
const display = document.getElementById('result-display');

genBtn.onclick = async () => {
    const selectedGenres = Array.from(document.querySelectorAll('.genre-check:checked')).map(el => el.value);
    const lang = document.getElementById('language-select').value;
    
    display.innerHTML = "<p style='text-align:center'>Searching for a hit...</p>";
    const movie = await getMovie(selectedGenres, lang);
    
    if (movie) {
        display.innerHTML = `
            <div class="movie-card">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" onerror="this.src='https://via.placeholder.com/500x750?text=No+Poster'">
                <div class="movie-info">
                    <h2>${movie.title}</h2>
                    <p>${movie.overview ? movie.overview.slice(0, 100) + '...' : 'No description.'}</p>
                </div>
                <div class="actions">
                    <button class="like" id="btn-like">Add to List</button>
                    <button class="dislike" id="btn-dislike">Next</button>
                </div>
            </div>
        `;
        document.getElementById('btn-like').onclick = () => saveShow(movie, 'liked');
        document.getElementById('btn-dislike').onclick = () => genBtn.click();
    } else {
        display.innerHTML = "<p style='text-align:center'>No movies found. Change your filters!</p>";
    }
};