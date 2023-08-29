import { Entity } from './entity'
import { UniqueIdentity } from './value-objects/unique-identity'

interface FakeClassProps {
  name: string
  email: string
}

class FakeClass extends Entity<FakeClassProps> {
  constructor(name: string, email: string, id?: string) {
    super(
      {
        name,
        email,
      },
      id,
    )
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }
}

describe('Entity', () => {
  it('should create an entity', () => {
    const name = 'John Doe'
    const email = 'johm@doe.com'
    const fakeObject = new FakeClass(name, email)
    expect(fakeObject).instanceOf(Entity)
    expect(fakeObject.name).toBe(name)
    expect(fakeObject.email).toBe(email)
    expect(fakeObject.id).toBeInstanceOf(UniqueIdentity)
    expect(fakeObject.id.toString()).toEqual(expect.any(String))
  })

  it('should restore an entity', () => {
    const name = 'John Doe'
    const email = 'johm@doe.com'
    const id = 'fake-id'
    const fakeObject = new FakeClass(name, email, id)
    expect(fakeObject.id.toString()).toBe(id)
  })
})
