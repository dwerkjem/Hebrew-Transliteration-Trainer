#!/usr/bin/env bash
set -euo pipefail

# Path to the file to clean
FILE="../trimmed.csv"

# Verify that the file exists
if [[ ! -f "$FILE" ]]; then
  echo "Error: File '$FILE' not found." >&2
  exit 1
fi

# Remove all Left-to-Right Marks (U+200E) in-place
# \xE2\x80\x8E is the UTF-8 byte sequence for U+200E
sed -i 's/\xE2\x80\x8E//g' "$FILE"

echo "✅ Removed all U+200E characters from '$FILE'"
