const BASE_URL: any = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1' : ''
const TOKEN_KEY: any = 'x-access-token'
const SIGN_TAG_KEY = 'signed'
const SIGN_TIME_KEY = 'signed-time'
const USER_ID_KEY = 'user-id'

export default {
  BASE_URL,
  TOKEN_KEY,
  SIGN_TAG_KEY,
  SIGN_TIME_KEY,
  USER_ID_KEY
}
