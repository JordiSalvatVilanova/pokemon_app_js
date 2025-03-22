let pokemonList = []; // Lista completa de Pokémon
let filteredPokemonList = []; // Lista filtrada según los tipos seleccionados
const itemsPerLoad = 20;
let currentIndex = 0;

const DEFAULT_IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";

async function fetchPokemonData() {
    console.log("Obteniendo Pokémon con IDs 1 a 250...");
    await fetchPokemonBatch(1, 250);

    console.log("Obteniendo Pokémon con IDs 251 a 500...");
    await fetchPokemonBatch(251, 500);

    console.log("Obteniendo Pokémon con IDs 501 a 750...");
    await fetchPokemonBatch(501, 750);

    console.log("Obteniendo Pokémon con IDs 751 a 1024...");
    await fetchPokemonBatch(751, 1024);

    console.log("Obteniendo Pokémon con IDs 10001 a 10277...");
    await fetchPokemonBatch(10001, 10277);


    console.log("Todos los Pokémon cargados.", pokemonList);
    filteredPokemonList = [...pokemonList];
    renderPokemon();
}

async function fetchPokemonBatch(startId, endId) {
    let correspondingId = startId === 10001 ? 1025 : startId;
    let ids = Array.from({ length: endId - startId + 1 }, (_, i) => startId + i);
    
    let pokemonPromises = ids.map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()));
    let pokemonData = await Promise.all(pokemonPromises);
    
    pokemonData.forEach(data => {
        let pokemon = {
            id: correspondingId,
            nombre: data.name,
            imagen: data.sprites.front_default || DEFAULT_IMAGE,
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
        
        pokemonList.push(pokemon);
        correspondingId++;
    });
}

async function renderPokemon() {
    let main = document.getElementById("main-container");
    let end = currentIndex + itemsPerLoad;
    let paginatedPokemons = filteredPokemonList.slice(currentIndex, end);
    
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
    
    currentIndex = end;
}

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        renderPokemon();
    }
});

const checkboxes = document.querySelectorAll(".type input");
checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", filterByType);
});

function filterByType() {
    let selectedTypes = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id);

    checkboxes.forEach(checkbox => {
        const label = checkbox.closest('label');
        label.style.backgroundColor = checkbox.checked ? 'lightgreen' : '';
    });
    
    filteredPokemonList = selectedTypes.length === 0 ? [...pokemonList] : pokemonList.filter(pokemon =>
        selectedTypes.every(type => pokemon.tipos.includes(type))
    );

    document.getElementById("main-container").innerHTML = "";
    currentIndex = 0;
    renderPokemon();
}

fetchPokemonData();




// let pokemonList = []; // Lista completa de Pokémon
// let filteredPokemonList = []; // Lista filtrada según los tipos seleccionados
// const itemsPerLoad = 20;
// let currentIndex = 0;
// let fetching = false; // Para evitar hacer peticiones múltiples simultáneamente
// let currentBatch = 1; // Controla el batch actual (de 1 a 5)

// const DEFAULT_IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";

// // Función principal para la carga inicial de Pokémon
// async function fetchPokemonData() {
//     await loadNextBatch();
//     filteredPokemonList = [...pokemonList];
//     renderPokemon();
// }

// // Función para cargar el siguiente batch de Pokémon
// async function loadNextBatch() {
//     if (fetching) return; // Evita que se haga la misma solicitud si ya estamos cargando
//     fetching = true;

//     let startId, endId;
    
//     switch(currentBatch) {
//         case 1:
//             startId = 1;
//             endId = 250;
//             break;
//         case 2:
//             startId = 251;
//             endId = 500;
//             break;
//         case 3:
//             startId = 501;
//             endId = 750;
//             break;
//         case 4:
//             startId = 751;
//             endId = 1024;
//             break;
//         case 5:
//             startId = 10001;
//             endId = 10277;
//             break;
//         default:
//             return; // Si ya hemos cargado todos los lotes, no hacer nada
//     }

//     console.log(`Obteniendo Pokémon con IDs ${startId} a ${endId}...`);
//     await fetchPokemonBatch(startId, endId);

//     // Actualizamos el lote actual y preparamos para el siguiente
//     currentBatch++;
//     fetching = false;
// }

// // Función para obtener datos de un batch específico
// async function fetchPokemonBatch(startId, endId) {
//     let ids = Array.from({ length: endId - startId + 1 }, (_, i) => startId + i);
    
