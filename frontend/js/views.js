/* frontend/js/views.js
 * Pure rendering of screens from data returned by the backend API.
 * This module never fetches and never fabricates lesson/vocab data; it only
 * turns the data it is given into DOM. All event wiring is passed in via
 * callbacks so the controller (app.js) owns navigation and API calls.
 */

/* Small helper: build an element from an HTML string. */
function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/* Safe HTML escaping for values coming from the API. */
function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const Views = {
  /* Catalog: grid of lessons. `onOpen(lessonId)` called when clicked. */
  catalog(lessons, onOpen) {
    const grid = document.createElement('div');
    grid.className = 'lesson-grid';

    if (!lessons.length) {
      const none = el('<div class="alert alert-info">No lessons available.</div>');
      grid.appendChild(none);
      return grid;
    }

    lessons.forEach((lesson) => {
      const card = el(
        '<div class="card card-hover p-3">' +
          '<h5 class="card-title mb-1">' + esc(lesson.title) + '</h5>' +
          '<p class="text-muted mb-0">' + esc(lesson.vocab_count) + ' items</p>' +
        '</div>'
      );
      card.addEventListener('click', () => onOpen(lesson.id));
      grid.appendChild(card);
    });

    const wrap = el('<div></div>');
    wrap.appendChild(el('<h2 class="mb-3">Lesson Catalog</h2>'));
    wrap.appendChild(grid);
    return wrap;
  },

  /* Lesson hub: title plus buttons for the three modes. */
  lessonHub(lesson, onMode) {
    const wrap = el('<div></div>');
    wrap.appendChild(
      el(
        '<nav aria-label="breadcrumb" class="mb-3">' +
          '<ol class="breadcrumb">' +
            '<li class="breadcrumb-item"><a href="#" data-nav="catalog">Catalog</a></li>' +
            '<li class="breadcrumb-item active" aria-current="page">' + esc(lesson.title) + '</li>' +
          '</ol>' +
        '</nav>'
      )
    );
    wrap.appendChild(el('<h2 class="mb-4">' + esc(lesson.title) + '</h2>'));

    const row = el('<div class="row g-3"></div>');
    const modes = [
      { key: 'study', label: 'Study', desc: 'Read the vocabulary pairs', icon: '📖' },
      { key: 'quiz', label: 'Quiz', desc: 'Practice with immediate feedback', icon: '✏️' },
      { key: 'exam', label: 'Exam', desc: 'Test with results at the end', icon: '🎓' },
    ];
    modes.forEach((mode) => {
      const card = el(
        '<div class="col-md-4">' +
          '<div class="card card-hover p-4 text-center h-100">' +
            '<div class="display-6 mb-2">' + mode.icon + '</div>' +
            '<h5>' + mode.label + '</h5>' +
            '<p class="text-muted mb-0">' + mode.desc + '</p>' +
          '</div>' +
        '</div>'
      );
      card.querySelector('.card').addEventListener('click', () => onMode(mode.key));
      row.appendChild(card);
    });
    wrap.appendChild(row);
    return wrap;
  },

  /* Study mode: step through vocab pairs. `onExit` returns to the hub. */
  study(vocab, onExit) {
    let index = 0;

    const wrap = el(
      '<div>' +
        '<nav aria-label="breadcrumb" class="mb-3"><ol class="breadcrumb">' +
          '<li class="breadcrumb-item"><a href="#" data-nav="catalog">Catalog</a></li>' +
          '<li class="breadcrumb-item"><a href="#" data-back>Lesson</a></li>' +
          '<li class="breadcrumb-item active">Study</li>' +
        '</ol></nav>' +
        '<div class="d-flex justify-content-between align-items-center mb-3">' +
          '<h4 class="mb-0">Study</h4>' +
          '<span class="text-muted" id="studyCount"></span>' +
        '</div>' +
        '<div class="card study-item p-4 mb-4 text-center" id="studyCard">' +
          '<h3 class="mb-2" id="studyEnglish"></h3>' +
          '<h5 class="text-muted mb-0" id="studyHebrew"></h5>' +
        '</div>' +
        '<div class="d-flex justify-content-between">' +
          '<button class="btn btn-outline-primary" id="studyPrev">← Previous</button>' +
          '<button class="btn btn-outline-primary" id="studyNext">Next →</button>' +
        '</div>' +
      '</div>'
    );
    wrap.querySelector('[data-back]').addEventListener('click', (e) => { e.preventDefault(); onExit(); });
    wrap.querySelector('[data-nav="catalog"]').addEventListener('click', (e) => e.preventDefault());

    const engEl = wrap.querySelector('#studyEnglish');
    const hebEl = wrap.querySelector('#studyHebrew');
    const countEl = wrap.querySelector('#studyCount');
    const prevBtn = wrap.querySelector('#studyPrev');
    const nextBtn = wrap.querySelector('#studyNext');

    function render() {
      const item = vocab[index];
      engEl.textContent = item.english;
      hebEl.textContent = item.hebrew;
      countEl.textContent = (index + 1) + ' / ' + vocab.length;
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === vocab.length - 1;
    }

    prevBtn.addEventListener('click', () => { if (index > 0) { index -= 1; render(); } });
    nextBtn.addEventListener('click', () => { if (index < vocab.length - 1) { index += 1; render(); } });

    render();
    return wrap;
  },

  /* Build multiple-choice questions client-side from the served vocab.
   * Correct answer is the asked item; distractors are other items from the
   * same lesson. Returns [{ prompt, hebrew, options, correctId, id }]. */
  buildQuestions(vocab) {
    return vocab.map((item) => {
      const distractors = vocab
        .filter((other) => other.id !== item.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const options = [item, ...distractors].sort(() => 0.5 - Math.random());
      // Ask in English, answer in Hebrew (with Hebrew prompt meaning English answer).
      return {
        id: item.id,
        prompt: item.english,
        options: options.map((o) => ({ id: o.id, text: o.hebrew })),
        correctId: item.id,
      };
    });
  },

  /* Quiz mode: immediate per-question feedback. */
  quiz(vocab, onFinish, onExit) {
    const questions = Views.buildQuestions(vocab);
    const answers = [];
    let index = 0;
    let answered = false;

    const wrap = el(
      '<div>' +
        '<div class="d-flex justify-content-between align-items-center mb-3">' +
          '<h4 class="mb-0">Quiz</h4>' +
          '<span class="text-muted" id="quizProgress"></span>' +
        '</div>' +
        '<div class="card p-4 mb-3">' +
          '<h5 id="quizPrompt" class="mb-4"></h5>' +
          '<div id="quizOptions"></div>' +
          '<div id="quizFeedback" class="feedback-banner d-none mt-3"></div>' +
        '</div>' +
        '<div class="d-flex justify-content-between">' +
          '<button class="btn btn-outline-secondary" id="quizExit">Exit</button>' +
          '<button class="btn btn-primary d-none" id="quizNext">Next →</button>' +
        '</div>' +
      '</div>'
    );
    wrap.querySelector('#quizExit').addEventListener('click', () => onExit());
    const promptEl = wrap.querySelector('#quizPrompt');
    const optionsEl = wrap.querySelector('#quizOptions');
    const feedbackEl = wrap.querySelector('#quizFeedback');
    const progressEl = wrap.querySelector('#quizProgress');
    const nextBtn = wrap.querySelector('#quizNext');

    function render() {
      const q = questions[index];
      promptEl.textContent = 'What is the Hebrew for: “' + q.prompt + '”?';
      optionsEl.innerHTML = '';
      q.options.forEach((opt) => {
        const btn = el(
          '<button class="btn btn-outline-secondary option-btn" data-opt="' + opt.id + '">' +
            esc(opt.text) +
          '</button>'
        );
        btn.addEventListener('click', () => choose(q, opt));
        optionsEl.appendChild(btn);
      });
      feedbackEl.classList.add('d-none');
      nextBtn.classList.add('d-none');
      answered = false;
      progressEl.textContent = (index + 1) + ' / ' + questions.length;
    }

    function choose(q, chosen) {
      if (answered) return;
      answered = true;
      const correct = chosen.id === q.correctId;
      answers.push(correct);

      const buttons = optionsEl.querySelectorAll('.option-btn');
      buttons.forEach((btn) => {
        btn.disabled = true;
        const id = parseInt(btn.dataset.opt, 10);
        if (id === q.correctId) btn.classList.add('correct');
        else if (id === chosen.id) btn.classList.add('incorrect');
      });

      feedbackEl.classList.remove('d-none');
      feedbackEl.classList.add(correct ? 'bg-success-subtle' : 'bg-danger-subtle');
      feedbackEl.textContent = correct
        ? 'Correct!'
        : 'Incorrect. The correct answer is: ' +
          q.options.find((o) => o.id === q.correctId).text;

      const last = index === questions.length - 1;
      nextBtn.classList.remove('d-none');
      nextBtn.textContent = last ? 'Finish' : 'Next →';
      nextBtn.addEventListener('click', () => {
        if (last) onFinish(answers);
        else { index += 1; render(); }
      }, { once: true });
    }

    render();
    return wrap;
  },

  /* Exam mode: no per-question feedback; results at the end. */
  exam(vocab, onFinish, onExit) {
    const questions = Views.buildQuestions(vocab);
    const answers = [];
    let index = 0;

    const wrap = el(
      '<div>' +
        '<div class="d-flex justify-content-between align-items-center mb-3">' +
          '<h4 class="mb-0">Exam</h4>' +
          '<span class="text-muted" id="examProgress"></span>' +
        '</div>' +
        '<div class="card p-4 mb-3">' +
          '<h5 id="examPrompt" class="mb-4"></h5>' +
          '<div id="examOptions"></div>' +
        '</div>' +
        '<div class="d-flex justify-content-between">' +
          '<button class="btn btn-outline-secondary" id="examExit">Exit</button>' +
          '<button class="btn btn-primary d-none" id="examNext">Next →</button>' +
        '</div>' +
      '</div>'
    );
    wrap.querySelector('#examExit').addEventListener('click', () => onExit());
    const promptEl = wrap.querySelector('#examPrompt');
    const optionsEl = wrap.querySelector('#examOptions');
    const progressEl = wrap.querySelector('#examProgress');
    const nextBtn = wrap.querySelector('#examNext');

    function render() {
      const q = questions[index];
      promptEl.textContent = 'What is the Hebrew for: “' + q.prompt + '”?';
      optionsEl.innerHTML = '';
      q.options.forEach((opt) => {
        const btn = el(
          '<button class="btn btn-outline-secondary option-btn" data-opt="' + opt.id + '">' +
            esc(opt.text) +
          '</button>'
        );
        btn.addEventListener('click', () => choose(q, opt));
        optionsEl.appendChild(btn);
      });
      nextBtn.classList.add('d-none');
      progressEl.textContent = (index + 1) + ' / ' + questions.length;
    }

    function choose(q, chosen) {
      const buttons = optionsEl.querySelectorAll('.option-btn');
      buttons.forEach((b) => b.disabled = true);
      answers.push(chosen.id === q.correctId);
      const last = index === questions.length - 1;
      nextBtn.classList.remove('d-none');
      nextBtn.textContent = last ? 'Submit Exam' : 'Next →';
      nextBtn.addEventListener('click', () => {
        if (last) onFinish(answers);
        else { index += 1; render(); }
      }, { once: true });
    }

    render();
    return wrap;
  },

  /* Results screen shared by quiz and exam. `onExit` goes back to the hub. */
  results(mode, correct, total, onExit) {
    const pct = Math.round((correct / total) * 100);
    const wrap = el(
      '<div class="text-center py-4">' +
        '<h2 class="mb-4">' + (mode === 'quiz' ? 'Quiz' : 'Exam') + ' Complete</h2>' +
        '<div class="score-display text-primary mb-2">' + pct + '%</div>' +
        '<p class="text-muted mb-1">' + correct + ' correct out of ' + total + ' questions</p>' +
        '<p class="text-muted mb-4">Your result has been saved.</p>' +
        '<div class="d-flex justify-content-center gap-2">' +
          '<button class="btn btn-primary" id="resBack">Back to Lesson</button>' +
          '<button class="btn btn-outline-primary" data-nav="catalog">All Lessons</button>' +
        '</div>' +
      '</div>'
    );
    wrap.querySelector('#resBack').addEventListener('click', () => onExit());
    return wrap;
  },

  /* Scores history. */
  scores(scores, lessonTitles, onCatalog) {
    const wrap = el('<div></div>');
    wrap.appendChild(el('<h2 class="mb-3">Saved Scores</h2>'));

    if (!scores.length) {
      wrap.appendChild(el('<div class="alert alert-info">No scores saved yet. Complete a quiz or exam to see results here.</div>'));
      return wrap;
    }

    const rows = scores.map((s) => {
      const lessonTitle = lessonTitles[s.lesson_id] || ('Lesson ' + s.lesson_id);
      return (
        '<tr>' +
          '<td>' + esc(lessonTitle) + '</td>' +
          '<td><span class="badge text-bg-' + (s.mode === 'quiz' ? 'primary' : 'dark') + '">' + esc(s.mode) + '</span></td>' +
          '<td>' + esc(s.correct) + ' / ' + esc(s.total) + '</td>' +
          '<td>' + esc(s.score_pct) + '%</td>' +
          '<td class="text-muted small">' + esc(new Date(s.taken_at).toLocaleString()) + '</td>' +
        '</tr>'
      );
    }).join('');

    wrap.appendChild(
      el(
        '<div class="table-responsive"><table class="table table-hover align-middle">' +
          '<thead class="table-light"><tr>' +
            '<th>Lesson</th><th>Mode</th><th>Score</th><th>Percent</th><th>Taken</th>' +
          '</tr></thead><tbody>' + rows + '</tbody></table></div>'
      )
    );
    return wrap;
  },

  /* Admin login form. */
  adminLogin(onSubmit) {
    const wrap = el(
      '<div class="row justify-content-center">' +
        '<div class="col-md-5">' +
          '<div class="card p-4">' +
            '<h4 class="mb-3">Admin Sign In</h4>' +
            '<form id="adminLoginForm">' +
              '<div class="mb-3"><label class="form-label">Username</label>' +
                '<input class="form-control" name="username" autocomplete="username" required></div>' +
              '<div class="mb-3"><label class="form-label">Password</label>' +
                '<input class="form-control" type="password" name="password" autocomplete="current-password" required></div>' +
              '<div id="loginError" class="alert alert-danger d-none"></div>' +
              '<button class="btn btn-primary" type="submit">Sign In</button>' +
            '</form>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    wrap.querySelector('#adminLoginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const username = form.username.value;
      const password = form.password.value;
      onSubmit(username, password, form);
    });
    return wrap;
  },

  /* Admin panel: lesson list with expand/collapse + edit/add. */
  adminPanel(lessons, callbacks) {
    const wrap = el('<div></div>');
    wrap.appendChild(
      el(
        '<div class="d-flex justify-content-between align-items-center mb-3">' +
          '<h2 class="mb-0">Admin</h2>' +
          '<button class="btn btn-outline-danger" id="adminLogout">Sign Out</button>' +
        '</div>'
      )
    );
    wrap.querySelector('#adminLogout').addEventListener('click', () => callbacks.onLogout());

    // Add new lesson form.
    const addLesson = el(
      '<div class="card p-3 mb-4">' +
        '<h6 class="mb-3">Add New Lesson</h6>' +
        '<div class="input-group">' +
          '<input class="form-control" id="newLessonTitle" placeholder="Lesson title">' +
          '<button class="btn btn-primary" id="addLessonBtn">Add Lesson</button>' +
        '</div>' +
        '<div id="addLessonError" class="alert alert-danger d-none mt-2 mb-0"></div>' +
      '</div>'
    );
    addLesson.querySelector('#addLessonBtn').addEventListener('click', () => {
      const title = addLesson.querySelector('#newLessonTitle').value.trim();
      if (!title) return;
      callbacks.onAddLesson(title);
    });
    wrap.appendChild(addLesson);

    lessons.forEach((lesson) => {
      const card = el(
        '<div class="card p-3 mb-3">' +
          '<div class="d-flex justify-content-between align-items-center">' +
            '<div class="d-flex gap-2 align-items-center flex-grow-1">' +
              '<input class="form-control lesson-title-input" value="' + esc(lesson.title) + '">' +
              '<button class="btn btn-outline-primary save-title-btn">Save</button>' +
              '<button class="btn btn-link toggle-vocab">' + esc(lesson.vocab_count) + ' items ▾</button>' +
            '</div>' +
          '</div>' +
          '<div class="vocab-list mt-3 d-none"></div>' +
          '<div class="add-vocab mt-3 d-none">' +
            '<div class="input-group">' +
              '<input class="form-control new-english" placeholder="English">' +
              '<input class="form-control new-hebrew" placeholder="Hebrew">' +
              '<button class="btn btn-primary add-vocab-btn">Add Item</button>' +
            '</div>' +
            '<div class="error alert alert-danger d-none mt-2 mb-0"></div>' +
          '</div>' +
        '</div>'
      );
      const titleInput = card.querySelector('.lesson-title-input');
      const saveBtn = card.querySelector('.save-title-btn');
      const toggleBtn = card.querySelector('.toggle-vocab');
      const vocabList = card.querySelector('.vocab-list');
      const addVocab = card.querySelector('.add-vocab');

      saveBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        if (title && title !== lesson.title) callbacks.onUpdateLesson(lesson.id, title);
      });

      toggleBtn.addEventListener('click', async () => {
        const collapsed = vocabList.classList.toggle('d-none');
        addVocab.classList.toggle('d-none', collapsed);
        if (!collapsed && !vocabList.dataset.loaded) {
          callbacks.onLoadVocab(lesson.id, vocabList);
        }
      });

      card.querySelector('.add-vocab-btn').addEventListener('click', () => {
        const english = card.querySelector('.new-english').value.trim();
        const hebrew = card.querySelector('.new-hebrew').value.trim();
        if (english && hebrew) callbacks.onAddVocab(lesson.id, english, hebrew, card);
      });

      wrap.appendChild(card);
    });

    return wrap;
  },

  /* Render a lesson's vocab rows inside an admin card. */
  adminVocabRows(vocab, callbacks) {
    const list = document.createElement('div');
    vocab.forEach((item) => {
      const row = el(
        '<div class="row g-2 align-items-center mb-2">' +
          '<div class="col"><input class="form-control form-control-sm v-english" value="' + esc(item.english) + '"></div>' +
          '<div class="col"><input class="form-control form-control-sm v-hebrew" value="' + esc(item.hebrew) + '"></div>' +
          '<div class="col-auto"><button class="btn btn-sm btn-outline-primary v-save">Save</button></div>' +
          '<div class="col-12"><div class="error alert alert-danger d-none mb-0"></div></div>' +
        '</div>'
      );
      row.querySelector('.v-save').addEventListener('click', () => {
        const english = row.querySelector('.v-english').value.trim();
        const hebrew = row.querySelector('.v-hebrew').value.trim();
        callbacks.onUpdateVocab(item.id, english, hebrew, row);
      });
      list.appendChild(row);
    });
    return list;
  },

  error(message) {
    return el(
      '<div class="alert alert-danger d-flex justify-content-between align-items-center">' +
        '<span>' + esc(message) + '</span>' +
        '<button class="btn btn-outline-primary btn-sm" data-nav="catalog">Back to Catalog</button>' +
      '</div>'
    );
  },
};

window.Views = Views;