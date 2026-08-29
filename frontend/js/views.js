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

/* Curated, searchable emoji set for the Admin lesson emoji picker (Sprint 03
 * feature j). Each entry pairs an emoji with a plain-English name so the picker
 * can be filtered by name. The five seeded-lesson emojis are included. */
const EMOJI_CHOICES = [
  { emoji: '😀', name: 'grinning face' },
  { emoji: '😄', name: 'smiling face with open mouth' },
  { emoji: '😁', name: 'beaming face' },
  { emoji: '😂', name: 'face with tears of joy' },
  { emoji: '🤣', name: 'rolling on the floor laughing' },
  { emoji: '😊', name: 'smiling face with smiling eyes' },
  { emoji: '🥰', name: 'smiling face with hearts' },
  { emoji: '😍', name: 'smiling face with heart-eyes' },
  { emoji: '🤔', name: 'thinking face' },
  { emoji: '😴', name: 'sleeping face' },
  { emoji: '😎', name: 'smiling face with sunglasses' },
  { emoji: '🥳', name: 'partying face' },
  { emoji: '😭', name: 'loudly crying face' },
  { emoji: '😡', name: 'angry face' },
  { emoji: '👋', name: 'waving hand' },
  { emoji: '👏', name: 'clapping hands' },
  { emoji: '👍', name: 'thumbs up' },
  { emoji: '👎', name: 'thumbs down' },
  { emoji: '🙏', name: 'folded hands' },
  { emoji: '💪', name: 'flexed biceps' },
  { emoji: '👨‍👩‍👧', name: 'family' },
  { emoji: '🐶', name: 'dog face' },
  { emoji: '🐱', name: 'cat face' },
  { emoji: '🦊', name: 'fox face' },
  { emoji: '🐸', name: 'frog face' },
  { emoji: '🐔', name: 'chicken' },
  { emoji: '🐝', name: 'honeybee' },
  { emoji: '🌹', name: 'rose' },
  { emoji: '🌻', name: 'sunflower' },
  { emoji: '🍎', name: 'red apple' },
  { emoji: '🍌', name: 'banana' },
  { emoji: '🍇', name: 'grapes' },
  { emoji: '🍞', name: 'bread' },
  { emoji: '🧀', name: 'cheese wedge' },
  { emoji: '☕', name: 'hot beverage' },
  { emoji: '🍰', name: 'shortcake' },
  { emoji: '⚽', name: 'soccer ball' },
  { emoji: '🏀', name: 'basketball' },
  { emoji: '🎈', name: 'balloon' },
  { emoji: '🎁', name: 'wrapped gift' },
  { emoji: '🎯', name: 'direct hit' },
  { emoji: '🎨', name: 'artist palette' },
  { emoji: '🚗', name: 'car' },
  { emoji: '✈️', name: 'airplane' },
  { emoji: '⛵', name: 'sailboat' },
  { emoji: '🏠', name: 'house' },
  { emoji: '🏫', name: 'school' },
  { emoji: '⏰', name: 'alarm clock' },
  { emoji: '🕐', name: 'one oclock' },
  { emoji: '📖', name: 'open book' },
  { emoji: '📘', name: 'blue book' },
  { emoji: '✏️', name: 'pencil' },
  { emoji: '🔢', name: 'input numbers' },
  { emoji: '🔬', name: 'microscope' },
  { emoji: '🌍', name: 'globe showing europe-africa' },
  { emoji: '⚡', name: 'high voltage' },
  { emoji: '❤️', name: 'red heart' },
  { emoji: '⭐', name: 'star' },
  { emoji: '🌈', name: 'rainbow' },
];

/* Searchable emoji picker widget (Bug 04): a button that opens an inline panel
 * with a name-search input and a clickable emoji grid. The chosen emoji is
 * stored in `container.dataset.emojiValue` so callers can read it after the
 * widget is rendered. */
