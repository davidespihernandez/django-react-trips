import { userConstants } from '../_constants';

let auth = JSON.parse(localStorage.getItem('auth'));
const initialState = auth ? { loggedIn: true, loginError: false, auth} : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user,
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        auth: action.auth,
      };
    case userConstants.LOGIN_FAILURE:
      return {
        loginError: true
      };
    case userConstants.LOGOUT:
      return {
        loginError: state.loginError
      };
    default:
      return state
  }
}