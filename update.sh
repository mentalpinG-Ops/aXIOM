#!/usr/bin/env bash
# aXIOM — Local Installation Update Script
# =========================================
#
# Run this script to update your aXIOM installation to the latest version.
# Your data (requirement sets and assessment history) is backed up automatically
# before any changes are made.
#
# Usage:
#   bash update.sh
#
# Requirements:
#   - Docker must be installed and running.
#   - Run this script from the directory that contains your docker-compose.yml.
#
# What this script does:
#   1. Creates a timestamped backup of your database.
#   2. Downloads the latest aXIOM images.
#   3. Restarts the application (schema migrations run automatically on startup).
#   4. Checks that the application came back up correctly.
#   5. Tells you where the backup is stored and how to restore if needed.

set -euo pipefail

export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# ── Configurable values (read from environment or use defaults) ───────────────
BACKUP_DIR="${AXIOM_BACKUP_DIR:-./backups}"
AXIOM_PORT="${AXIOM_PORT:-8000}"
DB_NAME="${POSTGRES_DB:-axiom}"
DB_USER="${POSTGRES_USER:-axiom}"
HEALTH_CHECK_TIMEOUT="${AXIOM_HEALTH_TIMEOUT:-60}"
HEALTH_URL="http://localhost:${AXIOM_PORT}/health"

# ── Colour output helpers ──────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

info()  { echo -e "${GREEN}[aXIOM]${NC} $*"; }
warn()  { echo -e "${YELLOW}[aXIOM]${NC} $*"; }
error() { echo -e "${RED}[aXIOM]${NC} $*" >&2; }
abort() { error "$*"; exit 1; }

# ── Pre-flight checks ──────────────────────────────────────────────────────────
command -v docker >/dev/null 2>&1 \
    || abort "Docker is not installed. Please install Docker Desktop and try again."

docker compose version >/dev/null 2>&1 \
    || abort "Docker Compose is not available. Please update Docker Desktop and try again."

[ -f "docker-compose.yml" ] \
    || abort "docker-compose.yml not found. Please run this script from your aXIOM installation directory."

# ── Introduction ───────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}aXIOM Update — $(date)${NC}"
echo ""
echo "  This script will:"
echo "    1. Back up your data (requirement sets and assessment history)"
echo "    2. Download the latest version of aXIOM"
echo "    3. Restart the application with the new version"
echo ""
echo "  Your data will not be deleted at any point during this process."
echo "  If anything goes wrong you will receive step-by-step restore instructions."
echo ""
read -rp "  Continue? [y/N] " CONFIRM
[[ "${CONFIRM:-n}" =~ ^[Yy]$ ]] || { info "Update cancelled. No changes were made."; exit 0; }
echo ""

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/axiom_backup_${TIMESTAMP}.sql"

# ── Step 1: Back up the database ───────────────────────────────────────────────
info "Step 1 of 4 — Backing up your data..."

mkdir -p "${BACKUP_DIR}"

DB_RUNNING=$(docker compose ps --quiet db 2>/dev/null || true)

if [ -n "${DB_RUNNING}" ]; then
    docker compose exec -T db \
        pg_dump -U "${DB_USER}" --encoding=UTF8 "${DB_NAME}" \
        > "${BACKUP_FILE}" \
        || abort "Backup failed. Your installation has not been changed. Please report this issue: https://github.com/mentalpinG-Ops/aXIOM/issues"

    info "Backup saved: ${BACKUP_FILE}"
else
    warn "Database is not running — skipping backup (this is normal for a first-time setup)."
fi

# ── Step 2: Pull the latest images ────────────────────────────────────────────
info "Step 2 of 4 — Downloading the latest version..."

docker compose pull \
    || abort "Download failed. Please check your internet connection and try again. Your data has not been changed."

# ── Step 3: Restart with new version ──────────────────────────────────────────
info "Step 3 of 4 — Applying the update..."

docker compose down --timeout 30
# Schema migrations run automatically as part of the application startup sequence.
docker compose up --detach

# ── Step 4: Health check ───────────────────────────────────────────────────────
info "Step 4 of 4 — Checking that the application started correctly..."

WAITED=0
STARTED=false

while [ "${WAITED}" -lt "${HEALTH_CHECK_TIMEOUT}" ]; do
    if curl -sf "${HEALTH_URL}" >/dev/null 2>&1; then
        STARTED=true
        break
    fi
    sleep 3
    WAITED=$((WAITED + 3))
done

if [ "${STARTED}" = false ]; then
    echo ""
    error "The application did not start correctly after the update."
    error ""
    error "Your data is safe. To restore to the previous version, run:"
    error ""
    error "  docker compose down"
    error "  # Re-tag or re-pull the previous image version, then:"
    error "  docker compose up --detach"
    error ""
    if [ -f "${BACKUP_FILE}" ]; then
        error "If your database was also affected, restore from backup:"
        error ""
        error "  docker compose exec -T db psql -U ${DB_USER} ${DB_NAME} < ${BACKUP_FILE}"
        error ""
    fi
    error "Please report this issue: https://github.com/mentalpinG-Ops/aXIOM/issues"
    exit 1
fi

# ── Success ────────────────────────────────────────────────────────────────────
echo ""
info "Update complete. aXIOM is running."
info "Open your browser: http://localhost:${AXIOM_PORT}"
echo ""
if [ -f "${BACKUP_FILE}" ]; then
    info "Pre-update backup: ${BACKUP_FILE}"
    info "You can delete this file once you are satisfied with the update."
fi
echo ""
