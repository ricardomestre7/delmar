#!/usr/bin/env bash
# Copia modules/metrics-engine para dentro dos templates que o usam (cada template tem de ser autónomo no build do Coolify).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/modules/metrics-engine"
for T in 02-api-backend 04-worker-processor; do
  DEST="$ROOT/templates/$T/src/metrics-engine"
  rm -rf "$DEST"; mkdir -p "$DEST"
  cp -r "$SRC/index.js" "$SRC/domains" "$DEST/"
  echo "sincronizado -> templates/$T/src/metrics-engine"
done
