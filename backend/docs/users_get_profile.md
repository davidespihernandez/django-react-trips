# Get the request user profile info.

Retrieves the request user profile information.

**URL** : `/api/users/profile/`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : Any authenticated user allowed.

## Success Responses

**Code** : `200 OK`

**Content example** : 

```json
{
    "id": 149,
    "username": "regular@example.com",
    "first_name": "Regular",
    "last_name": "User",
    "email": "regular@example.com",
    "role": 1
}
```

## Error Responses

**Code** : `401 UNAUTHORIZED` For non authenticated requests.
