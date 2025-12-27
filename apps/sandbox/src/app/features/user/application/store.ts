import { signalStore, withState } from '@ngrx/signals';

export const userStore = signalStore(
  { providedIn: 'root' },
  withState({ loading: false })
);
