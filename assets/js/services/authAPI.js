import axios from 'axios'
import jwtDecode from 'jwt-decode'

/**
 * Requête HTTP d'authentification et stockage du token dans le storage et sur axios
 * @param {object} credentials
 * @returns
 */
function authenticate(credentials) {
  return axios
    .post('https://localhost:8000/api/login_check', credentials)
    .then((response) => response.data.token)
    .then((token) => {
      // Je stock le token dans le localStorage
      window.localStorage.setItem('authToken', token)
      //On prévient Axios qu'on a maintenant un header par défaut sur toutes nos futures requêtes HTTP
      setAxiosToken(token)
    })
}
/**
 * Déconnexion (suppression du token du localStorage)
 */
function logout() {
  window.localStorage.removeItem('authToken')
  delete axios.defaults.headers['Authorization']
}

/**
 * Positionne le token JWT sur Axios
 * @param {string} token le token jwt
 */
function setAxiosToken(token) {
  axios.defaults.headers['Authorization'] = 'Bearer ' + token
}

/**
 * Mise en place lors du chargment de l'application
 */
function setup() {
  // 1. Voir si on a un token?
  const token = window.localStorage.getItem('authToken')
  // 2. Si le token est encore valide
  if (token) {
    const { exp: expiration } = jwtDecode(token)
    if (expiration * 1000 > new Date().getTime()) {
      // 3. Donnez le token à axios
      setAxiosToken(token)
    }
  }
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated() {
  // 1. Voir si on a un token?
  const token = window.localStorage.getItem('authToken')
  // 2. Si le token est encore valide
  if (token) {
    const { exp: expiration } = jwtDecode(token)
    if (expiration * 1000 > new Date().getTime()) {
      return true
    }
    return false
  }
  return false
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
}
