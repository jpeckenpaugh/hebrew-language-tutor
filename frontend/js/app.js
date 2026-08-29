/* frontend/js/app.js
 * App controller: navigation, API client, and orchestration of the views.
 * All application state comes from the backend API; this module holds no
 * authoritative copy of lessons/vocabulary.
 */

(function () {
  const contentEl = document.getElementById('content');
  const loadingEl = document.getElementById('loading');

  // Admin token is kept in memory only (backend tokens are per-process).
  let adminToken = null;
  // User session token + identity for learner accounts (separate namespace).
  let userToken = null;
  let currentUser = null;
  let currentLessonId = null;

  // --- API client -------------------------------------------------------

  async function api(path, options = {}) {
    const headers = options.headers || {};
    headers['Content-Type'] = 'application/json';
    // User-scoped calls (scores, progress, auth session) carry the user token;
    // admin mutating calls carry the admin token. Two distinct namespaces.
    if (path.indexOf('/api/admin') === 0) {
      if (adminToken) headers['Authorization'] = 'Bearer ' + adminToken;
    } else if (userToken) {
      headers['Authorization'] = 'Bearer ' + userToken;
    }

    let body = options.body;
    if (body && typeof body !== 'string') body = JSON.stringify(body);

    const res = await fetch(path, { ...options, headers, body });

    let data = null;
    try {
      data = await res.json();
    } catch (_) {
      data = {};
    }

    if (!res.ok) {
      const err = new Error((data && data.detail) || ('Request failed (' + res.status + ')'));
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  // --- UI helpers -------------------------------------------------------

  // Only the initial page load shows the #loading spinner; intra-app
  // navigation is handled by the view-transition cross-fade (Bug 02), so the
  // spinner is suppressed after the first render so it never pops on top of
  // the transition.
  let spinnerEnabled = true;

  function showLoading(on) {
    if (on && !spinnerEnabled) return;
    loadingEl.classList.toggle('d-none', !on);
  }

  // Renders a screen. Where the browser supports the View Transitions API this
  // cross-fades between screens; otherwise it falls back to an instant swap.
  // Any in-flight Study Auto-Play speech is cancelled so leaving a lesson stops
  // playback (Sprint 03 feature c / d).
  function render(node) {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const apply = () => {
      contentEl.innerHTML = '';
      contentEl.appendChild(node);
    };
    if (document.startViewTransition) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
    // After the first screen renders, stop showing the #loading spinner for
    // subsequent intra-app navigation (Bug 02).
    spinnerEnabled = false;
  }

  function showError(message) {
    render(Views.error(message));
  }

  // --- Session / Title screen ------------------------------------------

  // The top-nav "Admin" link is hidden whenever a session (learner or admin)
  // is active; Admin stays reachable only from the Title screen.
  function setNavVisibility() {
    const adminNav = document.getElementById('adminNavItem');
    if (adminNav) adminNav.classList.toggle('d-none', !!(userToken || adminToken));
  }

  function updateUserBadge() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.classList.toggle('d-none', !(currentUser || adminToken));
  }

  function goTitle() {
    currentLessonId = null;
    adminToken = null;
    setActiveNav(null);
    setNavVisibility();
    document.body.classList.add('on-title');
    showLoading(true);
    api('/api/users')
      .then((res) => {
        render(Views.title(
          (username) => authenticate('login', username),
          showCreateModal,
          goAdmin,
          res.data
        ));
      })
      .catch(() => {
        render(Views.title(
          (username) => authenticate('login', username),
          showCreateModal,
          goAdmin,
          []
        ));
      })
      .finally(() => showLoading(false));
  }

  function showCreateModal() {
    const modalEl = Views.createAccountModal((username) => createAccount(username));
    document.body.appendChild(modalEl);
    new bootstrap.Modal(modalEl).show();
    modalEl.addEventListener('hidden.bs.modal', () => modalEl.remove());
    // Bug 06 Issue 1: ensure the username field is focused once the modal is
    // visible (Bootstrap does not focus inputs by default).
    modalEl.addEventListener('shown.bs.modal', () => {
      const input = document.getElementById('createUsername');
      if (input) input.focus();
    });
  }

  async function createAccount(rawUsername) {
    const username = (rawUsername || '').trim();
    const errorEl = document.getElementById('createError');
    if (errorEl) errorEl.classList.add('d-none');
    if (!username) {
      if (errorEl) {
        errorEl.textContent = 'Please enter a non-empty username.';
        errorEl.classList.remove('d-none');
      }
      return;
    }
    try {
      await api('/api/auth/signup', { method: 'POST', body: { username } });
      const modalEl = document.getElementById('createAccountModal');
      bootstrap.Modal.getInstance(modalEl).hide();
      goTitle();
    } catch (e) {
      if (errorEl) {
        errorEl.textContent = e.message;
        errorEl.classList.remove('d-none');
      }
    }
  }

  async function authenticate(kind, rawUsername) {
    const username = (rawUsername || '').trim();
    const errorEl = document.getElementById('titleError');
    if (errorEl) errorEl.classList.add('d-none');
    if (!username) {
      if (errorEl) {
        errorEl.textContent = 'Please select a username to sign in.';
        errorEl.classList.remove('d-none');
      }
      return;
    }
    try {
      const res = await api('/api/auth/' + kind, { method: 'POST', body: { username } });
      userToken = res.data.token;
      currentUser = res.data.user;
      setNavVisibility();
      updateUserBadge();
      document.body.classList.remove('on-title');
      goCatalog();
    } catch (e) {
      if (errorEl) {
        errorEl.textContent = e.message;
        errorEl.classList.remove('d-none');
      }
    }
  }

  async function logout() {
    if (userToken) {
      try { await api('/api/auth/logout', { method: 'POST' }); } catch (_) {}
    }
    if (adminToken) {
      try { await api('/api/admin/logout', { method: 'POST' }); } catch (_) {}
    }
    userToken = null;
    currentUser = null;
    adminToken = null;
    updateUserBadge();
    goTitle();
  }

  function goReview(scoreId, back) {
    showLoading(true);
    api('/api/scores/' + scoreId + '/review')
      .then((res) => render(Views.review(res.data, back)))
      .catch((e) => showError('Could not load review: ' + e.message))
      .finally(() => showLoading(false));
  }

  // --- Navigation -------------------------------------------------------

  function goCatalog() {
    currentLessonId = null;
    setActiveNav('catalog');
    showLoading(true);
    api('/api/lessons')
      .then((res) => {
        render(Views.catalog(res.data, openLesson));
      })
      .catch((e) => {
        if (e.status === 401) { logout(); return; }
        showError('Could not load the catalog: ' + e.message);
      })
      .finally(() => showLoading(false));
  }

  async function openLesson(lessonId) {
    currentLessonId = lessonId;
    setActiveNav(null);
    showLoading(true);
    try {
      const [lessonRes, progress] = await Promise.all([
        api('/api/lessons/' + lessonId),
        (userToken ? api('/api/lessons/' + lessonId + '/progress').then((r) => r.data).catch(() => null) : null),
      ]);
      render(Views.lessonHub(lessonRes.data, (mode) => openMode(lessonId, mode), progress));
    } catch (e) {
      if (e.status === 401) { logout(); return; }
      showError('Could not load the lesson: ' + e.message);
    } finally {
      showLoading(false);
    }
  }

  async function openMode(lessonId, mode) {
    showLoading(true);
    try {
      const res = await api('/api/lessons/' + lessonId);
      const lesson = res.data;
      const back = () => openLesson(lessonId);
      let node;
      if (mode === 'study') {
        node = Views.study(lesson.vocab, back);
      } else if (mode === 'quiz') {
        node = Views.quiz(lesson.vocab, (answers) => finishAttempt(lesson, 'quiz', answers, back), back);
      } else if (mode === 'exam') {
        node = Views.exam(lesson.vocab, (answers) => finishAttempt(lesson, 'exam', answers, back), back);
      }
      render(node);
    } catch (e) {
      showError('Could not load the lesson: ' + e.message);
    } finally {
      showLoading(false);
    }
  }

  async function finishAttempt(lesson, mode, answers, back) {
    const correct = answers.filter(Boolean).length;
    const total = answers.length;
    let scoreId = null;
    try {
      const res = await api('/api/scores', {
        method: 'POST',
        body: {
          lesson_id: lesson.id,
          mode,
          correct,
          total,
          answers: lesson.vocab.map((item, i) => ({ vocab_id: item.id, correct: answers[i] })),
        },
      });
      scoreId = res.data.id;
    } catch (e) {
      // Still show results locally if saving fails.
    }
    const wrongCount = total - correct;
    const reviewOpts = (scoreId && wrongCount > 0) ? {
      scoreId,
      wrongCount,
      onReview: () => goReview(scoreId, () => render(Views.results(mode, correct, total, back, reviewOpts))),
    } : null;
    render(Views.results(mode, correct, total, back, reviewOpts));
  }

  function goScores() {
    setActiveNav('scores');
    showLoading(true);
    Promise.all([api('/api/scores'), api('/api/lessons')])
      .then(([scoreRes, lessonRes]) => {
        const titles = {};
        lessonRes.data.forEach((l) => { titles[l.id] = l.title; });
        render(Views.scores(scoreRes.data, titles));
      })
      .catch((e) => {
        if (e.status === 401) { logout(); return; }
        showError('Could not load scores: ' + e.message);
      })
      .finally(() => showLoading(false));
  }

  // --- Admin ------------------------------------------------------------

  function goAdmin() {
    setActiveNav('admin');
    setNavVisibility();
    document.body.classList.remove('on-title');
    if (!adminToken) {
      // Automatic admin sign-in (Sprint 03 feature h): supply a fixed
      // credential to the retained dummy gate so no sign-in form is needed.
      showLoading(true);
      api('/api/admin/login', { method: 'POST', body: { username: 'admin', password: 'admin' } })
        .then((res) => {
          adminToken = res.data.token;
          updateUserBadge();
          goAdmin();
        })
        .catch((e) => {
          showLoading(false);
          showError('Could not sign in as Admin: ' + e.message);
        });
      return;
    }
    renderAdminPanel();
  }

  async function renderAdminPanel() {
    showLoading(true);
    try {
      const res = await api('/api/lessons');
      render(Views.adminPanel(res.data, adminCallbacks()));
    } catch (e) {
      if (e.status === 401) {
        adminToken = null;
        goAdmin();
        return;
      }
      showError('Could not load admin data: ' + e.message);
    } finally {
      showLoading(false);
    }
  }

  function adminCallbacks() {
    return {
      onLogout: async () => {
        try { await api('/api/admin/logout', { method: 'POST' }); } catch (_) {}
        adminToken = null;
        setNavVisibility();
        goTitle();
      },

      onAddLesson: async (title, level, emoji) => {
        try {
          await api('/api/admin/lessons', { method: 'POST', body: { title, level, emoji } });
          renderAdminPanel();
        } catch (e) {
          if (e.status === 401) { adminToken = null; goAdmin(); }
          else showError('Could not add lesson: ' + e.message);
        }
      },

      onUpdateLesson: async (lessonId, title, level, emoji) => {
        try {
          await api('/api/admin/lessons/' + lessonId, { method: 'PUT', body: { title, level, emoji } });
          renderAdminPanel();
        } catch (e) {
          if (e.status === 401) { adminToken = null; goAdmin(); }
          else showError('Could not update lesson: ' + e.message);
        }
      },

      onLoadVocab: async (lessonId, container) => {
        try {
          const res = await api('/api/lessons/' + lessonId + '/vocab');
          container.innerHTML = '';
          container.appendChild(Views.adminVocabRows(res.data, adminCallbacks()));
          container.dataset.loaded = '1';
        } catch (e) {
          if (e.status === 401) { adminToken = null; goAdmin(); }
          else showError('Could not load vocabulary: ' + e.message);
        }
      },

      onAddVocab: async (lessonId, english, hebrew, transliteration, card) => {
        const errorEl = card.querySelector('.add-vocab .error');
        errorEl.classList.add('d-none');
        try {
          await api('/api/admin/lessons/' + lessonId + '/vocab', {
            method: 'POST',
            body: { english, hebrew, transliteration },
          });
          card.querySelector('.new-english').value = '';
          card.querySelector('.new-hebrew').value = '';
          card.querySelector('.new-translit').value = '';
          const list = card.querySelector('.vocab-list');
          list.dataset.loaded = '';
          adminCallbacks().onLoadVocab(lessonId, list);
        } catch (e) {
          if (e.status === 401) { adminToken = null; goAdmin(); return; }
          errorEl.textContent = e.message;
          errorEl.classList.remove('d-none');
        }
      },

      onUpdateVocab: async (vocabId, english, hebrew, transliteration, row) => {
        const errorEl = row.querySelector('.error');
        errorEl.classList.add('d-none');
        try {
          await api('/api/admin/vocab/' + vocabId, {
            method: 'PUT',
            body: { english, hebrew, transliteration },
          });
          row.querySelector('.v-save').textContent = 'Saved';
          setTimeout(() => { row.querySelector('.v-save').textContent = 'Save'; }, 1500);
        } catch (e) {
          if (e.status === 401) { adminToken = null; goAdmin(); return; }
          errorEl.textContent = e.message;
          errorEl.classList.remove('d-none');
        }
      },
    };
  }

  // --- Nav highlighting -------------------------------------------------

  function setActiveNav(active) {
    document.querySelectorAll('.navbar .nav-link').forEach((link) => {
      link.classList.toggle('active', link.dataset.nav === active);
    });
  }

  // Navigation via event delegation: dynamically-rendered links carrying
  // data-nav work after the page renders, since the listener lives on the
  // document rather than being bound once to static nodes (Sprint 03 feature a).
  function setupNav() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-nav]');
      if (!link) return;
      e.preventDefault();
      const dest = link.dataset.nav;
      if (dest === 'catalog') goCatalog();
      else if (dest === 'scores') goScores();
      else if (dest === 'admin') goAdmin();
    });
  }

  function init() {
    setupNav();
    document.getElementById('logoutBtn').addEventListener('click', () => logout());
    goTitle();
  }

  document.addEventListener('DOMContentLoaded', init);
})();