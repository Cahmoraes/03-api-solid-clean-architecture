type Constructor = { new (): unknown }
export enum DependencyTypes {
  'createUserUseCase',
  'authenticateUseCase',
  'usersRepository',
  'checkInsRepository',
}
type DependencyType = keyof typeof DependencyTypes

class Registry {
  protected readonly dependencies = new Map<DependencyTypes, unknown>()
  static instance: Registry

  protected constructor() {}

  static getInstance(): Registry {
    if (!Registry.instance) Registry.instance = new Registry()
    return Registry.instance
  }

  public provide<T extends Constructor>(
    aDependencyName: DependencyType,
    aDependencyInstance: InstanceType<T>,
  ) {
    this.dependencies.set(DependencyTypes[aDependencyName], aDependencyInstance)
  }

  public inject<Type extends InstanceType<Constructor>>(
    aDependencyName: DependencyType,
  ): NonNullable<Type> {
    const dependency = this.dependencies.get(DependencyTypes[aDependencyName])
    if (!this.isValidDependency<Type>(dependency)) {
      throw new Error(`Dependency ${aDependencyName} not found`)
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

export class TestingRegistry extends Registry {
  static getInstance(): TestingRegistry {
    return new TestingRegistry()
  }

  public clearDependencies() {
    for (const [key] of this.dependencies) {
      this.dependencies.delete(key)
    }
  }
}

const registryTesting = TestingRegistry.getInstance()
export const provideTesting = registryTesting.provide.bind(registryTesting)
export const injectTesting = registryTesting.inject.bind(registryTesting)
export const clearDependenciesTesting =
  registryTesting.clearDependencies.bind(registryTesting)
