// Global data storage
let petsData = null;

// ===== CORE FUNCTIONS =====

async function loadFeaturedPets() {
    try {
        const response = await fetch('data/pets.json');
        const data = await response.json();
        petsData = data;
        
        showFeaturedPets();
        console.log('Featured pets loaded successfully!');
    } catch (error) {
        console.error('Error loading pets:', error);
        showErrorMessage();
    }
}

function showFeaturedPets() {
    if (!petsData) return;
    
    const petList = document.getElementById('pet-list');
    petList.innerHTML = '';
    
    const featuredPets = getOnePetFromEachType();
    
    let featuredPetsHTML = '';
    featuredPets.forEach(pet => {
        featuredPetsHTML += createFeaturedPetCardHTML(pet);
    });
    
    petList.innerHTML = featuredPetsHTML;
    console.log(`Showing ${featuredPets.length} featured pets (one from each type)`);
}

// ===== HELPER FUNCTIONS =====

function getOnePetFromEachType() {
    const featuredPets = [];
    const petTypes = petsData.availableTypes;
    
    petTypes.forEach(type => {
        if (petsData.pets[type] && petsData.pets[type].length > 0) {
            const firstPet = petsData.pets[type][0];
            featuredPets.push(firstPet);
        }
    });
    
    return featuredPets;
}

function createFeaturedPetCardHTML(pet) {
    return `
        <div class="pet">
            <img src="${pet.img}" alt="${pet.name}">
            <h3>${pet.name}</h3>
            <p>Type: ${pet.type}</p>
            <p>Age: ${pet.age} years</p>
            <button onclick="showAdoptionMessage()">Adopt Now</button>
        </div>
    `;
}

function showAdoptionMessage() {
    const message = document.createElement('div');
    message.className = 'adoption-message';
    message.innerHTML = `
        <div class="message-content">
            <h3>Thank you for your interest!</h3>
            <p>We will contact you shortly to discuss the adoption process.</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    document.body.appendChild(message);
    setTimeout(() => message.classList.add('show'), 10);
}

function showErrorMessage() {
    const petList = document.getElementById('pet-list');
    petList.innerHTML = '<p class="error">Sorry, we could not load the featured pets. Please try again later.</p>';
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', loadFeaturedPets); 