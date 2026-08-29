# English / Hebrew Language Tutor

A simple web app for learning basic Hebrew vocabulary. It includes 5 lessons, each with 10 vocabulary items, and supports three learning modes: Study, Quiz, and Exam.

> This is the "proof of concept" experiment — a single-pass static SPA with
> hardcoded vocabulary. See the repo-root
> [`COMPARISON.md`](../COMPARISON.md) for how it compares to the primary
> client/server build, documented in the root [`README.md`](../README.md).

## Features

- **5 lessons** covering Greetings & Basics, Numbers, Family, Colors, and Food & Drink.
- **Study mode**: flip through each vocabulary item with its transliteration.
- **Quiz mode**: multiple-choice questions with immediate right/wrong feedback.
- **Exam mode**: multiple-choice questions with results shown at the end.
- Built with **Bootstrap 5** (hosted locally) and vanilla JavaScript.
- Language logic is separated into dedicated files: no CSS or JS embedded in `index.html`.

## Files

| File        | Purpose                                        |
|-------------|------------------------------------------------|
| `index.html`| Main HTML structure                            |
| `style.css` | Custom CSS rules                               |
| `scripts.js`| All JavaScript (lessons, modes, logic)         |
| `README.md` | This file                                      |
| `run.sh`    | Runs a local Python server on port 8080        |
| `vendor/`   | Locally hosted Bootstrap 5 CSS/JS files        |

## Requirements

- Python 3 (for the local server)

## How to Run

1. Open a terminal in the project directory.
2. Start the server:

   ```bash
   ./run.sh
   ```

   The server runs on port **8080** by default. To use a different port, pass it as an argument:

   ```bash
   ./run.sh 3000
   ```

3. Open your browser and go to **http://localhost:8080**.

## How to Use

1. On the home page, pick a lesson.
2. Choose a mode:
   - **Study** – browse each vocabulary item.
   - **Quiz** – answer multiple-choice questions and get immediate feedback.
   - **Exam** – answer all questions and see your score at the end.
3. Use the **Retry** button to take a mode again, or **Study** to review the words.

## About the Vocabulary

Each vocabulary item shows the English word, the Hebrew word, and a transliteration (pronunciation guide). The quiz and exam ask you to match a Hebrew word to its English meaning.