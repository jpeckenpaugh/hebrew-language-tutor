const lessons = [
  {
    id: 1,
    title: "Greetings & Basics",
    items: [
      { en: "Hello", he: "שלום", tr: "shalom" },
      { en: "Good morning", he: "בוקר טוב", tr: "boker tov" },
      { en: "Good evening", he: "ערב טוב", tr: "erev tov" },
      { en: "Good night", he: "לילה טוב", tr: "laila tov" },
      { en: "Please", he: "בבקשה", tr: "bevakasha" },
      { en: "Thank you", he: "תודה", tr: "toda" },
      { en: "Yes", he: "כן", tr: "ken" },
      { en: "No", he: "לא", tr: "lo" },
      { en: "Goodbye", he: "להתראות", tr: "lehitraot" },
      { en: "How are you?", he: "מה שלומך", tr: "ma shlomcha" }
    ]
  },
  {
    id: 2,
    title: "Numbers",
    items: [
      { en: "One", he: "אחת", tr: "achat" },
      { en: "Two", he: "שתיים", tr: "shtayim" },
      { en: "Three", he: "שלוש", tr: "shalosh" },
      { en: "Four", he: "ארבע", tr: "arba" },
      { en: "Five", he: "חמש", tr: "chamesh" },
      { en: "Six", he: "שש", tr: "shesh" },
      { en: "Seven", he: "שבע", tr: "sheva" },
      { en: "Eight", he: "שמונה", tr: "shmone" },
      { en: "Nine", he: "תשע", tr: "tesha" },
      { en: "Ten", he: "עשר", tr: "eser" }
    ]
  },
  {
    id: 3,
    title: "Family",
    items: [
      { en: "Mother", he: "אמא", tr: "ima" },
      { en: "Father", he: "אבא", tr: "aba" },
      { en: "Sister", he: "אחות", tr: "achot" },
      { en: "Brother", he: "אח", tr: "ach" },
      { en: "Grandmother", he: "סבתא", tr: "savta" },
      { en: "Grandfather", he: "סבא", tr: "saba" },
      { en: "Daughter", he: "בת", tr: "bat" },
      { en: "Son", he: "בן", tr: "ben" },
      { en: "Wife", he: "אישה", tr: "isha" },
      { en: "Husband", he: "בעל", tr: "baal" }
    ]
  },
  {
    id: 4,
    title: "Colors",
    items: [
      { en: "Red", he: "אדום", tr: "adom" },
      { en: "Blue", he: "כחול", tr: "kachol" },
      { en: "Green", he: "ירוק", tr: "yarok" },
      { en: "Yellow", he: "צהוב", tr: "tzahov" },
      { en: "Black", he: "שחור", tr: "shachor" },
      { en: "White", he: "לבן", tr: "lavan" },
      { en: "Orange", he: "כתום", tr: "katom" },
      { en: "Purple", he: "סגול", tr: "sagol" },
      { en: "Brown", he: "חום", tr: "chum" },
      { en: "Pink", he: "ורוד", tr: "varod" }
    ]
  },
  {
    id: 5,
    title: "Food & Drink",
    items: [
      { en: "Water", he: "מים", tr: "mayim" },
      { en: "Bread", he: "לחם", tr: "lechem" },
      { en: "Milk", he: "חלב", tr: "chalav" },
      { en: "Apple", he: "תפוח", tr: "tapuach" },
      { en: "Meat", he: "בשר", tr: "basar" },
      { en: "Coffee", he: "קפה", tr: "kafe" },
      { en: "Tea", he: "תה", tr: "teh" },
      { en: "Egg", he: "ביצה", tr: "beitza" },
      { en: "Fish", he: "דג", tr: "dag" },
      { en: "Cheese", he: "גבינה", tr: "gvina" }
    ]
  }
];

let currentLesson = null;
let currentMode = null;
let currentIndex = 0;
let score = 0;
let options = [];
let answered = false;
let quizWrong = 0;

const $ = (id) => document.getElementById(id);

function showHome() {
  $("homeView").classList.remove("d-none");
  $("lessonView").classList.add("d-none");
  renderLessonList();
}

function renderLessonList() {
  const container = $("lessonList");
  container.innerHTML = "";
  lessons.forEach((lesson) => {
    const col = document.createElement("div");
    col.className = "col-md-4 col-sm-6";
    col.innerHTML = `
      <div class="card lesson-card" data-id="${lesson.id}">
        <div class="card-body">
          <h5 class="card-title">${lesson.title}</h5>
          <p class="card-text text-muted">${lesson.items.length} vocabulary items</p>
        </div>
      </div>`;
    col.querySelector(".lesson-card").addEventListener("click", () => openLesson(lesson.id));
    container.appendChild(col);
  });
}

function openLesson(id) {
  currentLesson = lessons.find((l) => l.id === id);
  $("homeView").classList.add("d-none");
  $("lessonView").classList.remove("d-none");
  $("lessonTitle").textContent = currentLesson.title;
  setMode("study");
}

