document.addEventListener('DOMContentLoaded', () => {
    fetchRecipes();
});

async function fetchRecipes() {
    try {
        const response = await fetch('recipes.json');
        const recipes = await response.json();
        
        // Store recipes globally for filtering
        window.allRecipes = recipes;
        
        // Create effect filters before displaying recipes
        createEffectFilters(recipes);
        
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

function createEffectFilters(recipes) {
    // Extract all unique effect types from recipes
    const effectTypes = new Set();
    recipes.forEach(recipe => {
        recipe.effects.forEach(effect => {
            effectTypes.add(effect.type);
        });
    });
    
    // Sort effect types alphabetically
    const sortedEffectTypes = Array.from(effectTypes).sort();
    
    // Create filter container if it doesn't exist
    let filterContainer = document.getElementById('filter-container');
    if (!filterContainer) {
        filterContainer = document.createElement('div');
        filterContainer.id = 'filter-container';
        filterContainer.className = 'filter-container';
        
        // Insert before recipes container
        const recipesContainer = document.getElementById('recipes-container');
        recipesContainer.parentNode.insertBefore(filterContainer, recipesContainer);
    }
    
    // Create filter dropdown
    const filterLabel = document.createElement('label');
    filterLabel.textContent = 'Filter by Effect: ';
    filterLabel.htmlFor = 'effect-filter';
    
    const filterSelect = document.createElement('select');
    filterSelect.id = 'effect-filter';
    filterSelect.className = 'effect-filter';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'All Effects';
    filterSelect.appendChild(defaultOption);
    
    // Add options for each effect type
    sortedEffectTypes.forEach(effectType => {
        const option = document.createElement('option');
        option.value = effectType;
        option.textContent = effectType;
        filterSelect.appendChild(option);
    });
    
    // Add event listener for filter changes
    filterSelect.addEventListener('change', applyFilters);
    
    filterContainer.appendChild(filterLabel);
    filterContainer.appendChild(filterSelect);
}

function applyFilters() {
    // Get selected effect
    const selectedEffect = document.getElementById('effect-filter').value;
    
    let filteredRecipes = window.allRecipes;
    
    // If an effect is selected, filter recipes
    if (selectedEffect) {
        filteredRecipes = filteredRecipes.filter(recipe => {
            const recipeEffectTypes = recipe.effects.map(effect => effect.type);
            return recipeEffectTypes.includes(selectedEffect);
        });
    }
    
    // Display the filtered recipes
    displayRecipes(filteredRecipes);
}

function clearFilters() {
    // Reset dropdown to default
    document.getElementById('effect-filter').value = '';
    
    // Reset to show all recipes
    displayRecipes(window.allRecipes);
}

function displayRecipes(recipes) {
    const container = document.getElementById('recipes-container');
    container.innerHTML = ''; // Clear loading message or previous recipes
    
    if (recipes.length === 0) {
        container.innerHTML = '<div class="no-results">No recipes match your selected filters</div>';
        return;
    }
    
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
    
    // Effects section (excluding Health/Mana Regeneration)
    const filteredEffects = recipe.effects.filter(effect => {
        if (!effect.duration) return true;
        
        // Parse the duration string
        const durationParts = effect.duration.split(' ');
        const value = parseFloat(durationParts[0]);
        const unit = durationParts[1].toLowerCase();
        
        // Convert to minutes
        let durationInMinutes = 0;
        if (unit.includes('second')) {
            durationInMinutes = value / 60;
        } else if (unit.includes('minute')) {
            durationInMinutes = value;
        } else if (unit.includes('hour')) {
            durationInMinutes = value * 60;
        }
        
        // Keep effects that last longer than 2 minutes
        return durationInMinutes > 2;
    });
    
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
    
    // Sources section (add this new section between effects and ingredients)
    if (recipe.sources && recipe.sources.length > 0) {
        const sourcesSection = document.createElement('div');
        sourcesSection.className = 'recipe-section';
        
        const sourcesTitle = document.createElement('h3');
        sourcesTitle.textContent = 'Sources';
        sourcesSection.appendChild(sourcesTitle);
        
        const sourcesList = document.createElement('div');
        sourcesList.className = 'sources-list';
        
        // Create two columns for the sources
        const leftColumn = document.createElement('ul');
        leftColumn.className = 'sources-column';
        
        const rightColumn = document.createElement('ul');
        rightColumn.className = 'sources-column';
        
        // Distribute sources between columns
        recipe.sources.forEach((source, index) => {
            const sourceItem = document.createElement('li');
            sourceItem.textContent = source;
            
            // Add to left column if index is even, right column if odd
            if (index % 2 === 0) {
                leftColumn.appendChild(sourceItem);
            } else {
                rightColumn.appendChild(sourceItem);
            }
        });
        
        sourcesList.appendChild(leftColumn);
        sourcesList.appendChild(rightColumn);
        sourcesSection.appendChild(sourcesList);
        content.appendChild(sourcesSection);
    }
    
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
        ingredientName.textContent = `${ingredient.name} x${ingredient.required}`;
        
        ingredientElem.appendChild(ingredientImg);
        ingredientElem.appendChild(ingredientName);
        
        ingredientsList.appendChild(ingredientElem);
    });
    
    ingredientsSection.appendChild(ingredientsList);
    content.appendChild(ingredientsSection);
    
    card.appendChild(content);
    return card;
} 