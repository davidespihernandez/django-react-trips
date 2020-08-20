# Backend API docs

The backend is a Django application, using Django Rest Framework to implement the REST API.
There's a `docker-compose.yml` file in the backend root folder that starts a container with the necessary postgres database for the backend.

## Test data

There's a Django management that allows to create test data automatically. 
The command is called `create_test_data`:

```bash
python manage.py create_test_data
```

The command deletes all data in the users and trips tables, and creates some users and trips for testing, with the same usernames and passwords, so tests can be repeatable.

## Postman collection

There's a postman collection with examples for each API endpoint, to make easier to test the API. 
Anyway, there are ~90 automatic tests for the API, with more than 90% of code coverage. 

## API

Authentication is done using JWT tokens. A token can be obtained in the `POST /api/token/` endpoint. The API also allows to refresh the JWT token.

An authentication header looks like:

`Authorization: Bearer {token}`

In addition, there are three different profiles in the API.

- Regular users. Can only manage their own trips and profile.
- Manager users. In addition, managers can manage other users.
- Admin users. Admin users can do anything.

There are 3 main endpoints in the REST API:

- Authentication
- Users
- Trips

### Authentication

* [Get token](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/auth_get_token.md) : `POST /api/token/`
* [Refresh token](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/auth_refresh_token.md) : `POST /api/token/refresh`
* [Verify token](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/auth_verify_token.md) : `POST /api/token/verify`

### Users
#### List endpoints
* [Get users list](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/users_get_list.md) : `GET /api/users/`
* [Create user](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/users_create_user.md) : `POST /api/users/`
#### Detail endpoints
* [Get user detail](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/users_get_detail.md) : `GET /api/users/:id/`
* [Update user](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/users_update.md) : `PUT /api/users/:id/`
* [Delete user](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/users_delete.md) : `DELETE /api/users/:id/`
#### Other endpoints
* [Get profile](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/users_get_profile.md) : `GET /api/users/profile/`
* [Update profile](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/users_update_profile.md) : `PUT /api/users/profile/`
* [Get next month travel plan](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/users_get_plan.md) : `GET /api/users/plan/`


### Trips
#### List endpoints
* [Get trips list](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/trips_get_list.md) : `GET /api/trips/`
* [Create trip](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/trips_create_trip.md) : `POST /api/trips/`
#### Detail endpoints
* [Get trip detail](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/trips_get_detail.md) : `GET /api/trips/:id/`
* [Update trip](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/trips_update.md) : `PUT /api/trips/:id/`
* [Delete trip](https://git.toptal.com/screening/david-espi/blob/master/backend/docs/trips_delete.md) : `DELETE /api/trips/:id/`

