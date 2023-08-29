type Constructor = { new (): unknown }
export enum DependencyTypes {
  'createUserUseCase',
  'usersRepository',
}
type DependencyType = keyof typeof DependencyTypes

class Registry {
  private readonly dependencies = new Map<DependencyTypes, unknown>()
  static instance: Registry

  private constructor() {}

  static getInstance(): Registry {
    if (!Registry.instance) Registry.instance = new Registry()
    return Registry.instance
  }

  public provide<T extends Constructor>(
    aDependency: DependencyType,
    dependency: InstanceType<T>,
  ) {
    this.dependencies.set(DependencyTypes[aDependency], dependency)
  }

  public inject<Type extends InstanceType<Constructor>>(
    aDependency: DependencyType,
  ): NonNullable<Type> {
    const dependency = this.dependencies.get(DependencyTypes[aDependency])
    if (!this.isValidDependency<Type>(dependency)) {
      throw new Error(`Dependency ${aDependency} not found`)
    }
    return dependency
  }

  private isValidDependency<TDependency>(
    aDependency: unknown,
  ): aDependency is NonNullable<TDependency> {
    return !!aDependency
  }
}

const registry = Registry.getInstance()
export const provide = registry.provide.bind(registry)
export const inject = registry.inject.bind(registry)
