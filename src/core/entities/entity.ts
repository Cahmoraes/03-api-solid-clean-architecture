import { UniqueIdentity } from './value-objects/unique-identity'

export abstract class Entity<Props> {
  protected readonly props: Props
  private _id: UniqueIdentity

  protected constructor(props: Props, anId?: UniqueIdentity | string) {
    this.props = props
    this._id = new UniqueIdentity(anId)
  }

  public get id() {
    return this._id
  }
}
