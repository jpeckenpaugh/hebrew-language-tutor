#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
ARTIFACTS_DIR=${TEST_ARTIFACTS_DIR:-"$ROOT/test-artifacts"}
case "$ARTIFACTS_DIR" in
  /*) ;;
  *) ARTIFACTS_DIR="$ROOT/$ARTIFACTS_DIR" ;;
esac
mkdir -p "$ARTIFACTS_DIR"
docker build -t hebrew-language-tutor-test:local "$ROOT/test-runner"
docker run --rm --init --name hebrew-language-tutor-test \
  -e WORKSPACE_DIR="/game" \
  -e ARTIFACTS_DIR="/artifacts" \
  -v "$ROOT:/game:ro" -v "$ARTIFACTS_DIR:/artifacts" \
  hebrew-language-tutor-test:local

echo "Syncing artifacts to demos/latest..."
mkdir -p "$ROOT/demos/latest/gallery"
if [ -f "$ARTIFACTS_DIR/demo.webm" ]; then
  cp "$ARTIFACTS_DIR/demo.webm" "$ROOT/demos/latest/demo.webm"
fi
if [ -d "$ARTIFACTS_DIR/gallery" ]; then
  cp "$ARTIFACTS_DIR/gallery/"*.png "$ROOT/demos/latest/gallery/"
fi
if [ -f "$ARTIFACTS_DIR/gallery/01-curriculum-overview.png" ]; then
  cp "$ARTIFACTS_DIR/gallery/01-curriculum-overview.png" "$ROOT/demos/latest/poster.png"
fi
if [ -f "$ARTIFACTS_DIR/poster.webp" ]; then
  cp "$ARTIFACTS_DIR/poster.webp" "$ROOT/demos/latest/poster.webp"
fi
echo "Artifacts synced successfully."
