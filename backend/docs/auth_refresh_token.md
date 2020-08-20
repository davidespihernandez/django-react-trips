# Refresh token

Used to retrieve a new access Token using the refresh token, which usually has more expiration time than the access token.

**URL** : `/api/token/refresh`

**Method** : `POST`

**Auth required** : NO

**Payload example**

```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTU5Mzk2NjA3NCwianRpIjoiMDk5NzhmODg2ODk2NDJhMmE5MjE0ZjRlM2ZkMzlhYWEiLCJ1c2VyX2lkIjoxMjV9.7EGZCFHtWOwSUupp2xAYBMXXCYJkhCmVG6_WHcu98GU"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTkyNjcwMTk4LCJqdGkiOiIzZjJiMDhiMDJhNDE0ZWIyOWZhMWQ2YzRiNDE2MTZjOCIsInVzZXJfaWQiOjEyNX0.o6Bi8x9GtoBAoptTPbf2k3ycFCFQnqmwSEDzvb7vWj8"
}
```

## Error Response

**Condition** : If refresh token is not valid.

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "detail": "Token is invalid or expired",
    "code": "token_not_valid"
}
```