function emojiPicker(selected) {
  const wrap = el(
    '<div class="emoji-picker" data-emoji-value="' + esc(selected || '') + '">' +
      '<button type="button" class="btn btn-outline-secondary emoji-picker-toggle" title="Choose emoji">' +
        esc(selected || '😀') +
      '</button>' +
      '<div class="emoji-picker-panel d-none">' +
        '<input type="text" class="form-control form-control-sm emoji-search mb-2" placeholder="Search emoji by name…">' +
        '<div class="emoji-grid"></div>' +
      '</div>' +
    '</div>'
  );
  const toggle = wrap.querySelector('.emoji-picker-toggle');
  const panel = wrap.querySelector('.emoji-picker-panel');
  const search = wrap.querySelector('.emoji-search');
  const grid = wrap.querySelector('.emoji-grid');

  function renderGrid(filter) {
    grid.innerHTML = '';
    EMOJI_CHOICES
      .filter((c) => !filter || c.name.indexOf(filter) !== -1)
      .forEach((c) => {
        const opt = el(
          '<button type="button" class="emoji-option" data-emoji="' + esc(c.emoji) + '" title="' + esc(c.name) + '">' + esc(c.emoji) + '</button>'
        );
        opt.addEventListener('click', () => {
          wrap.dataset.emojiValue = c.emoji;
          toggle.textContent = c.emoji;
          panel.classList.add('d-none');
        });
        grid.appendChild(opt);
      });
  }

  toggle.addEventListener('click', () => {
    const opening = panel.classList.contains('d-none');
    panel.classList.toggle('d-none');
    if (opening) {
      search.value = '';
      renderGrid('');
      search.focus();
    }
  });
  search.addEventListener('input', () => renderGrid(search.value.trim().toLowerCase()));

  renderGrid('');
  return wrap;
}

function levelOptions(selected) {
  return [1, 2, 3, 4, 5]
    .map((n) => '<option value="' + n + '"' + (n === selected ? ' selected' : '') + '>Level ' + n + '</option>')
    .join('');
}

