import config from 'config';
import { authHeader } from '../_helpers';
import { handleResponse } from "./helpers";

export const tripDetailService = {
    get,
    update,
    delete: _delete,
};

function get(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/trips/${id}`, requestOptions).then(handleResponse);
}

function update(trip) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(trip)
    };

    return fetch(`${config.apiUrl}/trips/${trip.id}/`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/trips/${id}`, requestOptions).then(handleResponse);
}
