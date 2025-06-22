// Global data storage
let petsData = null;

// ===== CORE FUNCTIONS =====

async function loadPetsFromFile() {
    try {
        const response = await fetch('data/pets.json');
        const data = await response.json();
        petsData = data;
        
        createFilterCheckboxes(data.availableTypes);
        updatePetDisplay();
        
        console.log('Pets loaded successfully!');
    } catch (error) {
        console.error('Error loading pets:', error);
        showErrorMessage();
    }
}

function updatePetDisplay() {
    if (!petsData) return;
    
    const selectedTypes = getSelectedPetTypes();
    const petsToShow = getPetsFromSelectedTypes(selectedTypes);
    
    showPets(petsToShow);
    updateSelectAllState();
    
    console.log(`Showing ${petsToShow.length} pets from: ${selectedTypes.join(', ')}`);
}

function showPets(pets) {
    const petList = document.getElementById('pet-list');
    petList.innerHTML = '';
    
    if (pets.length === 0) {
        petList.innerHTML = '<p class="no-pets">No pets found for the selected categories.</p>';
        return;
    }
    
    let petsHTML = '';
    pets.forEach(pet => {
        petsHTML += createPetCardHTML(pet);
    });
    
    petList.innerHTML = petsHTML;
}

// ===== FILTER FUNCTIONS =====

function createFilterCheckboxes(petTypes) {
    const filterContainer = document.getElementById('filter-container');
    if (!filterContainer) return;
    
    filterContainer.innerHTML = '<h3>Filter by Pet Type:</h3>';
    addSelectAllCheckbox(filterContainer);
    
    petTypes.forEach(type => {
        addPetTypeCheckbox(filterContainer, type);
    });
}

function addSelectAllCheckbox(container) {
    const selectAllHTML = `
        <div class="checkbox-container">
            <input type="checkbox" id="select-all" checked onchange="handleSelectAll()">
            <label for="select-all">Select All</label>
        </div>
    `;
    container.innerHTML += selectAllHTML;
}

function addPetTypeCheckbox(container, petType) {
    const checkboxHTML = `
        <div class="checkbox-container">
            <input type="checkbox" id="filter-${petType}" value="${petType}" checked onchange="updatePetDisplay()">
            <label for="filter-${petType}">${petType.charAt(0).toUpperCase() + petType.slice(1)}</label>
        </div>
    `;
    container.innerHTML += checkboxHTML;
}

function handleSelectAll() {
    const selectAllCheckbox = document.getElementById('select-all');
    const petCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="filter-"]');
    
    petCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updatePetDisplay();
}

function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('select-all');
    const petCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="filter-"]');
    const checkedCount = Array.from(petCheckboxes).filter(cb => cb.checked).length;
    
    if (checkedCount === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (checkedCount === petCheckboxes.length) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

// ===== HELPER FUNCTIONS =====

function getSelectedPetTypes() {
    const selectedTypes = [];
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"][id^="filter-"]:checked');
    
    checkedBoxes.forEach(checkbox => {
        selectedTypes.push(checkbox.value);
    });
    
    return selectedTypes;
}

function getPetsFromSelectedTypes(selectedTypes) {
    if (selectedTypes.length === 0) return [];
    
    let allPets = [];
    selectedTypes.forEach(type => {
        if (petsData.pets[type]) {
            allPets = allPets.concat(petsData.pets[type]);
        }
    });
    
    return allPets;
}

function createPetCardHTML(pet) {
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
    petList.innerHTML = '<p class="error">Sorry, we could not load the pets. Please try again later.</p>';
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', loadPetsFromFile);
