# Get token

Used to retrieve an access Token for a registered User.

**URL** : `/api/token/`

**Method** : `POST`

**Auth required** : NO

**Payload example**

```json
{
    "username": "regular@example.com",
    "password": "regular1"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTU5Mzk2NTg5OSwianRpIjoiNDI4OGRlNDQ0YWYxNGEwZWEzNjM5YWNlYTJiZDllMmMiLCJ1c2VyX2lkIjoxMjV9.7O9a80jqSnfqr2xDs1pRcq5tftqnUkWypHPJTJvlg9Q",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTkyNjY5ODk5LCJqdGkiOiIwM2RiMTUyMjRkZGU0ZjAwYjdiNDE3YjIzODg5ZWRjOSIsInVzZXJfaWQiOjEyNX0.suZteUqIyFdIOpmKRkhQ2GrOMMxQtH7wKTwH-MN-dr4"
}
```

## Error Response

**Condition** : If 'username' and 'password' combination is wrong.

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "detail": "No active account found with the given credentials"
}
```