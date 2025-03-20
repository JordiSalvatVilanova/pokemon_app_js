let pokemonList = [];
let currentPage = 1;
const itemsPerPage = 20;
let totalPages;
// Cuando un pokemon no tiene imagen
const DEFAULT_IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";

// -------------------------------------------------------------------------------------------------------
// Objeto para almacenar todos los tipos de Pokémon
let allTypes = {};

// Función para obtener todos los tipos de Pokémon
async function fetchAllTypes() {
    let response = await fetch('https://pokeapi.co/api/v2/type');
    let data = await response.json();
    
    allTypes = data.results;

    console.log(allTypes); 
}

// Llamamos a la función para obtener los tipos
fetchAllTypes();
// -------------------------------------------------------------------------------------------------------
//2️⃣ OBTENER LOS DETALLES DE LOS POKÉMON EN LOS DOS RANGOS
async function fetchPokemonData() {
    // Paso 1: Obtener los Pokémon con IDs 1 a 1024
    console.log("Obteniendo Pokémon con IDs 1 a 1024...");
    await fetchPokemonBatch(1, 1024); // Llamamos a la función para el primer rango

    // Paso 2: Obtener los Pokémon con IDs 10001 a 10277
    console.log("Obteniendo Pokémon con IDs 10001 en adelante...");
    await fetchPokemonBatch(10001, 10277); // Llamamos a la función para el segundo rango

    console.log("Todos los Pokémon cargados.");
    console.log(pokemonList); // Aquí puedes ver el objeto con todos los Pokémon

    // Actualizar el total de páginas para la paginación
    totalPages = Math.ceil(pokemonList.length / itemsPerPage);
    renderPokemon(); // Renderizamos los Pokémon
}
// -------------------------------------------------------------------------------------------------------
//3️⃣ OBTENER UN LOTE DE POKÉMON POR RANGO DE ID
async function fetchPokemonBatch(startId, endId) {
    let correspondingId;
    if(startId == 10001) {
        correspondingId = 1025;
    } else {
        correspondingId = 1;
    }

    for (let id = startId; id <= endId; id++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        let response = await fetch(url);
        let data = await response.json();

        // Guardar los datos del Pokémon con todos los detalles
        let pokemon = {
            id: correspondingId,
            nombre: data.name,
            url: data.url,
            imagen: data.sprites.front_default == null ? DEFAULT_IMAGE :  data.sprites.front_default,
            tipos: data.types.map(typeInfo => typeInfo.type.name),
            base_experience: data.base_experience,
            height: data.height,
            weight: data.weight,
            stats: {
                hp: data.stats[0].base_stat,
                attack: data.stats[1].base_stat,
                defense: data.stats[2].base_stat,
                special_attack: data.stats[3].base_stat,
                special_defense: data.stats[4].base_stat,
                speed: data.stats[5].base_stat
            }
        };

        // Agregar el Pokémon completo a la lista
        pokemonList.push(pokemon);

        ++correspondingId;
    }
}
// -------------------------------------------------------------------------------------------------------
// 4️⃣ MOSTRAR SOLO LOS POKÉMON DE LA PÁGINA ACTUAL
async function renderPokemon() {
    let main = document.getElementById("main-container");
    main.innerHTML = ""; // Limpiar la vista

    let start = (currentPage - 1) * itemsPerPage; // Calcula el índice inicial del primer Pokémon a mostrar en esta página
    let end = start + itemsPerPage; // Calcula el índice final del último Pokémon a mostrar en esta página
    let paginatedPokemons = pokemonList.slice(start, end); // Extrae los Pokémon que corresponden a la página actual

    // Itera sobre los Pokémon obtenidos y crea elementos HTML para mostrarlos
    paginatedPokemons.forEach(pokemon => {
        let card = document.createElement("div");
        card.classList.add("card");

        let num = document.createElement("p");
        num.classList.add("num");
        num.innerText = `#${pokemon.id}`;

        let img = document.createElement("img");
        img.src = pokemon.imagen;
        img.alt = pokemon.nombre;

        let name = document.createElement("p");
        name.classList.add("name");
        name.innerText = pokemon.nombre;

        card.appendChild(name);
        card.appendChild(img);
        card.appendChild(num);
        main.appendChild(card);
    });

    // Actualizar la información de paginación
    document.getElementById("page-info").innerText = `Página ${currentPage} / ${totalPages}`; // Muestra el número de página actual

    if (currentPage == 1) {
        document.getElementById("prev").disabled = true; // Deshabilita el botón "Anterior" si estamos en la primera página
    } else {
        document.getElementById("prev").disabled = false;
    }

    if (end >= pokemonList.length) {
        document.getElementById("next").disabled = true; // Deshabilita el botón "Siguiente" si no hay más Pokémon
    } else {
        document.getElementById("next").disabled = false;
    }
}
// 5️⃣ MANEJAR BOTONES DE PAGINACIÓN
document.getElementById("prev").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderPokemon();
}});

document.getElementById("next").addEventListener("click", () => {
    if (currentPage * itemsPerPage < pokemonList.length) {
        currentPage++;
        renderPokemon();
    }
});
// -------------------------------------------------------------------------------------------------------
// 1️⃣ Cargar la lista inicial de Pokémon (con detalles)
fetchPokemonData();