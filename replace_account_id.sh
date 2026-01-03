#!/bin/bash

# This script replaces AWS Account IDs with the placeholder {ACCOUNT ID} in all staged files
find . -type f \( -name "*.json" -o -name "*.md" \) -exec sed -i 's/"accountId": "[0-9]\{12\}"/"accountId": "{ACCOUNT ID}"/g' {} +
