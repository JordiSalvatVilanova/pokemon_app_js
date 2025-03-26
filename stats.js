document.addEventListener("DOMContentLoaded", () => {
    const pokemonData = JSON.parse(sessionStorage.getItem("selectedPokemon"));

    if (!pokemonData) {
        document.body.innerHTML = "<h2>No hay información del Pokémon disponible.</h2>";
        return;
    }

    // 🎵 Agregar evento para reproducir sonido al pasar el mouse
    let audio = new Audio(pokemonData.sonido);
    audio.play();

    document.getElementById("pokemon-image").addEventListener("click", () => {
        audio.play();
    });
    document.getElementById("pokemon-number").innerText = `#${pokemonData.id}`;
    document.getElementById("pokemon-name").innerText = pokemonData.nombre;
    document.getElementById("pokemon-image").src = pokemonData.animacion || pokemonData.imagen;

    const statsContainer = document.getElementById("stats");
    statsContainer.innerHTML = `
        <p class="stat exp"><span>Experiencia Base:</span> <span>${pokemonData.base_experience}</span></p>
        <p class="stat"><span>Altura:</span> <span>${(pokemonData.height / 10).toFixed(2)} m</span></p>
        <p class="stat"><span>Peso:</span> <span>${(pokemonData.weight / 10).toFixed(2)} kg</span></p>
        <p class="stat hp"><span>PS:</span> <span>${pokemonData.stats.hp}</span></p>
        <p class="stat atk"><span>Ataque:</span> <span>${pokemonData.stats.attack}</span></p>
        <p class="stat def"><span>Defensa:</span> <span>${pokemonData.stats.defense}</span></p>
        <p class="stat sp-atk"><span>Ataque Especial:</span> <span>${pokemonData.stats.special_attack}</span></p>
        <p class="stat sp-def"><span>Defensa Especial:</span> <span>${pokemonData.stats.special_defense}</span></p>
        <p class="stat spd"><span>Velocidad:</span> <span>${pokemonData.stats.speed}</span></p>
    `;

    // Función para volver atrás
    document.getElementById("back-button").addEventListener("click", () => {
        window.location.href = "index.html"; // Ajusta el nombre según tu archivo principal
    });

});
