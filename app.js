/**
 * Cinematic Sanctuary Engine
 * - Multi-Role Auth: Yash (Admin) & Glory (VIP User)
 * - Cinema Glass Text Animation (30+ Google fonts rapid cycling)
 * - Auto-on audio & seamless looping video engine
 * - Admin Broadcast Studio with video upload & IndexedDB persistent storage
 */

(function () {
  'use strict';

  // --- Core DOM Elements ---
  const bgVideo = document.getElementById('bgVideo');
  const bgVideoBlur = document.getElementById('bgVideoBlur');
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');
  const eyeToggle = document.getElementById('eyeToggle');
  const loginBtn = document.getElementById('loginBtn');
  const loginSpinner = document.getElementById('loginSpinner');
  const toastContainer = document.getElementById('toastContainer');
  const cinematicText = document.getElementById('cinematicText');

  // Dashboard & Feed DOM Elements
  const gloryIntroScreen = document.getElementById('gloryIntroScreen');
  const introCinematicText = document.getElementById('introCinematicText');
  const introProgressBar = document.getElementById('introProgressBar');
  const introCountdownText = document.getElementById('introCountdownText');
  const gloryFeed = document.getElementById('gloryFeed');
  const reelsWrapper = document.getElementById('reelsWrapper');
  const feedSoundBtn = document.getElementById('feedSoundBtn');
  const feedSignOutBtn = document.getElementById('feedSignOutBtn');
  const feedPrevBtn = document.getElementById('feedPrevBtn');
  const feedNextBtn = document.getElementById('feedNextBtn');
  const feedCounter = document.getElementById('feedCounter');
  const feedNavControls = document.getElementById('feedNavControls');
  const videoContainer = document.getElementById('videoContainer');
  const theaterStage = document.getElementById('theaterStage');

  // Admin Studio DOM Elements
  const adminModal = document.getElementById('adminModal');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  const adminViewAsGloryBtn = document.getElementById('adminViewAsGloryBtn');
  const adminFormModeBadge = document.getElementById('adminFormModeBadge');
  const adminFormModeText = document.getElementById('adminFormModeText');
  const adminCancelEditBtn = document.getElementById('adminCancelEditBtn');
  const adminTitleInput = document.getElementById('adminTitleInput');
  const adminMsgInput = document.getElementById('adminMsgInput');
  const adminMiniGlassPreview = document.getElementById('adminMiniGlassPreview');
  const tabVideoMode = document.getElementById('tabVideoMode');
  const tabTextOnlyMode = document.getElementById('tabTextOnlyMode');
  const mediaOptionHint = document.getElementById('mediaOptionHint');
  const videoMediaPane = document.getElementById('videoMediaPane');
  const textOnlyMediaPane = document.getElementById('textOnlyMediaPane');
  const adminDropzone = document.getElementById('adminDropzone');
  const adminVideoFile = document.getElementById('adminVideoFile');
  const dropzoneMainText = document.getElementById('dropzoneMainText');
  const dropzoneSubText = document.getElementById('dropzoneSubText');
  const adminPreviewVideo = document.getElementById('adminPreviewVideo');
  const previewBadgeStatus = document.getElementById('previewBadgeStatus');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const adminSaveReelBtn = document.getElementById('adminSaveReelBtn');
  const adminSaveBtnText = document.getElementById('adminSaveBtnText');
  const adminReelsCount = document.getElementById('adminReelsCount');
  const adminReelsList = document.getElementById('adminReelsList');
  const adminRepliesCount = document.getElementById('adminRepliesCount');
  const adminClearRepliesBtn = document.getElementById('adminClearRepliesBtn');
  const adminRepliesList = document.getElementById('adminRepliesList');

  // Admin Studio Tabs & Metrics DOM Elements
  const adminStatReels = document.getElementById('adminStatReels');
  const adminStatReplies = document.getElementById('adminStatReplies');
  const adminStatLogins = document.getElementById('adminStatLogins');
  const adminStatCloud = document.getElementById('adminStatCloud');
  const adminStatCloudLabel = document.getElementById('adminStatCloudLabel');
  const tabBadgeReplies = document.getElementById('tabBadgeReplies');
  const tabBadgeLogins = document.getElementById('tabBadgeLogins');

  const tabNavReels = document.getElementById('tabNavReels');
  const tabNavReplies = document.getElementById('tabNavReplies');
  const tabNavLogins = document.getElementById('tabNavLogins');
  const tabNavCloud = document.getElementById('tabNavCloud');

  const adminTabPaneReels = document.getElementById('adminTabPaneReels');
  const adminTabPaneReplies = document.getElementById('adminTabPaneReplies');
  const adminTabPaneLogins = document.getElementById('adminTabPaneLogins');
  const adminTabPaneCloud = document.getElementById('adminTabPaneCloud');

  const adminLoginsCount = document.getElementById('adminLoginsCount');
  const adminClearLoginsBtn = document.getElementById('adminClearLoginsBtn');
  const adminLastLoginTime = document.getElementById('adminLastLoginTime');
  const adminLastLoginDevice = document.getElementById('adminLastLoginDevice');
  const adminLoginsList = document.getElementById('adminLoginsList');

  const supabaseUrlInput = document.getElementById('supabaseUrlInput');
  const supabaseKeyInput = document.getElementById('supabaseKeyInput');
  const saveSupabaseSettingsBtn = document.getElementById('saveSupabaseSettingsBtn');
  const testSupabaseSyncBtn = document.getElementById('testSupabaseSyncBtn');
  const supabaseStatusBadge = document.getElementById('supabaseStatusBadge');

  // --- Rapid 30+ Fonts Cycling Engine (Runs Immediately) ---
  const fonts = [
    ["Cinzel", "0.08em"],
    ["Bebas Neue", "0.12em"],
    ["Anton", "0.04em"],
    ["Abril Fatface", "0.02em"],
    ["Black Ops One", "0.06em"],
    ["Bodoni Moda", "0.05em"],
    ["DM Serif Display", "0.03em"],
    ["Fjalla One", "0.08em"],
    ["Great Vibes", "0.01em"],
    ["Josefin Sans", "0.12em"],
    ["Lobster", "0.01em"],
    ["Major Mono Display", "0.05em"],
    ["Montserrat", "0.08em"],
    ["Orbitron", "0.10em"],
    ["Oswald", "0.08em"],
    ["Pacifico", "0.01em"],
    ["Permanent Marker", "0.02em"],
    ["Playfair Display", "0.04em"],
    ["Poiret One", "0.10em"],
    ["Raleway", "0.09em"],
    ["Righteous", "0.06em"],
    ["Roboto Mono", "0.05em"],
    ["Rubik", "0.08em"],
    ["Russo One", "0.06em"],
    ["Space Grotesk", "0.07em"],
    ["Special Elite", "0.04em"],
    ["Unbounded", "0.08em"],
    ["Yellowtail", "0.02em"],
    ["Comfortaa", "0.06em"]
  ];

  let fontIndex = 0;

  function changeFont() {
    // ONLY cycle font animation for login page when no authenticated user is logged in
    const currentRole = localStorage.getItem('cinema_session_role');
    if (currentRole === 'admin' || currentRole === 'glory') return;

    const loginCinemaText = document.getElementById('cinematicText');
    if (!loginCinemaText) return;
    const current = fonts[fontIndex];
    const scale = 0.98 + Math.random() * 0.04;

    loginCinemaText.style.fontFamily = `"${current[0]}", sans-serif`;
    loginCinemaText.style.letterSpacing = current[1];
    loginCinemaText.style.transform = `scale(${scale})`;

    fontIndex++;
    if (fontIndex >= fonts.length) {
      fontIndex = 0;
    }
  }

  setInterval(changeFont, 50);
  changeFont();

  // --- Constants & Defaults ---
  const GLORY_INTRO_TEXT = "hi glory last msg form yash";
  const DEFAULT_ADMIN_TEXT = "hi glory last msg form yash";
  const DEFAULT_INTRO_VIDEO = "assets/love_story_1.mp4";
  const DEFAULT_ADMIN_VIDEO = "assets/love_story_1.mp4";

  // --- IndexedDB for Large Video Blobs ---
  const DB_NAME = 'CinemaVaultDB';
  const STORE_NAME = 'videos';

  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE_NAME)) {
          req.result.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  const blobUrlCache = new Map();

  async function saveVideoBlob(blobOrFile, key = 'broadcastVideo') {
    try {
      let pureBlob = blobOrFile;
      if (blobOrFile && (blobOrFile instanceof File || blobOrFile.arrayBuffer)) {
        try {
          const buffer = await blobOrFile.arrayBuffer();
          pureBlob = new Blob([buffer], { type: blobOrFile.type || 'video/mp4' });
        } catch (convErr) {
          console.warn('Buffer conversion fallback:', convErr);
          pureBlob = blobOrFile;
        }
      }
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(pureBlob, key);
        tx.oncomplete = () => {
          if (blobUrlCache.has(key)) {
            URL.revokeObjectURL(blobUrlCache.get(key));
            blobUrlCache.delete(key);
          }
          const url = URL.createObjectURL(pureBlob);
          blobUrlCache.set(key, url);
          resolve(key);
        };
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('IndexedDB save failed:', e);
      return null;
    }
  }

  async function loadVideoBlob(key = 'broadcastVideo') {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      console.warn('IndexedDB load failed:', e);
      return null;
    }
  }

  async function getObjectUrlForBlob(key = 'broadcastVideo') {
    if (!key) return null;
    if (blobUrlCache.has(key)) {
      return blobUrlCache.get(key);
    }
    const blob = await loadVideoBlob(key);
    if (blob) {
      let safeBlob = blob;
      if (blob instanceof File || blob.arrayBuffer) {
        try {
          const buffer = await blob.arrayBuffer();
          safeBlob = new Blob([buffer], { type: blob.type || 'video/mp4' });
        } catch (e) {
          safeBlob = blob;
        }
      }
      const url = URL.createObjectURL(safeBlob);
      blobUrlCache.set(key, url);
      return url;
    }
    return null;
  }

  async function deleteVideoBlob(key) {
    if (!key) return;
    if (blobUrlCache.has(key)) {
      URL.revokeObjectURL(blobUrlCache.get(key));
      blobUrlCache.delete(key);
    }
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch (e) {
      console.warn('IndexedDB delete failed:', e);
    }
  }

  // --- Video Engine (Auto-Play & Auto-Loop) ---
  function safePlayVideo(video) {
    if (!video) return;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  }

  // Initial video setup
  safePlayVideo(bgVideo);
  if (bgVideoBlur) {
    bgVideoBlur.muted = true;
    safePlayVideo(bgVideoBlur);
  }

  // --- Auto-Play Audio Engine (Zero Tap Prompts) ---
  bgVideo.muted = false;
  bgVideo.volume = 1.0;

  function activateSound() {
    if (theaterStage && !theaterStage.classList.contains('hidden')) {
      bgVideo.muted = false;
      bgVideo.volume = 1.0;
      bgVideo.play().catch(() => {});
    }
  }

  // Immediate sound playback attempt
  const initialPlay = bgVideo.play();
  if (initialPlay !== undefined) {
    initialPlay.then(() => {
      bgVideo.muted = false;
      bgVideo.volume = 1.0;
    }).catch(() => {
      // If mobile policy requires 1 gesture, start muted and silently unmute on first touch
      bgVideo.muted = true;
      bgVideo.play().catch(() => {});
    });
  }

  // Silently unlock sound at full volume on ANY user touch or movement
  ['touchstart', 'touchend', 'touchmove', 'pointerdown', 'pointerup', 'pointermove', 'mousedown', 'click', 'keydown', 'scroll'].forEach(evt => {
    window.addEventListener(evt, activateSound, { passive: true, once: true });
    document.addEventListener(evt, activateSound, { passive: true, once: true });
  });

  usernameInput.addEventListener('focus', activateSound);
  passwordInput.addEventListener('focus', activateSound);

  // --- Cinema Glass Text Management ---
  function updateCinemaDisplay(text) {
    if (!cinematicText) return;
    cinematicText.textContent = text;
    cinematicText.setAttribute('data-text', text);
  }

  // --- Dynamic Video Engine ---
  let activeCustomBlobUrl = null;

  function setBothVideosSource(src) {
    if (!src) return;
    const currentSrc = bgVideo.currentSrc || bgVideo.src;
    if (!currentSrc.endsWith(src) && bgVideo.src !== src) {
      bgVideo.src = src;
      if (bgVideoBlur) bgVideoBlur.src = src;
      bgVideo.load();
      if (bgVideoBlur) bgVideoBlur.load();
    }
    safePlayVideo(bgVideo);
    if (bgVideoBlur) safePlayVideo(bgVideoBlur);
    activateSound();
  }

  function playIntroVideo() {
    setBothVideosSource(DEFAULT_INTRO_VIDEO);
  }

  async function applyAdminUploadedVideo() {
    const hasCustom = localStorage.getItem('cinema_has_custom_video');
    if (hasCustom === 'true') {
      const blob = await loadVideoBlob();
      if (blob) {
        if (activeCustomBlobUrl) URL.revokeObjectURL(activeCustomBlobUrl);
        activeCustomBlobUrl = URL.createObjectURL(blob);
        setBothVideosSource(activeCustomBlobUrl);
        return;
      }
    }

    const preset = localStorage.getItem('cinema_active_video') || DEFAULT_ADMIN_VIDEO;
    setBothVideosSource(preset);
  }

  // --- Toast Notification Center ---
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = '✦';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `<span style="font-weight:700;">${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('visible'), 20);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 350);
    }, 3000);
  }

  function shakeForm() {
    loginForm.classList.remove('shake-form');
    void loginForm.offsetWidth;
    loginForm.classList.add('shake-form');
  }

  // --- Password Peek Toggle ---
  eyeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const showIcon = eyeToggle.querySelector('.eye-show');
    const hideIcon = eyeToggle.querySelector('.eye-hide');

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      showIcon.classList.add('hidden');
      hideIcon.classList.remove('hidden');
    } else {
      passwordInput.type = 'password';
      showIcon.classList.remove('hidden');
      hideIcon.classList.add('hidden');
    }
  });

  // --- Glory Full-Screen N-Reels Controller & Admin Studio Engine ---
  let feedMuted = false;
  let currentFeedIndex = 1;
  let feedObjectUrls = [];
  let reelsObserver = null;
  let reelControlsInitialized = false;

  // Editor State
  let editingReelId = null;
  let selectedMediaType = 'video'; // 'video' | 'textonly'
  let stagedCustomVideoBlob = null;
  let activePresetSrc = 'assets/love_story_1.mp4';

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Reel Storage Manager (Up to N Reels) ---
  function getReels() {
    try {
      const raw = localStorage.getItem('cinema_admin_reels');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading reels:', e);
    }
    // Out-of-the-box default lineup with 2 reels ready for Instagram-style 1-by-1 scrolling
    return [
      {
        id: 'reel_default_1',
        title: 'Special Screening from Yash ❤️',
        text: localStorage.getItem('cinema_admin_uploaded_text') || DEFAULT_ADMIN_TEXT,
        mediaType: 'video',
        videoType: 'preset',
        videoKey: '',
        presetSrc: 'assets/love_story_1.mp4',
        createdAt: Date.now() - 120000
      },
      {
        id: 'reel_default_2',
        title: 'Our Next Chapter ✦ Yash',
        text: 'always with you glory ✨',
        mediaType: 'video',
        videoType: 'preset',
        videoKey: '',
        presetSrc: 'assets/love_story_2.mp4',
        createdAt: Date.now()
      }
    ];
  }

  function saveReels(reels) {
    localStorage.setItem('cinema_admin_reels', JSON.stringify(reels));
    localStorage.setItem('cinema_broadcast_time', Date.now().toString());
    if (reels.length > 0) {
      localStorage.setItem('cinema_admin_uploaded_text', reels[0].text);
    }
  }

  // --- Admin Studio Media Selector (Video is Optional!) ---
  function setMediaMode(mode) {
    selectedMediaType = mode;
    if (tabVideoMode && tabTextOnlyMode) {
      tabVideoMode.classList.toggle('active', mode === 'video');
      tabTextOnlyMode.classList.toggle('active', mode === 'textonly');
    }
    if (videoMediaPane && textOnlyMediaPane) {
      videoMediaPane.classList.toggle('hidden', mode === 'textonly');
      textOnlyMediaPane.classList.toggle('hidden', mode === 'video');
    }
    if (mediaOptionHint) {
      mediaOptionHint.textContent = mode === 'video' ? '🎬 Video Reel Mode' : '✍️ Text-Only Luxury Cinema Card';
    }
  }

  if (tabVideoMode) tabVideoMode.addEventListener('click', () => setMediaMode('video'));
  if (tabTextOnlyMode) tabTextOnlyMode.addEventListener('click', () => setMediaMode('textonly'));

  // --- Live Mini Cinema Glass Preview in Admin Studio ---
  function updateLiveGlassPreview() {
    if (!adminMiniGlassPreview || !adminMsgInput) return;
    const text = adminMsgInput.value.trim() || 'ENTER TEXT FOR GLORY';
    adminMiniGlassPreview.textContent = text;
    adminMiniGlassPreview.setAttribute('data-text', text);
  }

  if (adminMsgInput) {
    adminMsgInput.addEventListener('input', updateLiveGlassPreview);
  }

  // --- Preset Pickers ---
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stagedCustomVideoBlob = null;
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePresetSrc = btn.getAttribute('data-src');

      if (adminPreviewVideo) {
        adminPreviewVideo.src = activePresetSrc;
        adminPreviewVideo.load();
        adminPreviewVideo.play().catch(() => {});
      }
      if (previewBadgeStatus) {
        previewBadgeStatus.textContent = 'Preview: ' + btn.textContent.trim();
      }
      if (dropzoneMainText) {
        dropzoneMainText.textContent = 'Tap or drop 1 or multiple video files';
      }
      showToast(`Selected preset: ${btn.textContent.trim()}`, 'info');
    });
  });

  // --- Video File Upload (Drag & Drop or Multi-File Picker) ---
  async function handleVideoFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).filter(f => f.type.startsWith('video/'));

    if (files.length === 0) {
      showToast('Please select valid video files (MP4, WebM, MOV).', 'error');
      return;
    }

    // Multiple videos selected at once -> BATCH CREATE SEPARATE REELS!
    if (files.length > 1) {
      showToast(`⚡ Batch processing ${files.length} videos into reels...`, 'info');
      let reels = getReels();
      let addedCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const newId = 'reel_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        const videoKey = 'reel_video_' + newId;

        try {
          await saveVideoBlob(file, videoKey);
          const cleanTitle = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());

          const customText = (adminMsgInput ? adminMsgInput.value.trim() : '') || 'hi glory last msg form yash';

          reels.push({
            id: newId,
            title: cleanTitle || `Special Screening #${reels.length + 1}`,
            text: customText,
            mediaType: 'video',
            videoType: 'blob',
            videoKey: videoKey,
            presetSrc: '',
            createdAt: Date.now() + i
          });
          addedCount++;
        } catch (err) {
          console.error('Failed to save batch video:', file.name, err);
        }
      }

      saveReels(reels);
      renderAdminReelsManager();
      await renderGloryFeed();
      showToast(`✓ Batch added ${addedCount} reels! Glory feed now has ${reels.length} reels.`, 'success');
      return;
    }

    // Single video selected
    const file = files[0];
    showToast(`Loading video ${file.name}...`, 'info');
    stagedCustomVideoBlob = file;

    const previewUrl = URL.createObjectURL(file);
    if (adminPreviewVideo) {
      adminPreviewVideo.src = previewUrl;
      adminPreviewVideo.load();
      adminPreviewVideo.play().catch(() => {});
    }

    presetBtns.forEach(b => b.classList.remove('active'));
    if (dropzoneMainText) dropzoneMainText.textContent = '✓ Staged: ' + file.name;
    if (dropzoneSubText) dropzoneSubText.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB ready · Tap "${editingReelId ? 'Save Changes' : 'Add Reel to Feed'}" to apply`;
    if (previewBadgeStatus) previewBadgeStatus.textContent = 'Custom: ' + file.name;

    showToast(`Video "${file.name}" staged! Tap Add Reel to save.`, 'success');
  }

  if (adminVideoFile) {
    adminVideoFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleVideoFiles(e.target.files);
      }
    });
  }

  if (adminDropzone) {
    ['dragenter', 'dragover'].forEach(evt => {
      adminDropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        adminDropzone.style.borderColor = '#ff3366';
      });
    });
    ['dragleave', 'drop'].forEach(evt => {
      adminDropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        adminDropzone.style.borderColor = '';
      });
    });
    adminDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleVideoFiles(e.dataTransfer.files);
      }
    });
  }

  // --- Admin Reels Lineup Manager (N Reels) ---
  function renderAdminReelsManager() {
    if (!adminReelsList) return;
    const reels = getReels();
    if (adminReelsCount) {
      adminReelsCount.textContent = `${reels.length} Reel${reels.length > 1 ? 's' : ''}`;
    }

    adminReelsList.innerHTML = '';

    reels.forEach((reel, index) => {
      const isEditing = editingReelId === reel.id;
      const item = document.createElement('div');
      item.className = `admin-reel-item ${isEditing ? 'is-editing' : ''}`;

      const timeStr = new Date(reel.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const isVideo = reel.mediaType === 'video';

      item.innerHTML = `
        <div class="admin-reel-item-info">
          <div class="admin-reel-item-title-row">
            <span class="admin-reel-num-badge">#${index + 1}</span>
            <span class="admin-reel-item-title">${escapeHtml(reel.title || 'Reel #' + (index + 1))}</span>
          </div>
          <div class="admin-reel-item-meta">
            <span class="admin-reel-type-badge ${isVideo ? 'type-video' : 'type-text'}">${isVideo ? '🎬 Video' : '✍️ Text-Only'}</span>
            <span>· "${escapeHtml(reel.text.length > 28 ? reel.text.substring(0, 28) + '...' : reel.text)}" · ${timeStr}</span>
          </div>
        </div>
        <div class="admin-reel-actions">
          <button type="button" class="admin-reel-action-btn admin-reel-edit-btn" onclick="if(window.__startEditingReel){window.__startEditingReel('${reel.id}');}">
            <span>✏️ Edit</span>
          </button>
          <button type="button" class="admin-reel-action-btn admin-reel-delete-btn" onclick="if(window.__deleteReel){window.__deleteReel('${reel.id}');}">
            <span>🗑️ Delete</span>
          </button>
        </div>
      `;

      // Also hook programmatically
      const editBtn = item.querySelector('.admin-reel-edit-btn');
      if (editBtn) {
        editBtn.onclick = (e) => {
          e.stopPropagation();
          startEditingReel(reel.id);
        };
      }

      const delBtn = item.querySelector('.admin-reel-delete-btn');
      if (delBtn) {
        delBtn.onclick = (e) => {
          e.stopPropagation();
          deleteReel(reel.id);
        };
      }

      adminReelsList.appendChild(item);
    });
  }

  // --- Glory Direct Replies Management ---
  function getGloryReplies() {
    try {
      const raw = localStorage.getItem('cinema_glory_replies');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading replies:', e);
    }
    return [];
  }

  function saveGloryReplies(replies) {
    localStorage.setItem('cinema_glory_replies', JSON.stringify(replies));
    localStorage.setItem('cinema_glory_replies_time', Date.now().toString());
  }

  function renderAdminReplies() {
    if (!adminRepliesList) return;
    const replies = getGloryReplies();
    if (adminRepliesCount) {
      adminRepliesCount.textContent = `${replies.length} Message${replies.length !== 1 ? 's' : ''}`;
    }

    if (replies.length === 0) {
      adminRepliesList.innerHTML = `
        <div class="admin-replies-empty">
          <span style="font-weight:600; font-size:0.86rem; color:#fff;">No replies from Glory yet.</span>
          <p style="margin:4px 0 0; font-size:0.76rem; color:rgba(255,255,255,0.4);">When Glory sends a reply from her reel feed, it will appear here in real time.</p>
        </div>
      `;
      return;
    }

    adminRepliesList.innerHTML = '';
    replies.forEach((rep) => {
      const card = document.createElement('div');
      card.className = 'admin-reply-card';
      const timeStr = new Date(rep.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      card.innerHTML = `
        <div class="admin-reply-content">
          <div class="admin-reply-reel-badge-row">
            <div class="admin-reply-reel-pill">
              <span class="reel-pill-icon">🎬</span>
              <span class="reel-pill-num">Replied on Reel #${rep.reelIndex}</span>
              <span class="reel-pill-divider">·</span>
              <span class="reel-pill-title">${escapeHtml(rep.reelTitle || 'Exclusive Reel')}</span>
            </div>
            <span class="admin-reply-time">${timeStr}</span>
          </div>

          ${rep.reelText ? `
          <div class="admin-reply-reel-quote">
            <span class="quote-tag">On Reel Quote:</span>
            <span class="quote-text">“${escapeHtml(rep.reelText.length > 50 ? rep.reelText.slice(0, 50) + '...' : rep.reelText)}”</span>
          </div>
          ` : ''}

          <div class="admin-reply-body">
            <span class="admin-reply-from-badge">Glory replied:</span>
            <div class="admin-reply-text">“${escapeHtml(rep.text)}”</div>
          </div>
        </div>
        <button type="button" class="admin-reply-delete-btn" title="Delete message" data-id="${rep.id}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;

      const delBtn = card.querySelector('.admin-reply-delete-btn');
      if (delBtn) {
        delBtn.onclick = (e) => {
          e.stopPropagation();
          deleteGloryReply(rep.id);
        };
      }

      adminRepliesList.appendChild(card);
    });
  }

  function deleteGloryReply(id) {
    let replies = getGloryReplies();
    replies = replies.filter(r => r.id !== id);
    saveGloryReplies(replies);
    renderAdminReplies();
    showToast('Reply removed.', 'info');
  }

  function clearAllGloryReplies() {
    saveGloryReplies([]);
    renderAdminReplies();
    showToast('Glory inbox cleared.', 'info');
  }

  if (adminClearRepliesBtn) {
    adminClearRepliesBtn.onclick = clearAllGloryReplies;
  }

  // --- Device & User-Agent Descriptor for Audit Logs ---
  function getDeviceDescriptor() {
    const ua = navigator.userAgent || '';
    let os = 'Device';
    if (/iPhone/i.test(ua)) os = 'iPhone iOS';
    else if (/iPad/i.test(ua)) os = 'iPad iOS';
    else if (/Android/i.test(ua)) os = 'Android Mobile';
    else if (/Macintosh/i.test(ua)) os = 'Mac OS';
    else if (/Windows/i.test(ua)) os = 'Windows PC';
    else if (/Linux/i.test(ua)) os = 'Linux';

    let browser = 'Browser';
    if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Edg/i.test(ua)) browser = 'Edge';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';

    return `${os} · ${browser}`;
  }

  function formatRelativeTime(timestamp) {
    if (!timestamp) return 'recently';
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  // --- Glory Login Audits & History ---
  function getGloryLogins() {
    try {
      const raw = localStorage.getItem('cinema_glory_logins');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading logins:', e);
    }
    return [];
  }

  function saveGloryLogins(logins) {
    localStorage.setItem('cinema_glory_logins', JSON.stringify(logins));
    localStorage.setItem('cinema_glory_logins_time', Date.now().toString());
  }

  async function recordGloryLogin(username = 'glory') {
    const newLogin = {
      id: 'login_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      username: username,
      device_info: getDeviceDescriptor(),
      logged_in_at: new Date().toISOString(),
      timestamp: Date.now()
    };

    let logins = getGloryLogins();
    logins.unshift(newLogin);
    if (logins.length > 50) logins = logins.slice(0, 50);
    saveGloryLogins(logins);

    // Sync to Supabase in background if configured
    if (supabaseClient) {
      try {
        await supabaseClient.from('glory_logins').insert([
          {
            id: newLogin.id,
            username: newLogin.username,
            device_info: newLogin.device_info,
            logged_in_at: newLogin.logged_in_at
          }
        ]);
      } catch (err) {
        console.warn('Supabase login audit insert:', err);
      }
    }
  }

  function renderGloryLogins() {
    const logins = getGloryLogins();
    if (adminLoginsCount) {
      adminLoginsCount.textContent = `${logins.length} Session${logins.length !== 1 ? 's' : ''}`;
    }

    if (adminLastLoginTime && adminLastLoginDevice) {
      if (logins.length > 0) {
        const last = logins[0];
        const dateObj = new Date(last.timestamp || last.logged_in_at);
        const rel = formatRelativeTime(last.timestamp || Date.parse(last.logged_in_at));
        adminLastLoginTime.textContent = `${dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${rel})`;
        adminLastLoginDevice.textContent = `Device: ${last.device_info || 'Mobile/Web'}`;
      } else {
        adminLastLoginTime.textContent = 'Awaiting first session';
        adminLastLoginDevice.textContent = 'No recorded activity yet';
      }
    }

    if (!adminLoginsList) return;

    if (logins.length === 0) {
      adminLoginsList.innerHTML = `
        <div class="admin-replies-empty">
          <span style="font-weight:600; font-size:0.86rem; color:#fff;">No Glory logins recorded yet.</span>
          <p style="margin:4px 0 0; font-size:0.76rem; color:rgba(255,255,255,0.4);">Every time Glory logs into her feed, the exact date, time, and device will be cataloged here.</p>
        </div>
      `;
      return;
    }

    adminLoginsList.innerHTML = '';
    logins.forEach(item => {
      const card = document.createElement('div');
      card.className = 'admin-login-item-card';
      const d = new Date(item.timestamp || item.logged_in_at);
      const dateFormatted = d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      const timeFormatted = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const relTime = formatRelativeTime(item.timestamp || Date.parse(item.logged_in_at));

      card.innerHTML = `
        <div class="login-item-left">
          <div class="login-item-icon">✨</div>
          <div class="login-item-body">
            <span class="login-item-user">Glory Signed In</span>
            <span class="login-item-time">${dateFormatted} · ${timeFormatted}</span>
          </div>
        </div>
        <div class="login-item-right">
          <span class="login-item-rel">${relTime}</span>
          <span class="login-item-device">${escapeHtml(item.device_info || 'Web App')}</span>
        </div>
      `;
      adminLoginsList.appendChild(card);
    });
  }

  function clearAllGloryLogins() {
    saveGloryLogins([]);
    renderGloryLogins();
    updateAdminMetrics();
    showToast('Glory login history cleared.', 'info');
  }

  if (adminClearLoginsBtn) {
    adminClearLoginsBtn.onclick = clearAllGloryLogins;
  }

  // --- Real-Time Studio Metric Cards ---
  function updateAdminMetrics() {
    const reels = getReels();
    const replies = getGloryReplies();
    const logins = getGloryLogins();

    if (adminStatReels) adminStatReels.textContent = reels.length;
    if (adminStatReplies) adminStatReplies.textContent = replies.length;
    if (adminStatLogins) adminStatLogins.textContent = logins.length;
    if (tabBadgeReplies) tabBadgeReplies.textContent = replies.length;
    if (tabBadgeLogins) tabBadgeLogins.textContent = logins.length;

    if (adminStatCloud && adminStatCloudLabel) {
      if (supabaseClient) {
        adminStatCloud.textContent = 'Active';
        adminStatCloud.style.color = '#10b981';
        adminStatCloudLabel.textContent = 'Supabase Cloud';
      } else {
        adminStatCloud.textContent = 'Ready';
        adminStatCloud.style.color = '#fcd5b5';
        adminStatCloudLabel.textContent = 'Local Cache';
      }
    }
  }

  // --- Studio Tab Navigation ---
  function switchAdminTab(targetTab) {
    const tabs = [
      { id: 'reels', btn: tabNavReels, pane: adminTabPaneReels },
      { id: 'replies', btn: tabNavReplies, pane: adminTabPaneReplies },
      { id: 'logins', btn: tabNavLogins, pane: adminTabPaneLogins },
      { id: 'cloud', btn: tabNavCloud, pane: adminTabPaneCloud }
    ];

    tabs.forEach(t => {
      const isTarget = t.id === targetTab;
      if (t.btn) t.btn.classList.toggle('active', isTarget);
      if (t.pane) t.pane.classList.toggle('hidden', !isTarget);
    });

    if (targetTab === 'reels') renderAdminReelsManager();
    if (targetTab === 'replies') renderAdminReplies();
    if (targetTab === 'logins') renderGloryLogins();
    if (targetTab === 'cloud') loadRenderEnvConfig();
    updateAdminMetrics();
  }

  if (tabNavReels) tabNavReels.addEventListener('click', () => switchAdminTab('reels'));
  if (tabNavReplies) tabNavReplies.addEventListener('click', () => switchAdminTab('replies'));
  if (tabNavLogins) tabNavLogins.addEventListener('click', () => switchAdminTab('logins'));
  if (tabNavCloud) tabNavCloud.addEventListener('click', () => switchAdminTab('cloud'));

  // --- Supabase Cloud & Deployment Suite Integration ---
  let supabaseClient = null;

  function getSupabaseFactory() {
    if (typeof window !== 'undefined') {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        return window.supabase.createClient;
      }
      if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
        return supabase.createClient;
      }
    }
    return null;
  }

  function initSupabase(overrideBadge) {
    let savedUrl = (localStorage.getItem('supabase_project_url') || '').trim();
    let savedKey = (localStorage.getItem('supabase_anon_key') || '').trim();

    // Clean any accidentally pasted quotes or trailing slashes
    savedUrl = savedUrl.replace(/^['"]|['"]$/g, '').replace(/\/+$/, '');
    savedKey = savedKey.replace(/^['"]|['"]$/g, '');

    if (supabaseUrlInput) supabaseUrlInput.value = savedUrl;
    if (supabaseKeyInput) supabaseKeyInput.value = savedKey;

    const createClientFn = getSupabaseFactory();

    if (savedUrl && savedKey) {
      if (createClientFn) {
        try {
          supabaseClient = createClientFn(savedUrl, savedKey);
          if (supabaseStatusBadge) {
            supabaseStatusBadge.textContent = overrideBadge || 'Cloud Connected';
            supabaseStatusBadge.style.color = '#10b981';
          }
          updateAdminMetrics();
          return true;
        } catch (err) {
          console.warn('Supabase SDK initialization warning:', err);
        }
      }

      // REST API fallback client if SDK script is blocked or delayed
      supabaseClient = {
        from: (tableName) => ({
          select: async (cols = '*') => {
            try {
              const res = await fetch(`${savedUrl}/rest/v1/${tableName}?select=${encodeURIComponent(cols)}`, {
                headers: {
                  'apikey': savedKey,
                  'Authorization': `Bearer ${savedKey}`
                }
              });
              if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
              const data = await res.json();
              return { data, error: null };
            } catch (err) {
              return { data: null, error: err };
            }
          },
          insert: async (rows) => {
            try {
              const res = await fetch(`${savedUrl}/rest/v1/${tableName}`, {
                method: 'POST',
                headers: {
                  'apikey': savedKey,
                  'Authorization': `Bearer ${savedKey}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'return=minimal'
                },
                body: JSON.stringify(rows)
              });
              if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
              return { data: null, error: null };
            } catch (err) {
              return { data: null, error: err };
            }
          },
          upsert: async (row) => {
            try {
              const res = await fetch(`${savedUrl}/rest/v1/${tableName}`, {
                method: 'POST',
                headers: {
                  'apikey': savedKey,
                  'Authorization': `Bearer ${savedKey}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(row)
              });
              if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
              return { data: null, error: null };
            } catch (err) {
              return { data: null, error: err };
            }
          }
        })
      };

      if (supabaseStatusBadge) {
        supabaseStatusBadge.textContent = overrideBadge || 'Cloud Connected (REST)';
        supabaseStatusBadge.style.color = '#10b981';
      }
      updateAdminMetrics();
      return true;
    }

    if (supabaseStatusBadge) {
      supabaseStatusBadge.textContent = 'IndexedDB Local Cache Active';
      supabaseStatusBadge.style.color = '#fcd5b5';
    }
    updateAdminMetrics();
    return false;
  }

  // --- Fetch Render Cloud Environment Variables (/api/config) ---
  async function loadRenderEnvConfig() {
    try {
      const res = await fetch('/api/config');
      if (!res.ok) return false;
      const cfg = await res.json();
      if (cfg && cfg.supabaseUrl && cfg.supabaseAnonKey) {
        localStorage.setItem('supabase_project_url', cfg.supabaseUrl);
        localStorage.setItem('supabase_anon_key', cfg.supabaseAnonKey);

        const banner = document.getElementById('cloudEnvBanner');
        if (banner) banner.style.display = 'flex';

        initSupabase('Cloud Active (Render Env)');
        console.log('⚡ Supabase automatically connected via Render Environment Variables!');

        // Run background cloud sync
        syncAllCloudData({ quiet: true }).then(() => {
          const currentRole = localStorage.getItem('cinema_session_role');
          if (currentRole === 'glory') {
            renderGloryFeed();
          } else if (currentRole === 'admin') {
            renderAdminReelsManager();
            renderAdminReplies();
            renderGloryLogins();
          }
        }).catch(err => {
          console.warn('Auto cloud sync notice:', err);
        });

        return true;
      }
    } catch (e) {
      // Standalone static file or offline, ignore
    }
    return false;
  }

  async function saveSupabaseConfig(e) {
    if (e && e.preventDefault) e.preventDefault();

    const saveBtn = document.getElementById('saveSupabaseSettingsBtn');
    const saveBtnText = document.getElementById('saveSupabaseBtnText') || saveBtn;
    const origText = saveBtnText ? saveBtnText.textContent : '💾 Save & Connect Supabase';

    let url = (supabaseUrlInput ? supabaseUrlInput.value.trim() : '');
    let key = (supabaseKeyInput ? supabaseKeyInput.value.trim() : '');

    // Clean inputs: remove quotes, remove trailing slashes
    url = url.replace(/^['"]|['"]$/g, '').replace(/\/+$/, '').trim();
    key = key.replace(/^['"]|['"]$/g, '').trim();

    if (!url || !key) {
      showToast('Please paste both your Supabase Project URL and Anon Public Key.', 'error');
      if (supabaseUrlInput && !url) supabaseUrlInput.focus();
      else if (supabaseKeyInput && !key) supabaseKeyInput.focus();
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
      if (supabaseUrlInput) supabaseUrlInput.value = url;
    }

    if (saveBtnText) saveBtnText.textContent = '⏳ Connecting...';

    localStorage.setItem('supabase_project_url', url);
    localStorage.setItem('supabase_anon_key', key);

    const ok = initSupabase();

    setTimeout(async () => {
      if (saveBtnText) saveBtnText.textContent = origText;
      if (ok) {
        showToast('✓ Connected to Supabase Cloud! Syncing data now...', 'success');
        await syncAllCloudData();
      } else {
        showToast('Connected locally. Please ensure URL & Anon Key are valid.', 'info');
      }
    }, 400);
  }

  async function syncAllCloudData(e) {
    if (e && e.preventDefault) e.preventDefault();
    const isQuiet = (e && e.quiet === true);

    const syncBtn = document.getElementById('testSupabaseSyncBtn');
    const syncBtnText = document.getElementById('syncSupabaseBtnText') || syncBtn;
    const origText = syncBtnText ? syncBtnText.textContent : '⚡ Sync All Cloud Data Now';

    if (!supabaseClient) {
      initSupabase();
    }

    if (!supabaseClient) {
      if (!isQuiet) showToast('Please paste and save your Supabase URL & Anon Key first.', 'error');
      return;
    }

    if (!isQuiet) {
      if (syncBtnText) syncBtnText.textContent = '⏳ Syncing Cloud...';
      showToast('⚡ Syncing with Supabase Cloud...', 'info');
    }

    try {
      // 1. Sync Reels from cloud or push local
      const { data: cloudReels, error: reelErr } = await supabaseClient
        .from('reels')
        .select('*');

      if (!reelErr && cloudReels && cloudReels.length > 0) {
        const mapped = cloudReels.map(r => ({
          id: r.id,
          title: r.title,
          text: r.text,
          mediaType: r.media_type,
          videoType: r.video_type,
          videoKey: r.video_key,
          presetSrc: r.preset_src,
          videoUrl: r.video_url,
          createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now()
        }));
        saveReels(mapped);
        renderAdminReelsManager();
      } else {
        const localReels = getReels();
        for (const lr of localReels) {
          await supabaseClient.from('reels').upsert({
            id: lr.id,
            title: lr.title,
            text: lr.text,
            media_type: lr.mediaType,
            video_type: lr.videoType,
            video_key: lr.videoKey,
            preset_src: lr.presetSrc || '',
            video_url: lr.videoUrl || '',
            created_at: new Date(lr.createdAt || Date.now()).toISOString()
          });
        }
      }

      // 2. Sync Glory Replies
      const { data: cloudReplies, error: repErr } = await supabaseClient
        .from('glory_replies')
        .select('*');

      if (!repErr && cloudReplies) {
        if (cloudReplies.length > 0) {
          const mappedReplies = cloudReplies.map(cr => ({
            id: cr.id,
            reelId: cr.reel_id,
            reelIndex: cr.reel_index,
            reelTitle: cr.reel_title,
            reelText: cr.reel_text,
            text: cr.reply_text,
            createdAt: cr.created_at ? new Date(cr.created_at).getTime() : Date.now()
          }));
          saveGloryReplies(mappedReplies);
          renderAdminReplies();
        } else {
          const localReplies = getGloryReplies();
          for (const lrep of localReplies) {
            await supabaseClient.from('glory_replies').upsert({
              id: lrep.id,
              reel_id: lrep.reelId,
              reel_index: lrep.reelIndex,
              reel_title: lrep.reelTitle,
              reel_text: lrep.reelText,
              reply_text: lrep.text,
              created_at: new Date(lrep.createdAt || Date.now()).toISOString()
            });
          }
        }
      }

      // 3. Sync Glory Logins
      const { data: cloudLogins, error: loginErr } = await supabaseClient
        .from('glory_logins')
        .select('*');

      if (!loginErr && cloudLogins && cloudLogins.length > 0) {
        const mappedLogins = cloudLogins.map(cl => ({
          id: cl.id,
          username: cl.username,
          device_info: cl.device_info,
          logged_in_at: cl.logged_in_at,
          timestamp: new Date(cl.logged_in_at).getTime()
        }));
        saveGloryLogins(mappedLogins);
        renderGloryLogins();
      }

      updateAdminMetrics();
      if (!isQuiet) {
        showToast('✓ Cloud Sync Complete! All data secured in Supabase.', 'success');
      }
    } catch (err) {
      console.error('Cloud sync error:', err);
      if (!isQuiet) {
        showToast('Cloud notice: ' + (err.message || 'Check database connection'), 'error');
      }
    } finally {
      if (!isQuiet && syncBtnText) syncBtnText.textContent = origText;
    }
  }

  // Bind to window for direct HTML inline calls
  window.__saveSupabaseSettings = saveSupabaseConfig;
  window.__syncAllCloudData = syncAllCloudData;

  if (saveSupabaseSettingsBtn) {
    saveSupabaseSettingsBtn.onclick = saveSupabaseConfig;
    saveSupabaseSettingsBtn.addEventListener('click', saveSupabaseConfig);
  }
  if (testSupabaseSyncBtn) {
    testSupabaseSyncBtn.onclick = syncAllCloudData;
    testSupabaseSyncBtn.addEventListener('click', syncAllCloudData);
  }

  // --- Start / Cancel Reel Editing ---
  function startEditingReel(reelId) {
    const reels = getReels();
    const reel = reels.find(r => r.id === reelId);
    if (!reel) return;

    editingReelId = reelId;
    const index = reels.findIndex(r => r.id === reelId) + 1;

    // Fill form
    if (adminTitleInput) adminTitleInput.value = reel.title || '';
    if (adminMsgInput) adminMsgInput.value = reel.text || '';
    updateLiveGlassPreview();

    // Fill media format
    if (reel.mediaType === 'textonly') {
      setMediaMode('textonly');
    } else {
      setMediaMode('video');
      stagedCustomVideoBlob = null;
      if (reel.presetSrc) {
        activePresetSrc = reel.presetSrc;
        presetBtns.forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-src') === reel.presetSrc);
        });
        if (adminPreviewVideo) {
          adminPreviewVideo.src = reel.presetSrc;
          adminPreviewVideo.load();
        }
      }
    }

    // Update UI headers
    if (adminFormModeBadge) {
      if (adminFormModeText) adminFormModeText.textContent = `Editing Reel #${index}`;
    }
    if (adminCancelEditBtn) adminCancelEditBtn.classList.remove('hidden');
    if (adminSaveBtnText) adminSaveBtnText.textContent = `Save Changes to Reel #${index}`;

    // Highlight in list
    renderAdminReelsManager();

    // Scroll smoothly to editor at top of modal
    const glassCard = document.querySelector('.admin-glass-card');
    if (glassCard) {
      glassCard.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const editorCard = document.getElementById('adminEditorCard');
    if (editorCard) {
      editorCard.classList.remove('pulse-editor');
      void editorCard.offsetWidth;
      editorCard.classList.add('pulse-editor');
    }

    showToast(`✏️ Editing Reel #${index}. Update fields above & tap Save!`, 'info');
  }

  function addNewReel(e) {
    if (e && e.preventDefault) e.preventDefault();
    editingReelId = null;

    if (adminTitleInput) adminTitleInput.value = 'Special Screening from Yash ❤️';
    if (adminMsgInput) {
      adminMsgInput.value = '';
      adminMsgInput.focus();
    }
    updateLiveGlassPreview();
    setMediaMode('video');
    stagedCustomVideoBlob = null;
    if (dropzoneMainText) dropzoneMainText.textContent = 'Tap or drop video file';
    if (dropzoneSubText) dropzoneSubText.textContent = 'MP4, WebM, MOV supported';

    if (adminFormModeText) adminFormModeText.textContent = 'Create Next Reel';
    if (adminCancelEditBtn) adminCancelEditBtn.classList.add('hidden');
    if (adminSaveBtnText) adminSaveBtnText.textContent = 'Add Reel to Feed';

    renderAdminReelsManager();

    const glassCard = document.querySelector('.admin-glass-card');
    if (glassCard) glassCard.scrollTo({ top: 0, behavior: 'smooth' });

    const editorCard = document.getElementById('adminEditorCard');
    if (editorCard) {
      editorCard.classList.remove('pulse-editor');
      void editorCard.offsetWidth;
      editorCard.classList.add('pulse-editor');
    }

    showToast('✨ Ready to create new reel! Fill fields and tap Add Reel.', 'info');
  }

  function cancelEditing(e) {
    if (e && e.preventDefault) e.preventDefault();
    editingReelId = null;

    if (adminTitleInput) adminTitleInput.value = 'Special Screening from Yash ❤️';
    if (adminMsgInput) adminMsgInput.value = '';
    updateLiveGlassPreview();
    setMediaMode('video');
    stagedCustomVideoBlob = null;
    if (dropzoneMainText) dropzoneMainText.textContent = 'Tap or drop video file';
    if (dropzoneSubText) dropzoneSubText.textContent = 'MP4, WebM, MOV supported';

    if (adminFormModeText) adminFormModeText.textContent = 'Create Next Reel';
    if (adminCancelEditBtn) adminCancelEditBtn.classList.add('hidden');
    if (adminSaveBtnText) adminSaveBtnText.textContent = 'Add Reel to Feed';

    renderAdminReelsManager();
    showToast('Edit cancelled. Ready to create next reel.', 'info');
  }

  if (adminCancelEditBtn) {
    adminCancelEditBtn.addEventListener('click', cancelEditing);
  }

  // --- Save New Reel or Update Existing Reel ---
  async function saveReelAction(e) {
    if (e && e.preventDefault) e.preventDefault();
    const text = (adminMsgInput ? adminMsgInput.value.trim() : '') || DEFAULT_ADMIN_TEXT;
    const title = (adminTitleInput ? adminTitleInput.value.trim() : '') || 'Special Screening from Yash ❤️';
    let reels = getReels();

    if (editingReelId) {
      // --- UPDATE EXISTING REEL IN PLACE ---
      const targetIndex = reels.findIndex(r => r.id === editingReelId);
      if (targetIndex !== -1) {
        const reel = reels[targetIndex];
        reel.title = title;
        reel.text = text;
        reel.mediaType = selectedMediaType;

        if (selectedMediaType === 'video') {
          if (stagedCustomVideoBlob) {
            const videoKey = 'reel_video_' + reel.id;
            showToast('Saving updated video file...', 'info');
            await saveVideoBlob(stagedCustomVideoBlob, videoKey);
            reel.videoType = 'blob';
            reel.videoKey = videoKey;
            stagedCustomVideoBlob = null;
          } else if (!reel.videoKey) {
            reel.videoType = 'preset';
            reel.presetSrc = activePresetSrc;
          }
        } else {
          // Text-only
          if (reel.videoKey) {
            await deleteVideoBlob(reel.videoKey);
            reel.videoKey = '';
          }
          reel.videoType = 'none';
          reel.presetSrc = '';
        }

        saveReels(reels);
        cancelEditing();
        updateAdminMetrics();
        renderGloryFeed().catch(() => {});
        showToast(`✓ Reel #${targetIndex + 1} updated successfully!`, 'success');

        if (supabaseClient) {
          supabaseClient.from('reels').upsert({
            id: reel.id,
            title: reel.title,
            text: reel.text,
            media_type: reel.mediaType,
            video_type: reel.videoType,
            video_key: reel.videoKey || '',
            preset_src: reel.presetSrc || '',
            created_at: new Date(reel.createdAt || Date.now()).toISOString()
          }).then(() => {}).catch(err => console.warn('Supabase reel sync error:', err));
        }
      }
    } else {
      // --- ADD NEXT REEL (UP TO N REELS) ---
      const newId = 'reel_' + Date.now();
      let videoType = 'preset';
      let videoKey = '';
      let presetSrc = activePresetSrc;

      if (selectedMediaType === 'video') {
        if (stagedCustomVideoBlob) {
          videoType = 'blob';
          videoKey = 'reel_video_' + newId;
          showToast('Saving uploaded video to vault...', 'info');
          await saveVideoBlob(stagedCustomVideoBlob, videoKey);
          stagedCustomVideoBlob = null;
        }
      } else {
        videoType = 'none';
        presetSrc = '';
      }

      const newReel = {
        id: newId,
        title: title,
        text: text,
        mediaType: selectedMediaType,
        videoType: videoType,
        videoKey: videoKey,
        presetSrc: presetSrc,
        createdAt: Date.now()
      };

      reels.push(newReel);
      saveReels(reels);

      if (adminMsgInput) adminMsgInput.value = '';
      updateLiveGlassPreview();
      renderAdminReelsManager();
      updateAdminMetrics();
      renderGloryFeed().catch(() => {});

      showToast(`✓ Reel #${reels.length} added to Glory's feed!`, 'success');

      if (supabaseClient) {
        supabaseClient.from('reels').upsert({
          id: newReel.id,
          title: newReel.title,
          text: newReel.text,
          media_type: newReel.mediaType,
          video_type: newReel.videoType,
          video_key: newReel.videoKey || '',
          preset_src: newReel.presetSrc || '',
          created_at: new Date(newReel.createdAt).toISOString()
        }).then(() => {}).catch(err => console.warn('Supabase reel insert error:', err));
      }
    }
  }

  // Global window bindings for inline HTML handlers
  window.__startEditingReel = startEditingReel;
  window.__addNewReel = addNewReel;
  window.__cancelEditing = cancelEditing;
  window.__saveReel = saveReelAction;
  window.__deleteReel = deleteReel;

  if (adminSaveReelBtn) {
    adminSaveReelBtn.onclick = saveReelAction;
    adminSaveReelBtn.addEventListener('click', saveReelAction);
  }

  // --- Delete Reel ---
  async function deleteReel(reelId) {
    let reels = getReels();
    const target = reels.find(r => r.id === reelId);
    if (target && target.videoKey) {
      await deleteVideoBlob(target.videoKey);
    }

    reels = reels.filter(r => r.id !== reelId);
    if (reels.length === 0) {
      reels = [{
        id: 'reel_default',
        title: 'Special Screening from Yash ❤️',
        text: DEFAULT_ADMIN_TEXT,
        mediaType: 'video',
        videoType: 'preset',
        videoKey: '',
        presetSrc: DEFAULT_ADMIN_VIDEO,
        createdAt: Date.now()
      }];
    }

    if (editingReelId === reelId) {
      cancelEditing();
    }

    saveReels(reels);
    renderAdminReelsManager();
    await renderGloryFeed();
    showToast('Reel removed from feed.', 'info');
  }

  // --- Glory Full-Screen Multi-Reels Renderer (Up to N Reels) ---
  function pauseAllFeedVideos() {
    const videos = document.querySelectorAll('#reelsWrapper .reel-video');
    videos.forEach(v => v.pause());
  }

  async function renderGloryFeed() {
    if (!reelsWrapper) return;
    const reels = getReels();

    // Revoke old object URLs cleanly
    feedObjectUrls.forEach(url => URL.revokeObjectURL(url));
    feedObjectUrls = [];

    reelsWrapper.innerHTML = '';

    for (let i = 0; i < reels.length; i++) {
      const reel = reels[i];
      const index = i + 1;
      const isVideo = reel.mediaType === 'video';

      let videoSrc = reel.presetSrc || DEFAULT_ADMIN_VIDEO;
      if (isVideo && reel.videoType === 'blob' && reel.videoKey) {
        const cachedUrl = await getObjectUrlForBlob(reel.videoKey);
        if (cachedUrl) {
          videoSrc = cachedUrl;
        }
      }

      const section = document.createElement('section');
      section.className = `reel-slide ${index === 1 ? 'active' : ''}`;
      section.setAttribute('data-index', index.toString());
      section.id = `reel-${index}`;

      section.innerHTML = `
        <div class="reel-ambient-bg"></div>

        <div class="reel-content-stage">
          <!-- Top Text: Cinema Glass Text (Static Cinzel Glassmorphism, NO font animation) -->
          <div class="reel-zone reel-zone-top">
            <div class="glass-text feed-glass-text static-glass-text" data-text="${escapeHtml(reel.text)}">${escapeHtml(reel.text)}</div>
          </div>

          ${isVideo ? `
          <!-- Center Video Box: Same size as login, 16:9, centered, NOT zoomed to phone screen -->
          <div class="reel-video-frame-box">
            <video class="reel-video" playsinline webkit-playsinline x5-playsinline loop preload="${index === 1 ? 'auto' : 'metadata'}" muted src="${videoSrc}"></video>
            <div class="video-frame-reflection"></div>
            
            <!-- Click to Reveal and Play Overlay -->
            <div class="reel-reveal-overlay">
              <button type="button" class="reel-reveal-btn">
                <svg class="reveal-play-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span class="reveal-btn-text">Tap to Watch Reel</span>
              </button>
            </div>
          </div>
          ` : `
          <!-- Center Luxury Glass Typography Card for Text-Only Reels (Video is Optional!) -->
          <div class="reel-textonly-frame-box">
            <div class="textonly-sparkles"></div>
            <div class="textonly-decor-quote">“</div>
            <p class="textonly-body-text">${escapeHtml(reel.text)}</p>
            <div class="reel-reveal-overlay">
              <button type="button" class="reel-reveal-btn">
                <span class="reveal-btn-text">Tap to Read Note ✨</span>
              </button>
            </div>
          </div>
          `}

          <!-- Down Zone: Glory Quick Reply Bar to Yash (Replaces Special Screening Narrative Card) -->
          <div class="reel-zone reel-zone-bottom" onclick="event.stopPropagation()">
            <div class="reel-reply-box">
              <div class="reel-reply-context-pill">
                <span class="context-dot"></span>
                <span>Replying to Reel #${index}</span>
              </div>
              <form class="reel-reply-form" data-reel-id="${reel.id}" data-reel-index="${index}" data-reel-title="${escapeHtml(reel.title || 'Reel #' + index)}">
                <div class="reel-reply-input-wrap">
                  <input type="text" class="reel-reply-input" placeholder="Reply to Yash on Reel #${index}..." maxlength="300" autocomplete="off">
                  <button type="submit" class="reel-reply-send-btn" title="Send Reply to Yash">
                    <span>Reply</span>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Right Side Reel Actions -->
        <div class="reel-action-bar">
          <button type="button" class="reel-action-btn like-btn">
            <svg class="heart-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="action-count">Forever</span>
          </button>
          <button type="button" class="reel-action-btn love-note-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="action-count">Sweet</span>
          </button>
        </div>
      `;

      // Setup click-to-reveal on this slide
      const stage = section.querySelector('.reel-content-stage');
      const video = section.querySelector('.reel-video');

      function revealAndTogglePlay(e) {
        if (e.target.closest('.reel-action-bar') || e.target.closest('.feed-top-bar') || e.target.closest('.reel-reply-box')) return;

        if (!section.classList.contains('revealed')) {
          section.classList.add('revealed');
          if (video) {
            video.muted = feedMuted;
            video.volume = 1.0;
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                video.muted = true;
                video.play().catch(() => {});
              });
            }
          }
        } else {
          if (video) {
            if (video.paused) {
              const playPromise = video.play();
              if (playPromise !== undefined) playPromise.catch(() => {});
            } else {
              video.pause();
            }
          }
        }
      }

      if (stage) stage.addEventListener('click', revealAndTogglePlay);

      // Setup Glory direct reply form submit
      const replyForm = section.querySelector('.reel-reply-form');
      if (replyForm) {
        replyForm.addEventListener('submit', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const input = replyForm.querySelector('.reel-reply-input');
          const text = input ? input.value.trim() : '';
          if (!text) {
            showToast('Please type a reply before sending.', 'info');
            return;
          }
          const repObj = {
            id: 'reply_' + Date.now(),
            text: text,
            reelIndex: index,
            reelTitle: reel.title || `Reel #${index}`,
            reelText: reel.text || '',
            sender: 'Glory',
            createdAt: Date.now()
          };
          const replies = getGloryReplies();
          replies.unshift(repObj);
          saveGloryReplies(replies);

          if (supabaseClient) {
            supabaseClient.from('glory_replies').insert([{
              id: repObj.id,
              reel_id: reel.id || ('reel_' + index),
              reel_index: repObj.reelIndex,
              reel_title: repObj.reelTitle,
              reel_text: repObj.reelText,
              reply_text: repObj.text
            }]).then(() => {}).catch(err => console.warn('Supabase reply insert warning:', err));
          }

          input.value = '';
          input.blur();
          showToast(`💌 Reply to Reel #${index} sent to Yash! ✨`, 'success');
          renderAdminReplies();
          updateAdminMetrics();
        });
      }

      reelsWrapper.appendChild(section);
    }

    setupReelIntersectionObserver();

    // Nav controls visibility
    if (feedCounter) feedCounter.textContent = `1 / ${reels.length}`;
    if (feedNavControls) {
      feedNavControls.style.display = reels.length > 1 ? 'flex' : 'none';
    }
  }

  function scrollToReel(targetIndex) {
    const slides = document.querySelectorAll('#reelsWrapper .reel-slide');
    if (!slides || slides.length === 0) return;
    const clamped = Math.max(1, Math.min(targetIndex, slides.length));
    const targetSlide = document.querySelector(`#reelsWrapper .reel-slide[data-index="${clamped}"]`);
    if (targetSlide) {
      targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
      playActiveReelSlide(clamped);
    }
  }

  function playActiveReelSlide(index) {
    currentFeedIndex = index;
    const slides = document.querySelectorAll('#reelsWrapper .reel-slide');
    const total = slides.length;
    if (feedCounter) feedCounter.textContent = `${index} / ${total}`;

    slides.forEach((slide, i) => {
      const slideIndex = i + 1;
      const video = slide.querySelector('.reel-video');
      if (!video) return;

      if (slideIndex === index) {
        slide.classList.add('active');
        video.preload = 'auto';
        if (slide.classList.contains('revealed')) {
          video.muted = feedMuted;
          video.volume = 1.0;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              video.muted = true;
              video.play().catch(() => {});
            });
          }
        }
      } else {
        slide.classList.remove('active');
        video.pause();
        if (Math.abs(slideIndex - index) > 1) {
          video.preload = 'none';
        }
      }
    });
  }

  function setupReelIntersectionObserver() {
    if (!('IntersectionObserver' in window) || !reelsWrapper) return;
    if (reelsObserver) reelsObserver.disconnect();

    reelsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '1', 10);
          playActiveReelSlide(index);
        }
      });
    }, {
      root: reelsWrapper,
      threshold: 0.6
    });

    const slides = document.querySelectorAll('#reelsWrapper .reel-slide');
    slides.forEach(slide => reelsObserver.observe(slide));
  }

  function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    const hearts = ['❤️', '💖', '✨', '💕', '💗', '🔥'];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    const dx = (Math.random() - 0.5) * 80;
    const rot = (Math.random() - 0.5) * 40;
    heart.style.setProperty('--dx', `${dx}px`);
    heart.style.setProperty('--rot', `${rot}deg`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  }

  function setupReelControlsOnce() {
    if (reelControlsInitialized) return;
    reelControlsInitialized = true;

    // Sound toggle
    if (feedSoundBtn) {
      feedSoundBtn.onclick = () => {
        feedMuted = !feedMuted;
        const onIcon = feedSoundBtn.querySelector('.sound-on-icon');
        const offIcon = feedSoundBtn.querySelector('.sound-off-icon');
        if (onIcon) onIcon.classList.toggle('hidden', feedMuted);
        if (offIcon) offIcon.classList.toggle('hidden', !feedMuted);

        const activeSlide = document.querySelector('#reelsWrapper .reel-slide.active');
        if (activeSlide) {
          const v = activeSlide.querySelector('.reel-video');
          if (v) {
            v.muted = feedMuted;
            v.volume = 1.0;
            v.play().catch(() => {});
          }
        }
        showToast(feedMuted ? 'Muted' : 'Sound On 🔊', 'info');
      };
    }

    // Prev / Next Navigation Chevrons (Explicit 1-by-1 advance)
    if (feedPrevBtn) {
      feedPrevBtn.onclick = () => {
        if (currentFeedIndex > 1) {
          scrollToReel(currentFeedIndex - 1);
        }
      };
    }

    if (feedNextBtn) {
      feedNextBtn.onclick = () => {
        const slides = document.querySelectorAll('#reelsWrapper .reel-slide');
        if (currentFeedIndex < slides.length) {
          scrollToReel(currentFeedIndex + 1);
        }
      };
    }

    // Instagram-style 1-by-1 Wheel Physics (Desktop / Trackpad)
    let wheelLocked = false;
    if (reelsWrapper) {
      reelsWrapper.addEventListener('wheel', (e) => {
        const slides = document.querySelectorAll('#reelsWrapper .reel-slide');
        if (slides.length <= 1) return;

        if (Math.abs(e.deltaY) > 20) {
          e.preventDefault();
          if (wheelLocked) return;
          wheelLocked = true;

          if (e.deltaY > 0 && currentFeedIndex < slides.length) {
            scrollToReel(currentFeedIndex + 1);
          } else if (e.deltaY < 0 && currentFeedIndex > 1) {
            scrollToReel(currentFeedIndex - 1);
          }

          setTimeout(() => {
            wheelLocked = false;
          }, 650);
        }
      }, { passive: false });

      // Discrete Touch Flick Physics (Mobile Swiping 1-by-1)
      let touchStartY = 0;
      let touchStartTime = 0;

      reelsWrapper.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
          touchStartY = e.touches[0].clientY;
          touchStartTime = Date.now();
        }
      }, { passive: true });

      reelsWrapper.addEventListener('touchend', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const touchEndY = e.changedTouches[0].clientY;
        const diffY = touchStartY - touchEndY;
        const duration = Date.now() - touchStartTime;

        if (Math.abs(diffY) > 40 && duration < 600) {
          const slides = document.querySelectorAll('#reelsWrapper .reel-slide');
          if (diffY > 0 && currentFeedIndex < slides.length) {
            scrollToReel(currentFeedIndex + 1);
          } else if (diffY < 0 && currentFeedIndex > 1) {
            scrollToReel(currentFeedIndex - 1);
          }
        }
      }, { passive: true });
    }

    // Keyboard Navigation in Feed (1-by-1 Reel Transitions)
    window.addEventListener('keydown', (e) => {
      if (gloryFeed && !gloryFeed.classList.contains('hidden')) {
        const slides = document.querySelectorAll('#reelsWrapper .reel-slide');
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault();
          if (currentFeedIndex < slides.length) {
            scrollToReel(currentFeedIndex + 1);
          }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          e.preventDefault();
          if (currentFeedIndex > 1) {
            scrollToReel(currentFeedIndex - 1);
          }
        }
      }
    });

    // Likes & floating hearts
    if (reelsWrapper) {
      reelsWrapper.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.like-btn') || e.target.closest('.love-note-btn');
        if (likeBtn) {
          likeBtn.classList.toggle('liked');
          createFloatingHeart(e.clientX || (window.innerWidth - 30), e.clientY || (window.innerHeight - 100));
        }
      });
    }

    // Sign out from Feed
    if (feedSignOutBtn) {
      feedSignOutBtn.onclick = logoutUser;
    }
  }

  async function initReelsFeed() {
    await renderGloryFeed();
    setupReelControlsOnce();
    if (reelsWrapper) reelsWrapper.scrollTop = 0;
  }

  function showGloryDashboard() {
    if (gloryIntroScreen) gloryIntroScreen.classList.add('hidden');
    if (gloryFeed) gloryFeed.classList.remove('hidden');
    if (adminModal) adminModal.classList.add('hidden');
    initReelsFeed();
  }

  function startGlory5sIntroSequence() {
    if (!gloryIntroScreen) {
      showGloryDashboard();
      return;
    }

    if (gloryFeed) gloryFeed.classList.add('hidden');
    gloryIntroScreen.classList.remove('hidden');

    if (introProgressBar) {
      introProgressBar.style.transition = 'none';
      introProgressBar.style.width = '0%';
      void introProgressBar.offsetWidth;
      introProgressBar.style.transition = 'width 5s linear';
      introProgressBar.style.width = '100%';
    }

    let remaining = 5;
    if (introCountdownText) introCountdownText.textContent = `Connecting with Yash... ${remaining}s`;
    const interval = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        if (introCountdownText) introCountdownText.textContent = `Connecting with Yash... ${remaining}s`;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      showGloryDashboard();
      showToast("Welcome Glory! ✨ Yash's reels are now playing.", "success");
    }, 5000);
  }

  // --- Master View Switcher ---
  function renderView(role, isFreshLogin = false) {
    if (role === 'glory') {
      // 1. Hide login page & ambient theater
      if (videoContainer) videoContainer.classList.add('hidden');
      if (theaterStage) theaterStage.classList.add('hidden');
      if (bgVideo) {
        bgVideo.pause();
        bgVideo.muted = true;
        bgVideo.currentTime = 0;
      }
      if (bgVideoBlur) {
        bgVideoBlur.pause();
        bgVideoBlur.muted = true;
        bgVideoBlur.currentTime = 0;
      }

      // 2. Either show 5s intro on fresh login or go directly to feed
      if (isFreshLogin) {
        startGlory5sIntroSequence();
      } else {
        showGloryDashboard();
      }
    } else if (role === 'admin') {
      if (gloryIntroScreen) gloryIntroScreen.classList.add('hidden');
      if (gloryFeed) {
        gloryFeed.classList.add('hidden');
        pauseAllFeedVideos();
      }
      if (videoContainer) videoContainer.classList.remove('hidden');
      if (theaterStage) theaterStage.classList.remove('hidden');
      if (adminModal) adminModal.classList.remove('hidden');
      safePlayVideo(bgVideo);
      if (bgVideoBlur) safePlayVideo(bgVideoBlur);

      // Lock admin text to static Cinzel (NO font cycling!)
      updateCinemaDisplay("YASH ADMIN");
      if (cinematicText) {
        cinematicText.style.fontFamily = '"Cinzel", serif';
        cinematicText.style.letterSpacing = '0.08em';
        cinematicText.style.transform = 'none';
      }

      updateLiveGlassPreview();
      initSupabase();
      switchAdminTab('reels');
      renderAdminReelsManager();
      renderAdminReplies();
      renderGloryLogins();
      updateAdminMetrics();
    } else {
      // Default Login Screen: Resume font cycling on "CINEMA"
      if (gloryIntroScreen) gloryIntroScreen.classList.add('hidden');
      if (gloryFeed) {
        gloryFeed.classList.add('hidden');
        pauseAllFeedVideos();
      }
      if (videoContainer) videoContainer.classList.remove('hidden');
      if (theaterStage) theaterStage.classList.remove('hidden');
      if (adminModal) adminModal.classList.add('hidden');
      updateCinemaDisplay("CINEMA");
      playIntroVideo();
    }
  }

  // --- Auth Form Submit ---
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    activateSound();

    usernameError.textContent = '';
    passwordError.textContent = '';
    const userCapsule = usernameInput.closest('.clean-input-capsule');
    const passCapsule = passwordInput.closest('.clean-input-capsule');
    if (userCapsule) userCapsule.classList.remove('has-error');
    if (passCapsule) passCapsule.classList.remove('has-error');

    const userVal = usernameInput.value.trim().toLowerCase();
    const passVal = passwordInput.value;

    let hasError = false;
    if (!userVal) {
      usernameError.textContent = 'Please enter your ID.';
      if (userCapsule) userCapsule.classList.add('has-error');
      hasError = true;
    }
    if (!passVal) {
      passwordError.textContent = 'Please enter your password.';
      if (passCapsule) passCapsule.classList.add('has-error');
      hasError = true;
    }
    if (hasError) {
      shakeForm();
      return;
    }

    // Role Verification:
    // 1) Yash Admin: id = yash, password = yashadmin123
    // 2) Glory: id = glory or Glory, password = lory
    let matchedRole = null;
    if (userVal === 'yash' && passVal === 'yashadmin123') {
      matchedRole = 'admin';
    } else if (userVal === 'glory' && passVal === 'lory') {
      matchedRole = 'glory';
    }

    if (!matchedRole) {
      usernameError.textContent = 'Invalid ID or password';
      if (userCapsule) userCapsule.classList.add('has-error');
      if (passCapsule) passCapsule.classList.add('has-error');
      shakeForm();
      showToast('Invalid credentials! Check ID & password.', 'error');
      return;
    }

    loginBtn.disabled = true;
    loginSpinner.classList.remove('hidden');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnArrow = loginBtn.querySelector('.btn-arrow');
    if (btnText) btnText.textContent = 'Authenticating...';
    if (btnArrow) btnArrow.classList.add('hidden');

    setTimeout(() => {
      loginBtn.disabled = false;
      loginSpinner.classList.add('hidden');
      if (btnText) btnText.textContent = 'Sign In';
      if (btnArrow) btnArrow.classList.remove('hidden');

      if (matchedRole === 'glory') {
        recordGloryLogin('glory');
      }

      localStorage.setItem('cinema_session_role', matchedRole);
      renderView(matchedRole, matchedRole === 'glory');
    }, 600);
  });

  // --- Sign Out Actions ---
  function logoutUser() {
    localStorage.removeItem('cinema_session_role');
    usernameInput.value = '';
    passwordInput.value = '';
    if (gloryIntroScreen) gloryIntroScreen.classList.add('hidden');
    renderView(null);
    showToast('Signed out successfully.', 'info');
  }

  if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', logoutUser);

  // --- View as Glory Preview Button ---
  if (adminViewAsGloryBtn) {
    adminViewAsGloryBtn.addEventListener('click', () => {
      renderView('glory');
      showToast("Previewing Glory's multi-reel feed. Tap Sign Out to return.", 'info');
    });
  }

  // --- Real-time Storage Sync (across tabs and devices) ---
  window.addEventListener('storage', async (e) => {
    if (e.key === 'cinema_admin_reels' || e.key === 'cinema_broadcast_time') {
      const currentRole = localStorage.getItem('cinema_session_role');
      if (currentRole === 'glory') {
        await renderGloryFeed();
        showToast('New reels updated by Yash!', 'success');
      } else if (currentRole === 'admin') {
        renderAdminReelsManager();
        updateAdminMetrics();
      }
    } else if (e.key === 'cinema_glory_replies' || e.key === 'cinema_glory_replies_time') {
      const currentRole = localStorage.getItem('cinema_session_role');
      if (currentRole === 'admin') {
        renderAdminReplies();
        updateAdminMetrics();
        showToast('💌 New reply received from Glory! ✨', 'success');
      }
    } else if (e.key === 'cinema_glory_logins' || e.key === 'cinema_glory_logins_time') {
      const currentRole = localStorage.getItem('cinema_session_role');
      if (currentRole === 'admin') {
        renderGloryLogins();
        updateAdminMetrics();
        showToast('🕒 Glory signed in! Session recorded.', 'info');
      }
    }
  });

  // --- Initialize Saved Session or Default View ---
  initSupabase();
  loadRenderEnvConfig();
  const urlParams = new URLSearchParams(window.location.search);
  const paramRole = urlParams.get('role');
  const savedRole = paramRole || localStorage.getItem('cinema_session_role');
  renderView(savedRole);

})();
