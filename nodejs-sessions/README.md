# Sessions Action

A service that provides a temporary persistent session context for each user.

## Use Cases

1. An action finds a session id in the client request. It uses the session id to retrieve the session context of the user. *Example: an action receives an ecrypted password from the client. In order to decrypt it, the action retrieves the symmetric encryption key from the session context.*

2. An action wants to store data in the context of a client request. It creates a new session or updates an existing one. *Example: the `keys` action was called by a client to retrieve a symetric session key for the first time. The `keys` action will generate an encryption key and store it in the session context.*

## Requirements

- Session contexts are temporary and will expire automatically
- Session keys are hard to guess and protect their contexts by obscurity

## Dependencies

- Sessions are stored in a Cloudant instance (cloud-based document store).
  
## Protocol

### Request

- Requests carry a json object payload or query parameters (referred to as `params`)
  - `params` MIGHT include `sid` with a session identifier (only for retrieving an existing session)
  - `params` MIGHT include a `session_context` JSON object with any members (only for creating or updating session_contex)

### Response

- Carries a JSON object containing a `payload` member.
- `payload` is a session document containing
  - `sid` session identifier
  - `created_h` human readable creation timestamp
  - `created_u` unix creation timestamp
  - `expires_u` unix expiration time
  - `session_context` object with any members

### Data Formats

#### Session Document

```
{
    sid : "session identifier",
    created_h : "formated creation time string"
    created_u : "creation epoch time"
    expires_u : "expiration epoch time"
    session_context : {
        any_member : "any value"
    }
}
```
