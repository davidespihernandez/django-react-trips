import config from 'config';
import {handleResponse, logout} from "./helpers";

export const userService = {
    login,
    logout,
    register,
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${config.apiUrl}/token/`, requestOptions)
        .then(response => handleResponse(response, true))
        .then(auth => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('auth', JSON.stringify(auth));
            return auth;
        });
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/`, requestOptions).then(handleResponse);
}
