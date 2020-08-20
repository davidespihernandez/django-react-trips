export function handleResponse(response, inLogin=false) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401 && !inLogin) {
                // auto logout if 401 response returned from api
                logout()
                location.reload(true);
            }

            let error = "Error: ";
            if (data && typeof data === "object") {
                for (let [key, value] of Object.entries(data)) {
                    error += `${key}: ${value}\n `;
                }
                error = error.replace("non_field_errors:", "");
            } else {
                error += response.statusText;
            }

            return Promise.reject(error);
        }

        return data;
    });
}

export function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('auth');
}