# DAORegistry Helper

A helper tool for registering and removing DAOs from the DAORegistry contract.

## Usage

The DAORegistry Helper tool works like all other commands specified in the `README` file.
The exception to this is the format of the `migration-params.json` file.
For this tool, the params file should be prepared as follows:

```js
{
  "daoRegistryAddress": "0x...", // The address of the DAORegistry contract

  "unregisterAvatarAddresses": [ // DAOs addresses (based on their Avatars) to unregister from the DAORegistry
      "0x...",
      "0x...",
      ...
  ],

  "avatarAddresses": [ // DAOs addresses (based on their Avatars) to register in the DAORegistry
      "0x...",
      "0x...",
      ...
  ]
}
```
