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

- has a `session` header carrying the session id (which might be empty at this point)

### Response

- has a `session` header carrying the session id
- has a JSON payload carrying the session context

### Data Formats

### HTTP session header

```
x-iwibot-sid: <session identifier>
```

#### Session Context

```
{
    sid : "session identifier",
    expires : "epoch time"
    context : {
        any_member : "any value"
    }
}
```
