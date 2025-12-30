const genBtn = document.getElementById('generate-btn');
const display = document.getElementById('result-display');

genBtn.onclick = async () => {
    const selectedGenres = Array.from(document.querySelectorAll('.genre-check:checked')).map(el => el.value);
    const selection = document.getElementById('language-select').value;
    
    display.innerHTML = "<div class='loading-text' style='text-align:center; padding:40px; color:var(--primary); font-weight:bold;'>Finding matches...</div>";
    
    const content = await getMovie(selectedGenres, selection);
    
    if (content) {
        showFullDetails(content.id, content.media_type);
    } else {
        display.innerHTML = "<p style='text-align:center; padding:20px;'>No results found. Try fewer filters!</p>";
    }
};

async function showFullDetails(id, type) {
    const detailsUrl = `https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_KEY}&append_to_response=recommendations,credits,videos`;
    
    try {
        const res = await fetch(detailsUrl);
        const data = await res.json();
        const trailer = data.videos.results.find(v => v.type === 'Trailer');

        display.innerHTML = `
            <div class="movie-card">
                <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" onerror="this.src='https://via.placeholder.com/500x750'">
                <div class="movie-info">
                    <h2>${data.title || data.name}</h2>
                    <p style="color:var(--primary); font-weight:bold;">${data.release_date || data.first_air_date} | ⭐ ${data.vote_average.toFixed(1)}</p>
                    <p class="full-overview">${data.overview}</p>
                    
                    ${trailer ? `<button onclick="window.open('https://youtube.com/watch?v=${trailer.key}')" style="background:#ff0000; border:none; color:white; padding:10px; border-radius:5px; width:100%; margin-bottom:15px; font-weight:bold;">Watch Trailer</button>` : ''}

                    <h3>Similar Recommendations</h3>
                    <div class="recs">
                        ${data.recommendations.results.slice(0, 8).map(r => `
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

        document.getElementById('btn-like').onclick = () => saveShow(data, 'liked');
        document.getElementById('btn-watch').onclick = () => saveShow(data, 'watchlist');
        document.getElementById('btn-dislike').onclick = () => genBtn.click();

    } catch (err) {
        display.innerHTML = "<p>Error loading details.</p>";
    }
}