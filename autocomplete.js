const createAutoComplete = ({
    root, // onde redenrizar 
    renderOption, // como mostrar cada item individualmente
    onOptionSelect,  // o que fazer o item é clicado
    inputValue, // o que mostrar no input quando um item foi clicado
    fetchData // como pesquisar os dados
}) => {

    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>  
      `


    const input = root.querySelector('input')
    const dropdown = root.querySelector('.dropdown')
    const resultsWrapper = root.querySelector('.results')


    const onInput = async event => { 
        const items = await fetchData(event.target.value) // Pesquisa com o valor dentro do input
        
        if (!items.length) { 
            // se não tiver dados na busca o dropdown é removido e o codigo para 
            dropdown.classList.remove('is-active')
            return
        }

        resultsWrapper.innerHTML = `` // Limpa os resultados
        dropdown.classList.add('is-active') // Ativa o drop down

        for (let item of items) {
            const option = document.createElement('a') // Cria elemento 
           
            option.classList.add('dropdown-item') // aplica estilo da bulma.css 
            option.innerHTML = renderOption(item)

            option.addEventListener('click', () => { // identifica qual foi clicado
                dropdown.classList.remove('is-active')
                input.value = inputValue(item)
                onOptionSelect(item)
            })

            resultsWrapper.appendChild(option) // injeta dentro do .results o conteúdo
        }
    }


    // faz a pesquisa com o valor no input a cada segundo que não digitar
    input.addEventListener('input', debounce(onInput, 1000))


    // Fecha o dropdown quando clicado fora dele
    document.addEventListener('click', event => { // Identifica onde foi clicado no documento
        if (!root.contains(event.target)) { // Qualquer 1 que não for o root irá fechar o dropdown
            dropdown.classList.remove('is-active')
        }
    })

}