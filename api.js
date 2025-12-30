const TMDB_KEY = 'c483ed36ea1f2ab5fdd8d61da303798b'; 

async function getMovie(genres, selection) {
    const [type, lang] = selection.split('-'); 
    const genreIds = genres.join(',');
    const randomPage = Math.floor(Math.random() * 5) + 1;
    
    const endpoint = type === 'tv' ? 'discover/tv' : 'discover/movie';
    const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_KEY}&with_genres=${genreIds}&with_original_language=${lang}&page=${randomPage}&sort_by=popularity.desc`;
    
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
                media_type: type 
            };
        }
        return null;
    } catch (err) {
        return null;
    }
}