// (note) removed shadowing placeholders to ensure window exports work correctly
// let loadApodToday, loadApodRandom;

// --- PERINGATAN KEAMANAN ---
// Meletakkan API Key di sini tidak aman untuk aplikasi produksi.
// Hanya gunakan untuk proyek pribadi atau tugas.
// TODO: Ganti dengan API key Anda sendiri
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
const HUGGINGFACE_API_TOKEN = 'YOUR_HUGGINGFACE_API_TOKEN_HERE';

// 🌌 Cosmic Navbar Effects
class CosmicNavbar {
  constructor() {
    this.navbar = document.querySelector('.cosmic-navbar');
    this.particlesContainer = document.querySelector('#navbar-particles');
    this.lastScrollY = window.scrollY;
    this.isScrolling = false;
    this.particles = [];
    
    this.init();
  }
  
  init() {
    this.createParticles();
    this.bindScrollEvents();
    this.bindResizeEvents();
    this.startParticleAnimation();
  }
  
  createParticles() {
    const particleCount = 12; // Reduced for better performance
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'cosmic-particle';
      
      // Random positioning
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      
      // Random size (smaller for better performance)
      const size = Math.random() * 2 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      // Random animation delay and duration
      particle.style.animationDelay = Math.random() * 4 + 's';
      particle.style.animationDuration = (Math.random() * 4 + 3) + 's';
      
      // Optimize for performance
      particle.style.willChange = 'transform, opacity';
      particle.style.transform = 'translateZ(0)'; // Force hardware acceleration
      
      this.particlesContainer.appendChild(particle);
      this.particles.push(particle);
    }
  }
  
  bindScrollEvents() {
    let ticking = false;
    
    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
      
      // Add scrolled class for enhanced effects
      if (currentScrollY > 50) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
      
      // Add compact class for smaller navbar
      if (currentScrollY > 100) {
        this.navbar.classList.add('compact');
      } else {
        this.navbar.classList.remove('compact');
      }
      
      // Navbar selalu terlihat - tidak ada efek hide
      // Hanya mengubah opacity sedikit saat scroll untuk efek dinamis
      if (currentScrollY > 100) {
        this.navbar.style.opacity = '0.95';
      } else {
        this.navbar.style.opacity = '1';
      }
      
      this.lastScrollY = currentScrollY;
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    });
  }
  
  bindResizeEvents() {
    window.addEventListener('resize', () => {
      // Recreate particles on resize for better positioning
      this.particles.forEach(particle => particle.remove());
      this.particles = [];
      this.createParticles();
    });
  }
  
  startParticleAnimation() {
    // Add CSS for particle animation
    const style = document.createElement('style');
    style.textContent = `
      .cosmic-particle {
        position: absolute;
        background: radial-gradient(circle, rgba(122, 162, 255, 0.8), transparent);
        border-radius: 50%;
        pointer-events: none;
        animation: cosmicFloat 4s ease-in-out infinite;
        filter: blur(0.3px);
        will-change: transform, opacity;
        transform: translateZ(0);
      }
      
      @keyframes cosmicFloat {
        0%, 100% {
          opacity: 0.3;
          transform: translateY(0px) scale(1);
        }
        50% {
          opacity: 0.8;
          transform: translateY(-20px) scale(1.2);
        }
      }
      
      .cosmic-particle:nth-child(odd) {
        background: radial-gradient(circle, rgba(0, 229, 255, 0.6), transparent);
        animation-duration: 3s;
      }
      
      .cosmic-particle:nth-child(3n) {
        background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent);
        animation-duration: 5s;
      }
    `;
    document.head.appendChild(style);
  }
}

