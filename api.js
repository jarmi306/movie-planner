const TMDB_KEY = 'c483ed36ea1f2ab5fdd8d61da303798b'; 

async function getMovie(genres, lang) {
    const genreIds = genres.join(',');
    // We pick a random page (1 to 5) to ensure different results every time
    const randomPage = Math.floor(Math.random() * 5) + 1;
    
    // TMDB uses ISO codes: 'ko' for Korean, 'hi' for Hindi, 'zh' for Chinese, 'en' for English
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=${genreIds}&with_original_language=${lang}&page=${randomPage}&sort_by=popularity.desc`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            // Pick a random movie from the results array
            return data.results[Math.floor(Math.random() * data.results.length)];
        }
        return null;
    } catch (err) {
        console.error("TMDB API Error:", err);
        return null;
    }
}