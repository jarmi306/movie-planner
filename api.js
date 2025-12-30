const TMDB_KEY = 'c483ed36ea1f2ab5fdd8d61da303798b'; 

async function getMovie(genres, lang) {
    const genreIds = genres.join(',');
    const randomPage = Math.floor(Math.random() * 5) + 1;
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=${genreIds}&with_original_language=${lang}&page=${randomPage}&sort_by=popularity.desc`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[Math.floor(Math.random() * data.results.length)];
        }
        return null;
    } catch (err) {
        console.error("API Error:", err);
        return null;
    }
}