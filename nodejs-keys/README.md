# Keys Action

A service that provides a temporary symmetric encryption key for each user session.

## Use Cases

1. client `C` fetches his symmetric key `K` (to encrypt a password `P` for a backend system accessed by some action `A`).
2. `A` fetches `K` of `C` in order to decrypt `P`

# Requirements

- The key lives in a session context and expires with it
- Each session has a new key

## Dependencies

- the Key is stored in the session context of the client provided by action `Sessions`

## Protocol

### Request

- uses HTTP GET
- carries a `sid` key/value-pair as query parameter or (alternatively) as member of a json object or form data payload.
- `sid` value is a 

### Response

- carries a json object payload
- has a `sid` member with the session identifier
- has a `crypto_key` member with the symmetric key
- has a `crypto_iv` member with the crypto init vector
