#!/bin/bash

set -e

echo "Linking all local packages globally..."

for dir in packages/*; do
  if [ -f "$dir/package.json" ]; then
    echo "Linking $dir globally..."
    (cd "$dir" && pnpm link --global)
  fi
done

echo "Linking packages into current project..."

for dir in packages/*; do
  if [ -f "$dir/package.json" ]; then
    name=$(jq -r .name "$dir/package.json")
    echo "Linking $name into current project..."
    pnpm link "$name"
  fi
done

echo "All packages linked successfully!"
