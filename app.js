const genBtn = document.getElementById('generate-btn');
const display = document.getElementById('result-display');
const loader = document.getElementById('loading-overlay');

// Load All Row Recommendations on Start
window.onload = async () => {
    loadRow('tv', 'ko', '', 'row-k-drama');
    loadRow('tv', 'ja', '16', 'row-anime');
    loadRow('tv', 'hi', '', 'row-bollywood');
    loadRow('movie', 'en', '', 'row-hollywood');
};

async function loadRow(type, lang, genre, elementId) {
    const data = await getTrendingRow(type, lang, genre);
    const container = document.getElementById(elementId);
    if (container) {
        container.innerHTML = data.map(m => `
            <div class="rec-item" onclick="showFullDetails(${m.id}, '${type}')">
                <img src="https://image.tmdb.org/t/p/w200${m.poster_path}">
                <p style="font-size:0.75rem; color:#888; margin-top:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${m.title || m.name}</p>
            </div>
        `).join('');
    }
}

genBtn.onclick = async () => {
    const selectedGenres = Array.from(document.querySelectorAll('.genre-check:checked')).map(el => el.value);
    const selection = document.getElementById('language-select').value;
    
    loader.style.display = 'flex'; // Popcorn Loader Start
    
    const content = await getMovie(selectedGenres, selection);
    
    setTimeout(() => {
        loader.style.display = 'none'; // Popcorn Loader End
        if (content) {
            showFullDetails(content.id, content.media_type);
            window.scrollTo({ top: display.offsetTop - 20, behavior: 'smooth' });
        } else {
            display.innerHTML = "<p style='text-align:center'>Finding the closest match...</p>";
        }
    }, 1500); 
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
                    <p class="full-overview" style="color:#ccc; font-size:0.9rem; line-height:1.4;">${data.overview}</p>
                    
                    ${trailer ? `<button onclick="window.open('https://youtube.com/watch?v=${trailer.key}')" style="background:#ff0000; border:none; color:white; padding:12px; border-radius:8px; width:100%; margin-bottom:15px; font-weight:bold; cursor:pointer;">Watch Trailer</button>` : ''}

                    <div class="recs">
                        ${data.recommendations.results.slice(0, 8).map(r => `
                            <div class="rec-item" onclick="showFullDetails(${r.id}, '${type}')">
                                <img src="https://image.tmdb.org/t/p/w200${r.poster_path}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="actions" style="display:flex; gap:10px; padding:15px;">
                    <button class="like" style="flex:1; background:#27ae60; border:none; color:white; padding:12px; border-radius:8px; font-weight:bold;" onclick="saveShow(${JSON.stringify(data).replace(/"/g, '&quot;')}, 'liked')">Like</button>
                    <button class="watchlist-btn" style="flex:1; background:#3498db; border:none; color:white; padding:12px; border-radius:8px; font-weight:bold;" onclick="saveShow(${JSON.stringify(data).replace(/"/g, '&quot;')}, 'watchlist')">Watchlist</button>
                    <button class="dislike" style="flex:1; background:#c0392b; border:none; color:white; padding:12px; border-radius:8px; font-weight:bold;" onclick="document.getElementById('generate-btn').click()">Skip</button>
                </div>
            </div>
        `;
    } catch (err) { console.error(err); }
}