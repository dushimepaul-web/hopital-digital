#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_prereq() {
  local cmd=$1
  if ! command -v "$cmd" &>/dev/null; then
    error "$cmd is not installed. Please install it first."
    exit 1
  fi
  info "$cmd found: $($cmd --version 2>&1 | head -1)"
}

check_prerequisites() {
  info "Checking prerequisites..."
  check_prereq node
  check_prereq npm

  if command -v docker &>/dev/null; then
    info "docker found: $(docker --version)"
  else
    warn "docker is not installed. You will need PostgreSQL and Redis running locally."
  fi

  if command -v docker-compose &>/dev/null; then
    info "docker-compose found: $(docker-compose --version)"
  elif docker compose version &>/dev/null; then
    info "docker compose plugin found: $(docker compose version)"
  else
    warn "docker-compose is not installed."
  fi
}

setup_environment() {
  if [ ! -f "backend/.env" ]; then
    cp .env.example backend/.env
    info "Created backend/.env from .env.example"
  else
    info "backend/.env already exists"
  fi
}

install_dependencies() {
  info "Installing backend dependencies..."
  (cd backend && npm install)
  info "Installing frontend dependencies..."
  (cd frontend && npm install)
  info "All dependencies installed."
}

setup_database() {
  info "Generating Prisma client..."
  (cd backend && npx prisma generate)
  info "Running database migrations..."
  (cd backend && npx prisma migrate dev --name init 2>/dev/null || npx prisma migrate dev)
  info "Seeding database..."
  (cd backend && npx prisma db seed 2>/dev/null || warn "Seed skipped")
}

start_services() {
  echo ""
  info "========================================="
  info "  Setup complete!"
  info "========================================="
  echo ""
  info "To start the application:"
  echo ""
  echo "  Terminal 1 (Backend):"
  echo "    cd backend && npm run start:dev"
  echo ""
  echo "  Terminal 2 (Frontend):"
  echo "    cd frontend && npm run dev"
  echo ""
  info "Or with Docker:"
  echo "    docker compose up -d --build"
  echo ""

  read -rp "Start dev servers now? (y/N) " choice
  if [[ "$choice" =~ ^[Yy]$ ]]; then
    info "Starting backend on port 9016..."
    (cd backend && npm run start:dev) &
    BACKEND_PID=$!
    info "Starting frontend on port 5173..."
    (cd frontend && npm run dev) &
    FRONTEND_PID=$!
    info "Backend PID: $BACKEND_PID | Frontend PID: $FRONTEND_PID"
    info "Press Ctrl+C to stop both servers."
    trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' SIGINT SIGTERM
    wait
  fi
}

main() {
  echo ""
  echo "╔═══════════════════════════════════════╗"
  echo "║  Hôpital Digital Network - Setup     ║"
  echo "╚═══════════════════════════════════════╝"
  echo ""
  check_prerequisites
  setup_environment
  install_dependencies
  setup_database
  start_services
}

main
