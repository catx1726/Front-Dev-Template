import Cookies from 'js-cookie'

export const TokenKey = 'pt-2.0-token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token:string) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
