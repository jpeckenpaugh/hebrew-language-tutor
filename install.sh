#!/usr/bin/env bash
set -euo pipefail

# Stage 4 — Environment setup script.
# Provisions a reproducible environment from scratch using the system-installed
# Python and installs the Python dependencies. Also fetches the Bootstrap
# CSS/JS from the CDN and hosts it locally (per concept).

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PYTHON="${PYTHON_BIN:-python3}"

STATIC_DIR="$ROOT_DIR/frontend/static/vendor/bootstrap"
BOOTSTRAP_VERSION="5.3.3"
BOOTSTRAP_CSS_URL="https://cdn.jsdelivr.net/npm/bootstrap@${BOOTSTRAP_VERSION}/dist/css/bootstrap.min.css"
BOOTSTRAP_JS_URL="https://cdn.jsdelivr.net/npm/bootstrap@${BOOTSTRAP_VERSION}/dist/js/bootstrap.bundle.min.js"

echo "==> Using Python: $("$PYTHON" --version) ($("$PYTHON" -c "import sys; print(sys.executable)"))"

echo "==> Creating virtual environment at $ROOT_DIR/.venv"
"$PYTHON" -m venv "$ROOT_DIR/.venv"

echo "==> Installing dependencies from requirements.txt"
"$ROOT_DIR/.venv/bin/pip" install --upgrade pip
"$ROOT_DIR/.venv/bin/pip" install -r "$ROOT_DIR/requirements.txt"

echo "==> Fetching Bootstrap ${BOOTSTRAP_VERSION} (hosted locally)"
mkdir -p "$STATIC_DIR/css" "$STATIC_DIR/js"
if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$BOOTSTRAP_CSS_URL" -o "$STATIC_DIR/css/bootstrap.min.css"
    curl -fsSL "$BOOTSTRAP_JS_URL" -o "$STATIC_DIR/js/bootstrap.bundle.min.js"
elif command -v wget >/dev/null 2>&1; then
    wget -qO "$STATIC_DIR/css/bootstrap.min.css" "$BOOTSTRAP_CSS_URL"
    wget -qO "$STATIC_DIR/js/bootstrap.bundle.min.js" "$BOOTSTRAP_JS_URL"
else
    echo "ERROR: neither curl nor wget is available to fetch Bootstrap." >&2
    exit 1
fi
echo "==> Bootstrap files written under $STATIC_DIR"

echo "==> Environment setup complete."