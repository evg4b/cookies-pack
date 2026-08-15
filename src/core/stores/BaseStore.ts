import { type Listener, Store, type Unsubscribe } from '@core/stores/types';

export abstract class BaseStore<T extends object> implements Store<T> {
  protected abstract state: T;
  protected readonly listeners = new Set<Listener>();

  abstract refresh(): Promise<void>;

  public getSnapshot(): T {
    return this.state;
  }

  public subscribe(listener: Listener): Unsubscribe {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  protected setState(patch: Partial<T>) {
    this.state = { ...this.state, ...patch };
    this.notifyListeners();
  }

  protected notifyListeners = () => {
    this.listeners.forEach((listener) => { listener(); });
  };
}
