import { signalStore, withState } from '@ngrx/signals';

export const TestProductStore = signalStore(
  { providedIn: 'root' },
  withState({ loading: false })
);
