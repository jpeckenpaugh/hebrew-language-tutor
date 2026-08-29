#!/usr/bin/env bash
set -euo pipefail

# Stage 4 — Run / start script.
# Starts the FastAPI application using the provisioned virtual environment.
# Usage: ./run.sh [PORT]   (defaults to 8000)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PORT="${1:-8000}"

if [ ! -x "$ROOT_DIR/.venv/bin/uvicorn" ]; then
    echo "ERROR: virtual environment not provisioned. Run ./install.sh first." >&2
    exit 1
fi

HOST="${HOST:-0.0.0.0}"

echo "==> Starting application on ${HOST}:${PORT}"
cd "$ROOT_DIR/backend"
exec "$ROOT_DIR/.venv/bin/uvicorn" app.main:app --host "$HOST" --port "$PORT"