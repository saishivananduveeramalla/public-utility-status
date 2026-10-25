/**
 * ESSENTIALS OF WEB PROGRAMMING (EWP) LAB
 * Standalone JavaScript Demonstration (app.js)
 * Connected to javascript-demo.html
 * 
 * Demonstrates:
 * 1. Form Validation (Name, 10-digit mobile, email format, category, description)
 * 2. Real-time input checking
 * 3. Dynamic error and success messaging in DOM
 * 4. Client-side complaint ticket generation
 */

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('demoComplaintForm');
  const resultCard = document.getElementById('resultCard');
  const resetBtn = document.getElementById('resetBtn');

  // Input elements
  const nameInput = document.getElementById('citizenName');
  const mobileInput = document.getElementById('mobile');
  const emailInput = document.getElementById('email');
  const categorySelect = document.getElementById('utilityCategory');
  const areaSelect = document.getElementById('serviceArea');
  const descInput = document.getElementById('description');

  // Form submission handler
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page reload

    // Reset previous errors
    clearAllErrors();

    let isValid = true;

    // 1. Validate Citizen Name (Minimum 3 characters)
    if (!nameInput.value.trim()) {
      showError('nameError', 'Citizen name is required.');
      isValid = false;
    } else if (nameInput.value.trim().length < 3) {
      showError('nameError', 'Name must contain at least 3 characters.');
      isValid = false;
    }

    // 2. Validate Mobile Number (Must be exactly 10 digits)
    const mobileValue = mobileInput.value.trim();
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileValue) {
      showError('mobileError', 'Mobile number is required.');
      isValid = false;
    } else if (!mobileRegex.test(mobileValue)) {
      showError('mobileError', 'Mobile number must be exactly 10 digits (numbers only).');
      isValid = false;
    }

    // 3. Validate Email Format
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
      showError('emailError', 'Email address is required.');
      isValid = false;
    } else if (!emailRegex.test(emailValue)) {
      showError('emailError', 'Please enter a valid email address (e.g. citizen@example.com).');
      isValid = false;
    }

    // 4. Validate Utility Category
    if (!categorySelect.value) {
      showError('categoryError', 'Please select a utility category.');
      isValid = false;
    }

    // 5. Validate Service Area
    if (!areaSelect.value) {
      showError('areaError', 'Please select your service area.');
      isValid = false;
    }

    // 6. Validate Description (Minimum 15 characters)
    if (!descInput.value.trim()) {
      showError('descError', 'Problem description is required.');
      isValid = false;
    } else if (descInput.value.trim().length < 15) {
      showError('descError', 'Please describe the problem in at least 15 characters.');
      isValid = false;
    }

    // If all validations pass
    if (isValid) {
      const generatedId = 'CMP-JS-' + Math.floor(1000 + Math.random() * 9000);
      
      // Populate result card
      document.getElementById('ticketId').textContent = generatedId;
      document.getElementById('resName').textContent = nameInput.value.trim();
      document.getElementById('resMobile').textContent = mobileValue;
      document.getElementById('resEmail').textContent = emailValue;
      document.getElementById('resCategory').textContent = categorySelect.value;
      document.getElementById('resArea').textContent = areaSelect.value;
      document.getElementById('resDesc').textContent = descInput.value.trim();
      document.getElementById('resTime').textContent = new Date().toLocaleString();

      // Show success card, scroll into view
      resultCard.style.display = 'block';
      resultCard.scrollIntoView({ behavior: 'smooth' });

      // Form reset
      form.reset();
    }
  });

  // Reset button handler
  resetBtn.addEventListener('click', () => {
    clearAllErrors();
    resultCard.style.display = 'none';
  });

  // Helper functions
  function showError(elementId, message) {
    const errorElem = document.getElementById(elementId);
    if (errorElem) {
      errorElem.textContent = message;
      errorElem.style.display = 'block';
    }
  }

  function clearAllErrors() {
    const errorElems = document.querySelectorAll('.form-error');
    errorElems.forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }
});