function setMode(mode) {
  currentMode = mode;
  currentIndex = 0;
  score = 0;
  answered = false;
  quizWrong = 0;
  document.querySelectorAll(".btn-group [data-mode]").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`.btn-group [data-mode="${mode}"]`).classList.add("active");
  renderCurrent();
}

function renderCurrent() {
  const content = $("content");
  if (currentIndex >= currentLesson.items.length) {
    renderResults();
    return;
  }
  if (currentMode === "study") {
    renderStudyItem(currentLesson.items[currentIndex]);
  } else {
    renderQuestion(currentLesson.items[currentIndex]);
  }
}

function renderStudyItem(item) {
  $("content").innerHTML = `
    <div class="card mb-3">
      <div class="card-body study-item">
        <div>
          <div class="fs-5 fw-bold">${item.en}</div>
          <div class="text-muted">${item.tr}</div>
        </div>
        <div class="text-end fs-3">${item.he}</div>
      </div>
    </div>
    <div class="d-flex justify-content-between">
      <button id="prevBtn" class="btn btn-outline-secondary">Previous</button>
      <span class="align-self-center text-muted">${currentIndex + 1} / ${currentLesson.items.length}</span>
      <button id="nextBtn" class="btn btn-primary">Next</button>
    </div>`;
  $("prevBtn").addEventListener("click", () => {
    if (currentIndex > 0) currentIndex--;
    renderCurrent();
  });
  $("nextBtn").addEventListener("click", () => {
    if (currentIndex < currentLesson.items.length - 1) currentIndex++;
    renderCurrent();
  });
}

function renderQuestion(item) {
  buildOptions(item);
  answered = false;
  $("content").innerHTML = `
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="mb-3">${item.he}</h5>
        <div id="options"></div>
      </div>
    </div>
    <div class="d-flex justify-content-between">
      <span class="text-muted align-self-center">${currentIndex + 1} / ${currentLesson.items.length}</span>
      <button id="nextBtn" class="btn btn-primary d-none">Next</button>
    </div>`;
  const optContainer = $("options");
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-secondary option-btn mb-2";
    btn.textContent = opt.en;
    btn.addEventListener("click", () => handleAnswer(item, opt, btn));
    optContainer.appendChild(btn);
  });
  $("nextBtn").addEventListener("click", () => {
    currentIndex++;
    renderCurrent();
  });
}

function buildOptions(correctItem) {
  const distractors = lessons
    .flatMap((l) => l.items)
    .filter((i) => i.en !== correctItem.en);
  const shuffled = shuffle(distractors).slice(0, 3);
  options = shuffle([correctItem, ...shuffled]);
}

function handleAnswer(item, selected, btn) {
  if (answered) return;
  answered = true;
  const allBtns = document.querySelectorAll(".option-btn");
  allBtns.forEach((b) => b.classList.add("disabled-opt"));
  if (selected.en === item.en) {
    btn.classList.add("correct");
    score++;
  } else {
    btn.classList.add("incorrect");
    quizWrong++;
    allBtns.forEach((b) => {
      if (b.textContent === item.en) b.classList.add("correct");
    });
  }
  if (currentMode === "exam") {
    $("nextBtn").classList.remove("d-none");
  } else {
    const btn2 = document.createElement("button");
    btn2.className = "btn btn-primary";
    btn2.textContent = currentIndex < currentLesson.items.length - 1 ? "Next" : "Finish";
    btn2.addEventListener("click", () => {
      currentIndex++;
      renderCurrent();
    });
    $("content").querySelector(".d-flex").appendChild(btn2);
  }
}

function renderResults() {
  const total = currentLesson.items.length;
  const pct = Math.round((score / total) * 100);
  let title = "Exam Complete!";
  let color = "text-success";
  if (pct < 50) { title = "Keep Practicing!"; color = "text-danger"; }
  else if (pct < 80) { title = "Good Job!"; color = "text-warning"; }
  $("content").innerHTML = `
    <div class="card text-center">
      <div class="card-body">
        <h3 class="${color}">${title}</h3>
        <p class="display-4 fw-bold">${score} / ${total}</p>
        <p class="text-muted">${pct}%</p>
      </div>
    </div>
    <div class="d-flex justify-content-center gap-2 mt-3">
      <button id="retryBtn" class="btn btn-primary">Retry</button>
      <button id="studyBtn" class="btn btn-outline-secondary">Study</button>
    </div>`;
  $("retryBtn").addEventListener("click", () => setMode(currentMode));
  $("studyBtn").addEventListener("click", () => setMode("study"));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

$("backBtn").addEventListener("click", showHome);
document.querySelectorAll(".btn-group [data-mode]").forEach((btn) => {
  btn.addEventListener("click", () => setMode(btn.dataset.mode));
});

showHome();