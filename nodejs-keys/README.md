# Keys Action

A service that provides a temporary symmetric encryption key for each user session.

## Use Cases

1. client `C` fetches his symmetric key `K` (to encrypt a password `P` for a backend system accessed by some action `A`).
2. `A` fetches `K` of `C` in order to decrypt `P`

## Requirements

- The key lives in a session context and expires with it
- Each session has a new key

## Dependencies

- The Key is stored in the session context of the client provided by action `Sessions`

## Protocol

### Request

- Uses HTTP GET
- Carries a `sid` key/value-pair as query parameter or (alternatively) as member of a json object or form data payload.
- `sid` value is a hex string

### Response

- Carries a json object payload
- Has a `sid` member with the session identifier
- Has a `crypto_key` member with the symmetric key
- All values are hex strings

## Usage

See `webcrypto` folder for an example of using keys for browser-based encryption and node-based decryption.
