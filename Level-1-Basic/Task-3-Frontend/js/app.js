/**
 * =============================================================================
 * MENGED (መንገድ) - FRONTEND APPLICATION SCRIPT
 * Level 1: Task 3 - Dynamic Frontend with Vanilla JavaScript
 * Author: Haleta (Codveda Full-Stack Development Internship)
 * =============================================================================
 */

// Global API Base URL Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Application State
const state = {
  opportunities: [],
  filteredOpportunities: [],
  activeType: 'All',
  activeField: 'All',
  searchQuery: '',
  isEditing: false,
  editingId: null,
  pendingDeleteId: null,
  isBackendOnline: true,
  searchDebounceTimer: null,
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Sanitize strings to prevent XSS attacks when rendering dynamic HTML
 */
function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format ISO date string to readable human format (e.g. Dec 31, 2026)
 */
function formatDate(dateString) {
  if (!dateString) return 'No deadline specified';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (_) {
    return dateString;
  }
}

/**
 * Map opportunity category to appropriate CSS badge class
 */
function getCategoryBadgeClass(type) {
  switch (type) {
    case 'Internships':
      return 'category-internships';
    case 'Scholarships':
      return 'category-scholarships';
    case 'Remote jobs':
      return 'category-remote-jobs';
    case 'Training programs':
      return 'category-training-programs';
    case 'Fellowships':
      return 'category-fellowships';
    default:
      return 'category-internships';
  }
}

/**
 * Display toast notification to the user
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'ℹ';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '✕';

  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// =============================================================================
// API SERVICE (Fetch API & async/await)
// =============================================================================

/**
 * Check if Express backend is running via GET /api/health
 */
async function checkBackendHealth() {
  const banner = document.getElementById('backend-status-banner');
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (res.ok) {
      state.isBackendOnline = true;
      if (banner) banner.classList.add('hidden');
      return true;
    } else {
      throw new Error(`Health status ${res.status}`);
    }
  } catch (err) {
    state.isBackendOnline = false;
    if (banner) banner.classList.remove('hidden');
    return false;
  }
}

/**
 * Fetch opportunities from the REST API with query parameters
 */
async function fetchOpportunities() {
  renderLoadingState();
  hideEmptyAndErrorStates();

  try {
    const queryParams = new URLSearchParams();

    if (state.activeType && state.activeType !== 'All') {
      queryParams.append('type', state.activeType);
    }

    if (state.activeField && state.activeField !== 'All') {
      queryParams.append('field', state.activeField);
    }

    if (state.searchQuery && state.searchQuery.trim().length > 0) {
      queryParams.append('search', state.searchQuery.trim());
    }

    const url = `${API_BASE_URL}/opportunities${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw new Error(errorJson.message || `Server responded with ${response.status}`);
    }

    const result = await response.json();
    state.opportunities = result.data || [];
    state.filteredOpportunities = state.opportunities;

    renderOpportunities(state.filteredOpportunities);
    renderManagementTable(state.opportunities);
    updateResultsCount(state.filteredOpportunities.length);

    const banner = document.getElementById('backend-status-banner');
    if (banner) banner.classList.add('hidden');
    state.isBackendOnline = true;
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    renderErrorState(error.message);
    const banner = document.getElementById('backend-status-banner');
    if (banner) banner.classList.remove('hidden');
    state.isBackendOnline = false;
  }
}

/**
 * Fetch a single opportunity by ID
 */
async function fetchOpportunityById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/opportunities/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to load opportunity with ID ${id}`);
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    showToast(err.message, 'error');
    return null;
  }
}

/**
 * Create a new opportunity via POST /api/opportunities
 */
