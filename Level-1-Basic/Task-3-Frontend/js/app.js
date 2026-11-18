/**
 * =============================================================================
 * MENGED (መንገድ) - DYNAMIC FRONTEND APPLICATION CONTROLLER
 * Vanilla JavaScript (ES6+) for Codveda Internship Level 1
 * Features:
 *  - Dynamic Opportunity Discovery & Filtering (Category, Field, Location, Search)
 *  - Night Mode / Dark Theme Toggle with LocalStorage Persistence
 *  - 3D Floating Hero Parallax & Card Tilt Interactivity
 *  - Interactive Logo Lightbox Modal
 *  - Community Opportunity Submission (POST REST API Integration)
 *  - Seamless Offline Resilience / Demonstration Fallback
 * =============================================================================
 */

// REST API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Demonstration Dataset (Ensures the platform is always interactive, even if PostgreSQL/Express is offline)
const DEMO_FALLBACK_OPPORTUNITIES = [
  {
    id: 1,
    title: 'Junior Software Engineering Internship',
    organization: 'TechEthio Innovations',
    type: 'Internships',
    field: 'Software Engineering',
    description: 'Hands-on 3-month full-stack and backend internship for graduating computer science students in Ethiopian universities. Build real APIs with Node.js and modern databases.',
    eligibility: 'Undergraduate students in Computer Science, Software Engineering, or related technical disciplines with basic JavaScript and SQL knowledge.',
    deadline: '2026-12-31',
    application_url: 'https://example.com/apply/internship',
    location: 'Addis Ababa (Hybrid)',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Graduate STEM Excellence Scholarship',
    organization: 'Ethiopian Education Support Initiative',
    type: 'Scholarships',
    field: 'Computer Science & AI',
    description: 'Full tuition coverage and research stipends for high-achieving Ethiopian graduates pursuing advanced master or doctoral degrees in ICT and Engineering.',
    eligibility: 'Graduated within the last two years with a cumulative GPA of 3.5 or higher from an accredited university in Ethiopia.',
    deadline: '2026-11-30',
    application_url: 'https://example.com/apply/scholarship',
    location: 'International & Local',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Junior Frontend Developer (Remote)',
    organization: 'Global Pan-African Tech Labs',
    type: 'Remote jobs',
    field: 'Web Development',
    description: 'Junior developer position focusing on modern responsive web development, REST APIs, and accessible user interfaces. Work in flexible distributed teams.',
    eligibility: 'Demonstrated experience in HTML5, CSS3, modern JavaScript, and building responsive websites. Open to residents in Ethiopia.',
    deadline: '2026-12-15',
    application_url: 'https://example.com/apply/remote-job',
    location: 'Remote (Ethiopia)',
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Cloud Computing & DevOps Training Bootcamp',
    organization: 'Horn of Africa Tech Academy',
    type: 'Training programs',
    field: 'Cloud Computing',
    description: 'Intensive 8-week bootcamp covering Linux systems, Docker, PostgreSQL, CI/CD pipelines, and cloud deployments with mentorship from senior engineers.',
    eligibility: 'Final-year students or recent graduates with foundational programming interest and dedication to 15 hours per week.',
    deadline: '2027-01-15',
    application_url: 'https://example.com/apply/bootcamp',
    location: 'Hawassa & Online',
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    title: 'African Tech Leadership & AI Fellowship',
    organization: 'Future African Innovators Network',
    type: 'Fellowships',
    field: 'Artificial Intelligence',
    description: 'Prestigious 6-month fellowship offering project grants, AI research mentorship, and leadership seminars tackling local community challenges in Ethiopia.',
    eligibility: 'Young technology professionals, researchers, and innovators passionate about leveraging machine learning and data science.',
    deadline: '2027-02-28',
    application_url: 'https://example.com/apply/fellowship',
    location: 'Addis Ababa, Ethiopia',
    created_at: new Date().toISOString(),
  },
];

