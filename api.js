const TMDB_KEY = 'c483ed36ea1f2ab5fdd8d61da303798b'; 

async function getMovie(genres, selection) {
    const [type, lang] = selection.split('-'); 
    const endpoint = type === 'tv' ? 'discover/tv' : 'discover/movie';
    const adultFilter = "&include_adult=false";
    const modernFilter = "&primary_release_date.gte=2010-01-01&first_air_date.gte=2010-01-01";
    
    // Anime logic
    let finalGenres = [...genres];
    if (selection === 'tv-ja' && !finalGenres.includes('16')) finalGenres.push('16');
    let genreString = finalGenres.join(',');

    // Attempt 1: Strict (Modern + All Genres)
    let result = await fetchFromTMDB(endpoint, genreString, lang, modernFilter + adultFilter);

    // Attempt 2: Relax Date (Post-2010 is often too strict for Horror TV)
    if (!result) {
        console.log("Relaxing date filter...");
        result = await fetchFromTMDB(endpoint, genreString, lang, adultFilter);
    }

    // Attempt 3: Relax Genres (If still no result, pick one genre)
    if (!result && genres.length > 0) {
        console.log("Relaxing genres...");
        result = await fetchFromTMDB(endpoint, genres[0], lang, adultFilter);
    }

    return result;
}

// Function to fetch a list for the home page rows
async function getTrendingRow(type, lang, genreId = "") {
    const url = `https://api.themoviedb.org/3/discover/${type}?api_key=${TMDB_KEY}&with_original_language=${lang}&with_genres=${genreId}&sort_by=popularity.desc&include_adult=false&page=1`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.results.slice(0, 10);
    } catch (e) { return []; }
}

async function fetchFromTMDB(endpoint, genreIds, lang, extraFilters) {
    const randomPage = Math.floor(Math.random() * 5) + 1;
    const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_KEY}&with_genres=${genreIds}&with_original_language=${lang}&page=${randomPage}&sort_by=popularity.desc${extraFilters}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const item = data.results[Math.floor(Math.random() * data.results.length)];
            return {
                id: item.id, title: item.title || item.name, poster_path: item.poster_path,
                overview: item.overview, vote_average: item.vote_average,
                release_date: item.release_date || item.first_air_date,
                media_type: endpoint.includes('tv') ? 'tv' : 'movie'
            };
        }
        return null;
    } catch (err) { return null; }
}