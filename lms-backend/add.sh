#!/bin/bash

# Check if a package name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <package-name>"
  exit 1
fi

# Remove existing yarn.lock file
rm -f yarn.lock

# Add the specified package
yarn add "$1"

# Run yarn install
yarn install
