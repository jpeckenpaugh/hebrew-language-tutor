import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { execSync } from "node:child_process";

const workspaceDir = process.env.WORKSPACE_DIR || path.resolve("..");
const staticDir = path.join(workspaceDir, "proof-of-concept");
const artifactsDir = process.env.ARTIFACTS_DIR || path.join(workspaceDir, "test-artifacts");
const galleryDir = path.join(artifactsDir, "gallery");

fs.mkdirSync(artifactsDir, { recursive: true });
fs.mkdirSync(galleryDir, { recursive: true });

const mimeMap = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;
  if (pathname === "/" || pathname === "") pathname = "/index.html";
  const filePath = path.join(staticDir, pathname);

  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.end("Not Found");
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": mimeMap[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
});

await new Promise((resolve) => server.listen(8080, "0.0.0.0", resolve));
console.log("Local static server running on http://localhost:8080");

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"]
});

const rawVideoDir = path.join(artifactsDir, "raw-video");
fs.mkdirSync(rawVideoDir, { recursive: true });

const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
  recordVideo: {
    dir: rawVideoDir,
    size: { width: 1280, height: 720 }
  }
});

const page = await context.newPage();

async function injectHebrewFonts() {
  await page.addStyleTag({
    content: `
      @import url('https://fonts.googleapis.com/css2?family=Alef:wght@400;700&family=Noto+Sans+Hebrew:wght@400;600;700&display=swap');
      body, button, .card-title, .lead, h1, h2, h3, h5 {
        font-family: 'Noto Sans Hebrew', 'Alef', system-ui, -apple-system, sans-serif !important;
      }
      .study-item .fs-3, h5.mb-3 {
        font-family: 'Noto Sans Hebrew', 'Alef', 'David', 'Times New Roman', serif !important;
        letter-spacing: 0.5px;
      }
    `
  });
}

console.log("Navigating to site...");
await page.goto("http://localhost:8080/");
await injectHebrewFonts();
await page.waitForTimeout(1000);

// GALLERY 1: Curriculum Overview
console.log("Capturing Gallery 1: Curriculum Overview...");
// Hover over the first card
const lesson1Card = page.locator('.lesson-card[data-id="1"]');
await lesson1Card.hover();
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(galleryDir, "01-curriculum-overview.png") });

// VIDEO BEATS 00-04s: Showcase lessons
const lessonCards = page.locator('.lesson-card');
const count = await lessonCards.count();
for (let i = 1; i < count; i++) {
  await lessonCards.nth(i).hover();
  await page.waitForTimeout(600);
}

// VIDEO BEATS 04-10s: Enter Lesson 1 Study Mode
console.log("Entering Lesson 1 Study Mode...");
await lesson1Card.click();
await page.waitForTimeout(500);
await injectHebrewFonts();
await page.waitForTimeout(600);

// GALLERY 2: Bilingual Study Flashcard
console.log("Capturing Gallery 2: Study Flashcard...");
await page.screenshot({ path: path.join(galleryDir, "02-study-flashcard-nikud-greetings.png") });

// Step through study items
for (let step = 0; step < 4; step++) {
  const nextBtn = page.locator('#nextBtn');
  if (await nextBtn.isVisible()) {
    await nextBtn.hover();
    await page.waitForTimeout(300);
    await nextBtn.click();
    await page.waitForTimeout(700);
  }
}

// Switch to Lesson 4: Colors for culinary/vibrant study review
console.log("Switching to Colors Study...");
await page.locator('#backBtn').click();
await page.waitForTimeout(500);
await page.locator('.lesson-card[data-id="4"]').click();
await page.waitForTimeout(500);
await injectHebrewFonts();
await page.waitForTimeout(600);

// GALLERY 6: Colors / Vocabulary Study Session
console.log("Capturing Gallery 6: Vocabulary Study Session...");
await page.screenshot({ path: path.join(galleryDir, "06-food-and-drink-study-session.png") });

// VIDEO BEATS 10-18s: Quiz Mode Drills & Feedback
console.log("Switching to Quiz Mode...");
await page.locator('button[data-mode="quiz"]').click();
await page.waitForTimeout(500);
await injectHebrewFonts();
await page.waitForTimeout(700);

// Answer a question correctly to demonstrate emerald feedback
// Find correct answer button for current item
async function answerQuizQuestion() {
  const heText = await page.locator('#content h5.mb-3').textContent();
  const optButtons = page.locator('#options .option-btn');
  const optCount = await optButtons.count();
  // We can just click the first button or hover then click
  if (optCount > 0) {
    await optButtons.first().hover();
    await page.waitForTimeout(400);
    await optButtons.first().click();
    await page.waitForTimeout(800);
  }
}

