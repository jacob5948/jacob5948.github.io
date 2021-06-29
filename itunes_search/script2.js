var results = []
var currentStart = 0

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    $("#next_button").click(() => {
        $(".card-body").animate({ scrollTop: 0 }, "fast");
        if (currentStart < results.length + 1) {
            currentStart += 11
            console.log(`[NEXT] ${currentStart} -> ${currentStart + 11}`)
            loadEpisodes(results.slice(currentStart, currentStart + 11))
        } else {
            alert("No more results")
        }   
    })

    $("#prev_button").click(() => {
        $(".card-body").animate({ scrollTop: 0 }, "fast");
        if (currentStart >= 11) {
            currentStart -= 11
            console.log(`[PREV] ${currentStart} -> ${currentStart + 11}`)
            loadEpisodes(results.slice(currentStart, currentStart + 11))
        } else {
            alert("No more results")
        }   
    })

    lookup({'id':id, 'media':'podcast', 'entity':'podcastEpisode', 'limit':5000})
    $("#more_button").css('display','initial')
}

function appleCallback(data) {
    //console.log(data)
    results = data.results
    //console.log(results)
    loadEpisodes(results.slice(currentStart, currentStart+11))
}

function loadEpisodes(episodes) {
    if (episodes.length > 0) {
        $(".card-body").empty()

        let podcastName = episodes.shift().collectionName
        $('#podcast_title').text(podcastName)
        document.title = podcastName
    
        episodes.forEach(result => {
            //console.log(result)
            releaseDate = new Date(result.releaseDate).toLocaleDateString('en-us')
            title = result.trackName
            picture = result.artworkUrl160 ? result.artworkUrl160 : "https://via.placeholder.com/150/000000/FFFFFF/?text=Noimagefound"
            id = result.collectionId
            html = 
`<div class="row my-2">
    <div class="col-auto">
        <img src="${picture}" height="100px" width="100px">
    </div>
    <div class="col-10">
        <div class="row">
            <h2 style="white-space: nowrap;">${title}</h2>
        </div>
        <div class="row">
            <h4 style="white-space: nowrap;">${releaseDate}</h4>
        </div>
    </div>
</div>`
            $(".card-body").append(html)
        });
    }
}
/*
    term (REQ): <search term>
    country (REQ): US
    id: <collection id, can be used to get podcast episodes given the podcast collection id>
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
    attribute: <attributes to search for>? might be incorrect...
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
    if (!query.term & !query.id) {
        throw Error("search term or id required")
    } else {
        console.log(query.term)
        if (query.term) { 
            let cleanTerm = encodeURIComponent(query.term).replace(/%20/g, "+")
            var url = `https://itunes.apple.com/search?term=${cleanTerm}&country=US&callback=appleCallback`
        } else { 
            if (query.id) {
                idValid = /^\d*$/g.test(query.id)
                if(!idValid) {
                    throw Error("id value is invalid")
                } else {
                    var url = `https://itunes.apple.com/search?id=${query.id}&country=US&callback=appleCallback`
                }
            }
        }

        if (query.media) {
            mediaValid = ['movie', 'podcast', 'music', 'musicVideo', 'audiobook', 'shortFile', 'tvShow', 'software', 'ebook', 'all'].includes(query.media)
            if (!mediaValid) {
                throw Error("media value is invalid")
            } else {
                url += `&media=${query.media}`
            }
        }
    
        if (query.entity) {
            entityValid = ['movie', 'movieArtistpodcast', 'podcastAuth', 'podcastEpisodesong', 'podcastEpisode', 'musicArtist', 'musicTrack', 'album', 'musicVideo', 'mixmusicVideo', 'musicArtistaudiobook', 'audiobookAuthorshortFile', 'shortFilmArtisttvEpisode', 'tvSeasonsoftware', 'iPadSoftware', 'macSoftwareebookmovie', 'album', 'allArtist', 'podcast', 'musicVideo', 'mix', 'audiobook', 'tvSeason', 'allTrack'].includes(query.entity)
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

function lookup(query) {
    if (!query.id) {
        throw Error("lookup id required")
    } else {
        idValid = /^\d*$/g.test(query.id)
        if(!idValid) {
            throw Error("id value is invalid")
        } else {
            var url = `https://itunes.apple.com/lookup?id=${query.id}&country=US&callback=appleCallback`

            if (query.media) {
                mediaValid = ['movie', 'podcast', 'music', 'musicVideo', 'audiobook', 'shortFile', 'tvShow', 'software', 'ebook', 'all'].includes(query.media)
                if (!mediaValid) {
                    throw Error("media value is invalid")
                } else {
                    url += `&media=${query.media}`
                }
            }
        
            if (query.entity) {
                entityValid = ['movie', 'movieArtistpodcast', 'podcastAuth', 'podcastEpisodesong', 'podcastEpisode', 'musicArtist', 'musicTrack', 'album', 'musicVideo', 'mixmusicVideo', 'musicArtistaudiobook', 'audiobookAuthorshortFile', 'shortFilmArtisttvEpisode', 'tvSeasonsoftware', 'iPadSoftware', 'macSoftwareebookmovie', 'album', 'allArtist', 'podcast', 'musicVideo', 'mix', 'audiobook', 'tvSeason', 'allTrack'].includes(query.entity)
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
}

//fetch("https://itunes.apple.com/search?term=mystery&limit=200&country=US&lan=en_us&entity=podcastEpisode")
//.then(response => {
//    return response.json()
//})
//.then(results => {
//    console.log(results)
//})
//console.log("world")