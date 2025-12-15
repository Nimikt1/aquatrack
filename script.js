// Aquarium Tracker JavaScript
// This file handles adding, editing, deleting fish and saving to localStorage

// Array to store our fish
var fishList = [];

// Variable to track if we are editing a fish
var editingIndex = -1;

// Wait for the page to load before running our code
document.addEventListener('DOMContentLoaded', function() {
    // Load fish from localStorage when page loads
    loadFishFromStorage();
    
    // Get the add button element
    var addButton = document.getElementById('addFishBtn');
    
    // Get the cancel button element
    var cancelButton = document.getElementById('cancelEditBtn');
    
    // Add click event to the add button
    addButton.addEventListener('click', handleSubmit);
    
    // Add click event to the cancel button
    cancelButton.addEventListener('click', cancelEdit);
    
    // Display the fish list
    displayFish();
    
    // Update the statistics
    updateStats();
});

// Function to load fish from localStorage
function loadFishFromStorage() {
    // Try to get fish from localStorage
    var storedFish = localStorage.getItem('fishList');
    
    // Check if there is data in localStorage
    if (storedFish !== null) {
        // Parse the JSON string back to an array
        fishList = JSON.parse(storedFish);
    }
}

// Function to save fish to localStorage
function saveFishToStorage() {
    // Convert the array to a JSON string and save it
    localStorage.setItem('fishList', JSON.stringify(fishList));
}

// Function to handle form submit (add or update)
function handleSubmit() {
    // Check if we are editing or adding
    if (editingIndex === -1) {
        addFish();
    } else {
        updateFish();
    }
}

// Function to validate the form
function validateForm() {
    // Get the input values
    var fishName = document.getElementById('fishName').value.trim();
    var tankSize = document.getElementById('tankSize').value;
    var waterChangeDate = document.getElementById('waterChangeDate').value;
    
    // Array to store error messages
    var errors = [];
    
    // Remove previous error styling
    document.getElementById('fishName').classList.remove('input-error');
    document.getElementById('tankSize').classList.remove('input-error');
    document.getElementById('waterChangeDate').classList.remove('input-error');
    
    // Check fish name
    if (fishName === '') {
        errors.push('Please enter a fish name.');
        document.getElementById('fishName').classList.add('input-error');
    } else if (fishName.length < 2) {
        errors.push('Fish name must be at least 2 characters long.');
        document.getElementById('fishName').classList.add('input-error');
    }
    
    // Check tank size
    if (tankSize === '') {
        errors.push('Please enter a tank size.');
        document.getElementById('tankSize').classList.add('input-error');
    } else if (parseInt(tankSize) <= 0) {
        errors.push('Tank size must be greater than 0 liters.');
        document.getElementById('tankSize').classList.add('input-error');
    } else if (parseInt(tankSize) > 10000) {
        errors.push('Tank size seems too large. Please enter a realistic value.');
        document.getElementById('tankSize').classList.add('input-error');
    }
    
    // Check water change date
    if (waterChangeDate === '') {
        errors.push('Please select a water change date.');
        document.getElementById('waterChangeDate').classList.add('input-error');
    } else {
        // Check if date is not in the future
        var today = new Date();
        var selectedDate = new Date(waterChangeDate);
        if (selectedDate > today) {
            errors.push('Water change date cannot be in the future.');
            document.getElementById('waterChangeDate').classList.add('input-error');
        }
    }
    
    // Show or hide error message
    var errorMessageDiv = document.getElementById('errorMessage');
    if (errors.length > 0) {
        errorMessageDiv.innerHTML = errors.join('<br>');
        errorMessageDiv.classList.add('show');
        return false;
    } else {
        errorMessageDiv.innerHTML = '';
        errorMessageDiv.classList.remove('show');
        return true;
    }
}

// Function to add a new fish
function addFish() {
    // Validate the form first
    if (!validateForm()) {
        return;
    }
    
    // Get the input values
    var fishName = document.getElementById('fishName').value.trim();
    var tankSize = document.getElementById('tankSize').value;
    var waterChangeDate = document.getElementById('waterChangeDate').value;
    
    // Create a fish object
    var fish = {
        name: fishName,
        tankSize: tankSize,
        lastWaterChange: waterChangeDate
    };
    
    // Add the fish to our array
    fishList.push(fish);
    
    // Save to localStorage
    saveFishToStorage();
    
    // Clear the input fields
    clearInputs();
    
    // Update the display
    displayFish();
    
    // Update the statistics
    updateStats();
}

// Function to update an existing fish
function updateFish() {
    // Validate the form first
    if (!validateForm()) {
        return;
    }
    
    // Get the input values
    var fishName = document.getElementById('fishName').value.trim();
    var tankSize = document.getElementById('tankSize').value;
    var waterChangeDate = document.getElementById('waterChangeDate').value;
    
    // Update the fish in the array
    fishList[editingIndex].name = fishName;
    fishList[editingIndex].tankSize = tankSize;
    fishList[editingIndex].lastWaterChange = waterChangeDate;
    
    // Save to localStorage
    saveFishToStorage();
    
    // Reset editing mode
    editingIndex = -1;
    
    // Reset the form title and button
    document.getElementById('formTitle').textContent = 'Add a New Fish';
    document.getElementById('addFishBtn').textContent = 'Add Fish';
    document.getElementById('cancelEditBtn').classList.add('hidden');
    
    // Clear the input fields
    clearInputs();
    
    // Update the display
    displayFish();
    
    // Update the statistics
    updateStats();
}

