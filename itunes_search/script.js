window.onload = () => {
    $('#search_btn').click(() => {
        let term = $('#search_term').val()
        if (!(term == '')) {
            search({"term": term, "entity": "podcast"})
        }
    })
}

function appleCallback(data) {
    console.log(data)
    let results = data.results

    $(".card-body").empty()

    results.forEach(result => {
        console.log(result)
        artist = result.artistName
        podcast = result.collectionName
        picture = result.artworkUrl100 ? result.artworkUrl100 : "https://via.placeholder.com/150/000000/FFFFFF/?text=Noimagefound"
        html = 
`<div class="row my-2">
    <div class="col-auto">
        <img src="${picture}" height="100px" width="100px">
    </div>
    <div class="col-10">
        <div class="row">
            <h2 style="white-space: nowrap;">${podcast}</h2>
        </div>
        <div class="row">
            <h4 style="white-space: nowrap;">${artist}</h4>
        </div>
    </div>
</div>`
        $(".card-body").append(html)
    });
}
/*
    term (REQ): <search term>
    country (REQ): US
    media: <type of media to search>
        - movie, podcast, music, musicVideo, audiobook, shortFile, tvShow, software, ebook, all
    entity: <based on media type>
        - movie: movie, movieArtist
        - podcast: podcast, podcastAuth, podcastEpisode
        - music: song, musicArtist, musicTrack, album, musicVideo, mix
        - musicVideo: musicVideo, musicArtist
        - audiobook: audiobook, audiobookAuthor
        - shortFilm: shortFile, shortFilmArtist
        - tvShow: tvEpisode, tvSeason
        - software: software, iPadSoftware, macSoftware
        - ebook: ebook
        - all: movie, album, allArtist, podcast, musicVideo, mix, audiobook, tvSeason, allTrack
    attribute: <attributes to return>
        - movie: actorTerm, genreIndex, artistTerm, shortFilmTerm, producerTerm, ratingTerm, directorTerm, releaseYearTerm, featureFilmTerm, movieArtistTerm, movieTerm, ratingIndex, descriptionTerm
        - podcast: titleTerm, languageTerm, authorTerm, genreIndex, artistTerm, ratingIndex, keywordsTerm, descriptionTerm
        - music: mixTerm, genreIndex, artistTerm, composerTerm, albumTerm, ratingIndex, songTerm
        - musicVideo: genreIndex, artistTerm, albumTerm, ratingIndex, songTerm
        - audiobook: titleTerm, authorTerm, genreIndex, ratingIndex
        - shortFilm: genreIndex, artistTerm, shortFilmTerm, ratingIndex, descriptionTerm
        - software: softwareDeveloper
        - tvShow: genreIndex, tvEpisodeTerm, showTerm, tvSeasonTerm, ratingIndex, descriptionTerm
        - all: actorTerm, languageTerm, allArtistTerm, tvEpisodeTerm, shortFilmTerm, directorTerm, releaseYearTerm, titleTerm, featureFilmTerm, ratingIndex, keywordsTerm, descriptionTerm, authorTerm, genreIndex, mixTerm, allTrackTerm, artistTerm, composerTerm, tvSeasonTerm, producerTerm, ratingTerm, songTerm, movieArtistTerm, showTerm, movieTerm, albumTerm
    limit: <# of results to return>
*/
function search(query) {
    if (!query.term) {
        throw Error("search term required")
    } else {
        let cleanTerm = encodeURIComponent(query.term).replace(/%20/g, "+")
        var url = `https://itunes.apple.com/search?term=${cleanTerm}&country=US&callback=appleCallback`
        if (query.media) {
            mediaValid = ['movie', 'podcast', 'music', 'musicVideo', 'audiobook', 'shortFile', 'tvShow', 'software', 'ebook', 'all'].includes(query.media)
            if (!mediaValid) {
                throw Error("media value is invalid")
            } else {
                url += `&media=${query.media}`
            }
        }
    
        if (query.entity) {
            entityValid = ['movie', 'movieArtistpodcast', 'podcastAuth', 'podcastEpisodesong', 'musicArtist', 'musicTrack', 'album', 'musicVideo', 'mixmusicVideo', 'musicArtistaudiobook', 'audiobookAuthorshortFile', 'shortFilmArtisttvEpisode', 'tvSeasonsoftware', 'iPadSoftware', 'macSoftwareebookmovie', 'album', 'allArtist', 'podcast', 'musicVideo', 'mix', 'audiobook', 'tvSeason', 'allTrack'].includes(query.entity)
            if(!entityValid) {
                throw Error("entity value is invalid")
            } else {
                url += `&entity=${query.entity}`
            }
        }
    
        if (query.attribute) {
            attributeValid = ['actorTerm', 'genreIndex', 'artistTerm', 'shortFilmTerm', 'producerTerm', 'ratingTerm', 'directorTerm', 'releaseYearTerm', 'featureFilmTerm', 'movieArtistTerm', 'movieTerm', 'ratingIndex', 'descriptionTerm', 'titleTerm', 'languageTerm', 'authorTerm', 'genreIndex', 'artistTerm', 'ratingIndex', 'keywordsTerm', 'descriptionTerm', 'mixTerm', 'genreIndex', 'artistTerm', 'composerTerm', 'albumTerm', 'ratingIndex', 'songTerm', 'genreIndex', 'artistTerm', 'albumTerm', 'ratingIndex', 'songTerm', 'titleTerm', 'authorTerm', 'genreIndex', 'ratingIndex', 'genreIndex', 'artistTerm', 'shortFilmTerm', 'ratingIndex', 'descriptionTerm', 'softwareDeveloper', 'genreIndex', 'tvEpisodeTerm', 'showTerm', 'tvSeasonTerm', 'ratingIndex', 'descriptionTerm', 'actorTerm', 'languageTerm', 'allArtistTerm', 'tvEpisodeTerm', 'shortFilmTerm', 'directorTerm', 'releaseYearTerm', 'titleTerm', 'featureFilmTerm', 'ratingIndex', 'keywordsTerm', 'descriptionTerm', 'authorTerm', 'genreIndex', 'mixTerm', 'allTrackTerm', 'artistTerm', 'composerTerm', 'tvSeasonTerm', 'producerTerm', 'ratingTerm', 'songTerm', 'movieArtistTerm', 'showTerm', 'movieTerm', 'albumTerm'].includes(query.attribute)
            if (!attributeValid) {
                throw Error("attribute value is invalid")
            } else {
                url += `&attribute=${query.attribute}`
            }
        }
    
        if(query.limit) {
            limitValid = query.limit > 0 && Number.isInteger(query.limit)
            if (!limitValid) {
                throw Error("limit value is invalid")
            } else {
                url += `&limit=${query.limit}`
            }
        }
    
        console.log(url);
    
        let s = document.createElement("script");
        s.src = url;
        document.body.appendChild(s);
    }
}

//fetch("https://itunes.apple.com/search?term=mystery&limit=200&country=US&lan=en_us&entity=podcastEpisode")
//.then(response => {
//    return response.json()
//})
//.then(results => {
//    console.log(results)
//})
//console.log("world")