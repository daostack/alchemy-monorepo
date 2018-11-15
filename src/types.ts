import { Observable } from 'rxjs'

export interface Stateful<T> {
  state: Observable<T>
}
