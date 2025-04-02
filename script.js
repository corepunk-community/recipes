document.addEventListener('DOMContentLoaded', () => {
    fetchRecipes();
});

async function fetchRecipes() {
    try {
        const response = await fetch('recipes.json');
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error loading recipes:', error);
        document.getElementById('recipes-container').innerHTML = `
            <div class="error">
                <p>Failed to load recipes. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

function displayRecipes(recipes) {
    const container = document.getElementById('recipes-container');
    container.innerHTML = ''; // Clear loading message
    
    recipes.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe);
        container.appendChild(recipeCard);
    });
}

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    // Recipe header with name, sprite, and number created
    const header = document.createElement('div');
    header.className = 'recipe-header';
    
    const sprite = document.createElement('img');
    sprite.src = `./images/${recipe.sprite}`;
    sprite.alt = recipe.name;
    sprite.onerror = function() {
        this.src = 'placeholder.png'; // Fallback image if sprite doesn't load
        this.onerror = null;
    };
    
    const nameContainer = document.createElement('div');
    const name = document.createElement('h2');
    name.className = 'recipe-name';
    name.textContent = recipe.name;
    
    const number = document.createElement('div');
    number.className = 'recipe-number';
    number.textContent = `Creates: ${recipe.number}`;
    
    nameContainer.appendChild(name);
    nameContainer.appendChild(number);
    
    header.appendChild(sprite);
    header.appendChild(nameContainer);
    card.appendChild(header);
    
    // Recipe content
    const content = document.createElement('div');
    content.className = 'recipe-content';
    
    // Ingredients section
    const ingredientsSection = document.createElement('div');
    ingredientsSection.className = 'recipe-section';
    
    const ingredientsTitle = document.createElement('h3');
    ingredientsTitle.textContent = 'Ingredients';
    ingredientsSection.appendChild(ingredientsTitle);
    
    const ingredientsList = document.createElement('div');
    ingredientsList.className = 'ingredients-list';
    
    recipe.ingredients.forEach(ingredient => {
        const ingredientElem = document.createElement('div');
        ingredientElem.className = 'ingredient';
        
        const ingredientImg = document.createElement('img');
        ingredientImg.src = `./images/${ingredient.sprite}`;
        ingredientImg.alt = ingredient.name;
        ingredientImg.onerror = function() {
            this.src = 'placeholder.png'; // Fallback image
            this.onerror = null;
        };
        
        const ingredientName = document.createElement('div');
        ingredientName.className = 'ingredient-name';
        ingredientName.textContent = ingredient.name;
        
        const ingredientQuantity = document.createElement('div');
        ingredientQuantity.className = 'ingredient-quantity';
        ingredientQuantity.textContent = `x${ingredient.required}`;
        
        ingredientElem.appendChild(ingredientImg);
        ingredientElem.appendChild(ingredientName);
        ingredientElem.appendChild(ingredientQuantity);
        
        ingredientsList.appendChild(ingredientElem);
    });
    
    ingredientsSection.appendChild(ingredientsList);
    content.appendChild(ingredientsSection);
    
    // Effects section (excluding Health/Mana Regeneration)
    const filteredEffects = recipe.effects.filter(effect => 
        effect.type !== 'Health Regeneration' && effect.type !== 'Mana Regeneration'
    );
    
    if (filteredEffects.length > 0) {
        const effectsSection = document.createElement('div');
        effectsSection.className = 'recipe-section';
        
        const effectsTitle = document.createElement('h3');
        effectsTitle.textContent = 'Effects';
        effectsSection.appendChild(effectsTitle);
        
        const effectsList = document.createElement('div');
        effectsList.className = 'effects-list';
        
        filteredEffects.forEach(effect => {
            const effectElem = document.createElement('div');
            effectElem.className = 'effect';
            
            // Create effect description
            effectElem.innerHTML = `${effect.type}: <span>${effect.value}</span>`;
            
            // Add duration if available
            if (effect.duration) {
                effectElem.innerHTML += ` for ${effect.duration}`;
            }
            
            effectsList.appendChild(effectElem);
        });
        
        effectsSection.appendChild(effectsList);
        content.appendChild(effectsSection);
    }
    
    card.appendChild(content);
    return card;
} 