let pokemonList = []; // Lista completa de Pokémon
let filteredPokemonList = []; // Lista filtrada según los tipos seleccionados
const itemsPerLoad = 20; // Número de Pokémon que se cargan por cada renderizado
let currentIndex = 0; // Índice actual de la paginación

const DEFAULT_IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"; // Imagen por defecto si no hay disponible

// Función principal para obtener los datos de los Pokémon
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
    filteredPokemonList = [...pokemonList]; // Inicializar la lista filtrada con todos los Pokémon
    renderPokemon(); // Renderizar los Pokémon en la interfaz
}

// Función para obtener un rango de Pokémon desde la API
async function fetchPokemonBatch(startId, endId) {
    let correspondingId = startId === 10001 ? 1025 : startId; // Ajuste especial para IDs a partir de 10001
    let ids = Array.from({ length: endId - startId + 1 }, (_, i) => startId + i);
    
    // Obtener los datos de los Pokémon en paralelo
    let pokemonPromises = ids.map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()));
    let pokemonData = await Promise.all(pokemonPromises);
    
    // Procesar cada Pokémon y guardarlo en la lista
    pokemonData.forEach(data => {
        let pokemon = {
            id: correspondingId,
            nombre: data.name,
            imagen: data.sprites.front_default || DEFAULT_IMAGE,
            animacion: data.sprites.versions["generation-v"]["black-white"].animated.front_default || data.sprites.front_default || DEFAULT_IMAGE,
            sonido: data.cries.latest,
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

let userInteracted = false; // Variable para saber si el usuario interactuó

// Detectar cuando el usuario interactúa con la página (clic, tecla, scroll)
document.addEventListener("click", () => userInteracted = true);
document.addEventListener("keydown", () => userInteracted = true);
document.addEventListener("scroll", () => userInteracted = true);
document.addEventListener("mouseover", () => userInteracted = true);
document.addEventListener("mouseout", () => userInteracted = true);


// Función para renderizar los Pokémon en la interfaz
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

        // Agregar los elementos a la tarjeta
        card.appendChild(name);
        card.appendChild(img);
        card.appendChild(num);
        main.appendChild(card);

         // 🎵 Agregar evento para reproducir sonido al pasar el mouse
         card.addEventListener("click", () => {
            if (pokemon.sonido && userInteracted) {
                let audio = new Audio(pokemon.sonido);
                audio.play();
            }
        });

        card.addEventListener("mouseover", function() {
            if (pokemon.animacion && userInteracted) {
                img.src = pokemon.animacion;  // Cambia la imagen a GIF
            }
        });

        card.addEventListener("mouseout", function() {
            if (pokemon.imagen && userInteracted) {
                img.src = pokemon.imagen;  // Vuelve a la imagen estática
            }
        });
    });
    
    currentIndex = end; // Actualizar el índice actual
}

// Detectar el scroll para cargar más Pokémon automáticamente
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        renderPokemon();
    }
});

// Capturar los checkboxes para filtrar por tipo
const checkboxes = document.querySelectorAll(".type input");
checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", filterByType);
});

// Función para filtrar Pokémon por tipo
function filterByType() {
    let selectedTypes = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id);

    // Cambiar el color de fondo de las etiquetas de los tipos seleccionados
    checkboxes.forEach(checkbox => {
        const label = checkbox.closest('label');
        label.style.backgroundColor = checkbox.checked ? 'lightgreen' : '';
    });
    
    // Filtrar la lista de Pokémon según los tipos seleccionados
    filteredPokemonList = selectedTypes.length === 0 ? [...pokemonList] : pokemonList.filter(pokemon =>
        selectedTypes.every(type => pokemon.tipos.includes(type))
    );

    document.getElementById("main-container").innerHTML = ""; // Limpiar la vista
    currentIndex = 0;

    //Limpiamos input
    cleanTextInput();
    showOrHiddenCross();

    renderPokemon(); // Renderizar nuevamente
}

const input = document.getElementById("search")
input.addEventListener("input", searchByName);

function searchByName() {
    filteredPokemonList = pokemonList.filter(pokemon => pokemon.nombre.toLowerCase().includes(input.value.toLowerCase()));

    // Obtener solo los nombres para el autocompletado
    let suggestionsList = filteredPokemonList.filter(pokemon => pokemon.nombre.toLowerCase().startsWith(input.value.toLowerCase())).map(pokemon => pokemon.nombre);
    
    if (suggestionsList.length > 0) {
        // Aplicar jQuery UI Autocomplete
        $("#search").autocomplete({
            source: suggestionsList,
            select: function(event, ui) {
                // Cuando se selecciona una sugerencia, filtrar y mostrar el Pokémon correspondiente
                let selectedPokemonName = ui.item.value; // El nombre seleccionado

                // Filtrar el Pokémon seleccionado
                filteredPokemonList = pokemonList.filter(pokemon => pokemon.nombre === selectedPokemonName);

                // Limpiar y renderizar solo el Pokémon seleccionado
                document.getElementById("main-container").innerHTML = ""; // Limpiar la vista
                currentIndex = 0;
                renderPokemon(); // Renderizar nuevamente el Pokémon seleccionado
            }
        });
    } else {
        $("#search").autocomplete("destroy"); // Eliminar si no hay sugerencias
    } 

    document.getElementById("main-container").innerHTML = ""; // Limpiar la vista
    currentIndex = 0;
    renderPokemon(); // Renderizar nuevamente
}

const clearBtn = document.getElementById("clear-btn");

// Mostrar o esconder la cruz según el contenido del input
input.addEventListener("input", function() {
    showOrHiddenCross();
});

function showOrHiddenCross(){
    if (input.value.trim() !== "") {
        clearBtn.style.display = "block"; // Mostrar la cruz si hay texto
    } else {
        clearBtn.style.display = "none"; // Ocultar la cruz si no hay texto
    }
}

// Borrar el texto del input al hacer clic en la cruz
clearBtn.addEventListener("click", function() {
    cleanTextInput();
    input.focus();//para que se vuelva a poner el marcador en el input
    searchByName(); // Volver a filtrar Pokémon (opcional, si quieres actualizar la lista cuando se borra)
});

function cleanTextInput() {
    input.value = ""; // Limpiar el valor del input
    clearBtn.style.display = "none"; // Ocultar la cruz
}
// Iniciar la carga de datos
fetchPokemonData();
