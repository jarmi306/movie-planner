const TMDB_KEY = 'YOUR_TMDB_API_KEY_HERE'; 

async function getMovie(genres, lang) {
    const genreIds = genres.join(',');
    const randomPage = Math.floor(Math.random() * 3) + 1;
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=${genreIds}&with_original_language=${lang}&page=${randomPage}`;
    
    const response = await fetch(url);
    const data = await response.json();
    return data.results[Math.floor(Math.random() * data.results.length)];
}