document.addEventListener("DOMContentLoaded", () => {
    const pokemonData = JSON.parse(sessionStorage.getItem("selectedPokemon"));

    if (!pokemonData) {
        document.body.innerHTML = "<h2>No hay información del Pokémon disponible.</h2>";
        return;
    }

    // 🎵 Agregar evento para reproducir sonido al pasar el mouse
    let audio = new Audio(pokemonData.sonido);
    audio.play();

    document.getElementById("pokemon-number").innerText = `#${pokemonData.id}`;
    document.getElementById("pokemon-name").innerText = pokemonData.nombre;
    document.getElementById("pokemon-image").src = pokemonData.animacion || pokemonData.imagen;

    const statsContainer = document.getElementById("stats");
    statsContainer.innerHTML = `
        <p><span>Experiencia Base:</span> <span>${pokemonData.base_experience}</span></p>
        <p><span>Altura:</span> <span>${(pokemonData.height / 10).toFixed(2)} m</span></p>
        <p><span>Peso:</span> <span>${(pokemonData.weight / 10).toFixed(2)} kg</span></p>
        <p><span>Vida (HP):</span> <span>${pokemonData.stats.hp}</span></p>
        <p><span>Ataque:</span> <span>${pokemonData.stats.attack}</span></p>
        <p><span>Defensa:</span> <span>${pokemonData.stats.defense}</span></p>
        <p><span>Ataque Especial:</span> <span>${pokemonData.stats.special_attack}</span></p>
        <p><span>Defensa Especial:</span> <span>${pokemonData.stats.special_defense}</span></p>
        <p><span>Velocidad:</span> <span>${pokemonData.stats.speed}</span></p>
    `;

    // Función para volver atrás
    document.getElementById("back-button").addEventListener("click", () => {
        window.location.href = "index.html"; // Ajusta el nombre según tu archivo principal
    });

});
