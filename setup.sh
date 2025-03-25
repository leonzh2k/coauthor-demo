#!/bin/bash

echo "Setting up git hooks..."
git config core.hooksPath ./hooks
echo "Done."
echo "Setting up auto remote tracking..."
git config --global push.autoSetupRemote true
echo "Done."
echo "Setting up vscode as commit message editor..."
git config --global core.editor "code --wait"
echo "Done."
if [ -z "$( ls -A 'node_modules' )" ]; then
   echo "node_modules is empty, installing dependencies..."
   npm ci
else
   echo "node_modules non-empty, skipping dependency installation."
fi
echo "Creating database if not existing..."
npm run db:create -w @coauthor/backend
echo "Done."
echo "Getting latest database schema..."
npm run migrate:latest -w @coauthor/backend
echo "Done."
echo "Ready to start developing!"