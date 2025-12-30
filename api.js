const TMDB_KEY = 'c483ed36ea1f2ab5fdd8d61da303798b'; 

async function getMovie(genres, selection) {
    // Splits 'movie-ko' into type='movie' and lang='ko'
    const [type, lang] = selection.split('-'); 
    const genreIds = genres.join(',');
    const randomPage = Math.floor(Math.random() * 5) + 1;
    
    // Use 'tv' endpoint for series, 'movie' for films
    const endpoint = type === 'tv' ? 'discover/tv' : 'discover/movie';
    const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_KEY}&with_genres=${genreIds}&with_original_language=${lang}&page=${randomPage}&sort_by=popularity.desc`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const item = data.results[Math.floor(Math.random() * data.results.length)];
            // Normalize the data (Series use 'name', Movies use 'title')
            return {
                id: item.id,
                title: item.title || item.name,
                poster_path: item.poster_path,
                overview: item.overview,
                vote_average: item.vote_average,
                release_date: item.release_date || item.first_air_date,
                type: type // store if it was a movie or tv show
            };
        }
        return null;
    } catch (err) {
        console.error("TMDB Error:", err);
        return null;
    }
}