const Views = {
  /* Title screen: sign-in picker / create account / admin entry.
   * `users` is the list from GET /api/users. `onSignIn(username)` is called
   * with the selected username (selecting alone does not sign in);
   * `onCreate()` opens the Create Account modal; `onAdmin()` opens the
   * (unchanged) dummy admin gate. */
  title(onSignIn, onCreate, onAdmin, users) {
    const wrap = el(
      '<div class="row justify-content-center py-5">' +
        '<div class="col-md-6 col-lg-5">' +
          '<div class="text-center mb-4">' +
            '<h1 class="display-5">English / Hebrew Tutor</h1>' +
            '<p class="text-muted">Sign in or create an account to begin.</p>' +
          '</div>' +
          '<div class="card p-4">' +
            '<form id="titleForm">' +
              '<div class="mb-3" id="pickerGroup">' +
                '<label class="form-label" for="titleUserPicker">Username</label>' +
                '<select class="form-select" id="titleUserPicker"></select>' +
              '</div>' +
              '<div id="titleError" class="alert alert-danger d-none mb-3"></div>' +
              '<div class="d-grid gap-2">' +
                '<button type="submit" class="btn btn-primary" id="titleSignIn">Sign In</button>' +
                '<button type="button" class="btn btn-outline-primary" id="titleCreate">Create Account</button>' +
              '</div>' +
            '</form>' +
            '<hr class="my-4">' +
            '<button class="btn btn-outline-secondary w-100" id="titleAdmin">Admin</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    const picker = wrap.querySelector('#titleUserPicker');
    const signInBtn = wrap.querySelector('#titleSignIn');
    if (users && users.length) {
      users.forEach((u) => {
        const opt = document.createElement('option');
        opt.value = u.username;
        opt.textContent = u.username;
        picker.appendChild(opt);
      });
    } else {
      picker.innerHTML = '<option value="" selected disabled>No accounts yet</option>';
      picker.disabled = true;
      signInBtn.disabled = true;
      picker.parentElement.appendChild(
        el('<div class="alert alert-info mt-2 mb-0">No accounts yet. Use <strong>Create Account</strong> below to create your first account.</div>')
      );
    }
    wrap.querySelector('#titleForm').addEventListener('submit', (e) => {
      e.preventDefault();
      onSignIn(picker.value);
    });
    wrap.querySelector('#titleCreate').addEventListener('click', () => onCreate());
    wrap.querySelector('#titleAdmin').addEventListener('click', () => onAdmin());
    return wrap;
  },

  /* Create Account modal (Bootstrap). `onSubmit(username)` is called with the
   * entered username; blank usernames are rejected by the caller. */
  createAccountModal(onSubmit) {
    const modalEl = el(
      '<div class="modal fade" id="createAccountModal" tabindex="-1" aria-hidden="true">' +
        '<div class="modal-dialog">' +
          '<div class="modal-content">' +
            '<div class="modal-header">' +
              '<h5 class="modal-title">Create Account</h5>' +
              '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
            '</div>' +
            '<form id="createAccountForm">' +
              '<div class="modal-body">' +
                '<label class="form-label" for="createUsername">Username</label>' +
                '<input class="form-control" id="createUsername" autocomplete="username" placeholder="Enter a username" autofocus>' +
                '<div id="createError" class="alert alert-danger d-none mt-3 mb-0"></div>' +
              '</div>' +
              '<div class="modal-footer">' +
                '<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>' +
                '<button type="submit" class="btn btn-primary">Create Account</button>' +
              '</div>' +
            '</form>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    modalEl.querySelector('#createAccountForm').addEventListener('submit', (e) => {
      e.preventDefault();
      onSubmit(modalEl.querySelector('#createUsername').value);
    });
    return modalEl;
  },

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
          '<div class="text-center display-6 mb-2">' + esc(lesson.emoji || '') + '</div>' +
          '<div class="d-flex justify-content-between align-items-start">' +
            '<h5 class="card-title mb-0">' + esc(lesson.title) + '</h5>' +
            '<span class="badge text-bg-secondary">Level ' + esc(lesson.level) + '</span>' +
          '</div>' +
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

  /* Lesson hub: title plus buttons for the three modes. `progress` is an
   * optional { total, known } object (null when unavailable / not signed in). */
  lessonHub(lesson, onMode, progress) {
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
    wrap.appendChild(el('<h2 class="mb-2">' + esc(lesson.title) + ' <span class="badge text-bg-secondary">Level ' + esc(lesson.level) + '</span></h2>'));

    if (progress) {
      const known = Math.min(progress.known, progress.total);
      const pct = progress.total > 0 ? Math.round((known / progress.total) * 100) : 0;
      const progressBar = el(
        '<div class="mb-4">' +
          '<div class="d-flex justify-content-between small text-muted mb-1">' +
            '<span>Your progress</span>' +
            '<span>' + known + ' of ' + progress.total + ' known</span>' +
          '</div>' +
          '<div class="progress" style="height: 0.6rem;">' +
            '<div class="progress-bar" style="width: ' + pct + '%" role="progressbar"></div>' +
          '</div>' +
        '</div>'
      );
      wrap.appendChild(progressBar);
    }

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
          '<div class="d-flex align-items-center gap-3">' +
            '<span class="text-muted" id="studyCount"></span>' +
            '<button class="btn btn-success" id="studyAutoPlay" type="button">▶ Play</button>' +
          '</div>' +
        '</div>' +
        '<div class="card study-item p-4 mb-4 text-center" id="studyCard">' +
          '<div class="term-row mb-2">' +
            '<span class="term-en" id="studyEnglish"></span>' +
            '<button class="tts-icon" id="speakEnglish" type="button" aria-label="Speak English">🔊</button>' +
          '</div>' +
          '<div class="mb-3"><em class="text-muted" id="studyTransliteration"></em></div>' +
          '<div class="term-row mb-3">' +
            '<span class="term-he" id="studyHebrew"></span>' +
            '<button class="tts-icon" id="speakHebrew" type="button" aria-label="Speak Hebrew">🔊</button>' +
          '</div>' +
        '</div>' +
        '<div class="d-flex justify-content-between">' +
          '<button class="btn btn-outline-primary" id="studyPrev">← Previous</button>' +
          '<button class="btn btn-outline-primary" id="studyNext">Next →</button>' +
        '</div>' +
      '</div>'
    );
    wrap.querySelector('[data-back]').addEventListener('click', (e) => { e.preventDefault(); stopAuto(); onExit(); });

    const engEl = wrap.querySelector('#studyEnglish');
    const hebEl = wrap.querySelector('#studyHebrew');
    const transEl = wrap.querySelector('#studyTransliteration');
    const countEl = wrap.querySelector('#studyCount');
    const prevBtn = wrap.querySelector('#studyPrev');
    const nextBtn = wrap.querySelector('#studyNext');
    const speakEnBtn = wrap.querySelector('#speakEnglish');
    const speakHeBtn = wrap.querySelector('#speakHebrew');
    const autoPlayBtn = wrap.querySelector('#studyAutoPlay');

    let currentUtter = null;
    // Auto-Play state (Sprint 03 feature d).
    let playing = false;
    let autoTimer = null;

    function speak(text, lang) {
      if (!('speechSynthesis' in window)) return;
      const clean = String(text).replace(/[!?.,؛،;:]+$/g, '').trim();
      if (!clean) return;
      if (currentUtter) {
        window.speechSynthesis.cancel();
        currentUtter = null;
      }
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = lang;
      const finish = () => {
        currentUtter = null;
        window.speechSynthesis.resume();
      };
      utter.onend = finish;
      utter.onerror = finish;
      currentUtter = utter;
      window.speechSynthesis.speak(utter);
    }

    function render() {
      const item = vocab[index];
      engEl.textContent = item.english;
      hebEl.textContent = item.hebrew;
      transEl.textContent = item.transliteration || '';
      countEl.textContent = (index + 1) + ' / ' + vocab.length;
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === vocab.length - 1;
    }

    function inDocument() {
      return document.body.contains(autoPlayBtn);
    }

    function updatePlayBtn() {
      autoPlayBtn.textContent = playing ? '■ Stop' : '▶ Play';
      autoPlayBtn.classList.toggle('btn-success', !playing);
      autoPlayBtn.classList.toggle('btn-danger', playing);
    }

    function stopAuto() {
      playing = false;
      clearTimeout(autoTimer);
      autoTimer = null;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      updatePlayBtn();
    }

    // Speaks the current item's English term, pauses ~2s, speaks the Hebrew
    // term, pauses ~4s, then advances to the next item. On browsers without
    // speech support the same fixed timing advances items with no audio.
    function playItem() {
      if (!playing || !inDocument()) return;
      const item = vocab[index];
      if (item) speak(item.english, 'en-US');
      autoTimer = setTimeout(() => {
        if (!playing || !inDocument()) return;
        if (vocab[index]) speak(vocab[index].hebrew, 'he-IL');
        autoTimer = setTimeout(() => {
          if (!playing || !inDocument()) return;
          if (index < vocab.length - 1) {
            index += 1;
            render();
            playItem();
          } else {
            stopAuto();
          }
        }, 4000);
      }, 2000);
    }

    function toggleAuto() {
      if (playing) { stopAuto(); return; }
      playing = true;
      updatePlayBtn();
      playItem();
    }

    // Resync playback to the item just navigated to while continuing to play.
    function resyncAuto() {
      if (!playing) return;
      clearTimeout(autoTimer);
      autoTimer = null;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      playItem();
    }

    speakEnBtn.addEventListener('click', () => {
      const item = vocab[index];
      if (item) speak(item.english, 'en-US');
    });
    speakHeBtn.addEventListener('click', () => {
      const item = vocab[index];
      if (item) speak(item.hebrew, 'he-IL');
    });

    autoPlayBtn.addEventListener('click', toggleAuto);

    prevBtn.addEventListener('click', () => { if (index > 0) { index -= 1; render(); resyncAuto(); } });
    nextBtn.addEventListener('click', () => { if (index < vocab.length - 1) { index += 1; render(); resyncAuto(); } });

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
      promptEl.textContent = q.prompt;
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
      promptEl.textContent = q.prompt;
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
      // Neutral selection indicator (Sprint 03 feature e): show the chosen
      // option without revealing whether it is correct.
      const chosenBtn = optionsEl.querySelector('[data-opt="' + chosen.id + '"]');
      if (chosenBtn) chosenBtn.classList.add('selected');
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

  /* Results screen shared by quiz and exam. `onExit` goes back to the hub.
   * `reviewOpts` ({ scoreId, wrongCount, onReview }) enables the
   * incorrect-answer review when the attempt had wrong answers. */
  results(mode, correct, total, onExit, reviewOpts) {
    const pct = Math.round((correct / total) * 100);
    const wrongCount = reviewOpts ? reviewOpts.wrongCount : 0;
    const wrap = el(
      '<div class="text-center py-4">' +
        '<h2 class="mb-4">' + (mode === 'quiz' ? 'Quiz' : 'Exam') + ' Complete</h2>' +
        '<div class="score-display text-primary mb-2">' + pct + '%</div>' +
        '<p class="text-muted mb-1">' + correct + ' correct out of ' + total + ' questions</p>' +
        '<p class="text-muted mb-4">Your result has been saved.</p>' +
        '<div class="d-flex justify-content-center gap-2 flex-wrap">' +
          '<button class="btn btn-primary" id="resBack">Back to Lesson</button>' +
          '<button class="btn btn-outline-primary" data-nav="catalog">All Lessons</button>' +
          (wrongCount > 0 && reviewOpts
            ? '<button class="btn btn-outline-danger" id="resReview">Review ' + wrongCount + ' Incorrect</button>'
            : '') +
        '</div>' +
      '</div>'
    );
    wrap.querySelector('#resBack').addEventListener('click', () => onExit());
    const reviewBtn = wrap.querySelector('#resReview');
    if (reviewBtn) reviewBtn.addEventListener('click', () => reviewOpts.onReview());
    return wrap;
  },

  /* Incorrect-answer review for a finished quiz/exam attempt. `onBack`
     * returns to the results screen. */
  review(review, onBack) {
    const wrap = el('<div></div>');
    wrap.appendChild(
      el(
        '<div class="d-flex justify-content-between align-items-center mb-3">' +
          '<h2 class="mb-0">Incorrect Answers</h2>' +
          '<button class="btn btn-outline-secondary" id="reviewBack">← Back</button>' +
        '</div>'
      )
    );
    wrap.querySelector('#reviewBack').addEventListener('click', () => onBack());

    if (!review.wrong.length) {
      wrap.appendChild(el('<div class="alert alert-success">Great job — you answered everything correctly!</div>'));
      return wrap;
    }

    const rows = review.wrong.map((w) =>
      '<div class="card p-3 mb-3">' +
        '<div class="d-flex justify-content-between align-items-start gap-3">' +
          '<div>' +
            '<div class="fw-semibold">' + esc(w.english) + '</div>' +
            '<div class="text-muted"><em>' + esc(w.transliteration || '') + '</em></div>' +
          '</div>' +
          '<div class="text-end">' +
            '<div class="fs-5">' + esc(w.hebrew) + '</div>' +
            '<div class="small text-success">correct answer</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    ).join('');

    wrap.appendChild(el('<div>' + rows + '</div>'));
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

  /* Admin panel: lesson list with expand/collapse + edit/add. */
  adminPanel(lessons, callbacks) {
    const wrap = el('<div></div>');
    wrap.appendChild(
      el(
        '<div class="d-flex justify-content-between align-items-center mb-3">' +
          '<h2 class="mb-0">Admin</h2>' +
        '</div>'
      )
    );

    // Add new lesson form.
    const addLesson = el(
      '<div class="card p-3 mb-4">' +
        '<h6 class="mb-3">Add New Lesson</h6>' +
        '<div class="row g-2 align-items-center">' +
          '<div class="col-12 col-md-5"><input class="form-control" id="newLessonTitle" placeholder="Lesson title"></div>' +
          '<div class="col-6 col-md-3"><select class="form-select" id="newLessonLevel">' + levelOptions(1) + '</select></div>' +
          '<div class="col-6 col-md-3"><select class="form-select" id="newLessonLevel">' + levelOptions(1) + '</select></div>' +
          '<div class="col-6 col-md-3"><div id="newLessonEmoji"></div></div>' +
          '<div class="col-12 col-md-1"><button class="btn btn-primary" id="addLessonBtn">Add</button></div>' +
        '</div>' +
        '<div id="addLessonError" class="alert alert-danger d-none mt-2 mb-0"></div>' +
      '</div>'
    );
    addLesson.querySelector('#newLessonEmoji').appendChild(emojiPicker('📘'));
    addLesson.querySelector('#addLessonBtn').addEventListener('click', () => {
      const title = addLesson.querySelector('#newLessonTitle').value.trim();
      if (!title) return;
      const level = parseInt(addLesson.querySelector('#newLessonLevel').value, 10);
      const emoji = addLesson.querySelector('#newLessonEmoji .emoji-picker').dataset.emojiValue;
      callbacks.onAddLesson(title, level, emoji);
    });
    wrap.appendChild(addLesson);

    lessons.forEach((lesson) => {
      const card = el(
        '<div class="card p-3 mb-3">' +
          '<div class="d-flex justify-content-between align-items-center gap-2 flex-wrap">' +
            '<input class="form-control lesson-title-input" style="max-width:280px" value="' + esc(lesson.title) + '">' +
            '<select class="form-select lesson-level-select" style="max-width:120px">' + levelOptions(lesson.level) + '</select>' +
            '<div class="lesson-emoji-widget"></div>' +
            '<button class="btn btn-outline-primary save-title-btn">Save</button>' +
            '<button class="btn btn-link toggle-vocab">' + esc(lesson.vocab_count) + ' items ▾</button>' +
          '</div>' +
          '<div class="vocab-list mt-3 d-none"></div>' +
          '<div class="add-vocab mt-3 d-none">' +
            '<div class="input-group">' +
              '<input class="form-control new-english" placeholder="English">' +
              '<input class="form-control new-hebrew" placeholder="Hebrew">' +
              '<input class="form-control new-translit" placeholder="Transliteration">' +
              '<button class="btn btn-primary add-vocab-btn">Add Item</button>' +
            '</div>' +
            '<div class="error alert alert-danger d-none mt-2 mb-0"></div>' +
          '</div>' +
        '</div>'
      );
      const titleInput = card.querySelector('.lesson-title-input');
      const levelSelect = card.querySelector('.lesson-level-select');
      const emojiWidget = emojiPicker(lesson.emoji);
      card.querySelector('.lesson-emoji-widget').appendChild(emojiWidget);
      const saveBtn = card.querySelector('.save-title-btn');
      const toggleBtn = card.querySelector('.toggle-vocab');
      const vocabList = card.querySelector('.vocab-list');
      const addVocab = card.querySelector('.add-vocab');

      saveBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const level = parseInt(levelSelect.value, 10);
        const emoji = emojiWidget.dataset.emojiValue;
        if (title) callbacks.onUpdateLesson(lesson.id, title, level, emoji);
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
        const transliteration = card.querySelector('.new-translit').value.trim();
        if (english && hebrew && transliteration) callbacks.onAddVocab(lesson.id, english, hebrew, transliteration, card);
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
          '<div class="col"><input class="form-control form-control-sm v-translit" value="' + esc(item.transliteration || '') + '"></div>' +
          '<div class="col-auto"><button class="btn btn-sm btn-outline-primary v-save">Save</button></div>' +
          '<div class="col-12"><div class="error alert alert-danger d-none mb-0"></div></div>' +
        '</div>'
      );
      row.querySelector('.v-save').addEventListener('click', () => {
        const english = row.querySelector('.v-english').value.trim();
        const hebrew = row.querySelector('.v-hebrew').value.trim();
        const transliteration = row.querySelector('.v-translit').value.trim();
        callbacks.onUpdateVocab(item.id, english, hebrew, transliteration, row);
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