import {
  SIGNIN_REQUEST,
  SIGNUP_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTO_LOGIN,
  LOGOUT,
  CLOSE_ERROR,
} from '../Types/Auth'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
  token: null,
  username: null,
  roles: [],
  isLoggedIn: false,
  loading: false,
  error: false,
  statusText: ''
})

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGNIN_REQUEST:
      return {
        ...state,
        error: false,
        loading: true,
        statusText: '',
      }

    case SIGNUP_REQUEST:
      return {
        ...state,
        error: false,
        loading: true,
        statusText: '',
      }

    case AUTH_SUCCESS:
      return {
        ...state,
        error: false,
        token: action.payload.token,
        username: action.payload.username,
        roles: action.payload.roles,
        isLoggedIn: true,
        loading: false,
        statusText: '',
      }

    case AUTH_FAILURE:
      return {
        ...state,
        loading: false,
        token: null,
        roles: [],
        isLoggedIn: false,
        error: true,
        statusText: action.payload.statusText,
      }

    case AUTO_LOGIN:
      return {
        ...state,
        error: false,
        isLoggedIn: true,
        loading: false,
        statusText: '',
      }

    case LOGOUT:
      return {
        ...state,
        error: false,
        token: null,
        loading: false,
        isLoggedIn: false,
        statusText: '',
      }

    case CLOSE_ERROR:
      return {
        ...state,
        error: false,
        token: null,
        loading: false,
        isLoggedIn: false,
        statusText: '',
      }

    default:
      return state
  }
}