export function isRegular(profile) {
    return profile && profile.role === 1;
}

export function isManager(profile) {
    return profile && profile.role === 2;
}

export function isAdmin(profile) {
    return profile && profile.role === 3;
}

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}