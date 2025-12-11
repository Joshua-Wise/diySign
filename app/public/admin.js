document.addEventListener('DOMContentLoaded', () => {
  // Check if user is authenticated
  const authToken = sessionStorage.getItem('authToken') || (sessionStorage.getItem('authenticated') ? 'admin123' : null);
  
  // If not authenticated, redirect to login page
  if (!authToken) {
    window.location.href = '/login';
    return;
  }
  
  // DOM elements
  const campusList = document.getElementById('campus-list');
  const campusForm = document.getElementById('campus-form');
  const modalTitle = document.getElementById('modal-title');
  const saveButton = document.getElementById('save-button');
  const cancelButton = document.getElementById('cancel-button');
  const campusIdInput = document.getElementById('campus-id');
  const campusNameInput = document.getElementById('campus-name');
  const campusOrgInput = document.getElementById('campus-organization');
  const campusAddressInput = document.getElementById('campus-address');
  const campusPhoneInput = document.getElementById('campus-phone');
  const addCampusButton = document.getElementById('add-campus-button');
  const campusModal = document.getElementById('campus-modal');
  const closeModalButton = document.querySelector('.close-modal');
  
  // Logo selection elements
  const logoPreview = document.getElementById('selected-logo-preview');
  const logoPathInput = document.getElementById('campus-logo-path');
  const selectLogoButton = document.getElementById('select-logo-button');
  const uploadLogoButton = document.getElementById('upload-logo-button');
  const logoFileInput = document.getElementById('logo-file-input');
  const logoSelectionModal = document.getElementById('logo-selection-modal');
  const closeLogoModalButton = document.querySelector('.close-modal-logo');
  const logosGrid = document.getElementById('logos-grid');
  
  // State
  let campuses = [];
  let editMode = false;
  let availableLogos = [];
  
  // Load campuses
  loadCampuses();
  
  // Event listeners
  campusForm.addEventListener('submit', handleFormSubmit);
  cancelButton.addEventListener('click', closeModal);
  addCampusButton.addEventListener('click', openAddModal);
  closeModalButton.addEventListener('click', closeModal);
  
  // Logo selection event listeners
  selectLogoButton.addEventListener('click', openLogoSelectionModal);
  uploadLogoButton.addEventListener('click', () => logoFileInput.click());
  logoFileInput.addEventListener('change', handleLogoUpload);
  closeLogoModalButton.addEventListener('click', closeLogoSelectionModal);
  
  // Load available logos
  loadAvailableLogos();
  
  // Logout button
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      // Clear authentication
      sessionStorage.removeItem('authenticated');
      sessionStorage.removeItem('authToken');
      // Redirect to login page
      window.location.href = '/login';
    });
  }
  
  // Close modal when clicking outside of it
  window.addEventListener('click', (e) => {
    if (e.target === campusModal) {
      closeModal();
    }
  });
  
  // Functions
  function loadCampuses() {
    fetch('/api/campuses')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load campuses');
        }
        return response.json();
      })
      .then(data => {
        campuses = data.campuses;
        renderCampusList();
      })
      .catch(error => {
        console.error('Error loading campuses:', error);
        campusList.innerHTML = `<div class="error">Error loading campuses: ${error.message}</div>`;
      });
  }
  
  function renderCampusList() {
    if (campuses.length === 0) {
      campusList.innerHTML = '<div class="no-campuses">No campuses found. Add one below.</div>';
      return;
    }
    
    campusList.innerHTML = campuses.map(campus => `
      <div class="campus-item" data-id="${campus.id}">
        <div class="campus-content">
          <div class="campus-logo">
            <img src="${campus.logoPath || 'images/logos/district-logo.png'}" alt="${campus.name} Logo">
          </div>
          <div class="campus-details">
            <h4>${campus.name}</h4>
            <p><strong>Organization:</strong> ${campus.organization}</p>
            <p><strong>Address:</strong> ${campus.address}</p>
            <p><strong>Phone:</strong> ${campus.phone}</p>
          </div>
        </div>
        <div class="campus-actions">
          <button class="btn-edit" data-id="${campus.id}"><i class="fas fa-edit"></i></button>
          <button class="btn-delete" data-id="${campus.id}"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.btn-edit').forEach(button => {
      button.addEventListener('click', () => editCampus(button.dataset.id));
    });
    
    document.querySelectorAll('.btn-delete').forEach(button => {
      button.addEventListener('click', () => deleteCampus(button.dataset.id));
    });
  }
  
  function handleFormSubmit(e) {
    e.preventDefault();
    
    const campusData = {
      name: campusNameInput.value,
      organization: campusOrgInput.value,
      address: campusAddressInput.value,
      phone: campusPhoneInput.value,
      logoPath: logoPathInput.value
    };
    
    if (editMode) {
      // Update existing campus
      campusData.id = campusIdInput.value;
      updateCampus(campusData);
    } else {
      // Generate a new ID for the campus
      campusData.id = generateCampusId(campusData.name);
      createCampus(campusData);
    }
  }
  
  function createCampus(campusData) {
    fetch('/api/campuses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': authToken
      },
      body: JSON.stringify(campusData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create campus');
        }
        return response.json();
      })
      .then(() => {
        loadCampuses();
        closeModal();
      })
      .catch(error => {
        console.error('Error creating campus:', error);
        alert(`Error creating campus: ${error.message}`);
      });
  }
  
  function updateCampus(campusData) {
    fetch(`/api/campuses/${campusData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': authToken
      },
      body: JSON.stringify(campusData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update campus');
        }
        return response.json();
      })
      .then(() => {
        loadCampuses();
        closeModal();
      })
      .catch(error => {
        console.error('Error updating campus:', error);
        alert(`Error updating campus: ${error.message}`);
      });
  }
  
  function deleteCampus(campusId) {
    if (!confirm('Are you sure you want to delete this campus?')) {
      return;
    }
    
    fetch(`/api/campuses/${campusId}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': authToken
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete campus');
        }
        return response.json();
      })
      .then(() => {
        loadCampuses();
      })
      .catch(error => {
        console.error('Error deleting campus:', error);
        alert(`Error deleting campus: ${error.message}`);
      });
  }
  
  function editCampus(campusId) {
    const campus = campuses.find(c => c.id === campusId);
    if (!campus) {
      console.error('Campus not found:', campusId);
      return;
    }
    
    // Set form to edit mode
    editMode = true;
    modalTitle.textContent = 'Edit Campus';
    saveButton.textContent = 'Update Campus';
    
    // Fill form with campus data
    campusIdInput.value = campus.id;
    campusNameInput.value = campus.name;
    campusOrgInput.value = campus.organization;
    campusAddressInput.value = campus.address;
    campusPhoneInput.value = campus.phone;
    
    // Set logo if available
    if (campus.logoPath) {
      logoPreview.src = campus.logoPath;
      logoPathInput.value = campus.logoPath;
    } else {
      // Use default logo
      logoPreview.src = 'images/logos/district-logo.png';
      logoPathInput.value = 'images/logos/district-logo.png';
    }
    
    // Open the modal
    openModal();
  }
  
  function openAddModal() {
    // Reset form and set to add mode
    resetForm();
    openModal();
  }
  
  function openModal() {
    campusModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
  }
  
  function closeModal() {
    campusModal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
    resetForm();
  }
  
  function resetForm() {
    // Reset form state
    editMode = false;
    modalTitle.textContent = 'Add New Campus';
    saveButton.textContent = 'Add Campus';
    
    // Clear form inputs
    campusForm.reset();
    campusIdInput.value = '';
  }
  
  function generateCampusId(name) {
    // Convert name to lowercase and replace spaces with underscores
    return name.toLowerCase().replace(/\s+/g, '_');
  }
  
  // Logo handling functions
  function loadAvailableLogos() {
    fetch('/api/logos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load logos');
        }
        return response.json();
      })
      .then(data => {
        availableLogos = data.logos || [];
        if (logoSelectionModal) {
          renderLogosGrid();
        }
      })
      .catch(error => {
        console.error('Error loading logos:', error);
        if (logosGrid) {
          logosGrid.innerHTML = `<div class="error">Error loading logos: ${error.message}</div>`;
        }
      });
  }
  
  function renderLogosGrid() {
    if (availableLogos.length === 0) {
      logosGrid.innerHTML = '<div class="no-logos">No logos available. Upload one using the upload button.</div>';
      return;
    }
    
    logosGrid.innerHTML = availableLogos.map(logoPath => {
      const fileName = logoPath.split('/').pop().replace(/\.(png|jpg|jpeg|gif|svg)$/i, '').replace(/[-_]/g, ' ');
      return `
      <div class="logo-item" data-path="${logoPath}">
        <img src="${logoPath}" alt="${fileName}">
      </div>
    `;
    }).join('');
    
    // Add event listeners to logo items
    document.querySelectorAll('.logo-item').forEach(item => {
      item.addEventListener('click', () => selectLogo(item.dataset.path));
    });
  }
  
  function openLogoSelectionModal() {
    logoSelectionModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    
    // Refresh logos
    loadAvailableLogos();
  }
  
  function closeLogoSelectionModal() {
    logoSelectionModal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  function selectLogo(logoPath) {
    // Update the preview and hidden input
    logoPreview.src = logoPath;
    logoPathInput.value = logoPath;
    
    // Close the modal
    closeLogoSelectionModal();
  }
  
  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('logo', file);
    
    // Upload the file
    fetch('/api/upload-logo', {
      method: 'POST',
      headers: {
        'x-auth-token': authToken
      },
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to upload logo');
        }
        return response.json();
      })
      .then(data => {
        // Update the preview and hidden input
        logoPreview.src = data.logoPath;
        logoPathInput.value = data.logoPath;
        
        // Refresh available logos
        loadAvailableLogos();
      })
      .catch(error => {
        console.error('Error uploading logo:', error);
        alert(`Error uploading logo: ${error.message}`);
      });
    
    // Reset the file input
    e.target.value = '';
  }
});
