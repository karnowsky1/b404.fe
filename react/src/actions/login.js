export const LOGIN_ACTION = 'LOGIN_ACTION'
export function login(data) {
    return {
        type: LOGIN_ACTION,
        payload: data
    }
}

