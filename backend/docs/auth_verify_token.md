# Verify token

Used to verify an access token.

**URL** : `/api/token/verify/`

**Method** : `POST`

**Auth required** : NO

**Payload example**

```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTkyNjcwMDc0LCJqdGkiOiI2MDY1Yjc4MGUwZmU0YmRkYTRhMzE1ODc1MTRlYTJlZCIsInVzZXJfaWQiOjEyNX0.3zJEqRrCEp74C0KA24wLyQzu8MyXxP4DmyZg_8qxxhY"
}
```

Where `token` is a valid access token.

## Success Response

**Code** : `200 OK`

**Content example**

```json
{}
```

## Error Response

**Condition** : If access token is not valid.

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "detail": "Token is invalid or expired",
    "code": "token_not_valid"
}
```