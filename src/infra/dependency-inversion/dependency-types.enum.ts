export const DependencyTypes = {
  createUserUseCase: 'createUserUseCase',
  createGymUseCase: 'createGymUseCase',
  searchGymsUseCase: 'searchGymsUseCase',
  authenticateUseCase: 'authenticateUseCase',
  createCheckInUseCase: 'createCheckInUseCase',
  getUserMetricsUseCase: 'getUserMetricsUseCase',
  getUserProfileUseCase: 'getUserProfileUseCase',
  fetchNearbyGymsUseCase: 'fetchNearbyGymsUseCase',
  validateCheckInUseCase: 'validateCheckInUseCase',
  fetchUserCheckInsHistoryUseCase: 'fetchUserCheckInsHistoryUseCase',
  updatePasswordUseCase: 'updatePasswordUseCase',
  usersRepository: 'usersRepository',
  checkInsRepository: 'checkInsRepository',
  gymsRepository: 'gymsRepository',
} as const

export type DependencyType =
  (typeof DependencyTypes)[keyof typeof DependencyTypes]
