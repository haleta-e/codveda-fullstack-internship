/**
 * =============================================================================
 * MENGED (መንገድ) - OFFICIAL APPLICATION SCRIPT
 * Concept: Discover opportunities. Build your future.
 * Level 1: Task 3 - Dynamic Frontend with Vanilla JavaScript
 * =============================================================================
 */

// Global API Base URL Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Application State Model
const state = {
  opportunities: [],
  filteredOpportunities: [],
  activeCategory: 'All',
  activeField: 'All',
  activeLocation: 'All',
  activeSort: 'newest',
  searchQuery: '',
  isEditing: false,
  editingId: null,
  pendingDeleteId: null,
  isBackendOnline: true,
  searchDebounceTimer: null,
};

// =============================================================================
// UTILITY & SANITIZATION HELPERS
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
 * Format ISO date string into readable format (e.g. Dec 31, 2026)
 */
function formatDate(dateString) {
  if (!dateString) return 'Rolling Basis';
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
 * Map category type to badge CSS class
 */
function getCategoryPillClass(type) {
  switch (type) {
    case 'Internships':
      return 'pill-internship';
    case 'Scholarships':
      return 'pill-scholarship';
    case 'Remote jobs':
      return 'pill-remote';
    case 'Training programs':
      return 'pill-training';
    case 'Fellowships':
      return 'pill-fellowship';
    default:
      return 'pill-internship';
  }
}

/**
 * Toast notification system
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
// REST API INTEGRATION (Fetch API & async/await)
// =============================================================================

/**
 * Check if the Express backend is online
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
      throw new Error(`Health response ${res.status}`);
    }
  } catch (_) {
    state.isBackendOnline = false;
    if (banner) banner.classList.remove('hidden');
    return false;
  }
}

/**
 * Fetch opportunity records from REST API
 */
async function fetchOpportunities() {
  renderLoadingState();
  hideEmptyAndErrorStates();

  try {
    const queryParams = new URLSearchParams();

    if (state.activeCategory && state.activeCategory !== 'All') {
      queryParams.append('type', state.activeCategory);
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
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `API error (${response.status})`);
    }

    const json = await response.json();
    let opportunities = json.data || [];

    // Client-side Location filter if selected
    if (state.activeLocation && state.activeLocation !== 'All') {
      opportunities = opportunities.filter((item) => {
        if (!item.location) return false;
        return item.location.toLowerCase().includes(state.activeLocation.toLowerCase());
      });
    }

    // Client-side Sorting
    if (state.activeSort === 'deadline') {
      opportunities.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    } else if (state.activeSort === 'title') {
      opportunities.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Newest first by default
      opportunities.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    state.opportunities = opportunities;
    state.filteredOpportunities = opportunities;

    renderOpportunities(state.filteredOpportunities);
    renderManagementTable(state.opportunities);
    updateResultsCount(state.filteredOpportunities.length);

    const banner = document.getElementById('backend-status-banner');
    if (banner) banner.classList.add('hidden');
    state.isBackendOnline = true;
  } catch (error) {
    console.error('Error connecting to Menged API:', error);
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
    const res = await fetch(`${API_BASE_URL}/opportunities/${id}`);
    if (!res.ok) throw new Error(`Could not load opportunity #${id}`);
    const result = await res.json();
    return result.data;
  } catch (err) {
    showToast(err.message, 'error');
    return null;
  }
}

/**
 * Create opportunity via POST /api/opportunities
 */
async function createOpportunity(payload) {
  const res = await fetch(`${API_BASE_URL}/opportunities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.errors ? data.errors.join(' ') : data.message || 'Creation failed';
    throw new Error(msg);
  }
  return data;
}

/**
 * Update opportunity via PUT /api/opportunities/:id
 */
async function updateOpportunity(id, payload) {
  const res = await fetch(`${API_BASE_URL}/opportunities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.errors ? data.errors.join(' ') : data.message || 'Update failed';
    throw new Error(msg);
  }
  return data;
}

/**
 * Delete opportunity via DELETE /api/opportunities/:id
 */
async function deleteOpportunity(id) {
  const res = await fetch(`${API_BASE_URL}/opportunities/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Failed to delete opportunity #${id}`);
  }
  return true;
}

