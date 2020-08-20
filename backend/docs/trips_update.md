# Update a trip.

Updates the trip info and returns the trip with the updated information.

**URL** : `/api/trips/:id/`

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : Any authenticated user allowed.

**Path parameters**

| Parameter | Purpose                                                       |
| --------- | ------------------------------------------------------------- |
|id         | The trip id                                                   |

**Payload example**

```json
{
    "destination": "destination changed",
    "comment": "comment changed",
    "start_date": "2020-06-23",
    "end_date": "2020-06-27"
}
```


## Success Responses

**Code** : `200 OK`

**Content example** : 

```json
{
    "id": 205,
    "destination": "destination changed",
    "start_date": "2020-06-23",
    "end_date": "2020-06-27",
    "comment": "comment changed",
    "count_to_trip_start": 18,
    "user": 149,
    "user_full_name": "Regular changed User"
}
```

## Error Responses

**Code** : `404 NOT FOUND` When the trip doesn't exist (it doesn't belong to the request user and the request user is not an admin user).

**Code** : `401 UNAUTHORIZED` For non authenticated requests.
