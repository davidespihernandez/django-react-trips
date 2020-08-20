import config from 'config';
import {authHeader} from '../_helpers';
import {handleResponse, logout} from "./helpers";

export const userListService = {
    create,
    get,
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

    return fetch(`${config.apiUrl}/users/${filterQS !== null ? filterQS : ""}`, requestOptions).then(handleResponse);
}

function create(user) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/`, requestOptions).then(handleResponse);
}

