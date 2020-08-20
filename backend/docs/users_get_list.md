# Get the list of users

Retrieves a paginated and filtered list of users.

**URL** : `/api/users/`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : Only manager or admin profiles.

**Query string parameters**

| Parameter | Purpose                                                       |
| --------- | ------------------------------------------------------------- |
|first_name | Filter first name containing case insensitive                 |
|last_name  | Filter last name containing case insensitive                  |
|email      | Filter email containing case insensitive                      |
|role       | Filter by role (1, 2 or 3, Regular, Manager or Admin)         |
|search     | Filter by first name OR last name containing case insensitive |
|limit          | Page size                                                     |
|offset         | Initial offset for pagination                                 |

## Success Responses

**When**: User has manager or admin role.

**Code** : `200 OK`

**Content example** : 

Users are sorted by first_name, last_name and id. By default page size is 10 elements.

```json
{
    "count": 18,
    "next": "http://localhost:8000/api/users/?limit=10&offset=10",
    "previous": null,
    "results": [
        {
            "id": 151,
            "username": "admin@example.com",
            "first_name": "Admin",
            "last_name": "User",
            "email": "admin@example.com",
            "role": 3
        },
        {
            "id": 150,
            "username": "manager@example.com",
            "first_name": "Manager",
            "last_name": "User",
            "email": "manager@example.com",
            "role": 2
        },
        {
            "id": 165,
            "username": "manager_trips@example.com",
            "first_name": "Manager Trips",
            "last_name": "User",
            "email": "manager_trips@example.com",
            "role": 1
        },
        {
            "id": 153,
            "username": "pagination0@example.com",
            "first_name": "Pagination",
            "last_name": "User 0",
            "email": "pagination0@example.com",
            "role": 1
        },
        {
            "id": 154,
            "username": "pagination1@example.com",
            "first_name": "Pagination",
            "last_name": "User 1",
            "email": "pagination1@example.com",
            "role": 1
        },
        {
            "id": 163,
            "username": "pagination10@example.com",
            "first_name": "Pagination",
            "last_name": "User 10",
            "email": "pagination10@example.com",
            "role": 1
        },
        {
            "id": 155,
            "username": "pagination2@example.com",
            "first_name": "Pagination",
            "last_name": "User 2",
            "email": "pagination2@example.com",
            "role": 1
        },
        {
            "id": 156,
            "username": "pagination3@example.com",
            "first_name": "Pagination",
            "last_name": "User 3",
            "email": "pagination3@example.com",
            "role": 1
        },
        {
            "id": 157,
            "username": "pagination4@example.com",
            "first_name": "Pagination",
            "last_name": "User 4",
            "email": "pagination4@example.com",
            "role": 1
        },
        {
            "id": 158,
            "username": "pagination5@example.com",
            "first_name": "Pagination",
            "last_name": "User 5",
            "email": "pagination5@example.com",
            "role": 1
        }
    ]
}
```

## Error Responses

**Code** : `403 FORBIDDEN` When user is a regular user.

**Code** : `401 UNAUTHORIZED` For non authenticated requests.
