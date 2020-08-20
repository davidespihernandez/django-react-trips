# Update a user.

Updates the user info and returns the user info with the updated information.

**URL** : `/api/users/:id/`

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : Only manager or admin profiles.

**Path parameters**

| Parameter | Purpose                                                       |
| --------- | ------------------------------------------------------------- |
|id         | The user id                                                   |

**Payload example**

```json
{
    "id": 154,
    "username": "pagination1@example.com",
    "first_name": "Pagination changed",
    "last_name": "User 1",
    "email": "pagination1@example.com",
    "role": 1
}
```


## Success Responses

**When**: User has manager or admin role and the user exists.

**Code** : `200 OK`

**Content example** : 

```json
{
    "id": 154,
    "username": "pagination1@example.com",
    "first_name": "Pagination changed",
    "last_name": "User 1",
    "email": "pagination1@example.com",
    "role": 1
}
```

## Error Responses

**Code** : `404 NOT FOUND` When the user id doesn't exist.

**Code** : `403 FORBIDDEN` When request user is a regular user.

**Code** : `401 UNAUTHORIZED` For non authenticated requests.