// Application State Model
const state = {
  opportunities: [],
  filteredOpportunities: [],
  activeCategory: 'All',
  activeField: 'All',
  activeLocation: 'All',
  activeSort: 'newest',
  searchQuery: '',
  isBackendOnline: false,
  searchDebounceTimer: null,
};

// =============================================================================
// UTILITY HELPERS & SANITIZATION
// =============================================================================

function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateString) {
  if (!dateString) return 'Rolling Applications';
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

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'ℹ';
  if (type === 'success') icon = '✓';
  if (type === 'warning') icon = '⚠️';
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
// NIGHT MODE / THEME CONTROLLER
// =============================================================================

function initNightMode() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const floatingToggleBtn = document.getElementById('floating-theme-toggle');
  const floatingText = document.getElementById('floating-theme-text');
  
  // Check persisted preference or default to dark
  const savedTheme = localStorage.getItem('menged-theme') || 'dark';
  applyTheme(savedTheme);

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('menged-theme', newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Night' : 'Light'} Mode`, 'info');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  if (floatingToggleBtn) {
    floatingToggleBtn.addEventListener('click', toggleTheme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    if (floatingText) {
      floatingText.textContent = theme === 'dark' ? 'Light Mode' : 'Night Mode';
    }

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Night Mode');
    }

    if (floatingToggleBtn) {
      floatingToggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Night Mode');
    }
  }
}

// =============================================================================
// REST API INTEGRATION WITH RESILIENT FALLBACK
// =============================================================================

async function checkBackendHealth() {
  const pill = document.getElementById('api-status-pill');
  const pillText = document.getElementById('api-status-text');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      state.isBackendOnline = true;
      if (pill) {
        pill.className = 'api-status-pill';
        pillText.textContent = 'Live PostgreSQL';
      }
      return true;
    }
  } catch (_) {
    state.isBackendOnline = false;
    if (pill) {
      pill.className = 'api-status-pill offline';
      pillText.textContent = 'Demonstration Mode';
    }
    return false;
  }
}

async function fetchOpportunities() {
  try {
    const queryParams = new URLSearchParams();
    if (state.activeCategory && state.activeCategory !== 'All') queryParams.append('type', state.activeCategory);
    if (state.activeField && state.activeField !== 'All') queryParams.append('field', state.activeField);
    if (state.searchQuery && state.searchQuery.trim().length > 0) queryParams.append('search', state.searchQuery.trim());

    const url = `${API_BASE_URL}/opportunities${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    let rawList = [];
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        rawList = json.data || [];
        state.isBackendOnline = true;
      } else {
        throw new Error('API offline');
      }
    } catch (_) {
      // Backend offline fallback - use local demonstration catalog so platform is always functional
      state.isBackendOnline = false;
      rawList = [...DEMO_FALLBACK_OPPORTUNITIES];

      // Filter locally
      if (state.activeCategory && state.activeCategory !== 'All') {
        rawList = rawList.filter((item) => item.type === state.activeCategory);
      }
      if (state.activeField && state.activeField !== 'All') {
        rawList = rawList.filter((item) => item.field && item.field.toLowerCase().includes(state.activeField.toLowerCase()));
      }
      if (state.searchQuery && state.searchQuery.trim().length > 0) {
        const q = state.searchQuery.toLowerCase();
        rawList = rawList.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.organization.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
        );
      }
    }

    // Client-side Location Filter
    if (state.activeLocation && state.activeLocation !== 'All') {
      rawList = rawList.filter((item) => item.location && item.location.toLowerCase().includes(state.activeLocation.toLowerCase()));
    }

    // Client-side Sorting
    if (state.activeSort === 'deadline') {
      rawList.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    } else if (state.activeSort === 'title') {
      rawList.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      rawList.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    state.opportunities = rawList;
    state.filteredOpportunities = rawList;

    renderOpportunities(state.filteredOpportunities);
    updateResultsCount(state.filteredOpportunities.length);
    checkBackendHealth();
  } catch (err) {
    console.error('Error fetching:', err);
    renderOpportunities(DEMO_FALLBACK_OPPORTUNITIES);
  }
}

async function fetchOpportunityById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/opportunities/${id}`);
    if (res.ok) {
      const result = await res.json();
      return result.data;
    }
  } catch (_) {
    // Fallback
  }
  return DEMO_FALLBACK_OPPORTUNITIES.find((x) => x.id === parseInt(id, 10)) || null;
}

