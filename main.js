let pokemonList = [];

async function getPokemonData() {
    for (let i = 1; i <= 50; i++) {  // Obtener los primeros 50 Pokémon
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        let data = await response.json();
        
        let tipos = data.types.map(typeInfo => typeInfo.type.name);

        let pokemon = {
            id: data.id,
            nombre: data.name,
            imagen: data.sprites.front_default,
            tipos: tipos,
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
    }
    
    // console.log("Datos de Pokémon guardados en variable:", pokemonList);
}

getPokemonData();

let main =  document.getElementById("main-container");

pokemonList.map(pokemon => {

    var newDiv = document.createElement("figure");

    // Añadir la imagen al enlace
    main.appendChild(newDiv);

    // Crear una imagen
    var img = document.createElement("img");
    img.src = pokemon.imagen;  // URL de la imagen
    img.alt = "Descripción de la imagen";  // Texto alternativo para la imagen

    // Añadir la imagen al enlace
    newDiv.appendChild(img);

    var newfigcaption = document.createElement("figcaption");
    newfigcaption.innerHTML = pokemon.nombre;
})

console.log(pokemonList)
























// async function getPokemonData() {
//     let pokemonList = [];
    
//     for (let i = 1; i <= 50; i++) {  // Obtener los primeros 50 Pokémon
//         let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
//         let data = await response.json();
        
//         let tipos = data.types.map(typeInfo => typeInfo.type.name);

//         let pokemon = {
//             id: data.id,
//             nombre: data.name,
//             imagen: data.sprites.front_default,
//             tipos: tipos,
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
//     }
    


//     let jsonData = JSON.stringify(pokemonList, null, 2);
//     let blob = new Blob([jsonData], { type: 'application/json' });
//     let a = document.createElement('a');
//     a.href = URL.createObjectURL(blob);
//     a.download = 'pokemon_data.json';
//     a.click();
// }

// document.addEventListener('DOMContentLoaded', () => {
//     let button = document.createElement('button');
//     button.textContent = 'Descargar Datos Pokémon';
//     button.onclick = getPokemonData;
//     document.body.appendChild(button);
// });
