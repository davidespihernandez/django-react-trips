import config from 'config';
import { authHeader } from '../_helpers';
import { handleResponse } from "./helpers";

export const tripListService = {
    get,
    create,
};

function get(filter=null) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    let filterQS = null;
    if (filter) {
        filterQS = "?" + new URLSearchParams(filter).toString();
    }

    return fetch(`${config.apiUrl}/trips/${filterQS !== null ? filterQS : ""}`, requestOptions).then(handleResponse);
}

function create(trip) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(trip)
    };

    return fetch(`${config.apiUrl}/trips/`, requestOptions).then(handleResponse);
}
