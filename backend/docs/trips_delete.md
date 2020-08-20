# Deletes a trip.

Deletes the trip. Trips can be deleted by the owner user or an admin user.

**URL** : `/api/trips/:id/`

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : Any authenticated user allowed.

**Path parameters**

| Parameter | Purpose                                                       |
| --------- | ------------------------------------------------------------- |
|id         | The trip id                                                   |

## Success Responses

**Code** : `204 NO CONTENT`

## Error Responses

**Code** : `404 NOT FOUND` When the trip id doesn't exist.

**Code** : `401 UNAUTHORIZED` For non authenticated requests.
