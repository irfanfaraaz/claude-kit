# Common Patterns

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Contents

- Common Patterns
  - Pattern 1: Helper Function for Send & Confirm
  - Pattern 2: Reusable Transaction Builder
  - Pattern 3: Add Compute Budget
  - Pattern 4: Versioned Transactions with Lookup Tables


## Common Patterns

### Pattern 1: Helper Function for Send & Confirm

```typescript
import {
  signTransactionMessageWithSigners,
  sendAndConfirmTransactionFactory,
  getSignatureFromTransaction,
  CompilableTransactionMessage,
  TransactionMessageWithBlockhashLifetime,
  Commitment,
} from "@solana/kit";

function createTransactionSender(rpc: Rpc, rpcSubscriptions: RpcSubscriptions) {
  const sendAndConfirm = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });

  return async (
    txMessage: CompilableTransactionMessage & TransactionMessageWithBlockhashLifetime,
    commitment: Commitment = "confirmed"
  ) => {
    const signedTx = await signTransactionMessageWithSigners(txMessage);
    await sendAndConfirm(signedTx, { commitment, skipPreflight: false });
    return getSignatureFromTransaction(signedTx);
  };
}

// Usage
const sendTx = createTransactionSender(rpc, rpcSubscriptions);
const signature = await sendTx(transactionMessage);
```

### Pattern 2: Reusable Transaction Builder

```typescript
import {
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  IInstruction,
} from "@solana/kit";

async function buildTransaction(
  rpc: Rpc,
  feePayer: Address,
  instructions: IInstruction[]
) {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  return pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(feePayer, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx)
  );
}
```

### Pattern 3: Add Compute Budget

```typescript
import {
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
} from "@solana-program/compute-budget";

const computeInstructions = [
  getSetComputeUnitLimitInstruction({ units: 200_000 }),
  getSetComputeUnitPriceInstruction({ microLamports: 1000n }),
];

const tx = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayer(payer.address, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(blockhash, tx),
  (tx) => prependTransactionMessageInstructions(computeInstructions, tx), // Prepend!
  (tx) => appendTransactionMessageInstruction(mainInstruction, tx),
);
```

### Pattern 4: Versioned Transactions with Lookup Tables

```typescript
import {
  setTransactionMessageAddressLookupTable,
} from "@solana/kit";

// Fetch lookup table
const lookupTableAccount = await fetchAddressLookupTable(rpc, lookupTableAddress);

const tx = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayer(payer.address, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(blockhash, tx),
  (tx) => setTransactionMessageAddressLookupTable(tx, lookupTableAccount),
  (tx) => appendTransactionMessageInstructions(instructions, tx),
);
```
