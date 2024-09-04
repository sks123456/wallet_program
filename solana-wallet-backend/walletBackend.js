const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const {
    getOrCreateAssociatedTokenAccount,
    getAssociatedTokenAddress,
    getTokenAccountBalance
} = require('@solana/spl-token');

// Connect to Solana Devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Replace these with your actual keys
const TOKEN_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
const WALLET_PUBLIC_KEY = new PublicKey('samAH4Ygc4XFrvzkdduVC8fw5e8Mchm6DuG2DgMrmSQ');
const TOKEN_MINT_ADDRESS = new PublicKey('mntLJRzjHeXDkA3AKv7eUGB5wkK2wmnJJBydWMM8c9t');

// Example fee payer, replace with your actual keypair
const feePayer = Keypair.fromSecretKey(Uint8Array.from([162,106,182,16,118,72,140,193,212,47,183,159,114,186,8,244,146,32,49,183,151,193,57,29,250,250,27,109,141,111,141,109,12,245,54,237,204,44,234,9,180,143,158,177,196,147,199,125,111,234,137,104,35,129,169,152,128,38,11,85,15,142,126,185]));
console.log('Fee Payer Public Key:', feePayer.publicKey.toBase58());

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
        // Example associated token account public key
        const existingAccountPubkey = new PublicKey('8zZvwhF9gJLbJE9nG6G1zDvkdF7m7YbYVAhhLDgu4uNs');

        // Fetch the account info to verify its mint
        const accountInfo = await connection.getParsedAccountInfo(existingAccountPubkey);
        if (accountInfo.value) {
            const data = accountInfo.value.data;
            if (data && data.parsed && data.parsed.info.mint) {
                const mintAddress = new PublicKey(data.parsed.info.mint);
                if (mintAddress.equals(TOKEN_MINT_ADDRESS)) {
                    console.log('The existing associated token account is correctly associated with the mint address:', TOKEN_MINT_ADDRESS.toBase58());

                    // Fetch and display the token account balance
                    const balance = await connection.getTokenAccountBalance(existingAccountPubkey);
                    console.log('Token Account Balance:', balance.value.amount);
                } else {
                    console.log('The existing associated token account is NOT associated with the mint address:', TOKEN_MINT_ADDRESS.toBase58());
                    console.log('Actual mint address:', mintAddress.toBase58());
                }
            } else {
                console.error('Invalid token account data or format.');
            }
        } else {
            console.error('Could not fetch account info for the associated token account.');
        }
    } catch (error) {
        console.error('Error using existing associated token account:', error);
    }
}

async function main() {
    await getTokenAccounts(); // Get all token accounts for the wallet
    await useExistingAssociatedTokenAccount(); // Use the existing associated token account
}

main();
