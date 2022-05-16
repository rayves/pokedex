const form = document.getElementById('pokemon-search');
// save element with id 'pokemon-search' (the form element)
const baseUrl = 'https://pokeapi.co/api/v2';
const typeColors = {
    normal: '#BEBEB0',
    poison: '#FFFDCF',
    psychic: '#F563B1',
    grass: '#F04F3F',
    ground: '#C8B76F',
    ice: '#8574FF',
    fire: '#55ACFF',
    rock: '#CDBC72',
    dragon: '#8874FF',
    water: '#A75545',
    bug: '#BFCE20',
    dark: '#C2C1D4',
    fighting: '#9D9AD5',
    ghost: '#FDE03E',
    steel: '#C4C2DA',
    flying: '#C4C2DA',
    electric: '#FDE53C',
    fairy: '#141518',
    poison: '#AB5DA3',
};

// On "click" event listener
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchBar = document.getElementById('search-bar');
    let { value } = searchBar;
    if (!value) {
        value = Math.floor(Math.random() * 898) + 1;
    }
    fetch(`${baseUrl}/pokemon/${value}`)
        // make fetch API request to retrieve data from the url
        .then((response) => response.json())
        // will receive back string from API so need to convert that to JSON
        .then(createPokemonData)
        .then((pokemonData) => populatePokemonDiv(pokemonData))
        .catch(handleError)
        .finally(() => (searchBar.value = ''));
    // empty the search bar after the value has been used to make the request
});

function handleError(error) {
    console.log(error.message);
    document.getElementById('main-section').innerHTML = `
    <p style="color: red">Oops, Something went wrong</p>
    `;
}

// function to display pokemon types in badges
function createTypeBadges(types) {
    const badgeString = types.reduce((initial, next) => {
        const type = next.type.name;
        return (initial += `<span class="badge badge-pill" style="background-color: ${typeColors[type]}">${type}</span>`);
    }, '');
    return badgeString;
}

function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

// async function to call properties from the retrieved data
async function createPokemonData(data) {
    // destructure multiple properties from data
    const {
        name,
        types,
        moves,
        sprites: { front_default: pictureUrl },
    } = data;
    const randomMove = getRandomElement(moves);
    const response = await fetch(randomMove.move.url);
    const moveObject = await response.json();
    console.log(moveObject);
    const { flavor_text_entries, name: moveName } = moveObject;
    const { flavor_text } = flavor_text_entries[1]; //TODO fix so flavor-text calls text that is english only
    return { name, types, moveName, flavor_text, pictureUrl };
}

// function to alter the main element and add pokemon card HTML
function populatePokemonDiv(pokemonData) {
    const { name, pictureUrl, moveName, flavor_text, types } = pokemonData;

    document.getElementById('main-section').innerHTML = `
  <div class="card" style="width: 60%; margin: auto">
    <div class="card-header mb-2">${name}</div>
    <div>${createTypeBadges(types)}</div>
    <img src="${pictureUrl}" alt="${name}" style="width: 50%; margin: auto" class="card-img-top" />
    <h5 class="card-title">${moveName}</h5>
    <p class="card-text">${flavor_text}</p>
  </div>
  `;
}
