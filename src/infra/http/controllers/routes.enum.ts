export enum Routes {
  USERS = '/users',
  SESSIONS = '/sessions',
  ME = '/me',
  METRICS = '/metrics',
  GYMS = '/gyms',
  GYMS_SEARCH = '/gyms/search',
  GYMS_NEARBY = '/gyms/nearby',
  CHECKINS_CREATE = '/gyms/:gymId/check-ins',
  CHECKINS_VALIDATE = '/check-ins/:checkInId/validate',
  CHECKINS_HISTORY = '/check-ins/history',
  CHECKINS_METRICS = '/check-ins/metrics',
  TOKEN_REFRESH = '/token/refresh',
}
