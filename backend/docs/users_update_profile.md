# Update the user profile.

Updates the request user info and returns the whole user with the updated information.

**URL** : `/api/users/profile/`

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : Any authenticated user allowed.

**Payload example**

```json
{
    "username": "regular@example.com",
    "first_name": "Regular changed",
    "last_name": "User",
    "email": "regular@example.com",
    "password": "regular",
    "role": 1
}
```

A user only can change his role to a lower one. All fields must be valid (see registration/creation).

The username can be changed, but the new one must not already exist.

## Success Responses

**When**: User has manager or admin role and the user exists.

**Code** : `200 OK`

**Content example** : 

```json
{
    "id": 149,
    "username": "regular@example.com",
    "first_name": "Regular changed",
    "last_name": "User",
    "email": "regular@example.com",
    "role": 1
}
```

## Error Responses

**Code** : `400 BAD REQUEST` When any field is incorrect, or the new role is not valid.

**Code** : `401 UNAUTHORIZED` For non authenticated requests.
