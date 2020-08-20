# Deletes a user.

Deletes the user and its related information (trips).
A user can't delete him/herself.

**URL** : `/api/users/:id/`

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : Only manager or admin profiles.

**Path parameters**

| Parameter | Purpose                                                       |
| --------- | ------------------------------------------------------------- |
|id         | The user id                                                   |

## Success Responses

**When**: User has manager or admin role and the user exists.

**Code** : `204 NO CONTENT`

## Error Responses

**Code** : `404 NOT FOUND` When the user id doesn't exist.

**Code** : `403 FORBIDDEN` When request user is a regular user or the user is trying to delete him/herself.

**Code** : `401 UNAUTHORIZED` For non authenticated requests.
