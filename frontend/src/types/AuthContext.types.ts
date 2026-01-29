export default interface AuthContext {
  state: string,
  token: string | null
  email: string | null
}