// Function to start editing a fish
function editFish(index) {
    // Set the editing index
    editingIndex = index;
    
    // Get the fish to edit
    var fish = fishList[index];
    
    // Fill the form with fish data
    document.getElementById('fishName').value = fish.name;
    document.getElementById('tankSize').value = fish.tankSize;
    document.getElementById('waterChangeDate').value = fish.lastWaterChange;
    
    // Change the form title and button text
    document.getElementById('formTitle').textContent = 'Edit Fish';
    document.getElementById('addFishBtn').textContent = 'Update Fish';
    document.getElementById('cancelEditBtn').classList.remove('hidden');
    
    // Clear any error messages
    document.getElementById('errorMessage').classList.remove('show');
    document.getElementById('fishName').classList.remove('input-error');
    document.getElementById('tankSize').classList.remove('input-error');
    document.getElementById('waterChangeDate').classList.remove('input-error');
    
    // Scroll to the form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Function to cancel editing
function cancelEdit() {
    // Reset editing mode
    editingIndex = -1;
    
    // Reset the form title and button
    document.getElementById('formTitle').textContent = 'Add a New Fish';
    document.getElementById('addFishBtn').textContent = 'Add Fish';
    document.getElementById('cancelEditBtn').classList.add('hidden');
    
    // Clear the input fields
    clearInputs();
    
    // Clear any error messages
    document.getElementById('errorMessage').classList.remove('show');
    document.getElementById('fishName').classList.remove('input-error');
    document.getElementById('tankSize').classList.remove('input-error');
    document.getElementById('waterChangeDate').classList.remove('input-error');
}

// Function to delete a fish
function deleteFish(index) {
    // Ask for confirmation
    var fishName = fishList[index].name;
    var confirmed = confirm('Are you sure you want to delete "' + fishName + '"?');
    
    if (confirmed) {
        // Remove the fish from the array
        fishList.splice(index, 1);
        
        // Save to localStorage
        saveFishToStorage();
        
        // If we were editing this fish, cancel the edit
        if (editingIndex === index) {
            cancelEdit();
        } else if (editingIndex > index) {
            // Adjust editing index if needed
            editingIndex = editingIndex - 1;
        }
        
        // Update the display
        displayFish();
        
        // Update the statistics
        updateStats();
    }
}

// Function to clear the input fields
function clearInputs() {
    document.getElementById('fishName').value = '';
    document.getElementById('tankSize').value = '';
    document.getElementById('waterChangeDate').value = '';
}

// Function to display all fish
function displayFish() {
    // Get the fish list container
    var fishListContainer = document.getElementById('fishList');
    
    // Clear the current content
    fishListContainer.innerHTML = '';
    
    // Check if there are no fish
    if (fishList.length === 0) {
        fishListContainer.innerHTML = '<p class="empty-message" id="emptyMessage">No fish added yet. Add your first fish above!</p>';
        return;
    }
    
    // Loop through each fish and create a card
    for (var i = 0; i < fishList.length; i++) {
        var fish = fishList[i];
        
        // Create the fish card HTML
        var fishCard = document.createElement('div');
        fishCard.className = 'fish-card';
        fishCard.setAttribute('data-testid', 'card-fish-' + i);
        
        // Add the fish details with edit and delete buttons
        fishCard.innerHTML = 
            '<div class="fish-card-header">' +
                '<div class="fish-name" data-testid="text-fish-name-' + i + '">' + fish.name + '</div>' +
                '<div class="card-actions">' +
                    '<button class="edit-btn" data-testid="button-edit-fish-' + i + '" onclick="editFish(' + i + ')">Edit</button>' +
                    '<button class="delete-btn" data-testid="button-delete-fish-' + i + '" onclick="deleteFish(' + i + ')">Delete</button>' +
                '</div>' +
            '</div>' +
            '<div class="fish-detail" data-testid="text-tank-size-' + i + '">Tank Size: ' + fish.tankSize + ' liters</div>' +
            '<div class="fish-detail" data-testid="text-water-change-' + i + '">Last Water Change: ' + formatDate(fish.lastWaterChange) + '</div>';
        
        // Add the card to the container
        fishListContainer.appendChild(fishCard);
    }
}

// Function to update the statistics
function updateStats() {
    // Get the stat elements
    var totalFishElement = document.getElementById('totalFish');
    var avgTankSizeElement = document.getElementById('avgTankSize');
    
    // Calculate total fish
    var totalFish = fishList.length;
    totalFishElement.textContent = totalFish;
    
    // Calculate average tank size
    if (totalFish === 0) {
        avgTankSizeElement.textContent = '0 liters';
    } else {
        var totalTankSize = 0;
        for (var i = 0; i < fishList.length; i++) {
            totalTankSize = totalTankSize + parseInt(fishList[i].tankSize);
        }
        var averageTankSize = Math.round(totalTankSize / totalFish);
        avgTankSizeElement.textContent = averageTankSize + ' liters';
    }
}

// Function to format the date nicely
function formatDate(dateString) {
    // Create a date object
    var date = new Date(dateString);
    
    // Get day, month, and year
    var day = date.getDate();
    var month = date.getMonth() + 1; // Months are 0-indexed
    var year = date.getFullYear();
    
    // Return formatted date
    return month + '/' + day + '/' + year;
}
