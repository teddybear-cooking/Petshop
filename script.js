// Global data storage
let petsData = null;
let allPets = []; // Flattened array of all pets for easier searching/filtering
let filteredPets = []; // Current filtered results

// ===== CORE FUNCTIONS =====

async function loadPetsFromFile() {
  try {
    const response = await fetch("data/pets.json");
    const data = await response.json();
    petsData = data;

    // Flatten pets data for easier filtering
    allPets = [];
    Object.keys(data.pets).forEach((type) => {
      allPets = allPets.concat(data.pets[type]);
    });

    createFilterCheckboxes(data.availableTypes);
    initializeEventListeners();
    updatePetDisplay();

    console.log("Pets loaded successfully!");
  } catch (error) {
    console.error("Error loading pets:", error);
    showErrorMessage();
  }
}

function updatePetDisplay() {
  if (!petsData) return;

  // Get all filter criteria
  const searchTerm =
    document.getElementById("search-input")?.value.toLowerCase() || "";
  const selectedTypes = getSelectedPetTypes();
  const minAge = parseInt(document.getElementById("min-age")?.value) || 0;
  const maxAge = parseInt(document.getElementById("max-age")?.value) || 20;
  const sortBy = document.getElementById("sort-select")?.value || "name-asc";

  // Apply all filters
  filteredPets = allPets.filter((pet) => {
    // Search filter
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm);

    // Type filter
    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.includes(pet.type.toLowerCase() + "s");

    // Age filter
    const matchesAge = pet.age >= minAge && pet.age <= maxAge;

    return matchesSearch && matchesType && matchesAge;
  });

  // Sort pets
  sortPets(filteredPets, sortBy);

  // Display results
  showPets(filteredPets);
  updateSelectAllState();
  updateResultsSummary();

  console.log(`Showing ${filteredPets.length} pets`);
}

function showPets(pets) {
  const petList = document.getElementById("pet-list");
  petList.innerHTML = "";

  if (pets.length === 0) {
    petList.innerHTML = `
            <div class="no-pets">
                <h3>No pets found</h3>
                <p>Try adjusting your search criteria or filters to find more pets.</p>
                <button onclick="resetAllFilters()" class="reset-btn">Reset Filters</button>
            </div>
        `;
    return;
  }

  let petsHTML = "";
  pets.forEach((pet) => {
    petsHTML += createPetCardHTML(pet);
  });

  petList.innerHTML = petsHTML;
}

// ===== SEARCH AND SORT FUNCTIONS =====

function sortPets(pets, sortBy) {
  pets.sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "age-asc":
        return a.age - b.age;
      case "age-desc":
        return b.age - a.age;
      case "type-asc":
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });
}

function updateResultsSummary() {
  const summaryElement = document.getElementById("results-summary");
  if (!summaryElement) return;

  const total = allPets.length;
  const filtered = filteredPets.length;

  if (filtered === total) {
    summaryElement.textContent = `Showing all ${total} pets`;
  } else {
    summaryElement.textContent = `Showing ${filtered} of ${total} pets`;
  }
}

// ===== EVENT LISTENERS =====

function initializeEventListeners() {
  // Search input
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", debounce(updatePetDisplay, 300));
  }

  // Clear search button
  const clearSearchBtn = document.getElementById("clear-search");
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", clearSearch);
  }

  // Age inputs
  const minAgeInput = document.getElementById("min-age");
  const maxAgeInput = document.getElementById("max-age");
  if (minAgeInput) {
    minAgeInput.addEventListener("change", updatePetDisplay);
  }
  if (maxAgeInput) {
    maxAgeInput.addEventListener("change", updatePetDisplay);
  }

  // Sort select
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", updatePetDisplay);
  }

  // Reset filters button
  const resetBtn = document.getElementById("reset-filters");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetAllFilters);
  }
}

function clearSearch() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.value = "";
    updatePetDisplay();
  }
}

function resetAllFilters() {
  // Clear search
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.value = "";

  // Reset age filters
  const minAgeInput = document.getElementById("min-age");
  const maxAgeInput = document.getElementById("max-age");
  if (minAgeInput) minAgeInput.value = "0";
  if (maxAgeInput) maxAgeInput.value = "20";

  // Reset sort
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) sortSelect.value = "name-asc";

  // Check all type filters
  const selectAllCheckbox = document.getElementById("select-all");
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = true;
    handleSelectAll();
  }

  updatePetDisplay();
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

// ===== FILTER FUNCTIONS =====

function createFilterCheckboxes(petTypes) {
  const filterContainer = document.getElementById("filter-container");
  if (!filterContainer) return;

  // Clear existing content
  filterContainer.innerHTML = "";

  // Add select all checkbox
  addSelectAllCheckbox(filterContainer);

  // Add individual type checkboxes
  petTypes.forEach((type) => {
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
            <label for="filter-${petType}">${
    petType.charAt(0).toUpperCase() + petType.slice(1)
  }</label>
        </div>
    `;
  container.innerHTML += checkboxHTML;
}

function handleSelectAll() {
  const selectAllCheckbox = document.getElementById("select-all");
  const petCheckboxes = document.querySelectorAll(
    'input[type="checkbox"][id^="filter-"]'
  );

  petCheckboxes.forEach((checkbox) => {
    checkbox.checked = selectAllCheckbox.checked;
  });

  updatePetDisplay();
}

function updateSelectAllState() {
  const selectAllCheckbox = document.getElementById("select-all");
  const petCheckboxes = document.querySelectorAll(
    'input[type="checkbox"][id^="filter-"]'
  );
  const checkedCount = Array.from(petCheckboxes).filter(
    (cb) => cb.checked
  ).length;

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
  const checkedBoxes = document.querySelectorAll(
    'input[type="checkbox"][id^="filter-"]:checked'
  );

  checkedBoxes.forEach((checkbox) => {
    selectedTypes.push(checkbox.value);
  });

  return selectedTypes;
}

// Legacy function - keeping for compatibility but not used in new filtering
function getPetsFromSelectedTypes(selectedTypes) {
  if (selectedTypes.length === 0) return [];

  let pets = [];
  selectedTypes.forEach((type) => {
    if (petsData.pets[type]) {
      pets = pets.concat(petsData.pets[type]);
    }
  });

  return pets;
}

function createPetCardHTML(pet) {
  return `
        <div class="pet" data-name="${pet.name.toLowerCase()}" data-type="${pet.type.toLowerCase()}" data-age="${
    pet.age
  }">
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
    '<p class="error">Sorry, we could not load the pets. Please try again later.</p>';
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", loadPetsFromFile);
