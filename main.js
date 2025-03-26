let pokemonList = []; // Lista completa de Pokémon
let filteredPokemonList = []; // Lista filtrada según los tipos seleccionados
const itemsPerLoad = 20; // Número de Pokémon que se cargan por cada renderizado
let currentIndex = 0; // Índice actual de la paginación

const DEFAULT_IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"; // Imagen por defecto si no hay disponible
const typeIcons = {
    normal: "./img/Type_Normal.webp",
    fighting: "./img/Type_Lucha.webp",
    flying: "./img/Type_Volador.webp",
    poison: "./img/Type_Veneno.webp",
    ground: "./img/Type_Tierra.webp",
    rock: "./img/Type_Roca.webp",
    bug: "./img/Type_Bicho.webp",
    ghost: "./img/Type_Fantasma.webp",
    steel: "./img/Type_Acero.webp",
    fire: "./img/Type_Fuego.webp",
    water: "./img/Type_Agua.webp",
    grass: "./img/Type_Planta.webp",
    electric: "./img/Type_Electrico.webp",
    psychic: "./img/Type_Psiquico.webp",
    ice: "./img/Type_Hielo.webp",
    dragon: "./img/Type_Dragon.webp",
    dark: "./img/Type_Siniestro.webp",
    fairy: "./img/Type_Hada.webp"
};

const checkboxes = document.querySelectorAll(".type input");

// Función principal para obtener los datos de los Pokémon
async function fetchPokemonData() {
    const cachedData = localStorage.getItem("pokemonData");

    if (cachedData) {
        console.log("✅ Cargando Pokémon desde localStorage...");
        pokemonList = JSON.parse(cachedData);
        filteredPokemonList = [...pokemonList];

        const savedTypes = sessionStorage.getItem("activeTypes");
        const savedSearch = sessionStorage.getItem("searchText");
        if (savedSearch != null && savedSearch.trim() !== "") {
            input.value = savedSearch;
            input.focus(); // 👉 Cursor activo dentro del input
            showOrHiddenCross(); // 👉 hace que aparezca la cruz si hay texto
            filteredPokemonList = filteredPokemonList.filter(pokemon =>
                pokemon.nombre.toLowerCase().includes(savedSearch)
            );
        }

        if (savedTypes != "[]") {
            const activeTypeList = JSON.parse(savedTypes);

            if (activeTypeList != null) {
                checkboxes.forEach(checkbox => {
                    checkbox.checked = activeTypeList.includes(checkbox.id);
                    checkbox.closest("label").style.backgroundColor = checkbox.checked ? "lightgreen" : "";
                });

                
            filteredPokemonList = pokemonList.filter(pokemon =>
                activeTypeList.every(type => pokemon.tipos.includes(type))
            );
            }

        }

        const lastViewedId = sessionStorage.getItem("lastViewedId");

        if (lastViewedId) {
            const index = filteredPokemonList.findIndex(p => p.id === parseInt(lastViewedId));

            // ⚠️ Detectar si hay filtros activos (tipo o texto)
            if (savedTypes !="[]" && savedSearch == null || savedSearch.trim() == "" || savedTypes =="[]" && savedSearch != null && savedSearch.trim() !== "") {
                // 🔁 Mostrar todos los Pokémon que coinciden con el filtro
                currentIndex = filteredPokemonList.length;
            } else {
                // 👣 Solo mostrar hasta el Pokémon que se había tocado
                currentIndex = index + 1;
            }

            renderPokemon();
            ensureScrollableContent();
            setTimeout(() => {
                const targetCard = [...document.querySelectorAll(".card")]
                    .find(card => card.querySelector(".num")?.textContent === `#${lastViewedId}`);

                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
                }

                sessionStorage.removeItem("lastViewedId");
            }, 500);
        } else {
            currentIndex = itemsPerLoad;
            renderPokemon();
            ensureScrollableContent();
        }

        return; // Salimos sin hacer fetch
    }

    // Si no hay datos cacheados, los traemos desde la API
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

    console.log("✅ Todos los Pokémon cargados desde API.");
    filteredPokemonList = [...pokemonList];

    // 👇 Insertar justo debajo
    const savedTypes = sessionStorage.getItem("activeTypes");
    if (savedTypes) {
        const activeTypeList = JSON.parse(savedTypes);

        checkboxes.forEach(checkbox => {
            checkbox.checked = activeTypeList.includes(checkbox.id);
            checkbox.closest("label").style.backgroundColor = checkbox.checked ? "lightgreen" : "";
        });

        filteredPokemonList = pokemonList.filter(pokemon =>
            activeTypeList.every(type => pokemon.tipos.includes(type))
        );
    }

    // Guardamos en localStorage
    localStorage.setItem("pokemonData", JSON.stringify(pokemonList));

    const lastViewedId = sessionStorage.getItem("lastViewedId");

    if (lastViewedId) {
        const index = filteredPokemonList.findIndex(p => p.id === parseInt(lastViewedId));

        // ⚠️ Detectar si hay filtros activos (tipo o texto)
        const hasTypeFilter = sessionStorage.getItem("activeTypes");
        const hasSearchText = sessionStorage.getItem("searchText");

        if (hasTypeFilter || hasSearchText) {
            // 🔁 Mostrar todos los Pokémon que coinciden con el filtro
            currentIndex = filteredPokemonList.length;
        } else {
            // 👣 Solo mostrar hasta el Pokémon que se había tocado
            currentIndex = index + 1;
        }

        renderPokemon();
        ensureScrollableContent();

        setTimeout(() => {
            const targetCard = [...document.querySelectorAll(".card")]
                .find(card => card.querySelector(".num")?.textContent === `#${lastViewedId}`);

            if (targetCard) {
                targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
            }

            sessionStorage.removeItem("lastViewedId");
        }, 500);
    } else {
        currentIndex = itemsPerLoad;
        renderPokemon();
        ensureScrollableContent();
    }
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

    let end = currentIndex;
    let start = main.children.length; // Esto sirve para paginar automáticamente

    // Si no hay nada renderizado todavía, arranca desde 0
    if (start === 0) start = 0;

    let paginatedPokemons = filteredPokemonList.slice(start, end);
    
    paginatedPokemons.forEach(pokemon => {
        let card = document.createElement("div");
        card.classList.add("card");

        let num = document.createElement("div");
        num.classList.add("num");

        const numText = document.createElement("span");
        numText.classList.add("poke-id");
        numText.innerText = `#${pokemon.id}`;
        num.appendChild(numText);

        // Contenedor de tipos (alineado a la derecha)
        const typesWrapper = document.createElement("div");
        typesWrapper.classList.add("type-wrapper");

        pokemon.tipos.forEach(tipo => {
            const icon = document.createElement("img");
            icon.src = typeIcons[tipo];
            icon.alt = tipo;
            icon.title = tipo;
            icon.classList.add("type-icon");
            typesWrapper.appendChild(icon);
        });

        num.appendChild(typesWrapper);



        let img = document.createElement("img");
        img.classList.add("pokemon-image");
        img.src = pokemon.imagen;
        // Pre-cargar animación en segundo plano
        if (pokemon.animacion && pokemon.animacion !== pokemon.imagen) {
            const preload = new Image();
            preload.src = pokemon.animacion;
        }

        img.alt = pokemon.nombre;

        let name = document.createElement("p");
        name.classList.add("name");
        name.innerText = pokemon.nombre;

        // Agregar los elementos a la tarjeta
        card.appendChild(name);
        card.appendChild(img);
        card.appendChild(num);
        main.appendChild(card);


         card.addEventListener("click", () => {
            if (pokemon.sonido && userInteracted) {
                // 📦Guardar los datos del Pokémon en sessionStorage
                sessionStorage.setItem("lastViewedId", pokemon.id);
                sessionStorage.setItem("selectedPokemon", JSON.stringify(pokemon));
                
                // ✅ Guardar tipos activos
                const selectedTypes = Array.from(checkboxes)
                .filter(c => c.checked)
                .map(c => c.id);
                sessionStorage.setItem("activeTypes", JSON.stringify(selectedTypes));

                // ✅ Guardar posición del scroll
                sessionStorage.setItem("scrollY", window.scrollY.toString());

                // 🔀Redirigir a la página de stats
                window.location.href = "stats.html";
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
    
    // Actualizar currentIndex solo si estamos en carga infinita
    currentIndex = end + itemsPerLoad;
}

// Detectar el scroll para cargar más Pokémon automáticamente
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        renderPokemon();
    }
});

// Capturar los checkboxes para filtrar por tipo
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
    currentIndex = itemsPerLoad;

    sessionStorage.removeItem("searchText"); // elimina la clave del todo

    //Limpiamos input
    cleanTextInput();
    showOrHiddenCross();

    renderPokemon(); // Renderizar nuevamente
    ensureScrollableContent();
}

