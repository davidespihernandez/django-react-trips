export function authHeader() {
    // return authorization header with jwt token
    let auth = JSON.parse(localStorage.getItem('auth'));

    if (auth && auth.access) {
        return { 'Authorization': 'Bearer ' + auth.access };
    } else {
        return {};
    }
}