let submissionAbortController = null;

async function createOpportunity(payload) {
  submissionAbortController = new AbortController();
  try {
    const res = await fetch(`${API_BASE_URL}/opportunities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: submissionAbortController.signal,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Submission was cancelled.');
    }
    // Demo fallback local append
    const newRecord = { ...payload, id: Date.now(), created_at: new Date().toISOString() };
    DEMO_FALLBACK_OPPORTUNITIES.unshift(newRecord);
    return { success: true, data: newRecord };
  } finally {
    submissionAbortController = null;
  }
}

// =============================================================================
// DOM RENDERING
// =============================================================================

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

  // Attach 3D interactive tilt
  attachCard3DTilt();
}

function attachCard3DTilt() {
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll('.opportunity-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

function updateResultsCount(count) {
  const badge = document.getElementById('results-count');
  if (!badge) return;
  badge.textContent = count === 1 ? '1 Opportunity Found' : `${count} Opportunities Available`;
}

// =============================================================================
// MODAL CONTROLLERS (Details & Logo Lightbox)
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
  if (catBadge) {
    catBadge.textContent = item.type;
    catBadge.className = `pill-badge ${getCategoryPillClass(item.type)}`;
  }

  const deadlineBadge = document.getElementById('modal-deadline-badge');
  if (deadlineBadge) {
    deadlineBadge.textContent = item.deadline ? `Deadline: ${formatDate(item.deadline)}` : 'Rolling Applications';
  }

  const eligSection = document.getElementById('modal-eligibility-section');
  const eligText = document.getElementById('modal-eligibility');
  if (item.eligibility && item.eligibility.trim().length > 0) {
    eligSection && eligSection.classList.remove('hidden');
    eligText && (eligText.textContent = item.eligibility);
  } else {
    eligSection && eligSection.classList.add('hidden');
  }

  const applyLink = document.getElementById('modal-apply-link');
  if (applyLink) {
    if (item.application_url) {
      applyLink.href = item.application_url;
      applyLink.classList.remove('hidden');
    } else {
      applyLink.classList.add('hidden');
    }
  }

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

// Logo Modal Lightbox
function openLogoModal() {
  const modal = document.getElementById('logo-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeLogoModal() {
  const modal = document.getElementById('logo-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// =============================================================================
// SUBMISSION FORM HANDLER
// =============================================================================

async function handleFormSubmit(e) {
  e.preventDefault();

  const titleInput = document.getElementById('form-title');
  const orgInput = document.getElementById('form-organization');
  const typeSelect = document.getElementById('form-type');
  const descInput = document.getElementById('form-description');

  const title = titleInput.value.trim();
  const organization = orgInput.value.trim();
  const type = typeSelect.value;
  const description = descInput.value.trim();

  let isValid = true;
  document.querySelectorAll('.form-control').forEach((el) => el.classList.remove('is-invalid'));
  document.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));

  if (!title) {
    titleInput.classList.add('is-invalid');
    document.getElementById('title-error').textContent = 'Title is required.';
    isValid = false;
  }
  if (!organization) {
    orgInput.classList.add('is-invalid');
    document.getElementById('organization-error').textContent = 'Organization is required.';
    isValid = false;
  }
  if (!type) {
    typeSelect.classList.add('is-invalid');
    document.getElementById('type-error').textContent = 'Please select a category.';
    isValid = false;
  }
  if (!description) {
    descInput.classList.add('is-invalid');
    document.getElementById('description-error').textContent = 'Description is required.';
    isValid = false;
  }

  if (!isValid) {
    showToast('Please fill in the required fields marked with *', 'warning');
    return;
  }

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
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
      </svg>
      <span>Submitting...</span>
    `;
  }

  try {
    await createOpportunity(payload);
    showToast('Opportunity submitted successfully! It has been added to Menged.', 'success');
    resetSubmissionForm(false);
    await fetchOpportunities();
  } catch (err) {
    if (err.message === 'Submission was cancelled.') {
      showToast('Submission was cancelled.', 'info');
    } else {
      showToast(err.message || 'Submission failed. Please check connection.', 'error');
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M22 2L11 13"></path>
          <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
        </svg>
        <span>Submit Opportunity for Review</span>
      `;
    }
  }
}

/**
 * Resets the opportunity submission form and clears all input states
 * If a submission request is currently in progress, it aborts it immediately
 */
function resetSubmissionForm(notify = false) {
  const form = document.getElementById('opportunity-form');
  const submitBtn = document.getElementById('submit-btn');

  // Cancel any running submission request
  if (submissionAbortController) {
    submissionAbortController.abort();
    submissionAbortController = null;
  }

  if (form) form.reset();
  document.querySelectorAll('.form-category-pill').forEach((p) => p.classList.remove('active'));
  document.querySelectorAll('.form-control').forEach((el) => el.classList.remove('is-invalid'));
  document.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M22 2L11 13"></path>
        <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
      </svg>
      <span>Submit Opportunity for Review</span>
    `;
  }

  if (notify) {
    showToast('Submission cleared. All fields have been reset.', 'info');
  }
}

// =============================================================================
// EVENT LISTENERS & SETUP
// =============================================================================

function setupEventListeners() {
  // Logo Modal Lightbox Click Trigger
  const logoTrigger = document.getElementById('brand-logo-trigger');
  const logoClose = document.getElementById('logo-modal-close');
  if (logoTrigger) logoTrigger.addEventListener('click', openLogoModal);
  if (logoClose) logoClose.addEventListener('click', closeLogoModal);

  // Search Input with 300ms Debounce
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const searchActionBtn = document.getElementById('search-action-btn');

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
      if (searchInput) searchInput.value = '';
      state.searchQuery = '';
      clearSearchBtn.classList.add('hidden');
      fetchOpportunities();
    });
  }

  if (searchActionBtn) {
    searchActionBtn.addEventListener('click', () => {
      fetchOpportunities();
      const disc = document.getElementById('discover');
      if (disc) disc.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Category Filter Pills
  document.querySelectorAll('.pill-chip').forEach((pill) => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.pill-chip').forEach((p) => p.classList.remove('active'));
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

      document.querySelectorAll('.pill-chip').forEach((pill) => {
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

    document.querySelectorAll('.pill-chip').forEach((p) => {
      if (p.getAttribute('data-category') === 'All') p.classList.add('active');
      else p.classList.remove('active');
    });

    fetchOpportunities();
  };

  const resetBtn = document.getElementById('reset-filters-btn');
  const emptyResetBtn = document.getElementById('empty-reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', resetFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetFilters);

  // Form submit & real-time input error clearing
  const form = document.getElementById('opportunity-form');
  const formTypeSelect = document.getElementById('form-type');
  const formCategoryPills = document.querySelectorAll('.form-category-pill');

  // Category quick-select buttons in form
  formCategoryPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const selectedValue = pill.getAttribute('data-value');
      formCategoryPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      if (formTypeSelect) {
        formTypeSelect.value = selectedValue;
        formTypeSelect.classList.remove('is-invalid');
        const errSpan = document.getElementById('type-error');
        if (errSpan) errSpan.textContent = '';
      }
    });
  });

  if (formTypeSelect) {
    formTypeSelect.addEventListener('change', () => {
      const val = formTypeSelect.value;
      formCategoryPills.forEach((pill) => {
        if (pill.getAttribute('data-value') === val) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });
      formTypeSelect.classList.remove('is-invalid');
      const errSpan = document.getElementById('type-error');
      if (errSpan) errSpan.textContent = '';
    });
  }

  if (form) {
    form.addEventListener('submit', handleFormSubmit);

    // Cancel / Clear started opportunity submission
    const cancelBtn = document.getElementById('form-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        resetSubmissionForm(true);
      });
    }

    // Clear field errors as soon as the user types or selects
    form.querySelectorAll('.form-control').forEach((input) => {
      const clearError = () => {
        input.classList.remove('is-invalid');
        const errSpan = input.parentElement.querySelector('.field-error');
        if (errSpan) errSpan.textContent = '';
      };
      input.addEventListener('input', clearError);
      input.addEventListener('change', clearError);
    });
  }

  // Modal close listeners
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const detailsModal = document.getElementById('details-modal');

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDetailsModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeDetailsModal);

  window.addEventListener('click', (e) => {
    if (e.target === detailsModal) closeDetailsModal();
    const logoModal = document.getElementById('logo-modal');
    if (e.target === logoModal) closeLogoModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDetailsModal();
      closeLogoModal();
    }
  });

  // Navigation Links & Active State Management
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinkElements = document.querySelectorAll('.nav-link');

  const setActiveNavLink = (targetHref) => {
    navLinkElements.forEach((link) => {
      if (link.getAttribute('href') === targetHref) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  // Mobile navigation drawer toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', open);
    });
  }

  // Click handler to instantly switch active nav link
  navLinkElements.forEach((link) => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        setActiveNavLink(href);
      }
      if (navLinks) navLinks.classList.remove('open');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Dynamic Scroll-Spy: update active nav link as sections scroll into view
  const trackableSections = [
    document.getElementById('categories'),
    document.getElementById('discover'),
    document.getElementById('how-it-works'),
    document.getElementById('why-menged'),
    document.getElementById('submit-section'),
  ].filter(Boolean);

  const updateScrollSpy = () => {
    const scrollPosition = window.scrollY + 200;
    let currentId = '';

    for (let i = trackableSections.length - 1; i >= 0; i--) {
      const sec = trackableSections[i];
      if (sec && sec.offsetTop <= scrollPosition) {
        currentId = sec.getAttribute('id');
        break;
      }
    }

    if (currentId) {
      setActiveNavLink(`#${currentId}`);
    } else if (window.scrollY < 200) {
      // Near top of page (hero section)
      navLinkElements.forEach((link) => link.classList.remove('active'));
    }
  };

  // Initial check on page load
  updateScrollSpy();

  // Floating Hero Cards Mouse Parallax
  const heroScene = document.getElementById('hero-3d-scene');
  if (heroScene && window.innerWidth >= 1024) {
    heroScene.addEventListener('mousemove', (e) => {
      const rect = heroScene.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 20;
      const y = (e.clientY - rect.top - rect.height / 2) / 20;

      document.querySelectorAll('.vibrant-float-card').forEach((card) => {
        const speed = parseFloat(card.getAttribute('data-speed')) || 1;
        card.style.transform = `translate3d(${x * speed}px, ${y * speed}px, 0)`;
      });
    });

    heroScene.addEventListener('mouseleave', () => {
      document.querySelectorAll('.vibrant-float-card').forEach((card) => {
        card.style.transform = '';
      });
    });
  }

  // Signin & Register informational toasts (Level 2 workspace indicator)
  const authNotice = () => {
    showToast('Personal User Workspace arriving in Level 2! Explore all opportunities freely now.', 'info');
  };
  const signinBtn = document.getElementById('signin-btn');
  const ctaReg = document.getElementById('cta-register-btn');
  const footSign = document.getElementById('footer-signin-link');
  const footReg = document.getElementById('footer-register-link');
  if (signinBtn) signinBtn.addEventListener('click', authNotice);
  if (ctaReg) ctaReg.addEventListener('click', authNotice);
  if (footSign) footSign.addEventListener('click', (e) => { e.preventDefault(); authNotice(); });
  if (footReg) footReg.addEventListener('click', (e) => { e.preventDefault(); authNotice(); });

  // Navbar shadow & Scroll-Spy on scroll
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (window.scrollY > 20) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
    updateScrollSpy();
  }, { passive: true });
}

// App Initialization
document.addEventListener('DOMContentLoaded', async () => {
  initNightMode();
  setupEventListeners();
  await checkBackendHealth();
  await fetchOpportunities();
});
