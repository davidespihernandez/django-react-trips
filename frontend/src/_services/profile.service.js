import config from 'config';
import { authHeader } from '../_helpers';
import {handleResponse} from "./helpers";

export const profileService = {
    updateProfile,
    getProfile,
};

function getProfile() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/profile/`, requestOptions).then(handleResponse);
}

function updateProfile(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/profile/update/`, requestOptions).then(handleResponse);
}
