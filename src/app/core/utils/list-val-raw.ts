import { onValue, Query } from 'firebase/database';
import { Observable } from 'rxjs';

export function listValRaw<T>(q: Query, keyField = 'key'): Observable<T[]> {
  return new Observable<T[]>(subscriber =>
    onValue(
      q,
      snapshot => {
        const items: T[] = [];
        snapshot.forEach(child => { items.push({ [keyField]: child.key, ...child.val() } as T); });
        subscriber.next(items);
      },
      err => subscriber.error(err)
    )
  );
}
