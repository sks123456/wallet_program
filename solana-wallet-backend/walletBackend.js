const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount } = require('@solana/spl-token');

// Connect to the local Solana test validator
const connection = new Connection('http://localhost:8899', 'confirmed');

// Replace these with your actual keys
const TOKEN_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
const WALLET_PUBLIC_KEY = new PublicKey('mntLJRzjHeXDkA3AKv7eUGB5wkK2wmnJJBydWMM8c9t');
const TOKEN_MINT_ADDRESS = new PublicKey('ZFRzqjbJ4yCpHRAw1U1a4B3zWnvaUtnds8X3nrmiCt9');

// Example fee payer, replace with your actual keypair
const feePayer = Keypair.fromSecretKey(Uint8Array.from([12,49,223,106,161,203,115,252,35,98,220,238,86,162,161,189,20,99,130,155,137,174,203,164,151,110,209,39,136,71,26,247,11,121,112,31,254,7,122,154,47,51,125,114,239,142,98,84,144,103,147,172,28,90,86,154,160,42,9,174,136,55,130,7]));

async function getTokenAccounts() {
    try {
        const accounts = await connection.getParsedTokenAccountsByOwner(
            WALLET_PUBLIC_KEY,
            {
                programId: TOKEN_PROGRAM_ID,
            }
        );
        console.log('Token Accounts:', accounts.value);
    } catch (error) {
        console.error('Error fetching token accounts:', error);
    }
}

async function createCustomAssociatedTokenAccount() {
    try {
        const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            feePayer,           // Use the Keypair for the fee payer
            TOKEN_MINT_ADDRESS, // Mint address of the token
            WALLET_PUBLIC_KEY   // Owner of the associated token account
        );
        console.log('Associated Token Account:', associatedTokenAccount.address.toBase58());
    } catch (error) {
        console.error('Error creating associated token account:', error);
    }
}
async function useExistingAssociatedTokenAccount() {
    try {
        // Assuming CRUhxptxKwtePfHM6imKkDLprvoDZb3H6UzUTQiJyCt9 is the associated token account
        const existingAccountPubkey = new PublicKey('CRUhxptxKwtePfHM6imKkDLprvoDZb3H6UzUTQiJyCt9');
        console.log('Using existing Associated Token Account:', existingAccountPubkey.toBase58());

        // Additional code to interact with the existing account if needed
    } catch (error) {
        console.error('Error using existing associated token account:', error);
    }
}

async function main() {
    await getTokenAccounts(); // Get all token accounts for the wallet
    await useExistingAssociatedTokenAccount(); // Use the existing associated token account
}

main();