await answerQuizQuestion();

// GALLERY 3: Real-Time Quiz Drill
console.log("Capturing Gallery 3: Quiz Interactive Feedback...");
await page.screenshot({ path: path.join(galleryDir, "03-quiz-mode-interactive-feedback.png") });

// Advance quiz
const nextQuizBtn = page.locator('#content .d-flex button.btn-primary:not(.d-none)');
if (await nextQuizBtn.count() > 0 && await nextQuizBtn.first().isVisible()) {
  await nextQuizBtn.first().click();
  await page.waitForTimeout(700);
  await answerQuizQuestion();
  await page.waitForTimeout(800);
}

// VIDEO BEATS 18-24s: Exam Mode Numbers
console.log("Switching to Numbers Exam Mode...");
await page.locator('#backBtn').click();
await page.waitForTimeout(500);
// Open Numbers (Lesson 2)
await page.locator('.lesson-card[data-id="2"]').click();
await page.waitForTimeout(500);
await page.locator('button[data-mode="exam"]').click();
await page.waitForTimeout(500);
await injectHebrewFonts();
await page.waitForTimeout(600);

// GALLERY 4: Rigorous Vocabulary Exam
console.log("Capturing Gallery 4: Exam Mode Numbers...");
await page.screenshot({ path: path.join(galleryDir, "04-exam-mode-numbers.png") });

// Complete the 10 exam questions with 100% score
console.log("Running through 10-question Exam to 100% score...");
for (let q = 0; q < 10; q++) {
  await page.waitForTimeout(300);
  // Find which button contains the correct answer
  // The client script has `options` matching items
  // Or we evaluate in page context to click the exact matching option
  await page.evaluate(() => {
    const hebrewHeading = document.querySelector("#content h5")?.textContent?.trim();
    if (!hebrewHeading) return;
    const lesson = window.lessons?.find(l => l.id === window.currentLesson?.id) || window.currentLesson;
    const item = lesson?.items?.find(i => i.he === hebrewHeading);
    if (!item) {
      document.querySelector("#options .option-btn")?.click();
      return;
    }
    const btns = Array.from(document.querySelectorAll("#options .option-btn"));
    const match = btns.find(b => b.textContent.trim() === item.en);
    if (match) match.click();
    else btns[0]?.click();
  });
  await page.waitForTimeout(300);
  const examNext = page.locator('#nextBtn');
  if (await examNext.isVisible()) {
    await examNext.click();
  }
}

await page.waitForTimeout(800);
await injectHebrewFonts();

// GALLERY 5: Performance & Mastery Scorecard
console.log("Capturing Gallery 5: Exam Results Mastery...");
await page.screenshot({ path: path.join(galleryDir, "05-exam-results-mastery.png") });

// VIDEO BEATS 24-30s: Finale celebration & navigation
await page.locator('#studyBtn').hover();
await page.waitForTimeout(800);
await page.locator('#backBtn').click();
await page.waitForTimeout(1000);
const finalCard = page.locator('.lesson-card[data-id="1"]');
await finalCard.hover();
await page.waitForTimeout(1200);

console.log("Closing browser context to finalize video...");
await page.close();
await context.close();
await browser.close();
server.close();

// Process video
const videoFiles = fs.readdirSync(rawVideoDir).filter(f => f.endsWith(".webm"));
if (videoFiles.length > 0) {
  const rawVideoPath = path.join(rawVideoDir, videoFiles[0]);
  const finalVideoPath = path.join(artifactsDir, "demo.webm");
  console.log(`Transcoding ${rawVideoPath} -> ${finalVideoPath}...`);
  execSync(`ffmpeg -y -i "${rawVideoPath}" -c:v libvpx-vp9 -b:v 1200k -crf 28 -an "${finalVideoPath}"`, { stdio: "inherit" });
}

// Generate poster thumbnail webp from Gallery 1
const posterSrc = path.join(galleryDir, "01-curriculum-overview.png");
const posterWebp = path.join(artifactsDir, "poster.webp");
if (fs.existsSync(posterSrc)) {
  console.log(`Generating poster ${posterWebp}...`);
  execSync(`ffmpeg -y -i "${posterSrc}" -vf "scale=640:360" "${posterWebp}"`, { stdio: "inherit" });
}

console.log("All Hebrew Language Tutor artifacts generated successfully!");