(() => {
  'use strict';

  // DOM refs
  const apodSection = document.querySelector('#apod-section');
  const welcomeTypedEl = document.querySelector('#welcomeTyped');
  const welcomeTitleEl = document.querySelector('#welcome-section .welcome-title');
  const marsSection = document.querySelector('#mars-section');
  const neoSection = document.querySelector('#neo-section');
  const navButtons = document.querySelectorAll('.nav-btn');

  const apiKeyInput = document.querySelector('#apiKey');
  const saveKeyBtn = document.querySelector('#saveKeyBtn');

  // API Key Validation System - DOM refs
  const apiKeyPopup = document.querySelector('#apiKeyPopup');
  const disclaimerState = document.querySelector('#disclaimerState');
  const formState = document.querySelector('#formState');
  const showApiKeyFormBtn = document.querySelector('#showApiKeyForm');
  const useDemoKeyBtn = null;
  const apiKeyForm = document.querySelector('#apiKeyForm');
  const apiKeyInputField = document.querySelector('#apiKeyInput');
  const apiKeyError = document.querySelector('#apiKeyError');
  const saveApiKeyBtn = document.querySelector('#saveApiKey');
  const backToDisclaimerBtn = document.querySelector('#backToDisclaimer');
  const btnText = document.querySelector('.btn-text');
  const btnSpinner = document.querySelector('.btn-spinner');
  const disclaimerTitle = document.querySelector('#disclaimerTitle');
  const disclaimerMessage = document.querySelector('#disclaimerMessage');

  // Splash Screen refs
  const splashScreen = document.querySelector('#splash-screen');
  const splashStars = document.querySelector('#splash-stars');
  const splashParticles = document.querySelector('#splash-particles');
  const progressText = document.querySelector('#progress-text');
  const progressRingFill = document.querySelector('.progress-ring-fill');
  const splashMessage = document.querySelector('#splash-message');
  const splashSubtitle = document.querySelector('#splash-subtitle');

  // Welcome typing effect (runs after DOM parsed since scripts are deferred)
  if (typeof window !== 'undefined' && window.Typed && welcomeTypedEl) {
    // Prevent layout jump during typing
    welcomeTypedEl.style.display = 'inline-block';
    welcomeTypedEl.style.whiteSpace = 'nowrap';
    // Ensure cursor stays right after the text (no reserved width)
    welcomeTypedEl.style.minWidth = '';
    // Ensure we always start from an empty state so the first phrase is typed, not immediately erased
    welcomeTypedEl.textContent = '';
    const updateUnderline = () => {
      try {
        const width = Math.ceil(welcomeTypedEl.offsetWidth);
        const root = welcomeTitleEl || welcomeTypedEl.parentElement;
        root?.style.setProperty('--welcome-underline-width', width + 'px');
      } catch (_) { /* no-op */ }
    };

    new window.Typed('#welcomeTyped', {
      strings: [
        'Selamat Datang',
        'Eksplorasi Angkasa',
        'Asteroid NEO'
      ],
      startDelay: 300,
      typeSpeed: 90,
      backSpeed: 50,
      backDelay: 1500,
      smartBackspace: true,
      shuffle: false,
      loop: true,
      loopCount: Infinity,
      showCursor: true,
      cursorChar: '▋',
      preStringTyped: updateUnderline,
      onStringTyped: updateUnderline,
      onLastStringBackspaced: updateUnderline,
      onTypingPaused: updateUnderline,
      onTypingResumed: updateUnderline
    });

    // Initial and responsive sync
    updateUnderline();
    window.addEventListener('resize', updateUnderline);
  }


  // APOD refs
  const apodLoader = document.querySelector('#apodLoader');
  const apodCard = document.querySelector('#apodCard');
  const apodMediaWrapper = document.querySelector('#apodMediaWrapper');
  const apodTitle = document.querySelector('#apodTitle');
  const apodDate = document.querySelector('#apodDate');
  const apodExplanation = document.querySelector('#apodExplanation');
  const refreshApodBtn = document.querySelector('#refreshApod');
  const refreshApodBtnText = refreshApodBtn?.querySelector('.btn-text');
  const refreshApodBtnSpinner = refreshApodBtn?.querySelector('.btn-spinner');

  // Media (replaces Mars) refs
  const mediaQueryInput = document.querySelector('#mediaQuery');
  const dateRangeInput = document.querySelector('#dateRange');
  const cosmicDropdown = document.querySelector('#cosmicDropdown');
  const dropdownTrigger = document.querySelector('#dropdownTrigger');
  const dropdownMenu = document.querySelector('#dropdownMenu');
  const dropdownText = dropdownTrigger?.querySelector('.dropdown-text');
  const searchMediaBtn = document.querySelector('#searchMedia');
  const marsLoader = document.querySelector('#marsLoader');
  const marsGrid = document.querySelector('#marsGrid');
  const marsEmpty = document.querySelector('#marsEmpty');
  const mediaTotal = document.querySelector('#mediaTotal');
  const mediaPrevBtn = document.querySelector('#mediaPrev');
  const mediaNextBtn = document.querySelector('#mediaNext');
  const mediaPageInfo = document.querySelector('#mediaPageInfo');
  const searchMediaBtnText = searchMediaBtn?.querySelector('.btn-text');
  const searchMediaBtnSpinner = searchMediaBtn?.querySelector('.btn-spinner');

  // NEO refs
  const neoStart = null; // removed filter inputs
  const neoEnd = null;   // removed filter inputs
  const loadNeoFeedBtn = null; // removed feed button
  const loadNeoBrowseBtn = document.querySelector('#loadNeoBrowse');
  const neoPrevPageBtn = document.querySelector('#neoPrevPage');
  const neoNextPageBtn = document.querySelector('#neoNextPage');
  const neoPageInfo = document.querySelector('#neoPageInfo');
  const neoLoader = document.querySelector('#neoLoader');
  const neoGrid = document.querySelector('#neoGrid');
  const neoCards = document.querySelector('#neoCards');
  const neoCardsPrev = document.querySelector('#neoCardsPrev');
  const neoCardsNext = document.querySelector('#neoCardsNext');
  const neoCardsPageInfo = document.querySelector('#neoCardsPageInfo');
  const neoEmpty = document.querySelector('#neoEmpty');
  const neoOrbitCanvas = document.querySelector('#neo-orbit-canvas');
  const neoTooltip = document.querySelector('#neo-tooltip');
  const neo3dLayer = document.querySelector('#neo-3d-layer');
  const loadNeoFeedBtnText = null;
  const loadNeoFeedBtnSpinner = null;
  const loadNeoBrowseBtnText = loadNeoBrowseBtn?.querySelector('.btn-text');
  const loadNeoBrowseBtnSpinner = loadNeoBrowseBtn?.querySelector('.btn-spinner');

  // Modal refs
  const modal = document.querySelector('#modal');
  const modalMedia = document.querySelector('#modalMedia');
  const modalTitle = document.querySelector('#modalTitle');
  const modalDescription = document.querySelector('#modalDescription');
  const modalDateCreated = document.querySelector('#modalDateCreated');
  const modalRover = document.querySelector('#modalRover');
  const modalCamera = document.querySelector('#modalCamera');
  const modalDate = document.querySelector('#modalDate');
  const modalStatus = document.querySelector('#modalStatus');
  const roverDetails = document.querySelector('#roverDetails');

  // State
  const STORAGE_KEY = 'nasa_api_key';
  const API_KEY_EXPIRY_KEY = 'nasa_api_key_expiry';
  const NASA_BASE = 'https://api.nasa.gov';
  const NASA_IMAGES_BASE = 'https://images-api.nasa.gov';
  // Remove demo key fallback; require user-provided key
  function getDefaultApiKey() { return ''; }

  // Track if this is the initial page load/refresh
  let isInitialLoad = true;
  // Track if entire app has finished initialization
  let isAppInitialized = false;
  // Track splash timeout guard to allow cancellation when splash is hidden
  let splashGuardTimeoutId = null;
  // One-time splash completion flag (tidak digunakan lagi untuk skip; Splash harus muncul setiap refresh)
  // Catatan: tetap disimpan untuk kompatibilitas, tetapi tidak dipakai untuk melewati Splash
  const SPLASH_COMPLETED_KEY = 'splash_completed_v1';
  let splashCompleted = false;

  // API Key Validation System
  let isApiKeyValidating = false;
  let apiKeyValidationPromise = null;
  let lastApiCallTime = 0;
  const MIN_API_CALL_INTERVAL = 2000; // Minimum 2 seconds between API calls
  // NASA Images state (logical pagination: 6 per page)
  let mediaState = {
    q: '',
    mediaTypes: new Set(['image', 'video', 'audio']),
    yearStart: '',
    yearEnd: '',
    pageSize: 6,           // logical page size
    logicalPage: 1,        // 1-based logical page
    apiPage: 1,            // 1-based API page (NASA returns up to ~100 per API page)
    totalHits: 0,
    hasNextApi: false,
    cachedItems: [],       // accumulated items from API pages
  };

  // NEO pagination (logical 6 per page)
  const neoState = {
    pageSize: 6,
    logicalPage: 1,
    apiPage: 0,            // 0-based for API (for browse mode)
    cachedItems: [],       // for feed pagination we cache flattened items
    hasNextApi: true,
    mode: 'feed',          // 'feed' (default) or 'browse'
    cardsPage: 1,          // paging for card list below canvas
  };
  // Limit how many items are considered for the list to avoid heavy DOM updates
  const NEO_LIST_MAX = 20;
  let neoHasRenderedOnce = false;
  let neoLoadingAll = false; // background loading flag

  // Safe URL builder to avoid hidden whitespace and concatenation issues
  function buildNasaUrl(path, params = {}) {
    const base = (NASA_BASE || '').trim().replace(/\/$/, '');
    const cleanPath = String(path || '').trim().replace(/^\//, '');
    const url = new URL(`${base}/${cleanPath}`);
    const apiKey = getApiKey().trim();
    url.searchParams.set('api_key', apiKey);
    for (const [key, value] of Object.entries(params)) {
      if (value == null) continue;
      url.searchParams.set(key, String(value).trim());
    }
    return url.toString();
  }

  function getApiKey() {
    return localStorage.getItem(STORAGE_KEY) || '';
  }

  function saveApiKey(key) {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
      // Set expiry timestamp (24 hours from now)
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem(API_KEY_EXPIRY_KEY, expiryTime.toString());
    }
  }

  function isApiKeyExpired() {
    const expiryTime = localStorage.getItem(API_KEY_EXPIRY_KEY);
    if (!expiryTime) return true;
    return Date.now() > parseInt(expiryTime);
  }

  function clearApiKey() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(API_KEY_EXPIRY_KEY);
  }

  // Rate limiting function
  async function enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCallTime;
    
    if (timeSinceLastCall < MIN_API_CALL_INTERVAL) {
      const waitTime = MIN_API_CALL_INTERVAL - timeSinceLastCall;
      console.log(`[Rate Limit] Waiting ${waitTime}ms before next API call...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    lastApiCallTime = Date.now();
  }

  // Enhanced API key validation with caching and rate limiting
  async function validateApiKey(key) {
    if (!key || key.trim() === '') return false;
    
    // Check if we're already validating this key
    if (isApiKeyValidating && apiKeyValidationPromise) {
      return apiKeyValidationPromise;
    }

    // Enforce rate limiting
    await enforceRateLimit();

    isApiKeyValidating = true;
    apiKeyValidationPromise = performApiKeyValidation(key);
    
    try {
      const result = await apiKeyValidationPromise;
      return result;
    } finally {
      isApiKeyValidating = false;
      apiKeyValidationPromise = null;
    }
  }

  async function performApiKeyValidation(key, retryCount = 0) {
    const maxRetries = 0; // no retry
    const baseDelay = 0; // no delay since no retry
    
    try {
      console.log(`[API Key Validation] Testing key: ${key.substring(0, 8)}... (attempt ${retryCount + 1}/${maxRetries + 1})`);
      
      // Use a specific date endpoint for better performance (more reliable than random)
      const testDate = new Date();
      testDate.setDate(testDate.getDate() - 1); // Use yesterday's date
      const dateString = testDate.toISOString().split('T')[0];
      
      const testUrl = `${NASA_BASE}/planetary/apod?api_key=${encodeURIComponent(key)}&date=${dateString}`;
      
      // Create AbortController for better timeout control
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('[API Key Validation] ⏰ Request timeout after 5 seconds');
      }, 5000); // 5 second timeout
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'NASA-APOD-App/1.0'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        console.log('[API Key Validation] ✅ Key is valid');
        return true;
      } else if (response.status === 403) {
        console.log('[API Key Validation] ❌ Key is invalid (403 Forbidden)');
        return false;
      } else if (response.status === 429) {
        console.log('[API Key Validation] ⚠️ Key hit rate limit (429 Too Many Requests)');
        // For rate limit, we'll assume key is valid but server is busy
        return true;
      } else if (response.status >= 500) {
        console.log(`[API Key Validation] ⚠️ Server error (${response.status}), no retry`);
        return true; // treat as possibly valid; don't block app
      } else {
        console.log('[API Key Validation] ❌ Key validation failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error(`[API Key Validation] ❌ Error validating key (attempt ${retryCount + 1}):`, error.message);
      
      // Handle different types of errors
      if (error.name === 'AbortError') {
        console.log('[API Key Validation] ⏰ Request was aborted (timeout)');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log('[API Key Validation] 🌐 Network connection error');
      } else if (error.message.includes('Server error')) {
        console.log('[API Key Validation] 🖥️ NASA server error');
      }
      
      // No retry logic
      
      // For network/timeout, assume key might be valid but do not retry
      if (error.name === 'AbortError' || error.name === 'TypeError') {
        console.log('[API Key Validation] ⚠️ Network/timeout; assuming key might be valid (no retry)');
        return true;
      }
      
      return false;
    }
  }

  // Popup Management Functions
  function showApiKeyPopup(reason = 'default') {
    if (!apiKeyPopup) return;
    
    console.log('[API Key Popup] Showing popup, reason:', reason);
    
    // Update disclaimer message based on reason
    updateDisclaimerMessage(reason);
    
    apiKeyPopup.classList.add('show');
    apiKeyPopup.setAttribute('aria-hidden', 'false');
    
    // Focus management
    const firstButton = apiKeyPopup.querySelector('button');
    if (firstButton) {
      setTimeout(() => firstButton.focus(), 100);
    }
  }

  function updateDisclaimerMessage(reason) {
    if (!disclaimerTitle || !disclaimerMessage) return;
    
    switch (reason) {
      case 'expired':
        disclaimerTitle.textContent = 'API Key Kadaluarsa';
        disclaimerMessage.textContent = 'API key NASA Anda sudah kadaluarsa atau mencapai batas penggunaan harian. Silakan masukkan API key baru untuk melanjutkan.';
        break;
      case 'invalid':
        disclaimerTitle.textContent = 'API Key Tidak Valid';
        disclaimerMessage.textContent = 'API key NASA yang tersimpan tidak valid atau tidak memiliki akses. Silakan masukkan API key yang benar atau dapatkan yang baru.';
        break;
      case 'timeout':
        disclaimerTitle.textContent = 'Koneksi ke NASA Lambat';
        disclaimerMessage.textContent = 'Server NASA sedang lambat atau mengalami gangguan. Silakan coba lagi nanti atau masukkan API key baru untuk memastikan koneksi yang stabil.';
        break;
      case 'demo':
        disclaimerTitle.textContent = 'API Key NASA Diperlukan';
        disclaimerMessage.textContent = 'Untuk menggunakan aplikasi ini dengan optimal, Anda memerlukan API key NASA yang valid. Demo key memiliki batasan penggunaan.';
        break;
      default:
        disclaimerTitle.textContent = 'API Key NASA Diperlukan';
        disclaimerMessage.textContent = 'Untuk menggunakan aplikasi ini dengan optimal, Anda memerlukan API key NASA yang valid.';
    }
  }

  function hideApiKeyPopup() {
    if (!apiKeyPopup) return;
    
    console.log('[API Key Popup] Hiding popup');
    apiKeyPopup.classList.remove('show');
    apiKeyPopup.setAttribute('aria-hidden', 'true');
    
    // Reset form state
    resetPopupState();
  }

  function resetPopupState() {
    if (!disclaimerState || !formState) return;
    
    disclaimerState.classList.add('active');
    formState.classList.remove('active');
    
    if (apiKeyInputField) {
      apiKeyInputField.value = '';
      apiKeyInputField.classList.remove('error');
    }
    
    if (apiKeyError) {
      apiKeyError.hidden = true;
      apiKeyError.textContent = '';
    }
    
    if (saveApiKeyBtn) {
      saveApiKeyBtn.disabled = true;
    }
  }

  function switchToFormState() {
    if (!disclaimerState || !formState) return;
    
    disclaimerState.classList.remove('active');
    formState.classList.add('active');
    
    // Focus on input field
    setTimeout(() => {
      if (apiKeyInputField) {
        apiKeyInputField.focus();
      }
    }, 300);
  }

  function switchToDisclaimerState() {
    if (!disclaimerState || !formState) return;
    
    formState.classList.remove('active');
    disclaimerState.classList.add('active');
  }

  function setButtonLoading(button, isLoading) {
    if (!button || !btnText || !btnSpinner) return;
    
    if (isLoading) {
      button.disabled = true;
      btnText.hidden = true;
      btnSpinner.hidden = false;
    } else {
      button.disabled = false;
      btnText.hidden = false;
      btnSpinner.hidden = true;
    }
  }

  function showApiKeyError(message) {
    if (!apiKeyError) return;
    
    apiKeyError.textContent = message;
    apiKeyError.hidden = false;
    
    if (apiKeyInputField) {
      apiKeyInputField.classList.add('error');
    }
  }

  function hideApiKeyError() {
    if (!apiKeyError) return;
    
    apiKeyError.hidden = true;
    apiKeyError.textContent = '';
    
    if (apiKeyInputField) {
      apiKeyInputField.classList.remove('error');
    }
  }

  // Auto-validation on page load with enhanced error handling
  async function checkApiKeyOnLoad() {
    console.log('[API Key System] Starting auto-validation...');
    
    const currentKey = getApiKey();
    const isExpired = isApiKeyExpired();
    
    console.log('[API Key System] Current key:', currentKey.substring(0, 8) + '...');
    console.log('[API Key System] Is expired:', isExpired);
    
    // If no key, force popup
    if (!currentKey) {
      console.log('[API Key System] No key found, showing popup');
      showApiKeyPopup('demo');
      return false;
    }
    
    // If key is expired, validate it with enhanced error handling
    if (isExpired) {
      console.log('[API Key System] Key is expired, validating with retry mechanism...');
      
      try {
        const isValid = await validateApiKey(currentKey);
        
        if (!isValid) {
          console.log('[API Key System] Expired key is invalid, showing popup');
          showApiKeyPopup('expired');
          return false;
        } else {
          console.log('[API Key System] Expired key is still valid, updating expiry');
          // Update expiry time for valid keys
          const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
          localStorage.setItem(API_KEY_EXPIRY_KEY, expiryTime.toString());
        }
      } catch (error) {
        console.error('[API Key System] Error during validation:', error);
        
        // If validation fails due to network issues, show timeout popup
        if (error.message.includes('timeout') || error.message.includes('network')) {
          console.log('[API Key System] Network/timeout error, showing timeout popup');
          showApiKeyPopup('timeout');
          return false;
        }
        
        // For other errors, show expired popup
        showApiKeyPopup('expired');
        return false;
      }
    }
    
    console.log('[API Key System] Auto-validation completed successfully');
    return true;
  }

  // Event Listeners for API Key Popup
  function setupApiKeyEventListeners() {
    // Show form button
    if (showApiKeyFormBtn) {
      showApiKeyFormBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchToFormState();
      });
    }

    // Removed demo key button handler

    // Back to disclaimer button
    if (backToDisclaimerBtn) {
      backToDisclaimerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchToDisclaimerState();
      });
    }

    // Form input validation
    if (apiKeyInputField) {
      apiKeyInputField.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        
        // Hide error when user starts typing
        hideApiKeyError();
        
        // Enable/disable save button based on input
        if (saveApiKeyBtn) {
          saveApiKeyBtn.disabled = value.length === 0;
        }
      });

      // Handle Enter key
      apiKeyInputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !saveApiKeyBtn.disabled) {
          e.preventDefault();
          apiKeyForm.dispatchEvent(new Event('submit'));
        }
      });
    }

    // Form submission
    if (apiKeyForm) {
      apiKeyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const apiKey = apiKeyInputField.value.trim();
        
        if (!apiKey) {
          showApiKeyError('API key tidak boleh kosong');
          return;
        }

        console.log('[API Key System] Validating user-provided key...');
        
        // Set loading state
        setButtonLoading(saveApiKeyBtn, true);
        
        try {
          // Validate the API key
          const isValid = await validateApiKey(apiKey);
          
          if (isValid) {
            console.log('[API Key System] ✅ User-provided key is valid');
            
            // Save the API key
            saveApiKey(apiKey);
            
            // Show success message briefly
            if (btnText) {
              btnText.textContent = '✅ Berhasil!';
            }
            
            // Hide popup with animation
            setTimeout(() => {
              hideApiKeyPopup();
              
              // Reload page after popup is hidden
              setTimeout(() => {
                console.log('[API Key System] Reloading page with new API key');
                window.location.reload();
              }, 300);
            }, 1000);
            
          } else {
            console.log('[API Key System] ❌ User-provided key is invalid');
            showApiKeyError('API key tidak valid. Silakan periksa kembali atau dapatkan key baru di https://api.nasa.gov');
            
            // Update disclaimer message to show invalid key reason
            updateDisclaimerMessage('invalid');
          }
          
        } catch (error) {
          console.error('[API Key System] Error validating user key:', error);
          showApiKeyError('Terjadi kesalahan saat memvalidasi API key. Silakan coba lagi.');
          
          // Update disclaimer message to show error reason
          updateDisclaimerMessage('invalid');
        } finally {
          setButtonLoading(saveApiKeyBtn, false);
        }
      });
    }

    // Close popup on backdrop click
    if (apiKeyPopup) {
      const backdrop = apiKeyPopup.querySelector('.popup-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', () => {
          // Don't close on backdrop click - force user to make a choice
          console.log('[API Key Popup] Backdrop clicked, but popup remains open');
        });
      }
    }

    // Handle Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && apiKeyPopup && apiKeyPopup.classList.contains('show')) {
        // Don't close on Escape - force user to make a choice
        console.log('[API Key Popup] Escape pressed, but popup remains open');
      }
    });
  }

  // Test API key validity (legacy function - now uses new validation system)
  async function testApiKey(key) {
    console.log('[Legacy testApiKey] Using new validation system...');
    return await validateApiKey(key);
  }

  // Get a working API key without demo fallback
  async function getWorkingApiKey() {
    const currentKey = getApiKey();
    
    console.log('[getWorkingApiKey] Testing current key...');
    
    // Test current key first with enhanced validation
    if (await validateApiKey(currentKey)) {
      console.log('[getWorkingApiKey] ✅ Current key is valid');
      return currentKey;
    }
    
    console.warn('[getWorkingApiKey] Current API key failed');
    
    console.error('[getWorkingApiKey] ❌ All API keys failed');
    return currentKey; // Return current key anyway for error handling
  }

  function setLoading(el, isLoading) {
    if (!el) return;
    if (isLoading) {
      el.removeAttribute('hidden');
      el.setAttribute('aria-busy', 'true');
    } else {
      el.setAttribute('hidden', '');
      el.setAttribute('aria-busy', 'false');
    }
  }

  // 🌌 Splash Screen Functions
  function createSplashStars() {
    if (!splashStars) return;
    
    for (let i = 0; i < 150; i++) {
      const star = document.createElement('div');
      star.className = 'splash-star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.animationDuration = (2 + Math.random() * 2) + 's';
      splashStars.appendChild(star);
    }
  }

  function createSplashParticles() {
    if (!splashParticles) return;
    
    // Clear any existing particles first
    splashParticles.innerHTML = '';
    
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'splash-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 2 + 's';
      particle.style.animationDuration = (3 + Math.random() * 2) + 's';
      splashParticles.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 5000);
    };
    
    // Create particles periodically
    const particleInterval = setInterval(createParticle, 300);
    
    // Store interval reference for cleanup
    splashParticles._particleInterval = particleInterval;
    
    // Stop creating particles after splash screen is hidden
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (splashScreen.classList.contains('hide')) {
            if (splashParticles._particleInterval) {
              clearInterval(splashParticles._particleInterval);
              splashParticles._particleInterval = null;
            }
            observer.disconnect();
          }
        }
      });
    });
    
    if (splashScreen) {
      observer.observe(splashScreen, { attributes: true });
    }
  }

  function updateProgress(percentage) {
    if (!progressText || !progressRingFill) return;
    
    const circumference = 2 * Math.PI * 54; // radius = 54
    const offset = circumference - (percentage / 100) * circumference;
    
    // Smooth percentage animation
    const currentPercentage = parseInt(progressText.textContent) || 0;
    const targetPercentage = Math.round(percentage);
    
    if (currentPercentage !== targetPercentage) {
      progressText.textContent = targetPercentage + '%';
    }
    
    progressRingFill.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRingFill.style.strokeDashoffset = offset;
    
    // Remove glow entirely; keep ring animation only
    progressRingFill.style.filter = 'none';
  }

  function updateSplashMessage(message, subtitle = '') {
    if (splashMessage) splashMessage.textContent = message;
    if (splashSubtitle && subtitle) splashSubtitle.textContent = subtitle;
  }

  function hideSplashScreen() {
    if (!splashScreen) return;
    
    // ✅ Tambahan: hindari double hide
    if (splashScreen.classList.contains('hide')) return;
    
    console.log('[Splash Screen] Hiding splash screen...');
    // Cancel any pending guard timeout once we start hiding
    if (splashGuardTimeoutId) {
      try { clearTimeout(splashGuardTimeoutId); } catch (_) {}
      splashGuardTimeoutId = null;
    }
    // Choose smoother animation if triggered by guard
    const useGuardExit = splashScreen.classList.contains('guard-exit');
    splashScreen.classList.add('hide', 'animate__animated');
    if (useGuardExit) {
      splashScreen.classList.add('animate__fadeOut', 'animate__faster');
    } else {
      splashScreen.classList.add('animate__fadeOutUp');
    }
    
    // Pastikan UI utama tampil meskipun splash belum benar-benar selesai animasi
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.style.display = 'block';
    
    // Bersihkan status setelah animasi
    setTimeout(() => {
      splashScreen.classList.remove('animate__animated', 'animate__fadeOutUp', 'animate__fadeOut', 'animate__faster', 'guard-exit');
      console.log('[Splash Screen] Hidden successfully.');
      // Reset progress dan pesan default
      updateProgress(0);
      updateSplashMessage('Memuat data dari NASA...', 'Menyiapkan pengalaman luar angkasa');
      // Tandai selesai (informasional; tidak dipakai untuk skip)
      try { sessionStorage.setItem(SPLASH_COMPLETED_KEY, 'true'); } catch (_) {}
      splashCompleted = true;
      // Bersihkan interval/observer partikel
      if (splashParticles) {
        if (splashParticles._particleInterval) {
          clearInterval(splashParticles._particleInterval);
          splashParticles._particleInterval = null;
        }
        if (splashParticles._observer) {
          try { splashParticles._observer.disconnect(); } catch (_) {}
          splashParticles._observer = null;
        }
      }
    }, 1200);
  }

  // 🚀 Unified Loading Screen Functions (using splash screen)
  let loadingProgress = 0;
  let loadingInterval = null;

  function showLoading(message = 'Memuat data...', subtitle = '', type = '') {
    if (!splashScreen) return;
    // Perbaikan: tetap izinkan loading untuk interaksi user setelah app aktif,
    // namun jangan memanggil kembali animasi intro Splash.
    
    // Cegah duplikat splash screen
    if (splashScreen.classList.contains('active')) return;
    
    console.log('[Loading] Showing loading screen');
    
    // Store loading context
    currentLoadingContext = {
      type: type,
      baseMessage: message,
      subtitle: subtitle
    };
    
    // Reset progress
    loadingProgress = 0;
    updateProgress(0);
    
    // Update message
    updateSplashMessage(message, subtitle);
    
    // Make splash screen reusable for all interactions
    splashScreen.classList.add('reusable', 'active');
    
    // Show splash screen (remove hide class and add animation bila belum initialized)
    splashScreen.classList.remove('hide', 'animate__animated', 'animate__fadeOutUp');
    if (!isAppInitialized && !splashCompleted) {
      // Animasi intro hanya saat pertama kali
      splashScreen.classList.add('animate__animated', 'animate__fadeIn', 'animate__zoomIn');
    } else {
      // Tambahan: saat aplikasi sudah aktif, tampilkan tanpa animasi intro berat
      splashScreen.classList.remove('animate__fadeIn', 'animate__zoomIn');
      splashScreen.classList.add('animate__animated');
    }
    
    // Start progress animation
    startProgressAnimation();
  }

  function startProgressAnimation() {
    // Clear any existing interval to prevent conflicts
    if (loadingInterval) {
      clearInterval(loadingInterval);
      loadingInterval = null;
    }
    
    loadingProgress = 0;
    loadingInterval = setInterval(() => {
      if (loadingProgress < 90) {
        loadingProgress += Math.random() * 3 + 1; // Random increment between 1-4
        updateProgress(Math.min(loadingProgress, 90));
        
        // Update loading message based on progress
        updateLoadingMessage(Math.min(loadingProgress, 90));
      }
    }, 100);
  }

  function completeProgress() {
    if (loadingInterval) {
      clearInterval(loadingInterval);
      loadingInterval = null;
    }
    updateProgress(100);
    updateLoadingMessage(100);
  }

  // Store current loading context for dynamic messages
  let currentLoadingContext = {
    type: '',
    baseMessage: '',
    subtitle: ''
  };

  function updateLoadingMessage(progress) {
    if (!splashMessage || !splashSubtitle) return;
    
    let message = currentLoadingContext.baseMessage;
    let subtitle = currentLoadingContext.subtitle;
    const type = currentLoadingContext.type;
    
    // Update message based on progress and context with more dynamic messages
    if (progress < 15) {
      if (type === 'apod' || type === 'apod-random') {
        subtitle = '🚀 Menghubungkan ke server NASA...';
      } else if (type === 'media-gallery') {
        subtitle = '🛰️ Mencari konten media NASA...';
      } else if (type === 'neo-feed' || type === 'neo-browse') {
        subtitle = '☄️ Menghubungkan ke database asteroid...';
      } else {
        subtitle = '🌌 Memulai koneksi...';
      }
    } else if (progress < 30) {
      if (type === 'apod' || type === 'apod-random') {
        subtitle = '📡 Mengunduh gambar astronomi...';
      } else if (type === 'media-gallery') {
        subtitle = '🔍 Mengambil data galeri media...';
      } else if (type === 'neo-feed' || type === 'neo-browse') {
        subtitle = '📊 Mengambil data asteroid terbaru...';
      } else {
        subtitle = '📡 Mengambil data dari server...';
      }
    } else if (progress < 50) {
      if (type === 'apod' || type === 'apod-random') {
        subtitle = '🖼️ Memproses gambar dan metadata...';
      } else if (type === 'media-gallery') {
        subtitle = '🎬 Memproses koleksi media...';
      } else if (type === 'neo-feed' || type === 'neo-browse') {
        subtitle = '🔬 Menganalisis data asteroid...';
      } else {
        subtitle = '⚙️ Memproses informasi...';
      }
    } else if (progress < 70) {
      if (type === 'apod' || type === 'apod-random') {
        subtitle = '✨ Menyiapkan tampilan gambar...';
      } else if (type === 'media-gallery') {
        subtitle = '🎨 Menyiapkan galeri media...';
      } else if (type === 'neo-feed' || type === 'neo-browse') {
        subtitle = '📋 Menyiapkan daftar asteroid...';
      } else {
        subtitle = '🎯 Menyiapkan tampilan...';
      }
    } else if (progress < 90) {
      subtitle = '🌟 Hampir selesai...';
    } else if (progress >= 100) {
      subtitle = '🎉 Selesai!';
    }
    
    splashSubtitle.textContent = subtitle;
  }

  function hideLoading() {
    if (!splashScreen) return;
    
    // Complete progress before hiding
    completeProgress();
    
    // Hide splash screen with animation
    setTimeout(() => {
      splashScreen.classList.add('hide', 'animate__animated', 'animate__fadeOutUp');
      
      // Reset after animation completes
      setTimeout(() => {
        splashScreen.classList.remove('reusable', 'active', 'animate__animated', 'animate__fadeIn', 'animate__zoomIn', 'animate__fadeOutUp');
        // Reset progress
        loadingProgress = 0;
        if (loadingInterval) {
          clearInterval(loadingInterval);
          loadingInterval = null;
        }
        // Reset to default message
        updateSplashMessage('Memuat data dari NASA...', 'Menyiapkan pengalaman luar angkasa');
      }, 1200);
    }, 500);
  }

  function setButtonLoading(button, isLoading, textElement, spinnerElement) {
    if (!button) return;
    
    if (isLoading) {
      button.classList.add('btn-loading');
      button.disabled = true;
      if (textElement) textElement.style.opacity = '0';
      if (spinnerElement) spinnerElement.hidden = false;
    } else {
      button.classList.remove('btn-loading');
      button.disabled = false;
      if (textElement) textElement.style.opacity = '1';
      if (spinnerElement) spinnerElement.hidden = true;
    }
  }

  function showSectionByRoute(route) {
    let target = null;
    if (route === 'apod') target = apodSection;
    if (route === 'media') target = marsSection;
    if (route === 'neo') target = neoSection;
    // Do not hide other sections; allow natural scrolling between sections
    [apodSection, marsSection, neoSection].forEach((sec) => {
      const isActive = (sec === target);
      sec.classList.toggle('active', isActive);
    });
    navButtons.forEach((btn) => {
      const isActive = (btn.dataset.route === route);
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });
    // Auto-load NEO data and render cards when entering NEO section
    if (route === 'neo') {
      try {
        if (!neoState.cachedItems || neoState.cachedItems.length === 0) {
          loadNeoBrowse(0).catch(() => {});
        } else if (!neoHasRenderedOnce) {
          renderNeoPage();
        }
      } catch (e) { /* no-op */ }
    }
    return target;
  }

  function smoothScrollToSection(sectionEl) {
    if (!sectionEl) return;
    const header = document.querySelector('.app-header');
    const offset = (header && header.offsetHeight) ? header.offsetHeight : 0;
    const rect = sectionEl.getBoundingClientRect();
    const top = rect.top + window.scrollY - offset - 8; // small extra gap
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function getRouteFromHash() {
    const h = (location.hash || '').replace(/^#/, '');
    if (h === 'media' || h === 'neo' || h === 'apod') return h;
    return 'apod';
  }

  // Fetch JSON with endpoint-aware timeout and retries
  async function fetchJSON(url, retries = 1) {
    try {
      const isApodEndpoint = String(url).includes('/planetary/apod');
      const isNeoEndpoint = String(url).includes('/neo/');
      const isApodCount = isApodEndpoint && String(url).includes('count=');
      // Panjangkan retry khusus endpoint APOD, agar menunggu sampai data tersedia
      const remainingRetries = isApodCount
        ? Math.max(10, retries)
        : (isApodEndpoint ? Math.max(5, retries) : (isNeoEndpoint ? Math.max(2, retries) : retries));
      console.log(`[fetchJSON] Making request to: ${url} (${remainingRetries} retries left)`);
      
      // Gunakan timeout yang lebih panjang untuk endpoint yang lambat
      const timeoutMs = isApodEndpoint ? 60000 : (isNeoEndpoint ? 20000 : 8000);
      const res = await fetchWithTimeout(url, timeoutMs);
      
      console.log('[fetchJSON] Response status:', res.status, res.statusText);
      // Tambahan: jika 200 OK, sembunyikan Splash segera agar data langsung tampil
      if (res.ok) {
        if (splashScreen && !splashScreen.classList.contains('hide')) {
          console.log('[Splash Screen] Hiding due to successful response 200');
          hideSplashScreen();
          const mainEl = document.querySelector('main');
          if (mainEl) mainEl.style.display = 'block';
        }
      }
      
      if (!res.ok) {
        const message = `HTTP ${res.status}`;
        // Tambahan: deteksi 504 agar alur inisialisasi tidak macet di Splash
        if (res.status === 504) {
          console.warn('[NASA API] Detected 504 Gateway Timeout');
        }
        
        // Handle 429 Rate Limit - don't retry, just log
        if (res.status === 429) {
          console.warn('[fetchJSON] Rate limit exceeded, not retrying');
        }

        // If token invalid, immediately show popup and hide splash
        if (res.status === 403) {
          try {
            showApiKeyPopup('invalid');
          } catch (_) {}
          try {
            hideSplashScreen();
          } catch (_) {}
        }
        
        console.error('[fetchJSON] Failed URL:', url);
        console.error('[fetchJSON] Status:', res.status, res.statusText);
        
        // Try to capture a short snippet of the response body for easier debugging
        let snippet = '';
        try {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const json = await res.json();
            snippet = JSON.stringify(json).slice(0, 300);
            console.error('API Error Response:', json);
          } else {
            const text = await res.text();
            snippet = String(text).slice(0, 300);
            console.error('API Error Text:', text);
          }
        } catch (_) {}
        
        console.error('[NASA API Error]', message, 'URL:', url, snippet ? '\nBody snippet:' : '', snippet || '');
        throw new Error(message);
      }
      
      try {
        const data = await res.json();
        console.log('[fetchJSON] Successfully parsed JSON response');
        return data;
      } catch (parseErr) {
        console.error('[fetchJSON] JSON parse error for URL:', url, parseErr);
        throw parseErr;
      }
    } catch (error) {
      // Tambahan: handle AbortError/timeouts dengan jelas tanpa retry loop
      if (error.name === 'AbortError') {
        console.error('[NASA API] AbortError (timeout) detected for URL:', url);
      } else {
        console.error('[fetchJSON] Error in fetchJSON:', url, error);
      }
      // For APOD count requests, be more persistent to wait for NASA's slow responses
      const isApodEndpoint = String(url).includes('/planetary/apod');
      const isNeoEndpoint = String(url).includes('/neo/');
      const isApodCount = isApodEndpoint && String(url).includes('count=');
      const baseRetries = typeof retries === 'number' ? retries : 0;
      // If APOD count request, allow a few extra retries to accommodate slow endpoint
      const remainingRetries = isApodCount ? Math.max(baseRetries, 3) : (isNeoEndpoint ? Math.max(baseRetries, 2) : baseRetries);
      if (isApodEndpoint || isNeoEndpoint || remainingRetries > 0) {
        const nextRetries = (isApodCount || isApodEndpoint || isNeoEndpoint)
          ? remainingRetries - 1
          : baseRetries - 1;
        if (nextRetries >= 0) {
          console.log('[fetchJSON] Retrying...', { nextRetries });
          return await fetchJSON(url, nextRetries);
        }
      }
      // ✅ Jangan blokir Splash, kembalikan null
      return null;
    }
  }

  // Enhanced fetch with timeout control - allow slower endpoints by default
  async function fetchWithTimeout(url, timeout = 8000) {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
      console.log(`[fetchWithTimeout] Request timed out after ${timeout}ms: ${url}`);
    }, timeout);
    
    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'NASA-APOD-App/1.0'
        }
      });
      clearTimeout(timer);
      return response;
    } catch (error) {
      clearTimeout(timer);
      if (error.name === 'AbortError') {
        console.error('[fetchWithTimeout] Request timed out:', url);
      }
      throw error;
    }
  }

  function renderFriendlyError(container, err, fallback) {
    const text = String(err || '').includes('HTTP 429')
      ? 'Terkena batas kuota (HTTP 429). Gunakan API key pribadi di kanan atas, lalu coba lagi nanti.'
      : fallback;
    container.innerHTML = `<div class="empty">${text}</div>`;
  }

  // Test function for direct APOD API testing
  async function testApodConsole() {
    try {
      const key = await getWorkingApiKey();
      const url = buildNasaUrl('/planetary/apod');
      console.log('=== APOD TEST ===');
      console.log('Testing URL:', url);
      const data = await fetchJSON(url);
      console.log('APOD Test Result:', data);
      return data;
    } catch (error) {
      console.error('APOD Test Failed:', error);
      throw error;
    }
  }

  

  /**
   * GANTI FUNGSI LAMA DENGAN KODE BARU DI BAWAH INI
   */
  async function loadFunFact() {
    // ==============================================================================
    // FUN FACT LOKAL SAJA (TANPA API, TANPA GAMBAR)
    // ==============================================================================
    const spaceFacts = [
      "Satu hari di Venus lebih lama dari satu tahun di Venus.",
      "Jejak kaki astronaut di bulan akan tetap ada di sana selama jutaan tahun.",
      "Ada planet yang hampir seluruhnya terbuat dari berlian.",
      "Matahari menyumbang 99.86% dari total massa di tata surya kita.",
      "Galaksi Andromeda akan bertabrakan dengan Bima Sakti dalam 4.5 miliar tahun.",
      "Jika Anda menangis di luar angkasa, air mata Anda akan menempel di wajah.",
      "Ada awan uap air raksasa di luar angkasa yang menampung 140 triliun kali massa air lautan Bumi.",
      "Bintang neutron sangat padat sehingga satu sendok teh materinya akan lebih berat dari Gunung Everest.",
      "Suara tidak dapat merambat di luar angkasa karena tidak ada medium untuk gelombang suara.",
      "Lubang hitam supermasif di pusat galaksi kita bernama Sagittarius A*.",
      "Olympus Mons di Mars adalah gunung berapi terbesar di tata surya, tiga kali lebih tinggi dari Everest.",
      "Cahaya dari beberapa bintang membutuhkan jutaan tahun untuk sampai ke Bumi.",
      "Jumlah bintang di alam semesta lebih banyak daripada jumlah butiran pasir di semua pantai di Bumi.",
      "Saturnus dapat mengapung di air jika ditemukan samudra yang cukup besar, karena kerapatannya lebih rendah dari air.",
      "Ada lebih dari 200 miliar galaksi di alam semesta yang teramati.",
      "Jupiter memiliki badai raksasa bernama Great Red Spot yang telah berlangsung setidaknya 350 tahun.",
      "Di Bulan, langit selalu gelap meski Matahari bersinar karena tidak ada atmosfer untuk menyebarkan cahaya.",
      "Astronaut menjadi lebih tinggi beberapa sentimeter di luar angkasa karena tulang belakang meregang tanpa gravitasi.",
      "Merkurius tidak memiliki atmosfer yang berarti, sehingga perbedaan suhu siang-malamnya ekstrem.",
      "Bumi adalah satu-satunya planet yang diketahui memiliki kehidupan—sejauh ini.",
      "Kometa adalah bola salju kotor yang terbuat dari es, debu, dan batu.",
      "Aurora terjadi ketika partikel bermuatan dari Matahari berinteraksi dengan atmosfer Bumi.",
      "Cincin Saturnus terutama terdiri dari partikel es yang sangat terang.",
      "Sinyal radio dari Voyager 1 memerlukan lebih dari 22 jam untuk mencapai Bumi.",
      "Neptunus memiliki angin tercepat di tata surya, mencapai lebih dari 2.000 km/jam.",
      "Bintang lahir dari awan gas dan debu yang disebut nebula.",
      "Supernova dapat menyinari seluruh galaksi selama beberapa waktu.",
      "Matahari adalah bintang kelas G dan berusia sekitar 4.6 miliar tahun.",
      "Tahun di Mars hampir dua kali lebih lama daripada tahun di Bumi.",
      "Pluto memiliki hati es besar di permukaannya bernama Tombaugh Regio.",
      "Gravitasi di Bulan hanya sekitar seperenam dari gravitasi Bumi.",
      "ISS mengorbit Bumi sekitar 16 kali per hari.",
      "Banyak asteroid memiliki bulan kecil yang mengorbit mereka sendiri.",
      "Bima Sakti berbentuk spiral batang dengan lengan-lengan spiral yang luas.",
      "Suhu permukaan Venus sangat panas—cukup untuk melelehkan timah.",
      "Uranus berputar miring hampir 98 derajat, seolah-olah berguling di orbitnya.",
      "Kosmonaut Yuri Gagarin adalah manusia pertama yang pergi ke luar angkasa pada tahun 1961."
    ];

    const factText = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

    const apodLoader = document.querySelector('#apodLoader');
    const apodCard = document.querySelector('#apodCard');
    const apodMediaWrapper = document.querySelector('#apodMediaWrapper');
    const apodTitle = document.querySelector('#apodTitle');
    const apodExplanation = document.querySelector('#apodExplanation');

    if (apodCard) apodCard.hidden = true;
    if (apodLoader) apodLoader.hidden = false;
    if (apodMediaWrapper) apodMediaWrapper.innerHTML = '';

    try {
      if (apodTitle) apodTitle.textContent = 'Fakta Luar Angkasa';
      if (apodExplanation) apodExplanation.textContent = factText;
    } finally {
      if (apodLoader) apodLoader.hidden = true;
      if (apodCard) {
        apodCard.hidden = false;
        apodCard.classList.remove('fade-in');
        void apodCard.offsetWidth;
        apodCard.classList.add('fade-in');
      }
    }
  }

  // Expose Fun Fact globally for inline handlers
  window.loadFunFact = loadFunFact;

  async function renderApodWithProgress(url, loadingMessage = 'Memuat data...') {
    setLoading(apodLoader, true);
    apodCard.hidden = true;
    apodMediaWrapper.innerHTML = '';
    
    // Update loading message
    if (apodLoader) {
      const span = apodLoader.querySelector('span');
      if (span) span.textContent = loadingMessage;
    }
    
    try {
      console.log('Fetching APOD from:', url);
      const data = await fetchJSON(url);
      console.log('APOD data received:', data);
      if (!data) {
        // ✅ Fallback jika data null (timeout/AbortError/504)
        apodCard.hidden = false;
        apodMediaWrapper.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--muted); text-align: center; padding: 20px;">
            <div>
              <div style="font-size: 48px; margin-bottom: 16px;">⏰</div>
              <div style="margin-bottom: 16px;">Data NASA tidak tersedia</div>
              <div style="font-size: 12px;">Server NASA sedang sibuk. Silakan coba lagi nanti.</div>
            </div>
          </div>
        `;
        apodTitle.textContent = 'Data NASA tidak tersedia';
        apodDate.textContent = new Date().toLocaleDateString('id-ID');
        apodExplanation.textContent = 'Server NASA sedang sibuk. Silakan coba lagi nanti.';
        return;
      }
      
      const apod = Array.isArray(data) ? data[0] : data;
      
      if (!apod) {
        throw new Error('No APOD data received from API');
      }
      
      // Extract all available data from APOD response
      const { 
        media_type, 
        url: mediaUrl, 
        hdurl: hdUrl,
        title, 
        date, 
        explanation,
        copyright,
        service_version
      } = apod;

      console.log('APOD Details:', {
        title,
        date,
        media_type,
        hasUrl: !!mediaUrl,
        hasHdUrl: !!hdUrl,
        explanationLength: explanation ? explanation.length : 0,
        copyright
      });

      if (!mediaUrl) {
        throw new Error('No media URL found in APOD data');
      }

      // Clear previous content
      apodMediaWrapper.innerHTML = '';

      // Handle different media types
      if (media_type === 'video') {
        console.log('Loading APOD video:', mediaUrl);
        const iframe = document.createElement('iframe');
        iframe.src = mediaUrl;
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        apodMediaWrapper.appendChild(iframe);
      } else {
        console.log('Loading APOD image:', mediaUrl);
        const img = document.createElement('img');
        img.src = mediaUrl;
        img.alt = title || 'Astronomy Picture of the Day';
        img.decoding = 'async';
        img.loading = 'lazy';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        
        // Add loading state
        img.onload = () => {
          console.log('APOD image loaded successfully');
        };
        
        // Add error handling for image loading
        img.onerror = () => {
          console.error('Failed to load APOD image:', mediaUrl);
          apodMediaWrapper.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--muted); text-align: center; padding: 20px;">
              <div>
                <div style="font-size: 48px; margin-bottom: 16px;">🖼️</div>
                <div>Gambar tidak dapat dimuat</div>
                <div style="font-size: 12px; margin-top: 8px;">URL: ${mediaUrl}</div>
              </div>
            </div>
          `;
        };
        
        apodMediaWrapper.appendChild(img);
      }

      // Update title with proper fallback
      apodTitle.textContent = title || 'Space Weather Update';
      
      // Update date with proper formatting
      if (date) {
        try {
          const formattedDate = new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          apodDate.textContent = formattedDate;
        } catch (e) {
          apodDate.textContent = date;
        }
      } else {
        apodDate.textContent = '';
      }
      
      // Update explanation with proper formatting
      if (explanation) {
        apodExplanation.textContent = explanation;
        console.log('APOD explanation set:', explanation.substring(0, 100) + '...');
      } else {
        apodExplanation.textContent = 'Deskripsi tidak tersedia untuk gambar ini.';
      }

      // Show the card with animation - no additional splash screen
      apodCard.hidden = false;
      apodCard.classList.remove('fade-in');
      // Force reflow for animation restart
      void apodCard.offsetWidth;
      apodCard.classList.add('fade-in');
      
      console.log('APOD rendered successfully');
      
    } catch (err) {
      console.error('APOD Error:', err);
      // Don't call showApodFallback here - let the calling function handle it
      throw err;
    } finally {
      setLoading(apodLoader, false);
    }
  }

  // Fallback system for APOD errors
  async function showApodFallback(error, type = 'today') {
    setLoading(apodLoader, false);
    apodCard.hidden = false;
    
    const isTimeout = String(error).includes('timeout') || String(error).includes('504');
    const isRateLimit = String(error).includes('429');
    const is504 = String(error).includes('504');
    
    let errorMessage = '';
    let icon = '🚀';
    
    if (is504) {
      errorMessage = '⏰ Server NASA sedang sibuk (504 Gateway Timeout). Silakan coba lagi dalam beberapa saat.';
      icon = '⏰';
    } else if (isTimeout) {
      errorMessage = '🚀 Server NASA sedang lambat atau mengalami gangguan. Silakan coba lagi nanti.';
      icon = '⏰';
    } else if (isRateLimit) {
      errorMessage = '📊 Batas penggunaan API NASA telah tercapai. Silakan gunakan API key pribadi atau coba lagi besok.';
      icon = '📊';
    } else {
      errorMessage = '🚀 Gagal memuat APOD. Silakan periksa koneksi internet dan coba lagi.';
    }
    
    apodMediaWrapper.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--muted); text-align: center; padding: 20px;">
        <div>
          <div style="font-size: 48px; margin-bottom: 16px;">${icon}</div>
          <div style="margin-bottom: 16px;">${errorMessage}</div>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button onclick="loadFunFact()" style="padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
              Coba Lagi
            </button>
            ${type === 'today' ? `
              <button onclick="loadFunFact()" style="padding: 8px 16px; background: var(--accent); color: #0b1020; border: none; border-radius: 8px; cursor: pointer;">
                Muat Ulang
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    
    // Update card content with fallback info
    apodTitle.textContent = 'Space Weather Update';
    apodDate.textContent = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    apodExplanation.textContent = 'Gambar tidak tersedia saat ini. Silakan coba lagi nanti atau gunakan tombol di atas untuk memuat ulang.';
  }

  async function renderApod(url, isArrayResponse = false) {
    setLoading(apodLoader, true);
    apodCard.hidden = true;
    apodMediaWrapper.innerHTML = '';
    
    try {
      console.log('Fetching APOD from:', url);
      const data = await fetchJSON(url);
      console.log('APOD data received:', data);
      if (!data) {
        // ✅ Fallback jika data null
        apodCard.hidden = false;
        apodMediaWrapper.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--muted); text-align: center; padding: 20px;">
            <div>
              <div style="font-size: 48px; margin-bottom: 16px;">⏰</div>
              <div style="margin-bottom: 16px;">Data NASA tidak tersedia</div>
              <div style="font-size: 12px;">Server NASA sedang sibuk. Silakan coba lagi nanti.</div>
            </div>
          </div>
        `;
        apodTitle.textContent = 'Data NASA tidak tersedia';
        apodDate.textContent = new Date().toLocaleDateString('id-ID');
        apodExplanation.textContent = 'Server NASA sedang sibuk. Silakan coba lagi nanti.';
        return;
      }
      
      const apod = isArrayResponse ? (Array.isArray(data) ? data[0] : data) : data;
      
      if (!apod) {
        throw new Error('No APOD data received from API');
      }
      
      // Extract all available data from APOD response
      const { 
        media_type, 
        url: mediaUrl, 
        hdurl: hdUrl,
        title, 
        date, 
        explanation,
        copyright,
        service_version
      } = apod;

      console.log('APOD Details:', {
        title,
        date,
        media_type,
        hasUrl: !!mediaUrl,
        hasHdUrl: !!hdUrl,
        explanationLength: explanation ? explanation.length : 0,
        copyright
      });

      if (!mediaUrl) {
        throw new Error('No media URL found in APOD data');
      }

      // Clear previous content
      apodMediaWrapper.innerHTML = '';

      // Handle different media types
      if (media_type === 'video') {
        console.log('Loading APOD video:', mediaUrl);
        const iframe = document.createElement('iframe');
        iframe.src = mediaUrl;
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        apodMediaWrapper.appendChild(iframe);
      } else {
        console.log('Loading APOD image:', mediaUrl);
        const img = document.createElement('img');
        img.src = mediaUrl;
        img.alt = title || 'Astronomy Picture of the Day';
        img.decoding = 'async';
        img.loading = 'lazy';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        
        // Add loading state
        img.onload = () => {
          console.log('APOD image loaded successfully');
        };
        
        // Add error handling for image loading
        img.onerror = () => {
          console.error('Failed to load APOD image:', mediaUrl);
          apodMediaWrapper.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--muted); text-align: center; padding: 20px;">
              <div>
                <div style="font-size: 48px; margin-bottom: 16px;">🖼️</div>
                <div>Gambar tidak dapat dimuat</div>
                <div style="font-size: 12px; margin-top: 8px;">URL: ${mediaUrl}</div>
              </div>
            </div>
          `;
        };
        
        apodMediaWrapper.appendChild(img);
      }

      // Update title with proper fallback
      apodTitle.textContent = title || 'Astronomy Picture of the Day';
      
      // Update date with proper formatting
      if (date) {
        try {
          const formattedDate = new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          apodDate.textContent = formattedDate;
        } catch (e) {
          apodDate.textContent = date;
        }
      } else {
        apodDate.textContent = '';
      }
      
      // Update explanation with proper formatting
      if (explanation) {
        apodExplanation.textContent = explanation;
        console.log('APOD explanation set:', explanation.substring(0, 100) + '...');
      } else {
        apodExplanation.textContent = 'Deskripsi tidak tersedia untuk gambar ini.';
      }

      // Show the card with animation
      apodCard.hidden = false;
      apodCard.classList.remove('fade-in');
      // Force reflow for animation restart
      void apodCard.offsetWidth;
      apodCard.classList.add('fade-in');
      
      console.log('APOD rendered successfully');
      
    } catch (err) {
      console.error('APOD Error:', err);
      await showApodFallback(err);
    } finally {
      setLoading(apodLoader, false);
    }
  }

  // NASA Images: search & render
  function buildMediaSearchUrl({ q, mediaTypes, yearStart, yearEnd, apiPage }) {
    const url = new URL(`https://images-api.nasa.gov/search`);
    if (q) url.searchParams.set('q', q);
    if (mediaTypes && mediaTypes.size > 0) url.searchParams.set('media_type', [...mediaTypes].join(','));
    if (yearStart) url.searchParams.set('year_start', String(yearStart));
    if (yearEnd) url.searchParams.set('year_end', String(yearEnd));
    if (apiPage) url.searchParams.set('page', String(apiPage));
    return url.toString();
  }

  function renderMediaPage() {
    marsGrid.innerHTML = '';
    marsEmpty.hidden = true;
    const startIndex = (mediaState.logicalPage - 1) * mediaState.pageSize;
    const endIndex = startIndex + mediaState.pageSize;

    // Interleave items by selected media types so each page alternates types
    const pageItems = getInterleavedMediaItems(mediaState.cachedItems).slice(startIndex, endIndex);
    if (pageItems.length === 0) {
      marsEmpty.hidden = false;
    } else {
      const frag = document.createDocumentFragment();
      for (const item of pageItems) frag.appendChild(createMediaCard(item));
      marsGrid.appendChild(frag);
    }
    if (mediaPrevBtn) mediaPrevBtn.disabled = mediaState.logicalPage <= 1;
    const hasMoreCached = mediaState.cachedItems.length > endIndex;
    if (mediaNextBtn) mediaNextBtn.disabled = !(hasMoreCached || mediaState.hasNextApi);
    if (mediaPageInfo) mediaPageInfo.textContent = `Halaman ${mediaState.logicalPage}`;
    if (mediaTotal && mediaState.totalHits) mediaTotal.textContent = `Total hasil: ${Number(mediaState.totalHits).toLocaleString()}`;
  }

  async function getPreferredAssetUrl(item) {
    try {
      const data0 = Array.isArray(item?.data) ? item.data[0] : null;
      const nasaId = data0?.nasa_id;
      const mediaType = (data0?.media_type || '').toLowerCase();
      if (!nasaId || !mediaType) return null;

      const assetUrl = `https://images-api.nasa.gov/asset/${encodeURIComponent(nasaId)}`;
      const res = await fetch(assetUrl);
      if (!res.ok) return null;
      const json = await res.json();
      const items = Array.isArray(json?.collection?.items) ? json.collection.items : [];
      const hrefs = items.map(i => i?.href).filter(Boolean);

      const pickByExt = (exts) => hrefs.find(h => exts.some(ext => new RegExp(`${ext}(?:\\?.*)?$`, 'i').test(h)));

      if (mediaType === 'video') {
        return pickByExt(['\\.mp4', '\\.m4v', '\\.webm']) || null;
      }
      if (mediaType === 'audio') {
        return pickByExt(['\\.mp3', '\\.m4a', '\\.wav', '\\.ogg']) || null;
      }
      if (mediaType === 'image') {
        return pickByExt(['\\.jpg', '\\.jpeg', '\\.png', '\\.gif']) || null;
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  function getInterleavedMediaItems(items) {
    // Determine selected types with a stable preference order
    const preferredOrder = ['image', 'video', 'audio'];
    const selectedTypes = preferredOrder.filter(t => mediaState.mediaTypes.has(t));
    if (selectedTypes.length <= 1) return items; // no need to interleave if 0/1 types

    // Bucket items by media type in original order
    const buckets = new Map();
    for (const t of selectedTypes) buckets.set(t, []);
    for (const it of items) {
      const t = getItemMediaType(it);
      if (buckets.has(t)) buckets.get(t).push(it);
    }

    // Round-robin merge across selected types
    const cursors = Object.fromEntries(selectedTypes.map(t => [t, 0]));
    const total = selectedTypes.reduce((sum, t) => sum + buckets.get(t).length, 0);
    const merged = [];
    let idxType = 0;
    while (merged.length < total) {
      const t = selectedTypes[idxType];
      const arr = buckets.get(t);
      const i = cursors[t];
      if (i < arr.length) {
        merged.push(arr[i]);
        cursors[t] = i + 1;
      }
      idxType = (idxType + 1) % selectedTypes.length;
      // If current type is exhausted and all others are also exhausted, loop will end naturally
      // because merged.length will reach total.
    }
    return merged;
  }

  function getItemMediaType(item) {
    const data0 = Array.isArray(item?.data) ? item.data[0] : null;
    return (data0?.media_type || '').toLowerCase();
  }

  async function fetchNextMediaApiPage() {
    const url = buildMediaSearchUrl({
      q: mediaState.q,
      mediaTypes: mediaState.mediaTypes,
      yearStart: mediaState.yearStart,
      yearEnd: mediaState.yearEnd,
      apiPage: mediaState.apiPage,
    });
    setLoading(marsLoader, true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = data?.collection?.items || [];
      const links = data?.collection?.links || [];
      const md = data?.collection?.metadata;
      const total = typeof md?.total_hits === 'number' ? md.total_hits : null;
      mediaState.totalHits = total || mediaState.totalHits;
      mediaState.cachedItems = mediaState.cachedItems.concat(items);
      mediaState.hasNextApi = Array.isArray(links) && links.some(l => (l?.rel === 'next'));
      mediaState.apiPage += 1; // prepare next API page
    } finally {
      setLoading(marsLoader, false);
    }
  }

  async function ensureMediaItemsForLogicalPage(targetLogicalPage) {
    const needed = targetLogicalPage * mediaState.pageSize;
      while (mediaState.cachedItems.length < needed) {
        await fetchNextMediaApiPage();
        if (!mediaState.hasNextApi && mediaState.cachedItems.length < needed) break;
    }
  }

  async function resetAndSearchMedia() {
    // Show loading state on search button (already handled in applyAndSearch)
    // Show enhanced mars loader
    if (marsLoader) {
      marsLoader.style.display = 'flex';
      marsLoader.hidden = false;
      
      // Update loading text with cosmic styling
      const loadingText = marsLoader.querySelector('span');
      if (loadingText) {
        loadingText.textContent = 'Mencari media NASA...';
      }
    }
    
    try {
      mediaState.cachedItems = [];
      mediaState.logicalPage = 1;
      mediaState.apiPage = 1;
      mediaState.hasNextApi = false;
      marsGrid.innerHTML = '';
      marsEmpty.hidden = true;
      if (mediaTotal) mediaTotal.textContent = '';
      if (mediaPageInfo) mediaPageInfo.textContent = '';
      
      await ensureMediaItemsForLogicalPage(1);
      renderMediaPage();
      
    } finally {
      // Hide mars loader with smooth transition
      if (marsLoader) {
        marsLoader.style.opacity = '0';
        marsLoader.style.transform = 'scale(0.95)';
        setTimeout(() => {
          marsLoader.style.display = 'none';
          marsLoader.hidden = true;
          marsLoader.style.opacity = '1';
          marsLoader.style.transform = 'scale(1)';
        }, 300);
      }
    }
  }

  function createMediaCard(item) {
    const data0 = Array.isArray(item?.data) ? item.data[0] : null;
    const links = Array.isArray(item?.links) ? item.links : [];
    const mediaType = (data0?.media_type || '').toLowerCase();
    const title = data0?.title || 'Media NASA';
    const dateCreated = data0?.date_created || '';
    const description = data0?.description || '';
    const preview = links.find(l => (l?.rel === 'preview' || l?.render === 'image' || l?.href))?.href;

    const card = document.createElement('article');
    card.className = 'media-card card fade-in';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Lihat detail ${mediaType || 'media'}: ${title}`);

    const media = document.createElement('div');
    media.className = 'media';
    media.style.position = 'relative';
    if (preview && (mediaType === 'image' || /\.(jpg|jpeg|png|gif)(\?.*)?$/i.test(preview))) {
      const img = document.createElement('img');
      img.src = preview;
      img.alt = title;
      img.loading = 'lazy';
      img.decoding = 'async';
      media.appendChild(img);
    } else if (mediaType === 'video') {
      const placeholder = document.createElement('div');
      placeholder.style.display = 'grid';
      placeholder.style.placeItems = 'center';
      placeholder.style.width = '100%';
      placeholder.style.height = '100%';
      placeholder.style.color = 'var(--muted)';
      placeholder.style.fontSize = '2.5rem';
      placeholder.innerHTML = '<i class="fas fa-video"></i>';
      media.appendChild(placeholder);
      // Play overlay icon
      const overlay = document.createElement('div');
      overlay.className = 'play-overlay';
      overlay.innerHTML = '<i class="fas fa-play"></i>';
      overlay.style.cssText = 'position:absolute;right:8px;bottom:8px;background:rgba(11,16,32,0.6);border:1px solid rgba(122,162,255,0.3);border-radius:999px;padding:6px 10px;font-size:12px;line-height:1;color:#7aa2ff;backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;width:28px;height:28px';
      media.appendChild(overlay);
    } else if (mediaType === 'audio') {
      const placeholder = document.createElement('div');
      placeholder.style.display = 'grid';
      placeholder.style.placeItems = 'center';
      placeholder.style.width = '100%';
      placeholder.style.height = '100%';
      placeholder.style.color = 'var(--muted)';
      placeholder.style.fontSize = '2.5rem';
      placeholder.innerHTML = '<i class="fas fa-volume-up"></i>';
      media.appendChild(placeholder);
      // Play overlay icon
      const overlay = document.createElement('div');
      overlay.className = 'play-overlay';
      overlay.innerHTML = '<i class="fas fa-play"></i>';
      overlay.style.cssText = 'position:absolute;right:8px;bottom:8px;background:rgba(11,16,32,0.6);border:1px solid rgba(122,162,255,0.3);border-radius:999px;padding:6px 10px;font-size:12px;line-height:1;color:#7aa2ff;backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;width:28px;height:28px';
      media.appendChild(overlay);
    } else {
      const placeholder = document.createElement('div');
      placeholder.style.display = 'grid';
      placeholder.style.placeItems = 'center';
      placeholder.style.width = '100%';
      placeholder.style.height = '100%';
      placeholder.style.color = 'var(--muted)';
      placeholder.style.fontSize = '2.5rem';
      placeholder.innerHTML = '<i class="fas fa-image"></i>';
      media.appendChild(placeholder);
    }

    const content = document.createElement('div');
    content.className = 'card-content';
    const h3 = document.createElement('h3');
    h3.textContent = title;
    const meta = document.createElement('p');
    meta.className = 'muted';
    const typeBadge = mediaType ? `${mediaType.toUpperCase()}` : 'MEDIA';
    meta.innerHTML = `<span class="badge">${typeBadge}</span> ${dateCreated ? '• ' + new Date(dateCreated).toLocaleDateString() : ''}`;
    content.appendChild(h3);
    content.appendChild(meta);

    card.appendChild(media);
    card.appendChild(content);

    const open = async () => {
      // For video/audio ensure playable asset URL
      if (mediaType === 'video' || mediaType === 'audio') {
        const data0 = Array.isArray(item?.data) ? item.data[0] : null;
        const nasaId = data0?.nasa_id;
        // Show modal immediately with loading state, then swap when ready
        openModal({ src: '', title, description, dateCreated, mediaType, nasaId });
        const src = await getPreferredAssetUrl(item);
        if (src) openModal({ src, title, description, dateCreated, mediaType, nasaId });
        return;
      }
      openModal({ src: preview || '', title, description, dateCreated, mediaType });
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    return card;
  }

  // Modal
  function summarizeText(text, maxChars = 260) {
    if (!text) return '';
    const clean = String(text).trim().replace(/\s+/g, ' ');
    if (clean.length <= maxChars) return clean;
    const slice = clean.slice(0, maxChars);
    const lastBreak = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf(' '));
    return (lastBreak > 40 ? slice.slice(0, lastBreak) : slice).trim() + '…';
  }

  function createCosmicAudioPlayer(src) {
    const shell = document.createElement('div');
    shell.style.cssText = 'display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;width:100%';
    const icon = document.createElement('div');
    icon.textContent = '🔭';
    icon.style.cssText = 'width:56px;height:56px;display:grid;place-items:center;font-size:28px;border-radius:12px;background:linear-gradient(135deg, rgba(122,162,255,0.2), rgba(0,229,255,0.15));border:1px solid rgba(122,162,255,0.35);box-shadow:inset 0 0 30px rgba(0,229,255,0.08)';
    const controlsWrap = document.createElement('div');
    controlsWrap.style.cssText = 'background:rgba(11,16,32,0.6);border:1px solid rgba(122,162,255,0.25);border-radius:12px;padding:10px 12px;box-shadow:0 10px 30px rgba(0,0,0,0.3);display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center';

    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.textContent = '▶';
    playBtn.style.cssText = 'width:36px;height:36px;border-radius:999px;border:1px solid rgba(122,162,255,0.35);background:rgba(122,162,255,0.15);color:#7aa2ff;cursor:pointer';

    const progress = document.createElement('input');
    progress.type = 'range';
    progress.min = '0';
    progress.max = '100';
    progress.value = '0';
    progress.style.width = '100%';

    const time = document.createElement('span');
    time.textContent = '0:00';
    time.style.cssText = 'font-variant-numeric:tabular-nums;color:#9bb3ff;font-size:12px';

    const audio = document.createElement('audio');
    audio.src = src;
    audio.preload = 'metadata';
    audio.style.display = 'none';

    let isPlaying = false;
    const fmt = (s) => {
      s = Math.max(0, Math.floor(s));
      const m = Math.floor(s / 60);
      const sec = String(s % 60).padStart(2, '0');
      return `${m}:${sec}`;
    };

    playBtn.addEventListener('click', async () => {
      try {
        if (!isPlaying) { await audio.play(); isPlaying = true; playBtn.textContent = '⏸'; }
        else { audio.pause(); isPlaying = false; playBtn.textContent = '▶'; }
      } catch (_) {}
    });
    audio.addEventListener('timeupdate', () => {
      const dur = audio.duration || 0;
      const cur = audio.currentTime || 0;
      if (dur > 0) progress.value = String(Math.round((cur / dur) * 100));
      time.textContent = `${fmt(cur)}`;
    });
    audio.addEventListener('ended', () => { isPlaying = false; playBtn.textContent = '▶'; });
    progress.addEventListener('input', () => {
      const dur = audio.duration || 0;
      const pct = Number(progress.value) / 100;
      if (dur > 0) audio.currentTime = dur * pct;
    });

    controlsWrap.appendChild(playBtn);
    controlsWrap.appendChild(progress);
    controlsWrap.appendChild(time);
    shell.appendChild(icon);
    shell.appendChild(controlsWrap);
    shell.appendChild(audio);
    return shell;
  }

  function createCosmicToggleButton(label) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.className = 'cosmic-toggle';
    btn.style.cssText = [
      'margin-top:8px',
      'align-self:flex-start',
      'background:linear-gradient(135deg, rgba(122,162,255,0.18), rgba(0,229,255,0.12))',
      'border:1px solid rgba(122,162,255,0.45)',
      'color:#bcd0ff',
      'padding:6px 10px',
      'border-radius:999px',
      'cursor:pointer',
      'box-shadow:0 6px 18px rgba(0,0,0,0.25), inset 0 0 20px rgba(0,229,255,0.08)',
      'font:inherit',
      'line-height:1',
      'transition:transform .12s ease, box-shadow .2s ease',
    ].join(';');
    btn.addEventListener('mouseenter', () => {
      btn.style.boxShadow = '0 10px 24px rgba(0,0,0,0.35), 0 0 20px rgba(122,162,255,0.25) inset';
      btn.style.transform = 'translateY(-1px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.boxShadow = '0 6px 18px rgba(0,0,0,0.25), inset 0 0 20px rgba(0,229,255,0.08)';
      btn.style.transform = 'translateY(0)';
    });
    return btn;
  }

  function applyCollapsibleDescription(el, fullText, shortText) {
    if (!el) return null;
    el.textContent = shortText;
    el.style.cssText = [
      'position:relative',
      'max-height:120px',
      'overflow:hidden',
      'transition:max-height .25s ease',
      'margin-bottom:6px',
    ].join(';');
    // Fade overlay
    const fade = document.createElement('div');
    fade.className = 'desc-fade';
    fade.style.cssText = 'position:absolute;left:0;right:0;bottom:0;height:36px;background:linear-gradient(to bottom, rgba(11,16,32,0), rgba(11,16,32,0.9))';
    el.appendChild(fade);

    const toggle = createCosmicToggleButton('Lihat selengkapnya');
    let expanded = false;
    function setExpanded(v) {
      expanded = v;
      if (expanded) {
        el.textContent = fullText;
        // make scrollable but cap height so content tidak memanjang ke atas
        el.style.maxHeight = Math.max(180, Math.floor(window.innerHeight * 0.5)) + 'px';
        el.style.overflow = 'auto';
        toggle.textContent = 'Sembunyikan';
      } else {
        el.textContent = shortText;
        el.style.maxHeight = '120px';
        el.style.overflow = 'hidden';
        toggle.textContent = 'Lihat selengkapnya';
      }
      // re-add fade only when collapsed
      if (!expanded) {
        try { el.querySelector('.desc-fade')?.remove(); } catch (_) {}
        const f = document.createElement('div');
        f.className = 'desc-fade';
        f.style.cssText = 'position:absolute;left:0;right:0;bottom:0;height:36px;background:linear-gradient(to bottom, rgba(11,16,32,0), rgba(11,16,32,0.9))';
        el.appendChild(f);
      } else {
        try { el.querySelector('.desc-fade')?.remove(); } catch (_) {}
      }
    }
    toggle.addEventListener('click', () => setExpanded(!expanded));
    return { toggle, setExpanded };
  }

  function openModal(payload) {
    modalMedia.innerHTML = '';
    // Cosmic themed wrapper
    const cosmicWrap = document.createElement('div');
    cosmicWrap.className = 'cosmic-player-wrap';
    cosmicWrap.style.cssText = 'position:relative;background:radial-gradient(1200px 600px at 20% 10%, rgba(122,162,255,0.12), rgba(11,16,32,0.8)), radial-gradient(900px 400px at 80% 30%, rgba(0,229,255,0.08), transparent);border:1px solid rgba(122,162,255,0.25);box-shadow:0 0 40px rgba(0,229,255,0.07) inset,0 20px 40px rgba(0,0,0,0.4);border-radius:12px;padding:12px;overflow:hidden;min-height:180px;display:grid;place-items:center';
    modalMedia.appendChild(cosmicWrap);
    if (modalDescription) modalDescription.textContent = '';
    if (modalDateCreated) modalDateCreated.textContent = '';
    // NASA Images payload has mediaType
    if (payload && payload.mediaType) {
      const { src, title, description, dateCreated } = payload;
      if (src) {
        const mediaType = (payload.mediaType || '').toLowerCase();
        if (mediaType === 'video') {
          const video = document.createElement('video');
          video.src = src;
          video.controls = true;
          video.autoplay = true;
          video.playsInline = true;
          video.style.maxWidth = '100%';
          video.style.maxHeight = '70vh';
          video.style.borderRadius = '8px';
          video.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
          video.style.background = 'rgba(0,0,0,0.3)';
          cosmicWrap.appendChild(video);
        } else if (mediaType === 'audio') {
          const player = createCosmicAudioPlayer(src);
          cosmicWrap.appendChild(player);
        } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = title || 'Media NASA';
        img.loading = 'eager';
          img.style.width = '100%';
          img.style.maxHeight = '70vh';
          img.style.objectFit = 'contain';
          cosmicWrap.appendChild(img);
        }
      } else {
        // Loading state for asset fetch
        const loader = document.createElement('div');
        loader.style.cssText = 'display:grid;place-items:center;color:var(--muted);height:140px;font-size:14px';
        loader.textContent = 'Mengambil media dari NASA...';
        cosmicWrap.appendChild(loader);
      }
      modalTitle.textContent = payload.title || 'Detail Media';
      if (modalDescription) {
        const fullText = String(description || '').trim();
        const shortText = summarizeText(fullText);
        // reset styles if any from previous open
        modalDescription.removeAttribute('style');
        try { modalDescription.querySelector('.desc-fade')?.remove(); } catch (_) {}
        // remove any previous toggle buttons to avoid duplicates
        try {
          const existing = modalDescription.parentNode?.querySelectorAll?.('.cosmic-toggle') || [];
          existing.forEach(el => el.parentNode && el.parentNode.removeChild(el));
        } catch (_) {}
        const cfg = applyCollapsibleDescription(modalDescription, fullText, shortText);
        if (cfg) modalDescription.insertAdjacentElement('afterend', cfg.toggle);
      }
      if (modalDateCreated) modalDateCreated.textContent = dateCreated ? new Date(dateCreated).toLocaleString() : '';
      if (roverDetails) roverDetails.style.display = 'none';
    } else {
      const { src, title, rover, camera, date, status } = payload || {};
      const img = document.createElement('img');
      img.src = src;
      img.alt = title || 'Foto Mars';
      img.loading = 'eager';
      modalMedia.appendChild(img);
      modalTitle.textContent = title || 'Detail Foto';
      if (modalRover) modalRover.textContent = rover || '-';
      if (modalCamera) modalCamera.textContent = camera || '-';
      if (modalDate) modalDate.textContent = date || '-';
      if (modalStatus) modalStatus.textContent = status || '-';
      if (roverDetails) roverDetails.style.display = '';
    }
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    lastFocused = document.activeElement;
    trapFocus(modal);
  }

  function closeModal() {
    // Pause any playing media inside modal before closing
    try {
      const mediaEls = modal.querySelectorAll('video, audio');
      mediaEls.forEach((el) => { try { el.pause(); } catch (_) {} });
    } catch (_) {}
    
    // Remove focus from modal elements before hiding
    const focusedElement = modal.querySelector(':focus');
    if (focusedElement) {
      focusedElement.blur();
    }
    
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    releaseFocus();
  }

  // NEO logic
  let neoBrowsePage = 0; // 0-based
  let neoTotalPages = null;

  function initNeoDefaultDates() { /* filter removed */ }

  function createNeoCard(neo) {
    const name = neo?.name || 'Asteroid';
    const id = neo?.id || '';
    const absMag = neo?.absolute_magnitude_h;
    const hazardous = neo?.is_potentially_hazardous_asteroid ? 'Berpotensi berbahaya' : 'Tidak berpotensi berbahaya';

    // pick first close approach data if exists
    const cad = Array.isArray(neo?.close_approach_data) && neo.close_approach_data.length > 0 ? neo.close_approach_data[0] : null;
    const approachDate = cad?.close_approach_date_full || cad?.close_approach_date || '-';
    const relVel = cad?.relative_velocity?.kilometers_per_hour ? `${Number(cad.relative_velocity.kilometers_per_hour).toLocaleString()} km/jam` : '-';
    const missKm = cad?.miss_distance?.kilometers ? `${Number(cad.miss_distance.kilometers).toLocaleString()} km` : '-';
    const body = cad?.orbiting_body || '-';

    const card = document.createElement('article');
    card.className = 'neo-card fade-in';
    // Text-only, pill-like
    const pill = document.createElement('div');
    pill.className = 'neo-pill';
    const left = document.createElement('div');
    const title = document.createElement('p');
    title.className = 'neo-title';
    title.textContent = `${name}`;
    const sub = document.createElement('p');
    sub.className = 'neo-sub';
    sub.textContent = `ID ${id} • H ${absMag ?? '-'} • ${hazardous}`;
    left.appendChild(title);
    left.appendChild(sub);
    const right = document.createElement('div');
    right.className = 'neo-meta';
    right.textContent = `${approachDate} • ${relVel} • ${missKm}`;
    pill.appendChild(left);
    pill.appendChild(right);
    card.appendChild(pill);
    return card;
  }

  async function loadNeoFeed() { /* removed: using browse mode */ }

  function getCardsPerPage() {
    // 10 per page on desktop (2 columns × 5 rows), 3 per page on tablet/phone
    const width = window.innerWidth || 1024;
    return width >= 1024 ? 10 : 3;
  }

  function computeMissKm(neo) {
    const cad = Array.isArray(neo?.close_approach_data) ? neo.close_approach_data[0] : null;
    const missStr = cad?.miss_distance?.kilometers;
    const miss = missStr != null ? parseFloat(missStr) : Infinity;
    return Number.isFinite(miss) ? miss : Infinity;
  }

  function sortNeoByNearest(items) {
    const arr = Array.isArray(items) ? items.slice() : [];
    arr.sort((a, b) => computeMissKm(a) - computeMissKm(b));
    return arr;
  }

  function renderNeoCards() {
    if (!neoCards) return;
    const raw = Array.isArray(neoState.cachedItems) ? neoState.cachedItems : [];
    const items = sortNeoByNearest(raw).slice(0, NEO_LIST_MAX);
    const perPage = getCardsPerPage();
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    if (neoState.cardsPage > totalPages) neoState.cardsPage = totalPages;
    const start = (neoState.cardsPage - 1) * perPage;
    const end = start + perPage;
    const slice = items.slice(start, end);
    neoCards.innerHTML = '';
    slice.forEach((neo) => neoCards.appendChild(createNeoCard(neo)));
    if (neoCardsPageInfo) neoCardsPageInfo.textContent = `Hal ${neoState.cardsPage} / ${totalPages}`;
    if (neoCardsPrev) neoCardsPrev.disabled = neoState.cardsPage <= 1;
    if (neoCardsNext) neoCardsNext.disabled = neoState.cardsPage >= totalPages;
  }

  function renderNeoPage() {
    // Replace grid rendering with orbit visualization of top-3 nearest
    if (neoGrid) neoGrid.innerHTML = '';
    neoEmpty.hidden = true;
    const flat = Array.isArray(neoState.cachedItems) ? neoState.cachedItems : [];
    const withApproach = flat.map((neo) => {
      const ca = Array.isArray(neo?.close_approach_data) ? neo.close_approach_data[0] : null;
      const missKm = ca ? parseFloat(ca?.miss_distance?.kilometers || 'Infinity') : Infinity;
      return { neo, missKm };
    }).filter(x => isFinite(x.missKm));
    withApproach.sort((a,b) => a.missKm - b.missKm);
    const top3 = withApproach.slice(0, 3).map(x => x.neo);
    if (top3.length === 0) {
      neoEmpty.hidden = false;
      if (neoPageInfo) neoPageInfo.textContent = '';
      if (neoPrevPageBtn) neoPrevPageBtn.disabled = true;
      if (neoNextPageBtn) neoNextPageBtn.disabled = true;
      return;
    }
    startNeoOrbit(top3);
    const totalPages = Math.max(1, Math.ceil(neoState.cachedItems.length / neoState.pageSize));
    if (neoPageInfo) neoPageInfo.textContent = `Visual orbit • Hal ${neoState.logicalPage} / ${totalPages}`;
    if (neoPrevPageBtn) neoPrevPageBtn.disabled = true;
    if (neoNextPageBtn) neoNextPageBtn.disabled = true;

    // Render up to 10 NEO cards below explanation
    renderNeoCards();
    neoHasRenderedOnce = true;
  }

  async function loadNeoBrowse(page = 0) {
    // Show loading screen
    showLoading('Memuat data asteroid...', 'Mengambil data NEO dari NASA', 'neo-browse');
    
    // Set button loading state (guard when button removed)
    if (loadNeoBrowseBtn) setButtonLoading(loadNeoBrowseBtn, true, loadNeoBrowseBtnText, loadNeoBrowseBtnSpinner);

    const key = getApiKey();
    if (neoGrid) neoGrid.innerHTML = '';
    neoEmpty.hidden = true;
    setLoading(neoLoader, true);
    try {
      // Simulate progress steps
      setTimeout(() => updateProgress(25), 200);
      setTimeout(() => updateProgress(50), 400);
      
      const url = `${NASA_BASE}/neo/rest/v1/neo/browse?api_key=${encodeURIComponent(key)}&page=${encodeURIComponent(page)}`;
      
      setTimeout(() => updateProgress(70), 600);
      const data = await fetchJSON(url, 2);
      
      setTimeout(() => updateProgress(85), 800);
      const neos = data?.near_earth_objects || [];
      const pageInfo = data?.page || {};
      neoBrowsePage = typeof pageInfo.number === 'number' ? pageInfo.number : page;
      const size = pageInfo.size || neos.length || 20;
      const totalElements = pageInfo.total_elements || null;
      neoTotalPages = typeof pageInfo.total_pages === 'number' ? pageInfo.total_pages : (totalElements != null ? Math.ceil(totalElements / size) : null);

      // Store items and reset paginations
      neoState.cachedItems = neos;
      neoState.logicalPage = 1;
      neoState.cardsPage = 1;
      
      setTimeout(() => updateProgress(90), 1000);
      renderNeoPage();

      // Continue loading remaining pages in background until we have up to NEO_LIST_MAX items
      if (typeof neoTotalPages === 'number' && neoTotalPages > (neoBrowsePage + 1)) {
        neoLoadingAll = true;
        setLoading(neoLoader, true); // show inline loader while gathering remaining pages
        loadAllNeoBrowse(neoBrowsePage + 1, neoTotalPages)
          .catch(() => {})
          .finally(() => { neoLoadingAll = false; setLoading(neoLoader, false); });
      }

      // Note: API page info is not shown directly now; we show local pagination info
    } catch (err) {
      renderFriendlyError(neoGrid, err, `Gagal memuat NEO Browse (${String(err)}).`);
    } finally {
      // Hide loading screen (keep inline loader if still fetching background pages)
      hideLoading();
      
      setLoading(neoLoader, false);
      if (loadNeoBrowseBtn) setButtonLoading(loadNeoBrowseBtn, false, loadNeoBrowseBtnText, loadNeoBrowseBtnSpinner);
    }
  }

  // Background loader: fetch remaining NEO browse pages sequentially and append
  async function loadAllNeoBrowse(startPage, totalPages) {
    const key = getApiKey();
    let current = startPage || 0;
    const maxPages = typeof totalPages === 'number' ? totalPages : startPage + 1;
    while (current < maxPages) {
      const url = `${NASA_BASE}/neo/rest/v1/neo/browse?api_key=${encodeURIComponent(key)}&page=${encodeURIComponent(current)}`;
      try {
        const data = await fetchJSON(url, 2);
        if (!data) break;
        const neos = Array.isArray(data.near_earth_objects) ? data.near_earth_objects : [];
        if (neos.length === 0) break;
        // Append and re-render cards for pagination
        neoState.cachedItems = neoState.cachedItems.concat(neos);
        renderNeoCards();
        // Stop when we have enough
        if (neoState.cachedItems.length >= NEO_LIST_MAX) break;
      } catch (e) {
        console.warn('[NEO] Background page fetch failed at page', current, e);
        break;
      }
      current += 1;
      // small delay to be gentle to API
      await new Promise(r => setTimeout(r, 350));
    }
    // Ensure loader hides when background load finishes (in case .finally didn't fire somewhere)
    setLoading(neoLoader, false);
  }

  // ---------------- NEO Orbit Visualization (Canvas) ----------------
  const neoOrbitState = {
    running: false,
    rafId: 0,
    ctx: null,
    width: 0,
    height: 0,
    dpr: Math.min(2, window.devicePixelRatio || 1),
    centerX: 0,
    centerY: 0,
    earth: { radius: 60, angle: 0 },
    asteroids: [],
    hoverTarget: null,
    images: { earth: null, asteroid: null },
    assetsLoaded: false,
    mvEarth: null,
    mvAsteroids: [],
  };

  // Asset images for orbit visualization
  const EARTH_IMG_URL = 'https://i.ibb.co.com/dw6MP9RJ/bumi.png';
  const ASTEROID_IMG_URL = 'https://i.ibb.co.com/jvyy2BVQ/asteroid.png';

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  }

  async function loadOrbitAssets() {
    if (neoOrbitState.assetsLoaded && neoOrbitState.images.earth && neoOrbitState.images.asteroid) return true;
    try {
      const [earthImg, asteroidImg] = await Promise.all([
        loadImage(EARTH_IMG_URL),
        loadImage(ASTEROID_IMG_URL),
      ]);
      neoOrbitState.images.earth = earthImg;
      neoOrbitState.images.asteroid = asteroidImg;
      neoOrbitState.assetsLoaded = true;
      return true;
    } catch (e) {
      console.warn('[NEO] Failed to load orbit images, fallback to vector shapes', e);
      neoOrbitState.assetsLoaded = false;
      return false;
    }
  }

  function setupOrbitCanvasSize() {
    if (!neoOrbitCanvas) return;
    const parent = neoOrbitCanvas.parentElement;
    const dpr = neoOrbitState.dpr;
    const parentW = Math.max(0, Math.round(parent?.clientWidth || window.innerWidth || 1100));
    // Use full parent width so background fills the box on large screens
    const width = Math.max(300, parentW);
    // Pleasant aspect ratio; clamp height to avoid overflow on small screens
    const height = Math.round(Math.min(Math.max(280, width * 0.58), 720));
    neoOrbitCanvas.width = Math.floor(width * dpr);
    neoOrbitCanvas.height = Math.floor(height * dpr);
    neoOrbitCanvas.style.width = width + 'px';
    neoOrbitCanvas.style.height = height + 'px';
    neoOrbitState.width = width;
    neoOrbitState.height = height;
    neoOrbitState.centerX = Math.floor(width / 2);
    neoOrbitState.centerY = Math.floor(height / 2);
    if (!neoOrbitState.ctx) neoOrbitState.ctx = neoOrbitCanvas.getContext('2d');
    // draw in CSS pixels while backing store uses DPR
    neoOrbitState.ctx.setTransform(1, 0, 0, 1, 0, 0);
    neoOrbitState.ctx.scale(dpr, dpr);
  }

  function drawSpaceBackground(ctx, w, h, t) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0a0f2b');
    g.addColorStop(1, '#120b2f');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 80; i++) {
      const px = (i * 97 + (t * 0.03) % (w + 100)) % (w + 100) - 50;
      const py = (i * 53 + (t * 0.02) % (h + 100)) % (h + 100) - 50;
      const r = (i % 3 === 0) ? 1.6 : 1.0;
      ctx.fillStyle = i % 5 === 0 ? 'rgba(180,220,255,0.8)' : 'rgba(140,180,255,0.5)';
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function drawEarth(ctx, cx, cy, radius, angle) {
    const img = neoOrbitState.images.earth;
    if (img) {
      const size = Math.max(80, Math.floor(radius * 1.6));
      const x = cx - size / 2;
      const y = cy - size / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle * 0.25);
      ctx.translate(-cx, -cy);
      ctx.drawImage(img, x, y, size, size);
      ctx.restore();
    } else {
    ctx.fillStyle = 'rgba(122,162,255,0.15)';
    ctx.beginPath(); ctx.arc(cx, cy, Math.max(2, radius * 0.06), 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawOrbitCircle(ctx, cx, cy, r) {
    ctx.save();
    ctx.strokeStyle = 'rgba(120,170,255,0.25)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 6]);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawAsteroid(ctx, x, y, size, angle) {
    const img = neoOrbitState.images.asteroid;
    if (img) {
      const px = Math.max(24, Math.floor(size * 6));
      const hw = px / 2;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.drawImage(img, -hw, -hw, px, px);
      ctx.restore();
    } else {
    ctx.fillStyle = 'rgba(200,210,220,0.2)';
    ctx.beginPath(); ctx.arc(x, y, Math.max(2, size * 0.2), 0, Math.PI * 2); ctx.fill();
    }
  }

  async function startNeoOrbit(asteroidList) {
    if (!neoOrbitCanvas) return;
    if (!Array.isArray(asteroidList) || asteroidList.length === 0) return;
    neoGrid.hidden = true;
    setupOrbitCanvasSize();
    await loadOrbitAssets();
    const ctx = neoOrbitState.ctx || neoOrbitCanvas.getContext('2d');
    neoOrbitState.ctx = ctx;
    const cx = neoOrbitState.centerX;
    const cy = neoOrbitState.centerY;
    const minDim = Math.min(neoOrbitState.width, neoOrbitState.height);
    // Smaller on tablets/phones to keep everything inside the box
    const isTablet = neoOrbitState.width <= 1024;
    const isPhone = neoOrbitState.width <= 640;
    const sizeFactor = isPhone ? 0.12 : (isTablet ? 0.14 : 0.16);
    neoOrbitState.earth.radius = Math.max(36, Math.floor(minDim * sizeFactor));
    const base = neoOrbitState.earth.radius * 2.0;
    // Orbit radii tuned so they remain within the canvas on small screens
    const orbits = [base * 0.72, base * 1.04, base * 1.32];
    const speeds = [0.0038, 0.005, 0.0065];
    const sizes = isPhone ? [6, 8, 10] : (isTablet ? [7, 9, 11] : [8, 10, 12]);
    neoOrbitState.asteroids = asteroidList.slice(0, 3).map((data, i) => ({
      data,
      radius: orbits[i] || (base * (1.2 + i * 0.3)),
      angle: Math.random() * Math.PI * 2,
      speed: speeds[i] || (0.006 + i * 0.0025),
      size: sizes[i] || 10,
      x: 0, y: 0,
    }));

    // Prepare 3D overlay elements
    if (neo3dLayer) neo3dLayer.innerHTML = '';
    // Prefer model-viewer elements (iframes to NASA are blocked by CSP). Allow overriding via data attributes.
    const earthSrc = (neo3dLayer?.dataset?.earthModel || '').trim();
    let earthMV = null;
    if (earthSrc) {
      earthMV = document.createElement('model-viewer');
      earthMV.setAttribute('src', earthSrc);
      earthMV.setAttribute('auto-rotate', '');
      earthMV.setAttribute('camera-controls', '');
      earthMV.style.left = neoOrbitState.centerX + 'px';
      earthMV.style.top = neoOrbitState.centerY + 'px';
      earthMV.style.width = Math.max(120, Math.floor(neoOrbitState.earth.radius * 2.0)) + 'px';
      earthMV.style.height = earthMV.style.width;
      if (neo3dLayer) neo3dLayer.appendChild(earthMV);
      neoOrbitState.mvEarth = earthMV;
    }

    const asteroidMVs = [];
    for (let i = 0; i < neoOrbitState.asteroids.length; i++) {
      const astSrc = (neo3dLayer?.dataset?.asteroidModel || '').trim();
      if (!astSrc) { asteroidMVs.push(null); continue; }
      const mv = document.createElement('model-viewer');
      mv.setAttribute('src', astSrc);
      mv.setAttribute('auto-rotate', '');
      mv.setAttribute('camera-controls', '');
      mv.style.width = Math.max(90, neoOrbitState.asteroids[i].size * 7) + 'px';
      mv.style.height = mv.style.width;
      if (neo3dLayer) neo3dLayer.appendChild(mv);
      asteroidMVs.push(mv);
    }
    neoOrbitState.mvAsteroids = asteroidMVs;

    const getHoverTarget = (mx, my) => {
      const dxE = mx - (cx);
      const dyE = my - (cy);
      if (Math.hypot(dxE, dyE) <= neoOrbitState.earth.radius + 6) return { type: 'earth' };
      for (let i = 0; i < neoOrbitState.asteroids.length; i++) {
        const a = neoOrbitState.asteroids[i];
        if (Math.hypot(mx - a.x, my - a.y) <= a.size + 8) return { type: 'asteroid', index: i };
      }
      return null;
    };

    function positionTooltip(target, clientX, clientY) {
      if (!neoTooltip || !target) return;
      let html = '';
      if (target.type === 'earth') {
        html = '<strong> Planet Bumi </strong><br>Pusat Orbit';
      } else if (target.type === 'asteroid') {
        const neo = neoOrbitState.asteroids[target.index].data;
        const ca = Array.isArray(neo?.close_approach_data) ? neo.close_approach_data[0] : {};
        const name = neo?.name || 'Asteroid';
        const dateFull = ca?.close_approach_date_full || '-';
        const vel = ca?.relative_velocity?.kilometers_per_hour || '-';
        const miss = ca?.miss_distance?.kilometers || '-';
        const haz = neo?.is_potentially_hazardous_asteroid ? 'Berbahaya' : 'Aman';
        html = `<strong>☄️ ${name}</strong><br>Tanggal Pendekatan: ${dateFull}<br>Kecepatan: ${Number(vel).toLocaleString()} km/jam<br>Jarak Terdekat: ${Number(miss).toLocaleString()} km<br>Status: ${haz}`;
      }
      neoTooltip.innerHTML = html;
      neoTooltip.hidden = false;
      const rect = neoOrbitCanvas.getBoundingClientRect();
      const x = Math.min(rect.width - neoTooltip.offsetWidth - 8, Math.max(8, clientX - rect.left + 12));
      const y = Math.min(rect.height - neoTooltip.offsetHeight - 8, Math.max(8, clientY - rect.top + 12));
      neoTooltip.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    }

    function hideTooltip() { if (neoTooltip) neoTooltip.hidden = true; }

    function onPointerMove(ev) {
      const rect = neoOrbitCanvas.getBoundingClientRect();
      const mx = ev.clientX - rect.left;
      const my = ev.clientY - rect.top;
      const target = getHoverTarget(mx, my);
      neoOrbitState.hoverTarget = target;
      if (target) positionTooltip(target, ev.clientX, ev.clientY); else hideTooltip();
    }
    function onPointerLeave() { neoOrbitState.hoverTarget = null; hideTooltip(); }
    function onClick(ev) {
      const rect = neoOrbitCanvas.getBoundingClientRect();
      const mx = ev.clientX - rect.left; const my = ev.clientY - rect.top;
      const target = getHoverTarget(mx, my);
      if (target) positionTooltip(target, ev.clientX, ev.clientY); else hideTooltip();
    }

    neoOrbitCanvas.style.cursor = 'crosshair';
    neoOrbitCanvas.addEventListener('pointermove', onPointerMove);
    neoOrbitCanvas.addEventListener('pointerleave', onPointerLeave);
    neoOrbitCanvas.addEventListener('click', onClick);

    let lastTs = 0;
    function tick(ts) {
      if (!neoOrbitState.running) return;
      ctx.clearRect(0, 0, neoOrbitState.width, neoOrbitState.height);
      drawSpaceBackground(ctx, neoOrbitState.width, neoOrbitState.height, ts);
      neoOrbitState.earth.angle += 0.0025;
      drawEarth(ctx, cx, cy, neoOrbitState.earth.radius, neoOrbitState.earth.angle);
      for (const a of neoOrbitState.asteroids) drawOrbitCircle(ctx, cx, cy, a.radius);
      neoOrbitState.asteroids.forEach((a, idx) => {
        a.angle += a.speed;
        const x = cx + a.radius * Math.cos(a.angle);
        const y = cy + a.radius * Math.sin(a.angle);
        a.x = x; a.y = y;
      drawAsteroid(ctx, x, y, a.size, a.angle);
        // position 3D overlays when present
        const mv = asteroidMVs[idx];
        if (mv) { mv.style.left = x + 'px'; mv.style.top = y + 'px'; }
      });
      lastTs = ts;
      neoOrbitState.rafId = requestAnimationFrame(tick);
    }

    neoOrbitState.running = true;
    cancelAnimationFrame(neoOrbitState.rafId);
    neoOrbitState.rafId = requestAnimationFrame(tick);
    try { hideLoading(); } catch (_) {}
  }

  // Recenter and rescale on resize with debounce
  (function setupNeoResizeHandler(){
    let resizeTimer = 0;
    function reflowOrbit() {
      if (!neoOrbitCanvas || !neoOrbitState.running) return;
      const astData = neoOrbitState.asteroids ? neoOrbitState.asteroids.map(a => ({ data: a.data })) : [];
      // Restart orbit with current top-asteroids to recompute sizes/centers
      if (astData.length) startNeoOrbit(astData.map(a => a.data));
      else setupOrbitCanvasSize();
    }
    window.addEventListener('resize', () => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(reflowOrbit);
    }, { passive: true });
  })();

  // Focus trap
  let lastFocused = null;
  function trapFocus(container) {
    const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handle(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    container.addEventListener('keydown', handle);
    first?.focus();
    container._trapHandler = handle;
  }
  function releaseFocus() {
    const handler = modal._trapHandler;
    if (handler) modal.removeEventListener('keydown', handler);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  // Enhanced navbar animations and effects
  function createParticleEffect(element, x, y) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: radial-gradient(circle, rgba(122,162,255,0.8), transparent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      left: ${x}px;
      top: ${y}px;
      animation: particleFloat 0.8s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 800);
  }

  // Add particle animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
      }
      100% {
        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0);
        opacity: 0;
      }
    }
    
    @keyframes navGlow {
      0%, 100% {
        box-shadow: 0 0 5px rgba(122,162,255,0.3);
      }
      50% {
        box-shadow: 0 0 20px rgba(122,162,255,0.6), 0 0 30px rgba(0,229,255,0.3);
      }
    }
    
    .nav-btn.ripple {
      animation: navGlow 0.6s ease-out;
    }
  `;
  document.head.appendChild(style);

  // Cosmic styles for filter controls (search + checkboxes + years)
  (function injectCosmicFilterStyles(){
    const id = 'cosmic-filter-styles';
    if (document.getElementById(id)) return;
    const styleEl = document.createElement('style');
    styleEl.id = id;
    styleEl.textContent = `
      /* Filter bar base - Enhanced */
      .media-filters { 
        display: grid; grid-template-columns: 1fr auto auto auto; gap: 12px; align-items: center;
        padding: 16px 20px; border-radius: 16px;
        background: radial-gradient(800px 300px at 20% -40%, rgba(122,162,255,0.12), transparent),
                    linear-gradient(180deg, rgba(8,12,28,0.9), rgba(8,12,28,0.7));
        border: 1px solid rgba(122,162,255,0.3);
        box-shadow: inset 0 0 30px rgba(0,229,255,0.08), 0 8px 32px rgba(0,0,0,0.4);
        position: relative;
        overflow: hidden;
      }
      
      .media-filters::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(45deg, transparent 30%, rgba(122,162,255,0.05) 50%, transparent 70%);
        animation: shimmer 3s ease-in-out infinite;
        pointer-events: none;
      }
      
      @keyframes shimmer {
        0%, 100% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
      }
      
      @media (max-width: 768px) {
        .media-filters { 
          grid-template-columns: 1fr; 
          gap: 10px; 
          padding: 12px 16px;
        }
      }

      /* Inputs - Enhanced */
      #mediaQuery { 
        background: linear-gradient(180deg, rgba(8,12,28,0.9), rgba(8,12,28,0.7));
        border: 1px solid rgba(122,162,255,0.35);
        color: #cfe0ff; border-radius: 12px; padding: 12px 16px; outline: none;
        box-shadow: inset 0 0 20px rgba(0,229,255,0.06), 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        font-weight: 400;
      }
      
      #mediaQuery:hover {
        border-color: rgba(122,162,255,0.5);
        box-shadow: inset 0 0 20px rgba(0,229,255,0.08), 0 6px 16px rgba(0,0,0,0.4);
      }
      
      #mediaQuery:focus {
        border-color: rgba(122,162,255,0.7);
        box-shadow: inset 0 0 20px rgba(0,229,255,0.1), 0 0 0 3px rgba(122,162,255,0.2);
      }
      
      #mediaQuery::placeholder { color: #7aa2ff99; }

      /* Date Range Picker - Enhanced */
      #dateRange {
        background: linear-gradient(180deg, rgba(8,12,28,0.9), rgba(8,12,28,0.7));
        border: 1px solid rgba(122,162,255,0.35);
        color: #cfe0ff; 
        border-radius: 12px; 
        padding: 12px 16px; 
        outline: none;
        box-shadow: inset 0 0 20px rgba(0,229,255,0.06), 0 4px 12px rgba(0,0,0,0.3);
        width: 100%; 
        min-width: 200px;
        transition: all 0.3s ease;
        font-weight: 500;
        cursor: pointer;
      }
      
      #dateRange:hover {
        border-color: rgba(122,162,255,0.5);
        box-shadow: inset 0 0 20px rgba(0,229,255,0.08), 0 6px 16px rgba(0,0,0,0.4);
        transform: translateY(-1px);
      }
      
      #dateRange:focus {
        border-color: rgba(122,162,255,0.7);
        box-shadow: inset 0 0 20px rgba(0,229,255,0.1), 0 0 0 3px rgba(122,162,255,0.2);
      }
      
      #dateRange::placeholder { color: #7aa2ff99; }
      
      /* Enhanced Media Gallery Loader - Within section */
      #marsLoader {
        position: relative;
        background: transparent;
        border: none;
        box-shadow: none;
        backdrop-filter: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        padding: 60px 20px;
        margin: 0;
        min-height: 300px;
        width: 100%;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 1;
      }
      
      #marsLoader .spinner {
        width: 60px;
        height: 60px;
        border: 4px solid rgba(122,162,255,0.2);
        border-top: 4px solid #7aa2ff;
        border-radius: 50%;
        animation: cosmicSpin 1.2s linear infinite;
        box-shadow: 0 0 30px rgba(122,162,255,0.4);
        position: relative;
      }
      
      #marsLoader .spinner::before {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border: 2px solid transparent;
        border-top: 2px solid rgba(0,229,255,0.3);
        border-radius: 50%;
        animation: cosmicSpin 1.2s linear infinite reverse;
      }
      
      @keyframes cosmicSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      #marsLoader span {
        color: #cfe0ff;
        font-size: 1.1rem;
        font-weight: 600;
        text-shadow: 0 0 15px rgba(122,162,255,0.6);
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      #marsLoader span::before {
        content: '\f002';
        font-family: 'Font Awesome 6 Free';
        font-weight: 900;
        color: #7aa2ff;
        font-size: 1rem;
        animation: pulse 1.5s ease-in-out infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
      }
      
      /* Cosmic Flatpickr Theme */
      .flatpickr-calendar {
        background: linear-gradient(180deg, rgba(8,12,28,0.95), rgba(8,12,28,0.9)) !important;
        border: 1px solid rgba(122,162,255,0.4) !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(122,162,255,0.2) !important;
        backdrop-filter: blur(10px) !important;
        font-family: 'Poppins', sans-serif !important;
      }
      
      /* Year-only mode: hide months grid and day grid, keep header with year input */
      .flatpickr-calendar.year-only .flatpickr-monthDropdown-months,
      .flatpickr-calendar.year-only .flatpickr-weekdays,
      .flatpickr-calendar.year-only .flatpickr-days,
      .flatpickr-calendar.year-only .flatpickr-weekwrapper,
      .flatpickr-calendar.year-only .dayContainer {
        display: none !important;
      }
      .flatpickr-calendar.year-only .flatpickr-months .flatpickr-month {
        width: 100% !important;
        justify-content: center !important;
      }
      .flatpickr-calendar.year-only .flatpickr-current-month .numInputWrapper {
        flex: 0 1 auto !important;
      }

      /* Custom Year Picker Dropdown */
      .year-picker-dropdown {
        background: linear-gradient(180deg, rgba(8,12,28,0.98), rgba(8,12,28,0.9));
        border: 1px solid rgba(122,162,255,0.35);
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,229,255,0.05);
        z-index: 9999;
        padding: 8px 6px;
        height: 160px; /* compact like lottery */
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior: contain;
        backdrop-filter: blur(6px);
        position: absolute;
      }
      .year-picker-dropdown::before,
      .year-picker-dropdown::after {
        content: '';
        position: sticky;
        left: 0;
        right: 0;
        height: 28px;
        pointer-events: none;
        z-index: 2;
        display: block;
      }
      .year-picker-dropdown::before {
        top: 0;
        background: linear-gradient(180deg, rgba(8,12,28,0.98), rgba(8,12,28,0));
      }
      .year-picker-dropdown::after {
        bottom: 0;
        background: linear-gradient(0deg, rgba(8,12,28,0.98), rgba(8,12,28,0));
      }
      .year-picker-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        scroll-snap-type: y mandatory;
        padding: 12px 0; /* space for center snap */
      }
      .year-picker-item {
        background: rgba(122,162,255,0.12);
        border: 1px solid rgba(122,162,255,0.35);
        color: #cfe0ff;
        border-radius: 10px;
        padding: 8px 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 600;
        width: 100%;
        text-align: center;
        scroll-snap-align: center;
      }
      .year-picker-item:hover {
        border-color: rgba(122,162,255,0.6);
        box-shadow: inset 0 0 20px rgba(0,229,255,0.12), 0 6px 16px rgba(0,0,0,0.4);
        transform: translateY(-1px);
        color: #00e5ff;
      }
      .year-picker-item.selected {
        background: linear-gradient(135deg, #7aa2ff, #00e5ff);
        color: #081c3c;
        border-color: #7aa2ff;
      }
      .year-picker-item:focus-visible {
        outline: 2px solid rgba(122,162,255,0.7);
        outline-offset: 2px;
      }
      
      .flatpickr-months {
        background: linear-gradient(90deg, rgba(122,162,255,0.1), rgba(0,229,255,0.1)) !important;
        border-bottom: 1px solid rgba(122,162,255,0.3) !important;
        border-radius: 12px 12px 0 0 !important;
      }
      
      .flatpickr-month {
        color: #cfe0ff !important;
      }
      
      .flatpickr-prev-month, .flatpickr-next-month {
        color: #7aa2ff !important;
        transition: all 0.3s ease !important;
      }
      
      .flatpickr-prev-month:hover, .flatpickr-next-month:hover {
        color: #00e5ff !important;
        background: rgba(122,162,255,0.1) !important;
        border-radius: 6px !important;
      }
      
      .flatpickr-current-month {
        color: #cfe0ff !important;
      }
      
      .flatpickr-current-month .flatpickr-monthDropdown-months {
        background: rgba(8,12,28,0.8) !important;
        border: 1px solid rgba(122,162,255,0.3) !important;
        color: #cfe0ff !important;
        border-radius: 6px !important;
      }
      
      .flatpickr-current-month input.cur-year {
        background: rgba(8,12,28,0.8) !important;
        border: 1px solid rgba(122,162,255,0.3) !important;
        color: #cfe0ff !important;
        border-radius: 6px !important;
      }
      
      .flatpickr-weekdays {
        background: rgba(122,162,255,0.05) !important;
      }
      
      .flatpickr-weekday {
        color: #7aa2ff !important;
        font-weight: 600 !important;
      }
      
      .flatpickr-day {
        color: #cfe0ff !important;
        border: 1px solid transparent !important;
        transition: all 0.3s ease !important;
      }
      
      .flatpickr-day:hover {
        background: rgba(122,162,255,0.2) !important;
        border-color: rgba(122,162,255,0.4) !important;
        color: #00e5ff !important;
      }
      
      .flatpickr-day.selected {
        background: linear-gradient(135deg, #7aa2ff, #00e5ff) !important;
        color: #081c3c !important;
        font-weight: 600 !important;
        border-color: #7aa2ff !important;
      }
      
      .flatpickr-day.startRange, .flatpickr-day.endRange {
        background: linear-gradient(135deg, #7aa2ff, #00e5ff) !important;
        color: #081c3c !important;
        font-weight: 600 !important;
        border-color: #7aa2ff !important;
      }
      
      .flatpickr-day.inRange {
        background: rgba(122,162,255,0.1) !important;
        color: #cfe0ff !important;
        border-color: rgba(122,162,255,0.2) !important;
      }
      
      .flatpickr-day.today {
        border-color: #00e5ff !important;
        color: #00e5ff !important;
        font-weight: 600 !important;
      }
      
      .flatpickr-day.today:hover {
        background: rgba(0,229,255,0.2) !important;
        border-color: #00e5ff !important;
      }

      /* Custom Cosmic Dropdown */
      .cosmic-dropdown {
        position: relative;
        min-width: 180px;
      }
      
      .dropdown-trigger {
        background: linear-gradient(180deg, rgba(8,12,28,0.9), rgba(8,12,28,0.7));
        border: 1px solid rgba(122,162,255,0.35);
        color: #cfe0ff; 
        border-radius: 12px; 
        padding: 12px 16px; 
        outline: none;
        box-shadow: inset 0 0 20px rgba(0,229,255,0.06), 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer; 
        transition: all 0.3s ease;
        font-weight: 500;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        overflow: hidden;
      }
      
      .dropdown-trigger:hover {
        border-color: rgba(122,162,255,0.6);
        box-shadow: inset 0 0 20px rgba(0,229,255,0.1), 0 6px 16px rgba(0,0,0,0.4);
        transform: translateY(-1px);
      }
      
      .dropdown-trigger:focus {
        border-color: rgba(122,162,255,0.8);
        box-shadow: inset 0 0 20px rgba(0,229,255,0.1), 0 0 0 3px rgba(122,162,255,0.2);
      }
      
      .dropdown-arrow {
        color: #7aa2ff;
        font-size: 12px;
        transition: transform 0.3s ease;
      }
      
      .dropdown-menu {
        position: fixed;
        background: linear-gradient(180deg, rgba(8,12,28,0.95), rgba(8,12,28,0.9));
        border: 1px solid rgba(122,162,255,0.4);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,229,255,0.08);
        backdrop-filter: blur(10px);
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px) scale(0.95);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        min-width: 160px;
      }
      
      .dropdown-menu.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }
      
      .dropdown-menu::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: radial-gradient(circle at 50% 0%, rgba(122,162,255,0.1), transparent 70%);
        pointer-events: none;
      }
      
      .dropdown-option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        color: #cfe0ff;
        cursor: pointer;
        transition: all 0.2s ease;
        border-bottom: 1px solid rgba(122,162,255,0.1);
        position: relative;
      }
      
      .dropdown-option:last-child {
        border-bottom: none;
      }
      
      .dropdown-option:hover {
        background: linear-gradient(90deg, rgba(122,162,255,0.15), rgba(0,229,255,0.1));
        color: #bcd0ff;
        transform: translateX(4px);
      }
      
      .dropdown-option:focus {
        background: linear-gradient(90deg, rgba(122,162,255,0.2), rgba(0,229,255,0.15));
        color: #bcd0ff;
        outline: none;
      }
      
      .option-icon {
        font-size: 14px;
        width: 20px;
        text-align: center;
        color: #7aa2ff;
        transition: all 0.2s ease;
      }
      
      .option-text {
        font-weight: 500;
        flex: 1;
      }
      
      .dropdown-option:hover .option-icon {
        color: #bcd0ff;
        transform: scale(1.1);
        filter: drop-shadow(0 0 8px rgba(122,162,255,0.6));
      }
      
      /* Search Button - Enhanced cosmic theme */
      #searchMedia {
        background: linear-gradient(135deg, rgba(122,162,255,0.8), rgba(0,229,255,0.6));
        border: 1px solid rgba(122,162,255,0.5);
        color: #0b1020;
        border-radius: 12px;
        padding: 12px 20px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
        position: relative;
        overflow: hidden;
      }
      
      #searchMedia::before {
        content: '';
        position: absolute;
        top: 0; left: -100%; width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s ease;
      }
      
      #searchMedia:hover {
        background: linear-gradient(135deg, rgba(122,162,255,0.9), rgba(0,229,255,0.7));
        border-color: rgba(122,162,255,0.7);
        box-shadow: 0 6px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3);
        transform: translateY(-2px);
      }
      
      #searchMedia:hover::before {
        left: 100%;
      }
      
      #searchMedia:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
      }
      
      #searchMedia:disabled {
        background: linear-gradient(135deg, rgba(122,162,255,0.3), rgba(0,229,255,0.2));
        border-color: rgba(122,162,255,0.2);
        color: rgba(11,16,32,0.5);
        cursor: not-allowed;
        transform: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
    `;
    document.head.appendChild(styleEl);
  })();

  // Enhanced nav button interactions
  navButtons.forEach((btn) => {
    // Add ripple effect on click
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Create multiple particles for better effect
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          createParticleEffect(btn, x, y);
        }, i * 50);
      }
      
      // Add glow animation
      btn.classList.add('ripple');
      setTimeout(() => btn.classList.remove('ripple'), 600);
      
      const route = btn.dataset.route;
      if (!route) return;
      e.preventDefault();
      const newHash = `#${route}`;
      if (location.hash !== newHash) {
        location.hash = newHash;
      }
      const target = showSectionByRoute(route);
      // next frame to ensure layout updated before measuring
      requestAnimationFrame(() => smoothScrollToSection(target));
    });

    // Enhanced hover effects
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px) scale(1.02)';
    });

    btn.addEventListener('mouseleave', () => {
      if (!btn.classList.contains('active')) {
        btn.style.transform = 'translateY(0) scale(1)';
      }
    });

    // Add keyboard navigation enhancement
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  if (refreshApodBtn) {
    refreshApodBtn.addEventListener('click', async () => {
      // Jalankan langsung tanpa animasi/loading state pada tombol
      await loadFunFact();
    });
  }

  // Pagination buttons don't need loading screen as they're fast local operations

  // API key input and save button removed from UI; keep graceful no-op handling

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.hasAttribute && target.hasAttribute('data-close')) {
      closeModal();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });

  // 🌌 Splash Screen Loading with API Integration
  async function loadWithSplashScreen() {
    console.log('[Splash Screen] Starting splash screen loading...');
    
    // ⏱ Splash guard timeout to prevent being stuck; force-hide only post-init
    if (splashGuardTimeoutId) {
      try { clearTimeout(splashGuardTimeoutId); } catch (_) {}
      splashGuardTimeoutId = null;
    }
    splashGuardTimeoutId = setTimeout(() => {
      if (!splashScreen || splashScreen.classList.contains('hide')) return;
      if (isAppInitialized) {
        console.warn('[Splash Screen] Timeout guard triggered - forcing hide (post-init)');
        // Mark guard exit to use smoother animation classes
        try { splashScreen.classList.add('guard-exit'); } catch (_) {}
        hideSplashScreen();
        const mainEl = document.querySelector('main');
        if (mainEl) mainEl.style.display = 'block';
      } else {
        console.log('[Splash Screen] Timeout guard skipped; app not initialized yet');
      }
    }, 12000);

    // Prevent animation stacking by resetting classes first
    if (splashScreen) {
      splashScreen.classList.remove('hide', 'reusable', 'active', 'animate__animated', 'animate__fadeIn', 'animate__zoomIn', 'animate__fadeOutUp');
    }
    
    // Initialize splash screen elements only once
    if (!splashStars.hasChildNodes()) {
      createSplashStars();
    }
    if (!splashParticles.hasChildNodes()) {
      createSplashParticles();
    }
    
    // Simulate loading progress with real API calls
    let progress = 0;
    const progressInterval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 8 + 2; // Random increment between 2-10
        updateProgress(Math.min(progress, 90));
      }
    }, 150);
    
    try {
      // Step 1: Initialize API key validation
      updateSplashMessage('Memvalidasi API key...', 'Memeriksa koneksi ke NASA');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Step 2: Check API key
      const isApiKeyValid = await checkApiKeyOnLoad();
      if (!isApiKeyValid) {
        clearInterval(progressInterval);
        updateProgress(100);
        updateSplashMessage('API key diperlukan', 'Silakan masukkan API key NASA');
        await new Promise(resolve => setTimeout(resolve, 2000));
        hideSplashScreen();
        return false;
      }
      
      updateProgress(25);
      updateSplashMessage('API key valid', 'Menyiapkan aplikasi...');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Step 3: Initialize app components
      updateProgress(50);
      updateSplashMessage('Menginisialisasi komponen...', 'Menyiapkan antarmuka pengguna');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 4: Load initial data
      updateProgress(75);
      updateSplashMessage('Memuat data NASA...', 'Mengambil gambar astronomi terbaru');
      
      // Initialize app components
      initNeoDefaultDates();
      if (!location.hash) location.hash = '#apod';
      const route = getRouteFromHash();
      showSectionByRoute(route);
      
      // Load Fun Fact only if not already loaded, dan pastikan Splash tidak menahan UI
      try {
        if (apodCard.hidden) {
          await loadFunFact();
        }
        hideSplashScreen();
      } catch (err) {
        console.error('[APOD] Gagal memuat data:', err);
        hideSplashScreen();
      }
      
      // Complete loading and immediately hide splash screen (no extra delay)
      clearInterval(progressInterval);
      updateProgress(100);
      updateSplashMessage('Selesai!', 'Selamat datang di Eksplorasi Angkasa');
      // Splash sudah di-hide di blok di atas
      return true;
      
    } catch (error) {
      console.error('[Splash Screen] Error during loading:', error);
      clearInterval(progressInterval);
      
      // Tambahan: Tampilkan aplikasi meskipun 504/AbortError, jangan macet di Splash
      if (String(error).includes('504')) {
        console.error('[NASA API] 504 Gateway Timeout - proceeding with fallback UI');
        updateProgress(100);
        updateSplashMessage('Data NASA sedang tidak tersedia', 'Menampilkan tampilan offline');
        setTimeout(() => hideSplashScreen(), 300);
        try { await showApodFallback(error); } catch (_) {}
        return false;
      }
      // Tampilkan error langsung jika server NASA unreachable
      if (error.name === 'AbortError' || error.message.includes('timeout') || error.message.includes('fetch')) {
        console.error('[NASA API] Server tidak merespons:', error);
        updateProgress(100);
        updateSplashMessage('Data NASA sedang tidak tersedia', 'Menampilkan tampilan offline');
        setTimeout(() => hideSplashScreen(), 300);
        try { await showApodFallback(error); } catch (_) {}
        return false;
      }
      
      updateProgress(100);
      updateSplashMessage('Terjadi kesalahan', 'Mencoba memuat ulang...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      hideSplashScreen();
      return false;
    }
  }

  // Prevent animation stacking on page load
  function preventAnimationStacking() {
    if (splashScreen) {
      // Remove all animation classes to prevent stacking
      splashScreen.classList.remove('animate__animated', 'animate__fadeIn', 'animate__zoomIn', 'animate__fadeOutUp');
      // Reset any inline styles that might interfere
      splashScreen.style.animation = '';
      splashScreen.style.transform = '';
      splashScreen.style.opacity = '';
    }
  }

  // Init
  async function init() {
    console.log('[App] Initializing application...');
    
    // Prevent animation stacking first
    preventAnimationStacking();
    
    // Setup API Key validation system first
    setupApiKeyEventListeners();
    
    // Start with splash screen loading
    try {
      const splashSuccess = await loadWithSplashScreen();
      if (!splashSuccess) {
        console.log('[App] Splash screen loading had issues; continuing with fallback init...');
        // Fallback: tetap validasi API key tanpa memblokir UI
        try { await checkApiKeyOnLoad(); } catch (_) {}
      }
    } finally {
      // Pastikan aplikasi tidak macet di Splash pada kondisi apa pun
      hideSplashScreen();
      isAppInitialized = true;
      // Jangan gunakan flag ini untuk skip di refresh berikutnya
      try { sessionStorage.setItem(SPLASH_COMPLETED_KEY, 'true'); } catch (_) {}
      splashCompleted = true;
      console.log('[App] Initialization finalized, Splash guard active');
    }
    
    console.log('[App] App initialization completed...');
    
    // restore key into input obscured
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && apiKeyInput) apiKeyInput.value = stored; // keep hidden when container is hidden

    // Build selected media types from custom dropdown - default alternating video+image
    function getSelectedMediaTypes() {
      const selected = cosmicDropdown?.dataset.value;
      if (!selected) return new Set(['image','video']); // Default: alternating images and videos
      return new Set([selected]);
    }

    async function applyAndSearch() {
      // Show loading state on search button
      if (searchMediaBtn) {
        const btnText = searchMediaBtn.querySelector('.btn-text');
        const btnSpinner = searchMediaBtn.querySelector('.btn-spinner');
        if (btnText) btnText.textContent = 'Mencari...';
        if (btnSpinner) btnSpinner.style.display = 'inline-block';
        searchMediaBtn.disabled = true;
      }
      
      try {
        const types = getSelectedMediaTypes();
      mediaState.q = (mediaQueryInput?.value || '').trim();
        mediaState.mediaTypes = types;
        
        // Handle year selection (single year or a typed custom range)
        const dateRange = dateRangeInput?.value || '';
        if (dateRange.includes(' to ')) {
          const [startDate, endDate] = dateRange.split(' to ');
          mediaState.yearStart = (startDate || '').split('-')[0];
          mediaState.yearEnd = (endDate || '').split('-')[0];
        } else if (/^\d{4}$/.test(dateRange)) {
          // Single year chosen: use the same year for start & end
          mediaState.yearStart = dateRange;
          mediaState.yearEnd = dateRange;
        } else {
          mediaState.yearStart = '';
          mediaState.yearEnd = '';
        }
        
      await resetAndSearchMedia();
      } finally {
        // Hide loading state on search button
        if (searchMediaBtn) {
          const btnText = searchMediaBtn.querySelector('.btn-text');
          const btnSpinner = searchMediaBtn.querySelector('.btn-spinner');
          if (btnText) btnText.textContent = 'Cari';
          if (btnSpinner) btnSpinner.style.display = 'none';
          searchMediaBtn.disabled = false;
        }
      }
    }

    async function applyAndSearchInit() {
      if (mediaImageCb) mediaImageCb.checked = true;
      if (mediaVideoCb) mediaVideoCb.checked = true;
      if (mediaAudioCb) mediaAudioCb.checked = true;
      await applyAndSearch();
    }
    // Initial state: no selection (shows alternating video+image by default)
    if (mediaQueryInput) mediaQueryInput.value = '';
    
    // Initialize custom year-only picker (click to select; no typing)
    if (dateRangeInput) {
      try { dateRangeInput.placeholder = 'Pilih tahun'; } catch (_) {}
      dateRangeInput.setAttribute('readonly', 'readonly');
      let yearPickerEl = null;

      function closeYearPicker() {
        if (yearPickerEl && yearPickerEl.parentNode) {
          yearPickerEl.parentNode.removeChild(yearPickerEl);
        }
        yearPickerEl = null;
        document.removeEventListener('click', handleOutsideClick, true);
        window.removeEventListener('resize', closeYearPicker);
        document.removeEventListener('keydown', handleEsc, true);
      }

      function handleOutsideClick(ev) {
        if (!yearPickerEl) return;
        if (ev.target === dateRangeInput) return;
        if (!yearPickerEl.contains(ev.target)) closeYearPicker();
      }

      function handleEsc(ev) {
        if (ev.key === 'Escape') closeYearPicker();
      }

      function openYearPicker() {
        closeYearPicker();
        const rect = dateRangeInput.getBoundingClientRect();
        yearPickerEl = document.createElement('div');
        yearPickerEl.className = 'year-picker-dropdown';
        const startYear = 1920;
        const currentYear = new Date().getFullYear();
        const selectedYear = (dateRangeInput.value && /^\d{4}$/.test(dateRangeInput.value))
          ? parseInt(dateRangeInput.value, 10)
          : null;
        const list = document.createElement('div');
        list.className = 'year-picker-list';
        for (let y = currentYear; y >= startYear; y--) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'year-picker-item' + (selectedYear === y ? ' selected' : '');
          btn.textContent = String(y);
          btn.setAttribute('data-year', String(y));
          btn.addEventListener('click', () => {
            dateRangeInput.value = String(y);
            closeYearPicker();
          });
          list.appendChild(btn);
        }
        yearPickerEl.appendChild(list);

        // Position below input
        const top = Math.round(window.scrollY + rect.bottom + 6);
        const left = Math.round(window.scrollX + rect.left);
        yearPickerEl.style.position = 'absolute';
        yearPickerEl.style.top = top + 'px';
        yearPickerEl.style.left = left + 'px';
        yearPickerEl.style.width = Math.max(rect.width, 200) + 'px';
        document.body.appendChild(yearPickerEl);

        // Keyboard navigation: Up/Down arrows, Enter to select
        yearPickerEl.addEventListener('keydown', (e) => {
          const items = Array.from(yearPickerEl.querySelectorAll('.year-picker-item'));
          const active = document.activeElement;
          const idx = items.indexOf(active);
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = items[Math.min(items.length - 1, idx + 1) || 0];
            if (next) next.focus({ preventScroll: false });
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = items[Math.max(0, idx - 1) || 0];
            if (prev) prev.focus({ preventScroll: false });
          } else if (e.key === 'Enter' && active && active.classList.contains('year-picker-item')) {
            e.preventDefault();
            active.click();
          }
        });

        // Auto-scroll to the selected/current year
        const target = yearPickerEl.querySelector('.year-picker-item.selected') || yearPickerEl.querySelector('.year-picker-item');
        if (target) {
          // center approximately: scroll so target is centered within 160px height
          const containerRect = yearPickerEl.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          const delta = (targetRect.top + targetRect.height / 2) - (containerRect.top + containerRect.height / 2);
          yearPickerEl.scrollTop += delta;
          target.focus({ preventScroll: true });
        }

        // Close handlers
        setTimeout(() => {
          document.addEventListener('click', handleOutsideClick, true);
          window.addEventListener('resize', closeYearPicker);
          document.addEventListener('keydown', handleEsc, true);
        }, 0);
      }

      dateRangeInput.addEventListener('click', openYearPicker);
      dateRangeInput.addEventListener('focus', openYearPicker);
    }
    
    // Load initial data on first visit (like before)
    await applyAndSearch();
    if (searchMediaBtn) searchMediaBtn.addEventListener('click', async () => { await applyAndSearch(); });
    if (mediaPrevBtn) mediaPrevBtn.addEventListener('click', async () => {
      if (mediaState.logicalPage > 1) {
        mediaState.logicalPage -= 1;
        renderMediaPage();
      }
    });
    if (mediaNextBtn) mediaNextBtn.addEventListener('click', async () => {
      const target = mediaState.logicalPage + 1;
      await ensureMediaItemsForLogicalPage(target);
      mediaState.logicalPage = target;
      renderMediaPage();
    });
    // Remove auto-search from input field - only search when button is clicked
    
    // Custom dropdown functionality
    if (dropdownTrigger && dropdownMenu) {
      let isOpen = false;
      let isPointerOverMenu = false;
      
      const toggleDropdown = () => {
        isOpen = !isOpen;
        
        if (isOpen) {
          // Calculate position for fixed dropdown
          const triggerRect = dropdownTrigger.getBoundingClientRect();
          dropdownMenu.style.top = (triggerRect.bottom + 4) + 'px';
          dropdownMenu.style.left = triggerRect.left + 'px';
          dropdownMenu.style.width = triggerRect.width + 'px';
          dropdownMenu.setAttribute('aria-hidden', 'false');
        } else {
          dropdownMenu.setAttribute('aria-hidden', 'true');
        }
        
        dropdownMenu.classList.toggle('show', isOpen);
        dropdownTrigger.setAttribute('aria-expanded', isOpen);
        const arrowIcon = dropdownTrigger.querySelector('.dropdown-arrow i');
        if (arrowIcon) {
          arrowIcon.className = isOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
        }
      };
      
      const closeDropdown = () => {
        isOpen = false;
        dropdownMenu.classList.remove('show');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
        dropdownMenu.setAttribute('aria-hidden', 'true');
        const arrowIcon = dropdownTrigger.querySelector('.dropdown-arrow i');
        if (arrowIcon) {
          arrowIcon.className = 'fas fa-chevron-down';
        }
        // Remove focus from dropdown options
        const focusedOption = dropdownMenu.querySelector('.dropdown-option:focus');
        if (focusedOption) {
          focusedOption.blur();
        }
      };
      
      const selectOption = (option) => {
        const value = option.dataset.value;
        const text = option.querySelector('.option-text').textContent;
        
        cosmicDropdown.dataset.value = value;
        dropdownText.textContent = text;
        closeDropdown();
        // Don't auto-search, wait for user to click search button
      };
      
      dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
      });
      
      dropdownMenu.addEventListener('click', (e) => {
        const option = e.target.closest('.dropdown-option');
        if (option) {
          selectOption(option);
        }
      });

      // Track pointer presence over dropdown to decide scroll-close behavior
      dropdownMenu.addEventListener('pointerenter', () => { isPointerOverMenu = true; });
      dropdownMenu.addEventListener('pointerleave', () => { isPointerOverMenu = false; });
      
      // Keyboard navigation
      dropdownTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleDropdown();
        }
      });
      
      dropdownMenu.addEventListener('keydown', (e) => {
        const options = Array.from(dropdownMenu.querySelectorAll('.dropdown-option'));
        const currentIndex = options.indexOf(document.activeElement);
        
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % options.length;
            options[nextIndex].focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
            options[prevIndex].focus();
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            selectOption(document.activeElement);
            break;
          case 'Escape':
            closeDropdown();
            dropdownTrigger.focus();
            break;
        }
      });
      
      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!cosmicDropdown.contains(e.target)) {
          closeDropdown();
        }
      });
      
      // Reposition dropdown on window resize
      window.addEventListener('resize', () => {
        if (isOpen) {
          const triggerRect = dropdownTrigger.getBoundingClientRect();
          dropdownMenu.style.top = (triggerRect.bottom + 4) + 'px';
          dropdownMenu.style.left = triggerRect.left + 'px';
          dropdownMenu.style.width = triggerRect.width + 'px';
        }
      });
      
      // Close or reposition on window scroll
      window.addEventListener('scroll', () => {
        if (!isOpen) return;
        if (!isPointerOverMenu) {
          closeDropdown();
          return;
        }
        const triggerRect = dropdownTrigger.getBoundingClientRect();
        dropdownMenu.style.top = (triggerRect.bottom + 4) + 'px';
        dropdownMenu.style.left = triggerRect.left + 'px';
      }, { passive: true });
    }

    // Default NEO: load Browse mode without date filter
    await loadNeoBrowse(0);

    // NEO paging controls removed along with buttons
    // Browse button removed; keep guard in case legacy markup appears
    if (loadNeoBrowseBtn) loadNeoBrowseBtn.addEventListener('click', async () => { await loadNeoBrowse(0); });

    // handle hash routing
    window.addEventListener('hashchange', () => {
      const r = getRouteFromHash();
      const target = showSectionByRoute(r);
      // Only load APOD if it's not already loaded or if it's the first time
      if (r === 'apod' && apodCard.hidden) {
        loadFunFact();
      }
      // media and neo load on demand via user actions
      requestAnimationFrame(() => smoothScrollToSection(target));
    });

    // Scrollspy + header behavior (always visible; compact/solid on scroll)
    const header = document.querySelector('.app-header');
    let ticking = false;
    let lastY = window.scrollY || 0;
    const SCROLLED_THRESHOLD = 8; // apply scrolled state quickly
    const COMPACT_THRESHOLD = 120; // compact after some scroll

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY || 0;

        // Header visual states
        if (header) {
          // Solid background once scrolled a bit
          header.classList.toggle('scrolled', currentY > SCROLLED_THRESHOLD);
          // Compact after bigger threshold
          header.classList.toggle('compact', currentY > COMPACT_THRESHOLD);
          // Always keep header visible
          header.classList.remove('hide');
        }

        // Scrollspy: update active nav and hash while scrolling
        const offset = (header && header.offsetHeight) ? header.offsetHeight : 0;
        const sections = [
          { el: apodSection, route: 'apod' },
          { el: marsSection, route: 'media' },
          { el: neoSection, route: 'neo' },
        ];
        let best = null;
        for (const s of sections) {
          if (!s.el) continue;
          const rect = s.el.getBoundingClientRect();
          const top = rect.top - offset;
          const score = top >= -200 ? Math.abs(top) : Math.abs(top) + 1000;
          if (!best || score < best.score) best = { route: s.route, el: s.el, score };
        }
        if (best) {
          showSectionByRoute(best.route);
          const newHash = `#${best.route}`;
          if (location.hash !== newHash) {
            history.replaceState(null, '', newHash);
          }
        }

        lastY = currentY;
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initialize header state in case we load mid-scroll (e.g., browser restores position)
    if (header) header.classList.remove('hide');

    // Compute and set CSS var for header offset so main content doesn't go underneath fixed header
    function setHeaderOffset() {
      const h = header ? header.offsetHeight : 80;
      document.documentElement.style.setProperty('--header-offset', h + 'px');
    }
    setHeaderOffset();
    window.addEventListener('resize', setHeaderOffset);
    const ro = (typeof ResizeObserver !== 'undefined' && header) ? new ResizeObserver(setHeaderOffset) : null;
    if (ro && header) ro.observe(header);

    onScroll();
  }

  // Enhanced initialization with API key handling
  async function initializeApp() {
    try {
      await init();
    } catch (error) {
      console.error('[App] Initialization error:', error);
      
      // If initialization fails, show API key popup as fallback
      if (apiKeyPopup) {
        showApiKeyPopup('invalid');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', initializeApp);
  
  // Initialize Cosmic Navbar
  document.addEventListener('DOMContentLoaded', () => {
    new CosmicNavbar();
  // Wire NEO cards pagination controls after DOM ready
  if (neoCardsPrev) neoCardsPrev.addEventListener('click', () => { neoState.cardsPage = Math.max(1, neoState.cardsPage - 1); renderNeoCards(); });
  if (neoCardsNext) neoCardsNext.addEventListener('click', () => { neoState.cardsPage += 1; renderNeoCards(); });
  window.addEventListener('resize', () => { renderNeoCards(); });
  });
  
  // Make testApodConsole available globally for console testing
  window.testApodConsole = testApodConsole;
  
  // Make loading functions available globally
  window.showLoading = showLoading;
  window.hideLoading = hideLoading;
  
  // Test function for splash screen behavior
  window.testSplashScreen = function() {
    console.log('[Test] Testing splash screen behavior...');
    
    // Test 1: Show loading
    showLoading('Test Loading', 'Testing splash screen functionality', 'test');
    
    // Test 2: Hide after 3 seconds
    setTimeout(() => {
      console.log('[Test] Hiding splash screen...');
      hideLoading();
    }, 3000);
    
    // Test 3: Show again after 5 seconds
    setTimeout(() => {
      console.log('[Test] Showing splash screen again...');
      showLoading('Test Loading 2', 'Testing reuse functionality', 'test2');
      
      // Test 4: Hide again after 2 seconds
      setTimeout(() => {
        console.log('[Test] Final hide...');
        hideLoading();
        console.log('[Test] Splash screen test completed!');
      }, 2000);
    }, 5000);
  };
  
  // Test function specifically for CSS fixes
  window.testSplashScreenCSS = function() {
    console.log('[CSS Test] Testing splash screen CSS fixes...');
    
    const splashScreen = document.querySelector('#splash-screen');
    if (!splashScreen) {
      console.error('[CSS Test] Splash screen element not found!');
      return;
    }
    
    console.log('[CSS Test] Splash screen element found:', splashScreen);
    console.log('[CSS Test] Current classes:', splashScreen.className);
    console.log('[CSS Test] Computed z-index:', window.getComputedStyle(splashScreen).zIndex);
    
    // Test showing splash screen
    showLoading('CSS Test', 'Testing CSS fixes', 'css-test');
    
    setTimeout(() => {
      console.log('[CSS Test] After showLoading - classes:', splashScreen.className);
      console.log('[CSS Test] After showLoading - z-index:', window.getComputedStyle(splashScreen).zIndex);
      
      // Hide splash screen
      hideLoading();
      
      setTimeout(() => {
        console.log('[CSS Test] After hideLoading - classes:', splashScreen.className);
        console.log('[CSS Test] CSS test completed!');
      }, 1500);
    }, 1000);
  };
})();


