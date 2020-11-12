const BASE_URL: any = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1' : ''
const TOKEN_KEY: any = 'x-access-token'

export default {
  BASE_URL,
  TOKEN_KEY
}
