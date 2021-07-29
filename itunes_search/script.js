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
        id = result.collectionId
        html = 
`<div class="row my-2">
    <div class="col-auto">
        <a href="episodes.html?id=${id}"><img src="${picture}" height="100px" width="100px"></a>
    </div>
    <div class="col-10">
        <div class="row">
            <h2 style="white-space: nowrap;">${podcast}</h2>
        </div>
        <div class="row">
            <h4 style="white-space: nowrap;">${id}</h4>
        </div>
    </div>
</div>`
        $(".card-body").append(html)
    });
}

function search(term=undefined, id=undefined, media='podcast', entity='podcast', attribute=undefined, limit=undefined, callback='appleCallback') {
    if (!term & !id) {
        throw Error("search term or id required")
    } else {
        if (term) { 
            let cleanTerm = encodeURIComponent(term).replace(/%20/g, "+")
            var url = `https://itunes.apple.com/search?term=${cleanTerm}&country=US`
        } else { 
            if (id) {
                idValid = /^\d*$/g.test(id)
                if(!idValid) {
                    throw Error("id value is invalid")
                } else {
                    var url = `https://itunes.apple.com/search?id=${id}&country=US`
                }
            }
        }

        if (callback) {
            url += `&callback=${callback}`
        } else {
            url += `&callback=appleCallback`
        }

        if (media) {
            mediaValid = ['movie', 'podcast', 'music', 'musicVideo', 'audiobook', 'shortFile', 'tvShow', 'software', 'ebook', 'all'].includes(media)
            if (!mediaValid) {
                throw Error("media value is invalid")
            } else {
                url += `&media=${media}`
            }
        } else {
            url += `&media=${media}`
        }
    
        if (entity) {
            entityValid = ['movie', 'movieArtistpodcast', 'podcastAuth', 'podcastEpisodesong', 'podcastEpisode', 'musicArtist', 'musicTrack', 'album', 'musicVideo', 'mixmusicVideo', 'musicArtistaudiobook', 'audiobookAuthorshortFile', 'shortFilmArtisttvEpisode', 'tvSeasonsoftware', 'iPadSoftware', 'macSoftwareebookmovie', 'album', 'allArtist', 'podcast', 'musicVideo', 'mix', 'audiobook', 'tvSeason', 'allTrack'].includes(entity)
            if(!entityValid) {
                throw Error("entity value is invalid")
            } else {
                url += `&entity=${entity}`
            }
        }
    
        if (attribute) {
            attributeValid = ['actorTerm', 'genreIndex', 'artistTerm', 'shortFilmTerm', 'producerTerm', 'ratingTerm', 'directorTerm', 'releaseYearTerm', 'featureFilmTerm', 'movieArtistTerm', 'movieTerm', 'ratingIndex', 'descriptionTerm', 'titleTerm', 'languageTerm', 'authorTerm', 'genreIndex', 'artistTerm', 'ratingIndex', 'keywordsTerm', 'descriptionTerm', 'mixTerm', 'genreIndex', 'artistTerm', 'composerTerm', 'albumTerm', 'ratingIndex', 'songTerm', 'genreIndex', 'artistTerm', 'albumTerm', 'ratingIndex', 'songTerm', 'titleTerm', 'authorTerm', 'genreIndex', 'ratingIndex', 'genreIndex', 'artistTerm', 'shortFilmTerm', 'ratingIndex', 'descriptionTerm', 'softwareDeveloper', 'genreIndex', 'tvEpisodeTerm', 'showTerm', 'tvSeasonTerm', 'ratingIndex', 'descriptionTerm', 'actorTerm', 'languageTerm', 'allArtistTerm', 'tvEpisodeTerm', 'shortFilmTerm', 'directorTerm', 'releaseYearTerm', 'titleTerm', 'featureFilmTerm', 'ratingIndex', 'keywordsTerm', 'descriptionTerm', 'authorTerm', 'genreIndex', 'mixTerm', 'allTrackTerm', 'artistTerm', 'composerTerm', 'tvSeasonTerm', 'producerTerm', 'ratingTerm', 'songTerm', 'movieArtistTerm', 'showTerm', 'movieTerm', 'albumTerm'].includes(attribute)
            if (!attributeValid) {
                throw Error("attribute value is invalid")
            } else {
                url += `&attribute=${attribute}`
            }
        }
    
        if(limit) {
            limitValid = limit > 0 && Number.isInteger(limit)
            if (!limitValid) {
                throw Error("limit value is invalid")
            } else {
                url += `&limit=${limit}`
            }
        }
        
        let s = document.createElement("script");
        s.src = url;
        document.body.appendChild(s);
    }
}

