const genBtn = document.getElementById('generate-btn');
const display = document.getElementById('result-display');

/**
 * Main function to generate a movie based on filters
 */
genBtn.onclick = async () => {
    const selectedGenres = Array.from(document.querySelectorAll('.genre-check:checked')).map(el => el.value);
    const lang = document.getElementById('language-select').value;
    
    display.innerHTML = "<div style='text-align:center; padding:20px;'>Searching the globe for a hit...</div>";
    
    const movie = await getMovie(selectedGenres, lang);
    
    if (movie) {
        // Instead of just showing a card, we fetch deep details immediately
        showFullDetails(movie.id);
    } else {
        display.innerHTML = "<p style='text-align:center'>No movies found. Try selecting fewer filters!</p>";
    }
};

/**
 * Fetches expanded details, cast, and recommendations from TMDB
 */
async function showFullDetails(movieId) {
    display.innerHTML = "<div style='text-align:center; padding:20px;'>Loading full details...</div>";
    
    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_KEY}&append_to_response=recommendations,credits`;
    
    try {
        const res = await fetch(detailsUrl);
        const movie = await res.json();

        // Build the expanded interface
        display.innerHTML = `
            <div class="movie-card full-detail">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" onerror="this.src='https://via.placeholder.com/500x750?text=No+Poster'">
                
                <div class="movie-info">
                    <h2 style="margin-bottom:5px;">${movie.title}</h2>
                    <p style="color: #e50914; font-weight: bold; margin-bottom: 15px;">
                        ${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'} | ⭐ ${movie.vote_average.toFixed(1)}/10 | ${movie.runtime} mins
                    </p>
                    
                    <p><strong>Genres:</strong> ${movie.genres.map(g => g.name).join(', ')}</p>
                    
                    <h3>Overview</h3>
                    <p class="full-overview">${movie.overview || "No description available."}</p>
                    
                    <h3>Top Cast</h3>
                    <p style="color: #ccc;">${movie.credits.cast.slice(0, 5).map(c => c.name).join(', ')}</p>

                    <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">

                    <h3>If you liked this, you'll like:</h3>
                    <div class="recs">
                        ${movie.recommendations.results.length > 0 ? 
                            movie.recommendations.results.slice(0, 4).map(r => `
                                <div class="rec-item" onclick="showFullDetails(${r.id})">
                                    <img src="https://image.tmdb.org/t/p/w200${r.poster_path}" onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
                                    <p>${r.title.length > 20 ? r.title.substring(0, 17) + '...' : r.title}</p>
                                </div>
                            `).join('') : '<p>No recommendations found.</p>'
                        }
                    </div>
                </div>

                <div class="actions">
                    <button class="like" id="btn-like">Liked It</button>
                    <button class="watchlist-btn" id="btn-watch" style="background:#3498db">Watchlist</button>
                    <button class="dislike" id="btn-dislike">Disliked</button>
                </div>
                
                <button onclick="window.scrollTo(0,0)" style="background:none; color:#666; font-size:0.8rem; margin-top:10px; border:none;">Back to Top</button>
            </div>
        `;

        // Attach event listeners for saving
        document.getElementById('btn-like').onclick = () => saveShow(movie, 'liked');
        document.getElementById('btn-watch').onclick = () => saveShow(movie, 'watchlist');
        document.getElementById('btn-dislike').onclick = () => saveShow(movie, 'disliked');

    } catch (err) {
        console.error("Error loading details:", err);
        display.innerHTML = "<p>Error loading movie details. Please try again.</p>";
    }
}