# RepAllocation Helper

A helper tool for adding beneficiaries to the RepAllocation contract.

## Usage

The RepAllocation Helper tool works like all other commands specified in the `README` file.
The exception to this is the format of the `migration-params.json` file.
For this tool, the params file should be prepared as follows:

```js
{
  "repAllocationAddress": "0x...", // The address of the RepAllocation contract

  "accounts": [ // List of all addresses to allocate reputation for and the corresponding amounts to allocate per address
    {
      "address": "0x...", // Address to allocate reputation to
      "reputation": 1000 // Reputation to allocate to the address
    },
    {
      "address": "0x...", // Address to allocate reputation to
      "reputation": 1000 // Reputation to allocate to the address
    }
  ],

  "batchSize": 100 // Number of addresses to allocate reputation to in a single transaction (Optional, default: 100)
}
```
