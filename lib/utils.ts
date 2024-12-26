import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || 'your-32-byte-length-encryption-k'; // Use an environment variable
const IV_LENGTH = 16; // AES block size for initialization vector (IV)

// Encrypt data
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH); // Initialization vector
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Decrypt data
export function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = textParts.join(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const secretKey = 'your-secret-key'; // Choose a strong secret key

// Encrypt function
export const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

// Decrypt function
export const decryptData = (encryptedData: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8); // Returns decrypted data in UTF-8 format
};
