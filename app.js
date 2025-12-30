const genBtn = document.getElementById('generate-btn');
const display = document.getElementById('result-display');

genBtn.onclick = async () => {
    const selectedGenres = Array.from(document.querySelectorAll('.genre-check:checked')).map(el => el.value);
    const lang = document.getElementById('language-select').value;
    
    display.innerHTML = "<p>Searching...</p>";
    const movie = await getMovie(selectedGenres, lang);
    
    if (movie) {
        display.innerHTML = `
            <div class="movie-card">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
                <div style="padding:15px">
                    <h2>${movie.title}</h2>
                    <p>${movie.overview.slice(0, 100)}...</p>
                </div>
                <div class="actions">
                    <button class="like" id="btn-like">Liked</button>
                    <button class="dislike" id="btn-dislike">Disliked</button>
                </div>
            </div>
        `;
        document.getElementById('btn-like').onclick = () => saveShow(movie, 'liked');
        document.getElementById('btn-dislike').onclick = () => saveShow(movie, 'disliked');
    }
};