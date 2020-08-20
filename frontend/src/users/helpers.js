export function roleDescription(role) {
    const roles = {
        1: "Regular",
        2: "Manager",
        3: "Admin",
    }
    return roles[role];
}
