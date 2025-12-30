const genBtn = document.getElementById('generate-btn');
const display = document.getElementById('result-display');

genBtn.onclick = async () => {
    // Get all checked genres
    const selectedGenres = Array.from(document.querySelectorAll('.genre-check:checked')).map(el => el.value);
    const lang = document.getElementById('language-select').value;
    
    // If no genres are selected, TMDB might return anything, which is fine
    display.innerHTML = "<div class='loading'>Searching the globe for a hit...</div>";
    
    const movie = await getMovie(selectedGenres, lang);
    
    if (movie) {
        // Build the movie card
        display.innerHTML = `
            <div class="movie-card">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/500x750?text=No+Poster'">
                <div class="movie-info">
                    <h2>${movie.title}</h2>
                    <p class="rating">⭐ ${movie.vote_average} / 10</p>
                    <p class="overview">${movie.overview ? movie.overview.slice(0, 120) + '...' : 'No description available.'}</p>
                </div>
                <div class="actions">
                    <button class="like" id="btn-like">Add to Watchlist</button>
                    <button class="dislike" id="btn-dislike">Skip</button>
                </div>
            </div>
        `;

        // Attach Firebase save events
        document.getElementById('btn-like').onclick = () => saveShow(movie, 'watchlist');
        document.getElementById('btn-dislike').onclick = () => {
            display.innerHTML = ""; // Clear current and let them click generate again
            genBtn.click(); // Auto-find another one
        };
    } else {
        display.innerHTML = "<p>No movies found. Try selecting fewer filters!</p>";
    }
};