//     let pokemonPromises = ids.map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()));
//     let pokemonData = await Promise.all(pokemonPromises);
    
//     pokemonData.forEach(data => {
//         let pokemon = {
//             id: data.id,
//             nombre: data.name,
//             imagen: data.sprites.front_default || DEFAULT_IMAGE,
//             tipos: data.types.map(typeInfo => typeInfo.type.name),
//             base_experience: data.base_experience,
//             height: data.height,
//             weight: data.weight,
//             stats: {
//                 hp: data.stats[0].base_stat,
//                 attack: data.stats[1].base_stat,
//                 defense: data.stats[2].base_stat,
//                 special_attack: data.stats[3].base_stat,
//                 special_defense: data.stats[4].base_stat,
//                 speed: data.stats[5].base_stat
//             }
//         };

//         pokemonList.push(pokemon);
//     });
// }

// // Función para renderizar los Pokémon en pantalla
// async function renderPokemon() {
//     let main = document.getElementById("main-container");
//     let end = currentIndex + itemsPerLoad;
//     let paginatedPokemons = filteredPokemonList.slice(currentIndex, end);
    
//     paginatedPokemons.forEach(pokemon => {
//         let card = document.createElement("div");
//         card.classList.add("card");

//         let num = document.createElement("p");
//         num.classList.add("num");
//         num.innerText = `#${pokemon.id}`;

//         let img = document.createElement("img");
//         img.src = pokemon.imagen;
//         img.alt = pokemon.nombre;

//         let name = document.createElement("p");
//         name.classList.add("name");
//         name.innerText = pokemon.nombre;

//         card.appendChild(name);
//         card.appendChild(img);
//         card.appendChild(num);
//         main.appendChild(card);
//     });
    
//     currentIndex = end;

//     // Cargar el siguiente lote si estamos cerca del final
//     if (currentIndex >= filteredPokemonList.length && currentBatch <= 5) {
//         await loadNextBatch();
//         filterByType();
//     }
// }

// // Evento de scroll para cargar más Pokémon al llegar al final
// window.addEventListener("scroll", () => {
//     if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
//         renderPokemon();
//     }
// });

// // Filtrar Pokémon por tipo
// const checkboxes = document.querySelectorAll(".type input");
// checkboxes.forEach(checkbox => {
//     checkbox.addEventListener("change", filterByType);
// });

// function filterByType() {
//     let selectedTypes = Array.from(checkboxes)
//         .filter(checkbox => checkbox.checked)
//         .map(checkbox => checkbox.id);

//     checkboxes.forEach(checkbox => {
//         const label = checkbox.closest('label');
//         label.style.backgroundColor = checkbox.checked ? 'lightgreen' : '';
//     });
    
//     filteredPokemonList = selectedTypes.length === 0 ? [...pokemonList] : pokemonList.filter(pokemon =>
//         selectedTypes.every(type => pokemon.tipos.includes(type))
//     );

//     document.getElementById("main-container").innerHTML = "";
//     currentIndex = 0;
//     renderPokemon();
// }


// // Llamada inicial a la función para cargar los datos de Pokémon
// fetchPokemonData();







// let pokemonList = []; // Lista completa de Pokémon
// let filteredPokemonList = []; // Lista filtrada según los tipos seleccionados
// let currentPage = 1;
// const itemsPerPage = 20;
// let totalPages;

// const DEFAULT_IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";

// // let allTypes = {}; // Objeto para almacenar los tipos de Pokémon

// // async function fetchAllTypes() {
// //     let response = await fetch('https://pokeapi.co/api/v2/type');
// //     let data = await response.json();
// //     allTypes = data.results; // Guardamos los tipos obtenidos de la API
// // }

// // fetchAllTypes();

// async function fetchPokemonData() {
//     console.log("Obteniendo Pokémon con IDs 1 a 1024...");
//     await fetchPokemonBatch(1, 1024);

//     console.log("Obteniendo Pokémon con IDs 10001 10277");
//     await fetchPokemonBatch(10001, 10277);

//     console.log("Todos los Pokémon cargados.", pokemonList);
//     filteredPokemonList = [...pokemonList]; // Inicialmente, la lista filtrada es una copia que la completa
//     totalPages = Math.ceil(filteredPokemonList.length / itemsPerPage); //redondeamos hacia arriba por los pokemos que sobran en la ultima pagina
//     renderPokemon();
// }

