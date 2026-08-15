#!/bin/bash
# Sync web source (repo root) into www/ — the Capacitor iOS webDir.
# Root is the source of truth; never edit www/ by hand.
set -euo pipefail
cd "$(dirname "$0")"

cp ./*.html styles.css script.js sw.js manifest.json www/
rsync -a --delete icons/ www/icons/
rsync -a --delete images/ www/images/

echo "Synced root → www/. Review with: git diff --stat www/"
