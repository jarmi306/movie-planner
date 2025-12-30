const TMDB_KEY = 'c483ed36ea1f2ab5fdd8d61da303798b'; 

async function getMovie(genres, selection) {
    const [type, lang] = selection.split('-'); 
    const endpoint = type === 'tv' ? 'discover/tv' : 'discover/movie';
    
    // Attempt 1: Strict Match (All selected genres)
    let genreString = genres.join(',');
    let result = await fetchFromTMDB(endpoint, genreString, lang);

    // Attempt 2: Relaxed Match (If Attempt 1 failed and you chose multiple genres)
    if (!result && genres.length > 1) {
        console.log("No strict match found. Relaxing filters...");
        // Pick one genre at random from your selection to find a 'closest' result
        const fallbackGenre = genres[Math.floor(Math.random() * genres.length)];
        result = await fetchFromTMDB(endpoint, fallbackGenre, lang);
    }

    return result;
}

// Helper function to handle the actual API call
async function fetchFromTMDB(endpoint, genreIds, lang) {
    const randomPage = Math.floor(Math.random() * 3) + 1;
    const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_KEY}&with_genres=${genreIds}&with_original_language=${lang}&page=${randomPage}&sort_by=popularity.desc`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const item = data.results[Math.floor(Math.random() * data.results.length)];
            const [type] = endpoint.split('/').reverse(); // gets 'tv' or 'movie'
            
            return {
                id: item.id,
                title: item.title || item.name,
                poster_path: item.poster_path,
                overview: item.overview,
                vote_average: item.vote_average,
                release_date: item.release_date || item.first_air_date,
                media_type: endpoint.includes('tv') ? 'tv' : 'movie'
            };
        }
        return null;
    } catch (err) {
        console.error("TMDB Error:", err);
        return null;
    }
}