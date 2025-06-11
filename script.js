// Function to show adoption message
function adoptPet() {
    // Create message element
    const message = document.createElement('div');
    message.className = 'adoption-message';
    message.innerHTML = `
        <div class="message-content">
            <h3>Thank you for your interest!</h3>
            <p>We will contact you shortly to discuss the adoption process.</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    // Add message to the page
    document.body.appendChild(message);
    
    // Add show class after a small delay to trigger animation
    setTimeout(() => {
        message.classList.add('show');
    }, 10);
}

// Function to load pets from JSON file
async function loadPets() {
    try {
        console.log('Loading pets...');
        const response = await fetch('data/pets.json');
        const data = await response.json();
        const petList = document.getElementById('pet-list');
        
        // Clear existing content
        petList.innerHTML = '';
        
        // Add each pet to the list
        data.pets.forEach(pet => {
            const petItem = document.createElement('div');
            petItem.className = 'pet';
            petItem.innerHTML = `
                <img src="${pet.img}" alt="${pet.name}">
                <h3>${pet.name}</h3>
                <p>Type: ${pet.type}</p>
                <p>Age: ${pet.age} years</p>
                <button onclick="adoptPet()">Adopt Now</button>
            `;
            petList.appendChild(petItem);
        });
        
        console.log('Pets loaded successfully.');
    } catch (error) {
        console.error('Error loading pets:', error);
        const petList = document.getElementById('pet-list');
        petList.innerHTML = '<p class="error">Sorry, we could not load the pets. Please try again later.</p>';
    }
}

// Load pets when the DOM is ready
document.addEventListener('DOMContentLoaded', loadPets);
