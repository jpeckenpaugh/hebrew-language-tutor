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
  let currentLessonId = null;

  // --- API client -------------------------------------------------------

  async function api(path, options = {}) {
    const headers = options.headers || {};
    headers['Content-Type'] = 'application/json';
    if (adminToken) headers['Authorization'] = 'Bearer ' + adminToken;

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

  function showLoading(on) {
    loadingEl.classList.toggle('d-none', !on);
  }

  function render(node) {
    contentEl.innerHTML = '';
    contentEl.appendChild(node);
  }

  function showError(message) {
    const node = Views.error(message);
    node.querySelector('[data-nav="catalog"]').addEventListener('click', (e) => {
      e.preventDefault();
      goCatalog();
    });
    render(node);
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
      .catch((e) => showError('Could not load the catalog: ' + e.message))
      .finally(() => showLoading(false));
  }

  async function openLesson(lessonId) {
    currentLessonId = lessonId;
    setActiveNav(null);
    showLoading(true);
    try {
      const res = await api('/api/lessons/' + lessonId);
      render(Views.lessonHub(res.data, (mode) => openMode(lessonId, mode)));
    } catch (e) {
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
    try {
      await api('/api/scores', {
        method: 'POST',
        body: { lesson_id: lesson.id, mode, correct, total },
      });
      render(Views.results(mode, correct, total, back));
    } catch (e) {
      render(Views.results(mode, correct, total, back));
    }
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
      .catch((e) => showError('Could not load scores: ' + e.message))
      .finally(() => showLoading(false));
  }

  // --- Admin ------------------------------------------------------------

  function goAdmin() {
    setActiveNav('admin');
    if (!adminToken) {
      render(Views.adminLogin(async (username, password, form) => {
        const errorEl = form.parentElement.querySelector('#loginError');
        errorEl.classList.add('d-none');
        try {
          const res = await api('/api/admin/login', {
            method: 'POST',
            body: { username, password },
          });
          adminToken = res.data.token;
          goAdmin();
        } catch (e) {
          errorEl.textContent = e.message;
          errorEl.classList.remove('d-none');
        }
      }));
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
        goAdmin();
      },

      onAddLesson: async (title) => {
        try {
          await api('/api/admin/lessons', { method: 'POST', body: { title } });
          renderAdminPanel();
        } catch (e) {
          if (e.status === 401) { adminToken = null; goAdmin(); }
          else showError('Could not add lesson: ' + e.message);
        }
      },

      onUpdateLesson: async (lessonId, title) => {
        try {
          await api('/api/admin/lessons/' + lessonId, { method: 'PUT', body: { title } });
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

      onAddVocab: async (lessonId, english, hebrew, card) => {
        const errorEl = card.querySelector('.add-vocab .error');
        errorEl.classList.add('d-none');
        try {
          await api('/api/admin/lessons/' + lessonId + '/vocab', {
            method: 'POST',
            body: { english, hebrew },
          });
          card.querySelector('.new-english').value = '';
          card.querySelector('.new-hebrew').value = '';
          const list = card.querySelector('.vocab-list');
          list.dataset.loaded = '';
          adminCallbacks().onLoadVocab(lessonId, list);
        } catch (e) {
          if (e.status === 401) { adminToken = null; goAdmin(); return; }
          errorEl.textContent = e.message;
          errorEl.classList.remove('d-none');
        }
      },

      onUpdateVocab: async (vocabId, english, hebrew, row) => {
        const errorEl = row.querySelector('.error');
        errorEl.classList.add('d-none');
        try {
          await api('/api/admin/vocab/' + vocabId, {
            method: 'PUT',
            body: { english, hebrew },
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

  function wireNav() {
    document.querySelectorAll('[data-nav]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const dest = link.dataset.nav;
        if (dest === 'catalog') goCatalog();
        else if (dest === 'scores') goScores();
        else if (dest === 'admin') goAdmin();
      });
    });
  }

  function init() {
    wireNav();
    goCatalog();
  }

  document.addEventListener('DOMContentLoaded', init);
})();