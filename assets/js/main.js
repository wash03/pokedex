const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const dialog = document.getElementById("dialog-details")

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-key="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

async function loadPokemonItens(offset, limit) {
    await pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    }).then(() => {
        document.querySelectorAll('.pokemon').forEach((pokemon) => {
            pokemon.addEventListener('click', () => {
                getPokemonDetails(pokemon.dataset.key)
            })
        })
    })
}

function getPokemonDetails(pokeId) {
    pokeApi.getPokemon(pokeId).then((pokemon) => {
        dialog.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <div class="poke">
                <div class="poke-header ${pokemon.type}">
                    <div class="poke-header-info">
                        <span class="number"><strong>#${pokemon.number}</strong></span>
                        <span class="name">${pokemon.name}</span>

                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                    </div>

                    <img class="poke-img" src="${pokemon.photo}"
                         alt="${pokemon.name}">
                </div>
                <div class="poke-infos">
                    <p class="abilities-title">Habilidades</p>
                    <ul class="abilities">
                        ${pokemon.abilities.map((ability) => `<li class="ability">${ability}</li>`).join('')}
                    </ul>
                    <p class="abilities-title">Movimentos</p>
                    <ul class="abilities">
                        ${pokemon.moves.map((move) => `<li class="ability">${move}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
        `

        dialog.showModal();
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})


// function openDetailsPokemon() {
//     dialog.showModal();
    

// }

function closeModal() {
    dialog.close();
}