import { Connection, PublicKey } from '@solana/web3.js';

const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);
const TOKEN_2022_PROGRAM_ID = new PublicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
);
const walletPublicKey = new PublicKey('mntLJRzjHeXDkA3AKv7eUGB5wkK2wmnJJBydWMM8c9t'); // insert your key
const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

const tokenAccounts = await connection.getTokenAccountsByOwner(
  walletPublicKey, { programId: TOKEN_PROGRAM_ID }
);
const token2022Accounts = await connection.getTokenAccountsByOwner(
  walletPublicKey, { programId: TOKEN_2022_PROGRAM_ID }
);
const accountsWithProgramId = [...tokenAccounts.value, ...token2022Accounts.value].map(
  ({ account, pubkey }) =>
    {
      account,
      pubkey,
      programId: account.data.program === 'spl-token' ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID,
    },
);

// later on...
const accountWithProgramId = accountsWithProgramId[0];
const instruction = createTransferInstruction(
  accountWithProgramId.pubkey,    // source
  accountWithProgramId.pubkey,    // destination
  walletPublicKey,                // owner
  1,                              // amount
  [],                             // multisigners
  accountWithProgramId.programId, // token program id
);