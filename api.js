const TMDB_KEY = 'c483ed36ea1f2ab5fdd8d61da303798b'; 

async function getMovie(genres, selection) {
    const [type, lang] = selection.split('-'); 
    const endpoint = type === 'tv' ? 'discover/tv' : 'discover/movie';
    
    // Safety & Modern Filters
    const currentDate = new Date().toISOString().split('T')[0]; // 2025-12-30
    const adultFilter = "&include_adult=false";
    const modernFilter = "&primary_release_date.gte=2010-01-01&first_air_date.gte=2010-01-01";
    
    // If it's Anime (tv-ja), we MUST include the Animation genre (16)
    let finalGenres = [...genres];
    if (selection === 'tv-ja' && !finalGenres.includes('16')) {
        finalGenres.push('16');
    }

    let genreString = finalGenres.join(',');

    // Attempt 1: Modern & Strict (Post-2010)
    let result = await fetchFromTMDB(endpoint, genreString, lang, modernFilter + adultFilter);

    // Attempt 2: Relaxed (If no modern match, look for older classics)
    if (!result) {
        console.log("No modern match found. Expanding search...");
        result = await fetchFromTMDB(endpoint, genreString, lang, adultFilter);
    }

    return result;
}

async function fetchFromTMDB(endpoint, genreIds, lang, extraFilters) {
    // We search across the first 5 pages to get a mix of popularity and hidden gems
    const randomPage = Math.floor(Math.random() * 5) + 1;
    const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_KEY}&with_genres=${genreIds}&with_original_language=${lang}&page=${randomPage}&sort_by=popularity.desc${extraFilters}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const item = data.results[Math.floor(Math.random() * data.results.length)];
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
        return null;
    }
}