async function createOpportunity(payload) {
  const response = await fetch(`${API_BASE_URL}/opportunities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.errors ? data.errors.join(' ') : data.message || 'Creation failed';
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Update an existing opportunity via PUT /api/opportunities/:id
 */
async function updateOpportunity(id, payload) {
  const response = await fetch(`${API_BASE_URL}/opportunities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.errors ? data.errors.join(' ') : data.message || 'Update failed';
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Delete an opportunity via DELETE /api/opportunities/:id
 */
async function deleteOpportunity(id) {
  const response = await fetch(`${API_BASE_URL}/opportunities/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 204) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Failed to delete opportunity #${id}`);
  }

  return true;
}

// =============================================================================
// DOM RENDERING FUNCTIONS
// =============================================================================

/**
 * Render loading skeleton placeholders
 */
function renderLoadingState() {
  const grid = document.getElementById('opportunities-grid');
  if (!grid) return;

  grid.innerHTML = Array(6)
    .fill(0)
    .map(
      () => `
      <div class="skeleton-card" aria-hidden="true">
        <div class="skeleton-line skeleton-badge"></div>
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-text-short"></div>
        <div class="skeleton-line skeleton-text"></div>
        <div class="skeleton-line skeleton-text"></div>
        <div class="skeleton-line skeleton-text-short"></div>
      </div>
    `
    )
    .join('');
}

/**
 * Hide empty and error state cards
 */
function hideEmptyAndErrorStates() {
  const emptyState = document.getElementById('empty-state');
  const errorState = document.getElementById('error-state');
  if (emptyState) emptyState.classList.add('hidden');
  if (errorState) errorState.classList.add('hidden');
}

/**
 * Render opportunity cards into the discovery grid
 */
function renderOpportunities(opportunities) {
  const grid = document.getElementById('opportunities-grid');
  const emptyState = document.getElementById('empty-state');
  if (!grid) return;

  if (!opportunities || opportunities.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  grid.innerHTML = opportunities
    .map((item) => {
      const badgeClass = getCategoryBadgeClass(item.type);
      const formattedDeadline = formatDate(item.deadline);

      return `
      <article class="opportunity-card" data-id="${item.id}">
        <div class="card-top">
          <span class="badge ${badgeClass}">${escapeHtml(item.type)}</span>
          <span class="meta-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${escapeHtml(formattedDeadline)}
          </span>
        </div>

        <h3 class="card-title">${escapeHtml(item.title)}</h3>
        <p class="card-org">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18"></path>
            <path d="M5 21V7l8-4v18"></path>
            <path d="M19 21V11l-6-4"></path>
          </svg>
          ${escapeHtml(item.organization)}
        </p>

        <div class="card-meta">
          ${
            item.field
              ? `<span class="meta-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                  ${escapeHtml(item.field)}
                </span>`
              : ''
          }
          ${
            item.location
              ? `<span class="meta-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  ${escapeHtml(item.location)}
                </span>`
              : ''
          }
        </div>

        <p class="card-desc">${escapeHtml(item.description)}</p>

        <div class="card-actions">
          <button class="btn btn-sm btn-secondary view-details-btn" data-id="${item.id}">
            View Details
          </button>
          ${
            item.application_url
              ? `<a href="${escapeHtml(item.application_url)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
                  Apply
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>`
              : `<button class="btn btn-sm btn-secondary view-details-btn" data-id="${item.id}">Learn More</button>`
          }
        </div>
      </article>
    `;
    })
    .join('');

  // Attach event listeners to "View Details" buttons
  document.querySelectorAll('.view-details-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openDetailsModal(id);
    });
  });
}

/**
 * Render management table in the CRUD section
 */
function renderManagementTable(opportunities) {
  const tbody = document.getElementById('management-table-body');
  if (!tbody) return;

  if (!opportunities || opportunities.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          No opportunity records currently in the PostgreSQL database.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = opportunities
    .map(
      (item) => `
    <tr>
      <td><strong>#${item.id}</strong></td>
      <td>
        <div class="table-title-cell">${escapeHtml(item.title)}</div>
        <div class="table-org-cell">${escapeHtml(item.organization)}</div>
      </td>
      <td>
        <span class="badge ${getCategoryBadgeClass(item.type)}">${escapeHtml(item.type)}</span>
      </td>
      <td>${escapeHtml(formatDate(item.deadline))}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-secondary btn-icon edit-table-btn" data-id="${item.id}" title="Edit opportunity">
            Edit
          </button>
          <button class="btn btn-sm btn-danger btn-icon delete-table-btn" data-id="${item.id}" data-title="${escapeHtml(item.title)}" title="Delete opportunity">
            Delete
          </button>
        </div>
      </td>
    </tr>
  `
    )
    .join('');

  // Attach Edit and Delete listeners
  tbody.querySelectorAll('.edit-table-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      loadOpportunityIntoForm(id);
    });
  });

  tbody.querySelectorAll('.delete-table-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const title = e.currentTarget.getAttribute('data-title');
      openDeleteConfirmation(id, title);
    });
  });
}