// =============================================================================
// DOM RENDERING
// =============================================================================

function renderLoadingState() {
  const grid = document.getElementById('opportunities-grid');
  if (!grid) return;
  grid.innerHTML = Array(6)
    .fill(0)
    .map(
      () => `
      <div class="skeleton-card" aria-hidden="true">
        <div class="skeleton-shimmer" style="height: 22px; width: 100px; border-radius: 9999px;"></div>
        <div class="skeleton-shimmer" style="height: 24px; width: 85%;"></div>
        <div class="skeleton-shimmer" style="height: 14px; width: 50%;"></div>
        <div class="skeleton-shimmer" style="height: 12px; width: 100%;"></div>
        <div class="skeleton-shimmer" style="height: 12px; width: 80%;"></div>
      </div>
    `
    )
    .join('');
}

function hideEmptyAndErrorStates() {
  const empty = document.getElementById('empty-state');
  const error = document.getElementById('error-state');
  if (empty) empty.classList.add('hidden');
  if (error) error.classList.add('hidden');
}

function renderOpportunities(opportunities) {
  const grid = document.getElementById('opportunities-grid');
  const empty = document.getElementById('empty-state');
  if (!grid) return;

  if (!opportunities || opportunities.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (empty) empty.classList.add('hidden');

  grid.innerHTML = opportunities
    .map((item) => {
      const pillClass = getCategoryPillClass(item.type);
      const formattedDeadline = formatDate(item.deadline);
      const initial = item.organization ? item.organization.charAt(0).toUpperCase() : 'M';

      return `
      <article class="opportunity-card" data-id="${item.id}">
        <div class="card-top">
          <div class="org-avatar">${escapeHtml(initial)}</div>
          <span class="pill-badge ${pillClass}">${escapeHtml(item.type)}</span>
        </div>

        <h3 class="card-title">${escapeHtml(item.title)}</h3>
        <p class="card-org-name">${escapeHtml(item.organization)}</p>

        <div class="card-tags">
          ${
            item.field
              ? `<span class="tag-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                  ${escapeHtml(item.field)}
                </span>`
              : ''
          }
          ${
            item.location
              ? `<span class="tag-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  ${escapeHtml(item.location)}
                </span>`
              : ''
          }
        </div>

        <p class="card-description">${escapeHtml(item.description)}</p>

        <div class="card-footer">
          <span class="deadline-text">Deadline: <strong>${escapeHtml(formattedDeadline)}</strong></span>
          <button class="view-details-action view-details-trigger" data-id="${item.id}">
            View Details &rarr;
          </button>
        </div>
      </article>
    `;
    })
    .join('');

  // Attach card detail triggers
  document.querySelectorAll('.view-details-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openDetailsModal(id);
    });
  });

  // Attach 3D tilt effect on hover for opportunity cards
  attachCard3DTilt();
}

/**
 * 3D Card Tilt Interaction
 */
