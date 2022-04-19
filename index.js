const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? "" : movie.Poster // Se o filme mão tiver poster
        return ` 
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `
    }, 
    inputValue(movie) {
        return movie.Title
    },
    async fetchData(searchTerm){
        const response = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey: '797d2cbd',
                s: searchTerm
            }
        })

        if (response.data.Error) {
            return []
        }
        
        return response.data.Search 
    }  
}

createAutoComplete({
    ...autoCompleteConfig,
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector("#left-summary"), 'left')
    },
    root: document.querySelector('#left-autocomplete'),
})

createAutoComplete({
    ...autoCompleteConfig,
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector("#right-summary"), 'right')
    },
    root: document.querySelector('#right-autocomplete')
})

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: '797d2cbd',
            i: movie.imdbID
        }
    })

    if(side === 'left') {
        leftMovie = response.data
    } else {
        rightMovie = response.data
    }

    summaryElement.innerHTML = movieTemplate(response.data) // adiciona as informaçôes na tela

    if (leftMovie && rightMovie) {
        runComparison()
    }    
}   

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification')
    const rightSideStats = document.querySelectorAll('#right-summary .notification')

    console.log('1' , leftSideStats)
    console.log('2' , rightSideStats)


    // Roda a array e reaproveita já que as duas arrays tem o memso tamanho
    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index]

        const leftSideValue = parseFloat(leftStat.dataset.value)
        const rightSideValue = parseFloat(rightStat.dataset.value)
        console.log(leftSideValue, ' ' , rightSideValue)

        const classes = ['is-warning', 'is-primary', 'is-info', 'nan']
        for (classe of classes) {
            leftStat.classList.remove(classe)
            rightStat.classList.remove(classe)
        }

        if (isNaN(rightSideValue) || isNaN(leftSideValue)) {
            leftStat.classList.add('nan')
            rightStat.classList.add('nan')
        }else if (rightSideValue > leftSideValue) {
            leftStat.classList.add('is-warning')
            rightStat.classList.add('is-primary')
        }else if (rightSideValue == leftSideValue) {
            leftStat.classList.add('is-info')
            rightStat.classList.add('is-info')
        } else {
            rightStat.classList.add('is-warning')
            leftStat.classList.add('is-primary')
        }
    })
}

const movieTemplate = (movieDetail) => {
    const dollars = parseInt(
        movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
    )
    const metascore = parseInt(movieDetail.Metascore)
    const imdbScore = parseFloat(movieDetail.imdbRating)
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))

    // split(), nesse caso, utiliza o ' ' da string para separar as index
    // então os valoresdas index são pegos e somados caso sejam numeros
    const awards = movieDetail.Awards
    if (awards === 'N/A') {
        awards === NaN
    } else {
        awards.split(' ').reduce((valorAnterior, palavra) => {
            const value = parseInt(palavra)
    
            if (isNaN(palavra)){
                return valorAnterior
            } else {
                return valorAnterior + value
            }
        }, 0)
    }
    
    return `
        <article class="media">
        <figure class="media-left">
        <p class="image">
        <img src="${movieDetail.Poster}"/>
        </p>
        </figure>
        <div class="media-content">
        <div class="content">
            <h1>${movieDetail.Title}<span> (${movieDetail.Year})</span></h1>
            <h4>${movieDetail.Genre}</h4>
            <p>${movieDetail.Plot}</p>
        </div>
        </div>
        </article>

        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbScore} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
    `    
}