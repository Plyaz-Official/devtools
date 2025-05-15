#!/bin/bash

set -e

echo "Setting up development environment..."

pnpm install

if [ -f scripts/link-all.sh ]; then
  bash scripts/link-all.sh
fi

echo "Setup complete."
