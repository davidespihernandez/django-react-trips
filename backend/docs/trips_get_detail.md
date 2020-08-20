# Get the detail of a trip.

Retrieves the trip information. Manager and regular users can retrieve only their own trips. Admin users can retrieve any trip.

**URL** : `/api/trips/:id/`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : Any authenticated user allowed.

**Path parameters**

| Parameter | Purpose                                                       |
| --------- | ------------------------------------------------------------- |
|id         | The trip id                                                   |

## Success Responses

**Code** : `200 OK`

**Content example** : 

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

## Error Responses

**Code** : `404 NOT FOUND` When the trip doesn't exist (it doesn't belong to the request user and the request user is not an admin user).

**Code** : `401 UNAUTHORIZED` For non authenticated requests.