function attachCard3DTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll('.opportunity-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

function renderErrorState(message) {
  const grid = document.getElementById('opportunities-grid');
  const error = document.getElementById('error-state');
  const desc = document.getElementById('error-description');
  if (grid) grid.innerHTML = '';
  if (desc) {
    desc.textContent =
      message || 'Unable to connect to the Menged REST API server. Ensure Express and PostgreSQL are running.';
  }
  if (error) error.classList.remove('hidden');
}

function updateResultsCount(count) {
  const badge = document.getElementById('results-count');
  if (!badge) return;
  badge.textContent = count === 1 ? '1 opportunity found' : `${count} opportunities found`;
}

function renderManagementTable(opportunities) {
  const tbody = document.getElementById('management-table-body');
  if (!tbody) return;

  if (!opportunities || opportunities.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--color-muted-grey); padding: 2rem;">No opportunity records in PostgreSQL database.</td></tr>`;
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
      <td><span class="pill-badge ${getCategoryPillClass(item.type)}">${escapeHtml(item.type)}</span></td>
      <td>${escapeHtml(formatDate(item.deadline))}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-secondary edit-table-btn" data-id="${item.id}">Edit</button>
          <button class="btn btn-sm btn-danger delete-table-btn" data-id="${item.id}" data-title="${escapeHtml(item.title)}">Delete</button>
        </div>
      </td>
    </tr>
  `
    )
    .join('');

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

// =============================================================================
// MODAL CONTROLLERS
// =============================================================================

async function openDetailsModal(id) {
  const modal = document.getElementById('details-modal');
  if (!modal) return;

  const item = await fetchOpportunityById(id);
  if (!item) return;

  document.getElementById('modal-title').textContent = item.title;
  document.getElementById('modal-organization').textContent = item.organization;
  document.getElementById('modal-location').textContent = item.location || 'Location Unspecified';
  document.getElementById('modal-field').textContent = item.field || 'General Technology';
  document.getElementById('modal-deadline').textContent = formatDate(item.deadline);
  document.getElementById('modal-description').textContent = item.description;

  const catBadge = document.getElementById('modal-category');
  catBadge.textContent = item.type;
  catBadge.className = `pill-badge ${getCategoryPillClass(item.type)}`;

  const deadlineBadge = document.getElementById('modal-deadline-badge');
  deadlineBadge.textContent = item.deadline ? `Deadline: ${formatDate(item.deadline)}` : 'Rolling Applications';

  const eligSection = document.getElementById('modal-eligibility-section');
  const eligText = document.getElementById('modal-eligibility');
  if (item.eligibility && item.eligibility.trim().length > 0) {
    eligSection.classList.remove('hidden');
    eligText.textContent = item.eligibility;
  } else {
    eligSection.classList.add('hidden');
  }

  const applyLink = document.getElementById('modal-apply-link');
  if (item.application_url) {
    applyLink.href = item.application_url;
    applyLink.classList.remove('hidden');
  } else {
    applyLink.classList.add('hidden');
  }

  // Edit / Delete in modal
  document.getElementById('modal-edit-btn').onclick = () => {
    closeDetailsModal();
    const portal = document.getElementById('crud-portal-content');
    if (portal) portal.classList.remove('hidden');
    loadOpportunityIntoForm(item.id);
  };

  document.getElementById('modal-delete-btn').onclick = () => {
    closeDetailsModal();
    openDeleteConfirmation(item.id, item.title);
  };

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDetailsModal() {
  const modal = document.getElementById('details-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function openDeleteConfirmation(id, title) {
  state.pendingDeleteId = id;
  const modal = document.getElementById('delete-modal');
  const target = document.getElementById('delete-opportunity-title');
  if (target) target.textContent = title || `Opportunity #${id}`;
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeDeleteConfirmation() {
  state.pendingDeleteId = null;
  const modal = document.getElementById('delete-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// =============================================================================
// CRUD FORM HANDLERS
// =============================================================================

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

  document.getElementById('form-heading').textContent = `Edit Opportunity #${item.id}`;
  document.getElementById('form-subheading').textContent = 'Modify opportunity details and update PostgreSQL.';
  document.getElementById('submit-btn-text').textContent = 'Update Opportunity';
  document.getElementById('cancel-edit-btn').classList.remove('hidden');

  const formSec = document.getElementById('manage-form-section');
  if (formSec) formSec.scrollIntoView({ behavior: 'smooth' });
}

function resetFormToCreate() {
  state.isEditing = false;
  state.editingId = null;

  const form = document.getElementById('opportunity-form');
  if (form) form.reset();

  document.getElementById('opportunity-id').value = '';
  document.getElementById('form-heading').textContent = 'Create New Opportunity';
  document.getElementById('form-subheading').textContent = 'Fill in the fields to add a record directly to PostgreSQL.';
  document.getElementById('submit-btn-text').textContent = 'Submit Opportunity';
  document.getElementById('cancel-edit-btn').classList.add('hidden');

  document.querySelectorAll('.form-control').forEach((el) => el.classList.remove('is-invalid'));
  document.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('form-title').value.trim();
  const organization = document.getElementById('form-organization').value.trim();
  const type = document.getElementById('form-type').value;
  const description = document.getElementById('form-description').value.trim();

  let isValid = true;
  if (!title) {
    document.getElementById('form-title').classList.add('is-invalid');
    document.getElementById('title-error').textContent = 'Title is required.';
    isValid = false;
  }
  if (!organization) {
    document.getElementById('form-organization').classList.add('is-invalid');
    document.getElementById('organization-error').textContent = 'Organization is required.';
    isValid = false;
  }
  if (!type) {
    document.getElementById('form-type').classList.add('is-invalid');
    document.getElementById('type-error').textContent = 'Please select a category.';
    isValid = false;
  }
  if (!description) {
    document.getElementById('form-description').classList.add('is-invalid');
    document.getElementById('description-error').textContent = 'Description is required.';
    isValid = false;
  }

  if (!isValid) return;

  const payload = {
    title,
    organization,
    type,
    field: document.getElementById('form-field').value.trim() || null,
    location: document.getElementById('form-location').value.trim() || null,
    deadline: document.getElementById('form-deadline').value || null,
    application_url: document.getElementById('form-url').value.trim() || null,
    description,
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
      showToast('New opportunity created in PostgreSQL!', 'success');
    }
    resetFormToCreate();
    await fetchOpportunities();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
  }
}

// =============================================================================
// EVENT LISTENERS & SETUP
// =============================================================================

function setupEventListeners() {
  // Real-time debounced search
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (clearSearchBtn) {
        if (state.searchQuery.length > 0) clearSearchBtn.classList.remove('hidden');
        else clearSearchBtn.classList.add('hidden');
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

  // Category Filter Pills
  document.querySelectorAll('.pill-filter').forEach((pill) => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.pill-filter').forEach((p) => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.activeCategory = e.currentTarget.getAttribute('data-category');
      fetchOpportunities();
    });
  });

  // Category Cards in Section 02
  document.querySelectorAll('.category-card').forEach((card) => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-category');
      state.activeCategory = cat;

      // Update active pill in discovery section
      document.querySelectorAll('.pill-filter').forEach((pill) => {
        if (pill.getAttribute('data-category') === cat) pill.classList.add('active');
        else pill.classList.remove('active');
      });

      fetchOpportunities();

      const discoverSec = document.getElementById('discover');
      if (discoverSec) discoverSec.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Secondary Filters
  const fieldFilter = document.getElementById('field-filter');
  if (fieldFilter) {
    fieldFilter.addEventListener('change', (e) => {
      state.activeField = e.target.value;
      fetchOpportunities();
    });
  }

  const locationFilter = document.getElementById('location-filter');
  if (locationFilter) {
    locationFilter.addEventListener('change', (e) => {
      state.activeLocation = e.target.value;
      fetchOpportunities();
    });
  }

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.activeSort = e.target.value;
      fetchOpportunities();
    });
  }

  // Reset Filters
  const resetFilters = () => {
    state.activeCategory = 'All';
    state.activeField = 'All';
    state.activeLocation = 'All';
    state.activeSort = 'newest';
    state.searchQuery = '';

    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
    if (fieldFilter) fieldFilter.value = 'All';
    if (locationFilter) locationFilter.value = 'All';
    if (sortSelect) sortSelect.value = 'newest';

    document.querySelectorAll('.pill-filter').forEach((p) => {
      if (p.getAttribute('data-category') === 'All') p.classList.add('active');
      else p.classList.remove('active');
    });

    fetchOpportunities();
  };

  const resetBtn = document.getElementById('reset-filters-btn');
  const emptyResetBtn = document.getElementById('empty-reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', resetFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetFilters);

  // Evaluator CRUD Portal Toggle
  const toggleCrudBtn = document.getElementById('toggle-crud-portal-btn');
  const crudPortal = document.getElementById('crud-portal-content');
  const toggleText = document.getElementById('portal-toggle-text');

  if (toggleCrudBtn && crudPortal) {
    toggleCrudBtn.addEventListener('click', () => {
      const isHidden = crudPortal.classList.toggle('hidden');
      toggleText.textContent = isHidden ? 'Show CRUD Portal' : 'Hide CRUD Portal';
      if (!isHidden) {
        crudPortal.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Form submit & cancel
  const form = document.getElementById('opportunity-form');
  if (form) form.addEventListener('submit', handleFormSubmit);

  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', resetFormToCreate);

  // Delete modal buttons
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  const deleteModalClose = document.getElementById('delete-modal-close');

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!state.pendingDeleteId) return;
      try {
        confirmDeleteBtn.disabled = true;
        await deleteOpportunity(state.pendingDeleteId);
        showToast('Opportunity permanently removed from database.', 'success');
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

  // Details Modal close
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const detailsModal = document.getElementById('details-modal');

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDetailsModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeDetailsModal);

  window.addEventListener('click', (e) => {
    if (e.target === detailsModal) closeDetailsModal();
    const delModal = document.getElementById('delete-modal');
    if (e.target === delModal) closeDeleteConfirmation();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDetailsModal();
      closeDeleteConfirmation();
    }
  });

  // Retries
  const retryBtn = document.getElementById('retry-connection-btn');
  const errorRetryBtn = document.getElementById('error-retry-btn');
  if (retryBtn) retryBtn.addEventListener('click', fetchOpportunities);
  if (errorRetryBtn) errorRetryBtn.addEventListener('click', fetchOpportunities);

  const refreshTableBtn = document.getElementById('refresh-table-btn');
  if (refreshTableBtn) refreshTableBtn.addEventListener('click', fetchOpportunities);

  // Mobile navigation
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Visual signin / register entry points
  const showAuthNotice = () => {
    showToast('Personal Workspace & Authentication will arrive in Level 2. Explore all opportunities freely now!', 'info');
  };
  const signinBtn = document.getElementById('signin-btn');
  const ctaRegisterBtn = document.getElementById('cta-register-btn');
  const footerSignin = document.getElementById('footer-signin-link');
  const footerRegister = document.getElementById('footer-register-link');
  if (signinBtn) signinBtn.addEventListener('click', showAuthNotice);
  if (ctaRegisterBtn) ctaRegisterBtn.addEventListener('click', showAuthNotice);
  if (footerSignin) footerSignin.addEventListener('click', (e) => { e.preventDefault(); showAuthNotice(); });
  if (footerRegister) footerRegister.addEventListener('click', (e) => { e.preventDefault(); showAuthNotice(); });

  // Floating Hero Cards Mouse Parallax
  const heroScene = document.getElementById('hero-3d-scene');
  if (heroScene && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth >= 1024) {
    heroScene.addEventListener('mousemove', (e) => {
      const rect = heroScene.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 25;
      const y = (e.clientY - rect.top - rect.height / 2) / 25;

      document.querySelectorAll('.floating-card').forEach((card) => {
        const speed = parseFloat(card.getAttribute('data-speed')) || 1;
        card.style.transform = `translate3d(${x * speed}px, ${y * speed}px, 0)`;
      });
    });

    heroScene.addEventListener('mouseleave', () => {
      document.querySelectorAll('.floating-card').forEach((card) => {
        card.style.transform = '';
      });
    });
  }

  // Navbar shadow on scroll
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (window.scrollY > 20) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
  });
}

// App Initialization
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  await checkBackendHealth();
  await fetchOpportunities();
});
