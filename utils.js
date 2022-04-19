const debounce = (func, delay = 1000) => {
    let timeoutId
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId) // Impede o setTimeout anterior de executar
        }
        timeoutId = setTimeout(() => { // Gera um id novo e atribui para a var toda vez
            func.apply(null, args) // transforma a array em argumentos separados
        }, delay)
    }
}
