// Global data storage
let petsData = null;
let allFeaturedPets = [];
let filteredFeaturedPets = [];

// ===== CORE FUNCTIONS =====

async function loadFeaturedPets() {
  try {
    const response = await fetch("data/pets.json");
    const data = await response.json();
    petsData = data;

    allFeaturedPets = getOnePetFromEachType();
    filteredFeaturedPets = [...allFeaturedPets];

    initializeHomeSearch();
    showFeaturedPets();
    console.log("Featured pets loaded successfully!");
  } catch (error) {
    console.error("Error loading pets:", error);
    showErrorMessage();
  }
}

function showFeaturedPets() {
  if (!petsData) return;

  const petList = document.getElementById("pet-list");
  petList.innerHTML = "";

  if (filteredFeaturedPets.length === 0) {
    petList.innerHTML = `
            <div class="no-pets">
                <h3>No featured pets found</h3>
                <p>Try clearing your search or <a href="pets.html">browse all pets</a></p>
            </div>
        `;
    return;
  }

  let featuredPetsHTML = "";
  filteredFeaturedPets.forEach((pet) => {
    featuredPetsHTML += createFeaturedPetCardHTML(pet);
  });

  petList.innerHTML = featuredPetsHTML;
  console.log(`Showing ${filteredFeaturedPets.length} featured pets`);
}

// ===== SEARCH FUNCTIONS =====

function initializeHomeSearch() {
  const searchInput = document.getElementById("home-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", debounce(handleHomeSearch, 300));
  }
}

function handleHomeSearch() {
  const searchInput = document.getElementById("home-search-input");
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (searchTerm === "") {
    filteredFeaturedPets = [...allFeaturedPets];
  } else {
    filteredFeaturedPets = allFeaturedPets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(searchTerm) ||
        pet.type.toLowerCase().includes(searchTerm)
    );
  }

  showFeaturedPets();
}

// Debounce function to limit search input frequency
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== HELPER FUNCTIONS =====

function getOnePetFromEachType() {
  const featuredPets = [];
  const petTypes = petsData.availableTypes;

  petTypes.forEach((type) => {
    if (petsData.pets[type] && petsData.pets[type].length > 0) {
      const firstPet = petsData.pets[type][0];
      featuredPets.push(firstPet);
    }
  });

  return featuredPets;
}

function createFeaturedPetCardHTML(pet) {
  return `
        <div class="pet" data-name="${pet.name.toLowerCase()}" data-type="${pet.type.toLowerCase()}">
            <img src="${pet.img}" alt="${pet.name}" loading="lazy">
            <div class="pet-info">
                <h3>${pet.name}</h3>
                <div class="pet-details">
                    <span class="pet-type">${pet.type}</span>
                    <span class="pet-age">${pet.age} year${
    pet.age !== 1 ? "s" : ""
  } old</span>
                </div>
                <button onclick="showAdoptionMessage('${
                  pet.name
                }')" class="adopt-btn">
                    <span>❤️</span> Adopt ${pet.name}
                </button>
            </div>
        </div>
    `;
}

function showAdoptionMessage(petName = "this pet") {
  const message = document.createElement("div");
  message.className = "adoption-message";
  message.innerHTML = `
        <div class="message-content">
            <h3>❤️ Thank you for your interest in ${petName}!</h3>
            <p>We're so excited that you want to give ${petName} a loving home. We'll contact you shortly to discuss the adoption process.</p>
            <div class="message-actions">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="close-btn">Close</button>
            </div>
        </div>
    `;

  document.body.appendChild(message);
  setTimeout(() => message.classList.add("show"), 10);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (message.parentElement) {
      message.classList.remove("show");
      setTimeout(() => message.remove(), 300);
    }
  }, 5000);
}

function showErrorMessage() {
  const petList = document.getElementById("pet-list");
  petList.innerHTML =
    '<p class="error">Sorry, we could not load the featured pets. Please try again later.</p>';
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", loadFeaturedPets);
