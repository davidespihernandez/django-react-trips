# Get the request user next month travel plan PDF.

Retrieves a PDF containing all the trips scheduled for next month for the request user.

**URL** : `/api/users/plan/`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : Any authenticated user allowed.

## Success Responses

**Code** : `200 OK`

**Content example** : 

A binary PDF file. The header `Content-Disposition` contains the file info, like `attachment: filename=plan_July_2020.pdf`.
The `Content-Type` header is `application/pdf`. 

If there are no trips, the PDF shows an appropriate message, but it's returned anyway.

## Error Responses

**Code** : `401 UNAUTHORIZED` For non authenticated requests.
