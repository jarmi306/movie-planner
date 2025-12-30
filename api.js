const TMDB_KEY = 'c483ed36ea1f2ab5fdd8d61da303798b'; 

async function getMovie(genres, selection) {
    const [type, lang] = selection.split('-'); 
    const endpoint = type === 'tv' ? 'discover/tv' : 'discover/movie';
    const safety = "&include_adult=false";
    const modern = "&primary_release_date.gte=2010-01-01&first_air_date.gte=2010-01-01";
    
    let genreString = genres.join(',');

    // LEVEL 1: Strict Search (Language + Genre + Modern)
    let result = await fetchFromTMDB(endpoint, genreString, lang, modern + safety);

    // LEVEL 2: Relax Date (Language + Genre + Any Year)
    if (!result) {
        console.log("No modern match. Trying all years...");
        result = await fetchFromTMDB(endpoint, genreString, lang, safety);
    }

    // LEVEL 3: Relax Genre (Language + Popularity) - This fixes the "Nothing found" error
    if (!result) {
        console.log("No genre match. Finding closest trending show in this region...");
        result = await fetchFromTMDB(endpoint, "", lang, safety);
    }

    return result;
}

async function fetchFromTMDB(endpoint, genreIds, lang, filters) {
    const page = Math.floor(Math.random() * 3) + 1;
    const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_KEY}&with_genres=${genreIds}&with_original_language=${lang}&page=${page}&sort_by=popularity.desc${filters}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
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
    } catch (e) { return null; }
}

async function getTrendingRow(type, lang, genreId = "") {
    const url = `https://api.themoviedb.org/3/discover/${type}?api_key=${TMDB_KEY}&with_original_language=${lang}&with_genres=${genreId}&sort_by=popularity.desc&include_adult=false&page=1`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.results.slice(0, 10);
    } catch (e) { return []; }
}