/**
 * Render error state message with retry capability
 */
function renderErrorState(message) {
  const grid = document.getElementById('opportunities-grid');
  const errorState = document.getElementById('error-state');
  const errorDescription = document.getElementById('error-description');

  if (grid) grid.innerHTML = '';
  if (errorDescription) {
    errorDescription.textContent =
      message || 'Unable to connect to the Menged REST API server. Please make sure the backend is running.';
  }
  if (errorState) errorState.classList.remove('hidden');
}

/**
 * Update the dynamic results count badge
 */
function updateResultsCount(count) {
  const badge = document.getElementById('results-count');
  if (!badge) return;

  if (count === 1) {
    badge.textContent = 'Showing 1 opportunity';
  } else {
    badge.textContent = `Showing ${count} opportunities`;
  }
}

// =============================================================================
// MODAL CONTROLLERS
// =============================================================================

/**
 * Open opportunity details modal
 */
async function openDetailsModal(id) {
  const modal = document.getElementById('details-modal');
  if (!modal) return;

  const item = await fetchOpportunityById(id);
  if (!item) return;

  document.getElementById('modal-title').textContent = item.title;
  document.getElementById('modal-organization').textContent = item.organization;
  document.getElementById('modal-location').textContent = item.location || 'Location Not Specified';
  document.getElementById('modal-field').textContent = item.field || 'General Tech';
  document.getElementById('modal-deadline').textContent = formatDate(item.deadline);
  document.getElementById('modal-description').textContent = item.description;

  // Category badge
  const categoryBadge = document.getElementById('modal-category');
  categoryBadge.textContent = item.type;
  categoryBadge.className = `badge ${getCategoryBadgeClass(item.type)}`;

  // Deadline badge
  const deadlineBadge = document.getElementById('modal-deadline-badge');
  deadlineBadge.textContent = item.deadline ? `Deadline: ${formatDate(item.deadline)}` : 'Open Application';

  // Eligibility section
  const eligSection = document.getElementById('modal-eligibility-section');
  const eligText = document.getElementById('modal-eligibility');
  if (item.eligibility && item.eligibility.trim().length > 0) {
    eligSection.classList.remove('hidden');
    eligText.textContent = item.eligibility;
  } else {
    eligSection.classList.add('hidden');
  }

  // Application link
  const applyLink = document.getElementById('modal-apply-link');
  if (item.application_url) {
    applyLink.href = item.application_url;
    applyLink.classList.remove('hidden');
  } else {
    applyLink.classList.add('hidden');
  }

  // Edit and Delete buttons in modal
  const editBtn = document.getElementById('modal-edit-btn');
  const deleteBtn = document.getElementById('modal-delete-btn');

  editBtn.onclick = () => {
    closeDetailsModal();
    loadOpportunityIntoForm(item.id);
  };

  deleteBtn.onclick = () => {
    closeDetailsModal();
    openDeleteConfirmation(item.id, item.title);
  };

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/**
 * Close opportunity details modal
 */
function closeDetailsModal() {
  const modal = document.getElementById('details-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

/**
 * Open delete confirmation modal
 */
function openDeleteConfirmation(id, title) {
  state.pendingDeleteId = id;
  const modal = document.getElementById('delete-modal');
  const titleElem = document.getElementById('delete-opportunity-title');

  if (titleElem) titleElem.textContent = title || `Opportunity #${id}`;
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close delete confirmation modal
 */
function closeDeleteConfirmation() {
  state.pendingDeleteId = null;
  const modal = document.getElementById('delete-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// =============================================================================
// FORM & CRUD HANDLERS
// =============================================================================

/**
 * Populate management form with an existing record for editing
 */
async function loadOpportunityIntoForm(id) {
  const item = await fetchOpportunityById(id);
  if (!item) return;

  state.isEditing = true;
  state.editingId = item.id;

  document.getElementById('opportunity-id').value = item.id;
  document.getElementById('form-title').value = item.title || '';
  document.getElementById('form-organization').value = item.organization || '';
  document.getElementById('form-type').value = item.type || '';
  document.getElementById('form-field').value = item.field || '';
  document.getElementById('form-location').value = item.location || '';
  document.getElementById('form-deadline').value = item.deadline ? item.deadline.substring(0, 10) : '';
  document.getElementById('form-url').value = item.application_url || '';
  document.getElementById('form-description').value = item.description || '';
  document.getElementById('form-eligibility').value = item.eligibility || '';

  // Update form UI headings
  document.getElementById('form-heading').textContent = `Edit Opportunity #${item.id}`;
  document.getElementById('form-subheading').textContent = `Update opportunity details in the PostgreSQL database.`;
  document.getElementById('submit-btn-text').textContent = 'Update Opportunity';
  document.getElementById('cancel-edit-btn').classList.remove('hidden');

  // Clear previous errors
  clearFormValidationErrors();

  // Smooth scroll to form
  const formSection = document.getElementById('manage-form-section');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showToast(`Loaded "${item.title}" for editing`, 'info');
}

/**
 * Reset form back to "Create New Opportunity" mode
 */
function resetFormToCreateMode() {
  state.isEditing = false;
  state.editingId = null;

  const form = document.getElementById('opportunity-form');
  if (form) form.reset();

  document.getElementById('opportunity-id').value = '';
  document.getElementById('form-heading').textContent = 'Create New Opportunity';
  document.getElementById('form-subheading').textContent = 'Fill in the fields below to add a record to PostgreSQL.';
  document.getElementById('submit-btn-text').textContent = 'Submit Opportunity';
  document.getElementById('cancel-edit-btn').classList.add('hidden');

  clearFormValidationErrors();
}

/**
 * Client-side validation of the opportunity form
 */
function validateForm() {
  clearFormValidationErrors();
  let isValid = true;

  const title = document.getElementById('form-title').value.trim();
  const organization = document.getElementById('form-organization').value.trim();
  const type = document.getElementById('form-type').value;
  const description = document.getElementById('form-description').value.trim();
  const url = document.getElementById('form-url').value.trim();

  if (!title) {
    setFieldError('form-title', 'title-error', 'Opportunity title is required.');
    isValid = false;
  } else if (title.length > 200) {
    setFieldError('form-title', 'title-error', 'Title cannot exceed 200 characters.');
    isValid = false;
  }

  if (!organization) {
    setFieldError('form-organization', 'organization-error', 'Organization name is required.');
    isValid = false;
  }

  if (!type) {
    setFieldError('form-type', 'type-error', 'Please select an opportunity category.');
    isValid = false;
  }

  if (!description) {
    setFieldError('form-description', 'description-error', 'Description is required.');
    isValid = false;
  }

  if (url) {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        setFieldError('form-url', 'url-error', 'URL must begin with http:// or https://');
        isValid = false;
      }
    } catch (_) {
      setFieldError('form-url', 'url-error', 'Please enter a valid URL.');
      isValid = false;
    }
  }

  return isValid;
}

function setFieldError(fieldId, errorId, message) {
  const input = document.getElementById(fieldId);
  const errorElem = document.getElementById(errorId);
  if (input) input.classList.add('is-invalid');
  if (errorElem) errorElem.textContent = message;
}

function clearFormValidationErrors() {
  document.querySelectorAll('.form-control').forEach((input) => {
    input.classList.remove('is-invalid');
  });
  document.querySelectorAll('.field-error').forEach((span) => {
    span.textContent = '';
  });
}

/**
 * Handle form submission (Create or Update)
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    showToast('Please correct the highlighted form errors.', 'error');
    return;
  }

  const payload = {
    title: document.getElementById('form-title').value.trim(),
    organization: document.getElementById('form-organization').value.trim(),
    type: document.getElementById('form-type').value,
    field: document.getElementById('form-field').value.trim() || null,
    location: document.getElementById('form-location').value.trim() || null,
    deadline: document.getElementById('form-deadline').value || null,
    application_url: document.getElementById('form-url').value.trim() || null,
    description: document.getElementById('form-description').value.trim(),
    eligibility: document.getElementById('form-eligibility').value.trim() || null,
  };

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;

  try {
    if (state.isEditing && state.editingId) {
      await updateOpportunity(state.editingId, payload);
      showToast('Opportunity updated successfully in database!', 'success');
    } else {
      await createOpportunity(payload);
      showToast('New opportunity created successfully in database!', 'success');
    }

    resetFormToCreateMode();
    await fetchOpportunities();

    // Scroll to opportunities discovery section to show new/updated record
    const oppSection = document.getElementById('opportunities');
    if (oppSection) {
      oppSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
  }
}

// =============================================================================
// EVENT LISTENERS & INITIALIZATION
// =============================================================================

function setupEventListeners() {
  // Real-time debounced search
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;

      if (clearSearchBtn) {
        if (state.searchQuery.length > 0) {
          clearSearchBtn.classList.remove('hidden');
        } else {
          clearSearchBtn.classList.add('hidden');
        }
      }

      clearTimeout(state.searchDebounceTimer);
      state.searchDebounceTimer = setTimeout(() => {
        fetchOpportunities();
      }, 300);
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      clearSearchBtn.classList.add('hidden');
      fetchOpportunities();
    });
  }

  // Category Filter
  const categoryFilter = document.getElementById('category-filter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      state.activeType = e.target.value;
      fetchOpportunities();
    });
  }

  // Field Filter
  const fieldFilter = document.getElementById('field-filter');
  if (fieldFilter) {
    fieldFilter.addEventListener('change', (e) => {
      state.activeField = e.target.value;
      fetchOpportunities();
    });
  }

  // Reset Filters Buttons
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const emptyResetBtn = document.getElementById('empty-reset-btn');

  const resetAllFilters = () => {
    state.activeType = 'All';
    state.activeField = 'All';
    state.searchQuery = '';

    if (categoryFilter) categoryFilter.value = 'All';
    if (fieldFilter) fieldFilter.value = 'All';
    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.classList.add('hidden');

    fetchOpportunities();
  };

  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);

  // Form submission & cancellation
  const form = document.getElementById('opportunity-form');
  if (form) form.addEventListener('submit', handleFormSubmit);

  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', resetFormToCreateMode);

  // Delete modal actions
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  const deleteModalClose = document.getElementById('delete-modal-close');

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!state.pendingDeleteId) return;

      try {
        confirmDeleteBtn.disabled = true;
        await deleteOpportunity(state.pendingDeleteId);
        showToast('Opportunity deleted permanently from PostgreSQL.', 'success');
        closeDeleteConfirmation();
        await fetchOpportunities();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        confirmDeleteBtn.disabled = false;
      }
    });
  }

  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteConfirmation);
  if (deleteModalClose) deleteModalClose.addEventListener('click', closeDeleteConfirmation);

  // Details Modal close actions
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const detailsModal = document.getElementById('details-modal');

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDetailsModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeDetailsModal);

  // Click outside to close modals
  window.addEventListener('click', (e) => {
    if (e.target === detailsModal) closeDetailsModal();
    const deleteModal = document.getElementById('delete-modal');
    if (e.target === deleteModal) closeDeleteConfirmation();
  });

  // ESC key to close open modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDetailsModal();
      closeDeleteConfirmation();
    }
  });

  // Retry buttons for network error
  const retryBtn = document.getElementById('retry-connection-btn');
  const errorRetryBtn = document.getElementById('error-retry-btn');
  if (retryBtn) retryBtn.addEventListener('click', fetchOpportunities);
  if (errorRetryBtn) errorRetryBtn.addEventListener('click', fetchOpportunities);

  // Refresh Table Button
  const refreshTableBtn = document.getElementById('refresh-table-btn');
  if (refreshTableBtn) refreshTableBtn.addEventListener('click', fetchOpportunities);

  // Mobile Navigation Hamburger Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('.nav-link, .nav-cta').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Footer Category Quick Filters
  document.querySelectorAll('.footer-col a[data-category]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.getAttribute('data-category');
      if (categoryFilter) categoryFilter.value = cat;
      state.activeType = cat;
      fetchOpportunities();
      const oppSection = document.getElementById('opportunities');
      if (oppSection) oppSection.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// Application Entry Point
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  await checkBackendHealth();
  await fetchOpportunities();
});
