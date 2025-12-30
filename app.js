const genBtn = document.getElementById('generate-btn');
const display = document.getElementById('result-display');

genBtn.onclick = async () => {
    const selectedGenres = Array.from(document.querySelectorAll('.genre-check:checked')).map(el => el.value);
    const selection = document.getElementById('language-select').value;
    
    display.innerHTML = "<div class='loading-text'>Fetching accurate matches...</div>";
    
    const content = await getMovie(selectedGenres, selection);
    
    if (content) {
        showFullDetails(content.id, content.media_type);
    } else {
        display.innerHTML = "<p>No results found. Try broader filters!</p>";
    }
};

async function showFullDetails(id, type) {
    const detailsUrl = `https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_KEY}&append_to_response=recommendations,credits,videos`;
    
    try {
        const res = await fetch(detailsUrl);
        const data = await res.json();

        display.innerHTML = `
            <div class="movie-card">
                <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" onerror="this.src='https://via.placeholder.com/500x750'">
                <div class="movie-info">
                    <h2>${data.title || data.name}</h2>
                    <p class="meta">${data.release_date || data.first_air_date} | ⭐ ${data.vote_average.toFixed(1)}</p>
                    <p class="full-overview">${data.overview}</p>
                    
                    <h3>Cast</h3>
                    <p class="cast-list">${data.credits.cast.slice(0, 5).map(c => c.name).join(', ')}</p>

                    <hr>
                    <h3>Similar Recommendations</h3>
                    <div class="recs">
                        ${data.recommendations.results.slice(0, 6).map(r => `
                            <div class="rec-item" onclick="showFullDetails(${r.id}, '${type}')">
                                <img src="https://image.tmdb.org/t/p/w200${r.poster_path}">
                                <p>${r.title || r.name}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="actions">
                    <button class="like" id="btn-like">Like</button>
                    <button class="watchlist-btn" id="btn-watch">Watchlist</button>
                    <button class="dislike" id="btn-dislike">Skip</button>
                </div>
            </div>
        `;

        // Pass the whole 'data' object to saveShow
        document.getElementById('btn-like').onclick = () => saveShow(data, 'liked');
        document.getElementById('btn-watch').onclick = () => saveShow(data, 'watchlist');
        document.getElementById('btn-dislike').onclick = () => genBtn.click();

    } catch (err) {
        display.innerHTML = "<p>Error loading details.</p>";
    }
}