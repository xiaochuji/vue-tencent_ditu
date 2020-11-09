// import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'

export function getToken() {
  return sessionStorage.getItem('token')
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem('token', token)
  // return Cookies.set(TokenKey, token)
}

export function setId(id) {
  return localStorage.setItem('id', id)
  // return Cookies.set(TokenKey, token)
}
export function userId(id) {
  return localStorage.setItem('userid', id)
  // return Cookies.set(TokenKey, token)
}

export function setName(name) {
  return localStorage.setItem('name', name)
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem('token')
  // return Cookies.remove(TokenKey)
}
export function setUser(data) {
  return localStorage.setItem('user', data)
  // return Cookies.remove(TokenKey)
}

export function setDetName(name) {
  return localStorage.setItem('detname', name)
  // return Cookies.remove(TokenKey)
}
export function setDetid(id) {
  return localStorage.setItem('detid', id)
  // return Cookies.remove(TokenKey)
}

export function setRoute(arr) {
  return localStorage.setItem('route', JSON.stringify(arr))
}

export function getRoute() {
  return JSON.parse(localStorage.getItem('route'))
}
