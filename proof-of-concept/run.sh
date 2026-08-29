#!/usr/bin/env bash
set -e

PORT="${1:-8080}"
cd "$(dirname "$0")"

echo "Starting server on http://localhost:${PORT}"
python3 -m http.server "${PORT}"