// async function fetchPokemonBatch(startId, endId) {
//     let correspondingId = startId === 10001 ? 1025 : 1;

//     for (let id = startId; id <= endId; id++) {
//         let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
//         let response = await fetch(url);
//         let data = await response.json();

//         let pokemon = {
//             id: correspondingId,
//             nombre: data.name,
//             imagen: data.sprites.front_default == null ? DEFAULT_IMAGE :  data.sprites.front_default,
//             tipos: data.types.map(typeInfo => typeInfo.type.name),
//             base_experience: data.base_experience,
//             height: data.height,
//             weight: data.weight,
//             stats: {
//                 hp: data.stats[0].base_stat,
//                 attack: data.stats[1].base_stat,
//                 defense: data.stats[2].base_stat,
//                 special_attack: data.stats[3].base_stat,
//                 special_defense: data.stats[4].base_stat,
//                 speed: data.stats[5].base_stat
//             }
//         };

//         pokemonList.push(pokemon);
//         correspondingId++;
//     }
// }
// // se ejecuta cada vez que cambiamos de pagina o filtramos por tipo (a parte de ejecutarse como primera vez al abrrir la web)
// async function renderPokemon() {
//     let main = document.getElementById("main-container");
//     main.innerHTML = "";

//     let start = (currentPage - 1) * itemsPerPage;
//     let end = start + itemsPerPage;
//     let paginatedPokemons = filteredPokemonList.slice(start, end);

//     paginatedPokemons.forEach(pokemon => {
//         let card = document.createElement("div");
//         card.classList.add("card");

//         let num = document.createElement("p");
//         num.classList.add("num");
//         num.innerText = `#${pokemon.id}`;

//         let img = document.createElement("img");
//         img.src = pokemon.imagen;
//         img.alt = pokemon.nombre;

//         let name = document.createElement("p");
//         name.classList.add("name");
//         name.innerText = pokemon.nombre;

//         card.appendChild(name);
//         card.appendChild(img);
//         card.appendChild(num);
//         main.appendChild(card);
//     });

//     document.getElementById("page-info").innerText = `Página ${currentPage} / ${totalPages}`;
//     document.getElementById("prev").disabled = currentPage === 1;
//     document.getElementById("next").disabled = end >= filteredPokemonList.length;
// }

// document.getElementById("prev").addEventListener("click", () => {
//     if (currentPage > 1) {
//         currentPage--;
//         renderPokemon();
//     }
// });

// document.getElementById("next").addEventListener("click", () => {
//     if (currentPage * itemsPerPage < filteredPokemonList.length) {
//         currentPage++;
//         renderPokemon();
//     }
// });

// // FILTRADO POR TIPOS
// const checkboxes = document.querySelectorAll(".type input");
// checkboxes.forEach(checkbox => {
//     checkbox.addEventListener("change", filterByType);
// });

// function filterByType() {
//     let selectedTypes = Array.from(checkboxes) // Convertimos los checkboxes a un array
//         .filter(checkbox => checkbox.checked) // Nos quedamos con los que están seleccionados
//         .map(checkbox => checkbox.id); // Extraemos el nombre del tipo por su id en ingles

//     checkboxes.forEach(checkbox => {
//         if (checkbox.checked) {
//             // Encontramos el label padre y cambiamos el color de fondo
//             const label = checkbox.closest('label');
//             label.style.backgroundColor = 'lightgreen'; // Puedes cambiar 'yellow' por cualquier color
//         } else {
//             // Si el checkbox no está seleccionado, puedes restaurar el color de fondo
//             const label = checkbox.closest('label');
//             label.style.backgroundColor = ''; // Restaura el color original
//         }
//     });
//     if (selectedTypes.length === 0) {
//         filteredPokemonList = [...pokemonList]; // Si no hay filtros, mostramos todos
//     } else {
//         filteredPokemonList = pokemonList
//         .filter(pokemon =>
//             selectedTypes
//             .every(
//                 type => pokemon.tipos.includes(type)
//             )
//         );
//     }

//     currentPage = 1;
//     totalPages = Math.ceil(filteredPokemonList.length / itemsPerPage);
//     renderPokemon();
// }

// fetchPokemonData();


