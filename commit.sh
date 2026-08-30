#!/bin/bash

# Prompt the user for input and store it in a variable named 'commit_msg'
read -p "Enter your commit message: " commit_msg

# Check if the user entered an empty message
if [ -z "$commit_msg" ]; then
  echo "Error: Commit message cannot be empty. Aborting."
  exit 1
fi

# Run the Git commands using the stored variable
git add .
git commit -m "$commit_msg"
git push origin main
echo "Changes committed successfully!"
