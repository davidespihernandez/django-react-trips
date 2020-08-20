# Create trip

Allows to create a trip.

**URL** : `/api/trips/`

**Method** : `POST`

**Auth required** : Any authenticated user allowed.

**Permissions required** : Regular or manager users can create trips only for their selves. Admin users can create trips for other users. 

**Payload example**

```json
{
    "destination": "destination",
    "comment": "comment",
    "start_date": "2020-06-22",
    "end_date": "2020-06-26"
}
```

Admin users can set a user field, containing the user id. By default the trip owner is the request user.

## Success Response

**Code** : `201 CREATED`

**Content example**

```json
{
    "id": 204,
    "destination": "destination",
    "start_date": "2020-06-22",
    "end_date": "2020-06-26",
    "comment": "comment",
    "count_to_trip_start": 17,
    "user": 149,
    "user_full_name": "Regular changed User"
}
```

## Error Response

**Condition** : If destination, start date or end date are blank.

**Code** : `400 BAD REQUEST`

**Example or content** :

```json
{
    "destination": [
        "This field may not be blank."
    ],
    "start_date": [
        "Date has wrong format. Use one of these formats instead: YYYY-MM-DD."
    ],
    "end_date": [
        "Date has wrong format. Use one of these formats instead: YYYY-MM-DD."
    ]
}
```
