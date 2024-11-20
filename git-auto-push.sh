#!/bin/bash

# Define the path to the log file
LOG_FILE="/Users/robertaperios/Desktop/stone-code/real-estate/git-auto-push.log"

# Log the time the script was triggered
echo "Triggered at $(date)" >> "$LOG_FILE"

# Navigate to the project directory
cd /Users/robertaperios/Desktop/stone-code/real-estate || { 
    echo "Failed to navigate to project directory" >> "$LOG_FILE"; 
    exit 1; 
}

# Add changes to Git
echo "Adding changes..." >> "$LOG_FILE"
git add . >> "$LOG_FILE" 2>&1

# Commit changes with a timestamp message
echo "Committing changes..." >> "$LOG_FILE"
git commit -m "Auto-commit: $(date)" >> "$LOG_FILE" 2>&1

# Push changes to the 'main' branch
echo "Pushing changes to GitHub..." >> "$LOG_FILE"
git push origin main >> "$LOG_FILE" 2>&1

# Log completion
echo "Completed at $(date)" >> "$LOG_FILE"