const input = document.getElementById("search")
input.addEventListener("input", searchByName);

function searchByName() {
    filteredPokemonList = pokemonList.filter(pokemon => pokemon.nombre.toLowerCase().includes(input.value.toLowerCase()));

    // Obtener solo los nombres para el autocompletado
    let suggestionsList = filteredPokemonList.filter(pokemon => pokemon.nombre.toLowerCase().startsWith(input.value.toLowerCase())).map(pokemon => pokemon.nombre);
    sessionStorage.setItem("searchText", input.value.trim().toLowerCase());

    sessionStorage.setItem("activeTypes", "[]");
    // ✅ También desmarcar los checkboxes y resetear estilos
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        const label = checkbox.closest("label");
        if (label) label.style.backgroundColor = '';
    });
    if (suggestionsList.length > 0) {
        // Aplicar jQuery UI Autocomplete
        $("#search").autocomplete({
            source: suggestionsList,
            select: function(event, ui) {
                // Cuando se selecciona una sugerencia, filtrar y mostrar el Pokémon correspondiente
                let selectedPokemonName = ui.item.value; // El nombre seleccionado

                sessionStorage.setItem("searchText", selectedPokemonName.trim().toLowerCase());
                
                // Filtrar el Pokémon seleccionado
                filteredPokemonList = pokemonList.filter(pokemon => pokemon.nombre === selectedPokemonName);

                // Limpiar y renderizar solo el Pokémon seleccionado
                document.getElementById("main-container").innerHTML = ""; // Limpiar la vista
                currentIndex = itemsPerLoad;
                renderPokemon(); // Renderizar nuevamente el Pokémon seleccionado
            }
        });
    } else {
        $("#search").autocomplete("destroy"); // Eliminar si no hay sugerencias
    } 

    document.getElementById("main-container").innerHTML = ""; // Limpiar la vista
    currentIndex = itemsPerLoad;
    renderPokemon(); // Renderizar nuevamente
    ensureScrollableContent();
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

function ensureScrollableContent() {
    // Si la altura del contenido no supera la altura visible, renderizamos más
    while (document.body.scrollHeight <= window.innerHeight + 100 && currentIndex < filteredPokemonList.length) {
        renderPokemon();
    }
}

// Iniciar la carga de datos
fetchPokemonData();
