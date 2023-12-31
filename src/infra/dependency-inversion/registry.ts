import { isTest } from '@/env'
import { DependencyTypes } from './dependency-types.enum'

type Constructor = { new (): unknown }
type DependencyType = keyof typeof DependencyTypes

class Registry {
  protected readonly dependencies = new Map<DependencyTypes, unknown>()
  static instance: Registry

  protected constructor() {}

  /* c8 ignore start */
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

/* c8 ignore start */
function makeRegistryFromEnvironment() {
  const isTestEnvironment = isTest()
  if (isTestEnvironment) {
    const registryTesting = TestingRegistry.getInstance()
    return {
      provide: registryTesting.provide.bind(registryTesting),
      inject: registryTesting.inject.bind(registryTesting),
      clearDependenciesTesting:
        registryTesting.clearDependencies.bind(registryTesting),
    }
  }
  const registry = Registry.getInstance()
  return {
    provide: registry.provide.bind(registry),
    inject: registry.inject.bind(registry),
  }
}

export const { inject, provide, clearDependenciesTesting } =
  makeRegistryFromEnvironment()
