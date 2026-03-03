Web3 Encrypted File Vault

A secure client-side encrypted file vault powered by Web3 wallet authentication.

Files are encrypted locally using AES-GCM before being uploaded to storage.
The server never sees plaintext files or encryption keys, making the system zero-knowledge by design.

Encryption keys are derived from a wallet signature + user PIN, ensuring that only the wallet owner can decrypt the stored files.

Features

Client-side AES-GCM encryption

Web3 wallet-based key derivation

Zero-knowledge file storage

Encrypted thumbnails / previews

Parallel encrypted file downloads

Envelope encryption for every file

Local decryption for viewing

Compatible with S3 storage backends

Tech Stack

Frontend

React Native

Expo

Expo FileSystem

Expo MediaLibrary

Expo ImageManipulator

Privy Wallet SDK

Backend

Bun runtime

Custom S3 Gateway

Cloudflare Tunnel

Cryptography

AES-GCM encryption

@noble/ciphers

Security Model

This project uses envelope encryption.

A master encryption key is derived from the user's wallet and PIN.

Key derivation flow:

Wallet Signature
        +
      User PIN
        ↓
deriveMasterKey()
        ↓
masterKey (32 bytes)

For every file uploaded:

Generate random fileKey
        ↓
Encrypt file using AES-GCM(fileKey)
        ↓
Encrypt fileKey using AES-GCM(masterKey)

This ensures:

each file has its own encryption key

the master key never leaves the device

the server cannot decrypt stored files

Storage Structure

Each file produces encrypted objects in storage:

file.enc
thumbnail.enc
metadata.json

Example metadata entry:

{
  "name": "file.enc",
  "thumb": "file.thumb.enc",
  "iv": "...",
  "thumbIv": "...",
  "encryptedKey": "...",
  "keyIv": "..."
}

The metadata file contains only encrypted information and IVs.

Upload Flow
User selects file
      ↓
Generate thumbnail / preview
      ↓
Encrypt file locally
      ↓
Encrypt thumbnail
      ↓
Encrypt fileKey with masterKey
      ↓
Upload encrypted blobs to storage
      ↓
Update metadata.json
File Retrieval Flow
Download metadata.json
        ↓
Download encrypted thumbnails
        ↓
Decrypt thumbnails locally
        ↓
Display gallery

When a file is opened:

Download encrypted file
        ↓
Decrypt locally using masterKey
        ↓
Render file
Installation

Clone the repository

git clone https://github.com/yourname/web3-encrypted-file-vault

Install dependencies

npm install

Start the Expo development server

npx expo start
Environment Setup

You will need:

a Privy wallet integration

S3-compatible storage

Bun-based S3 gateway

optional Cloudflare tunnel