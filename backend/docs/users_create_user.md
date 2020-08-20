# Create user

Allows to create a user, when request user is a manager or admin, or to register a new user when the request is anonymous.

**URL** : `/api/users/`

**Method** : `POST`

**Auth required** : NO (to register), admin or manager to create user.

**Permissions required** : Manager or admin profiles to create users, no authentication required to register. Authenticated regular users are unauthorized.

**Payload example**

```json
{
    "username": "newuser5@example.com",
    "first_name": "New",
    "last_name": "User 4",
    "email": "newuser5@example.com",
    "password": "newuser5",
    "role": 1
}
```

Only username and password are mandatory to the API. Username is unique.

When registering, the role will be always "1", regular.

## Success Response

**Code** : `201 CREATED`

**Content example**

```json
{
    "id": 167,
    "username": "newuser5@example.com",
    "first_name": "New",
    "last_name": "User 4",
    "email": "newuser5@example.com",
    "role": 1
}
```

## Error Response

**Condition** : If username or password are blank.

**Code** : `400 BAD REQUEST`

**Example or content** :

```json
{
    "username": [
        "This field may not be blank."
    ],
    "password": [
        "This field may not be blank."
    ]
}
```

**Condition** : If username already exists.

**Code** : `400 BAD REQUEST`

**Example or content** :

```json
{
    "username": [
        "A user with that username already exists."
    ]
}
```