function lookup(id, media = 'podcast', entity = 'podcastEpisode', attribute = undefined, limit = undefined, callback = 'appleCallback') {
    if (!id) {
        throw Error("lookup id required")
    } else {
        idValid = /^\d*$/g.test(id)
        if(!idValid) {
            throw Error("id value is invalid")
        } else {
            var url = `https://itunes.apple.com/lookup?id=${id}&country=US`

            if (media) {
                mediaValid = ['movie', 'podcast', 'music', 'musicVideo', 'audiobook', 'shortFile', 'tvShow', 'software', 'ebook', 'all'].includes(media)
                if (!mediaValid) { throw Error("media value is invalid") } else { url += `&media=${media}` }
            }
        
            if (entity) {
                entityValid = ['movie', 'movieArtistpodcast', 'podcastAuth', 'podcastEpisodesong', 'podcastEpisode', 'musicArtist', 'musicTrack', 'album', 'musicVideo', 'mixmusicVideo', 'musicArtistaudiobook', 'audiobookAuthorshortFile', 'shortFilmArtisttvEpisode', 'tvSeasonsoftware', 'iPadSoftware', 'macSoftwareebookmovie', 'album', 'allArtist', 'podcast', 'musicVideo', 'mix', 'audiobook', 'tvSeason', 'allTrack'].includes(entity)
                if(!entityValid) { throw Error("entity value is invalid") } else { url += `&entity=${entity}` }
            }
        
            if (attribute) {
                attributeValid = ['actorTerm', 'genreIndex', 'artistTerm', 'shortFilmTerm', 'producerTerm', 'ratingTerm', 'directorTerm', 'releaseYearTerm', 'featureFilmTerm', 'movieArtistTerm', 'movieTerm', 'ratingIndex', 'descriptionTerm', 'titleTerm', 'languageTerm', 'authorTerm', 'genreIndex', 'artistTerm', 'ratingIndex', 'keywordsTerm', 'descriptionTerm', 'mixTerm', 'genreIndex', 'artistTerm', 'composerTerm', 'albumTerm', 'ratingIndex', 'songTerm', 'genreIndex', 'artistTerm', 'albumTerm', 'ratingIndex', 'songTerm', 'titleTerm', 'authorTerm', 'genreIndex', 'ratingIndex', 'genreIndex', 'artistTerm', 'shortFilmTerm', 'ratingIndex', 'descriptionTerm', 'softwareDeveloper', 'genreIndex', 'tvEpisodeTerm', 'showTerm', 'tvSeasonTerm', 'ratingIndex', 'descriptionTerm', 'actorTerm', 'languageTerm', 'allArtistTerm', 'tvEpisodeTerm', 'shortFilmTerm', 'directorTerm', 'releaseYearTerm', 'titleTerm', 'featureFilmTerm', 'ratingIndex', 'keywordsTerm', 'descriptionTerm', 'authorTerm', 'genreIndex', 'mixTerm', 'allTrackTerm', 'artistTerm', 'composerTerm', 'tvSeasonTerm', 'producerTerm', 'ratingTerm', 'songTerm', 'movieArtistTerm', 'showTerm', 'movieTerm', 'albumTerm'].includes(attribute)
                if (!attributeValid) { throw Error("attribute value is invalid") } else { url += `&attribute=${attribute}` }
            }
        
            if(limit) {
                limitValid = limit > 0 && Number.isInteger(limit)
                if (!limitValid) { throw Error("limit value is invalid") } else { url += `&limit=${limit}` }
            }

            let s = document.createElement("script");
            s.src = url;
            document.body.appendChild(s);
        }
    }
}