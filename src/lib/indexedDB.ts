const DB_NAME = 'PwaExamDB';
const DB_VERSION = 1;
const USER_STORE = 'users';
const RESULT_STORE = 'results';

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
        // Return a mock object for SSR
        const mockDB = {} as IDBDatabase;
        resolve(mockDB);
        return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(USER_STORE)) {
        db.createObjectStore(USER_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(RESULT_STORE)) {
        db.createObjectStore(RESULT_STORE, { autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject('IndexedDB error: ' + (event.target as IDBOpenDBRequest).error);
    };
  });
};

export const addUser = async (user: { id: string; name: string; enrollmentId: string }) => {
  const db = await openDB();
  if (!db.transaction) return Promise.resolve(); // SSR guard
  const transaction = db.transaction(USER_STORE, 'readwrite');
  const store = transaction.objectStore(USER_STORE);
  // Use .put() to allow overwriting/updating existing users.
  // This prevents errors if a user takes the exam multiple times offline.
  store.put(user);
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const addResult = async (result: any) => {
    const db = await openDB();
    if (!db.transaction) return Promise.resolve(); // SSR guard
    const transaction = db.transaction(RESULT_STORE, 'readwrite');
    const store = transaction.objectStore(RESULT_STORE);
    store.add(result);
    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  };

export const getOfflineUsers = async () => {
    const db = await openDB();
    if (!db.transaction) return Promise.resolve([]); // SSR guard
    const transaction = db.transaction(USER_STORE, 'readonly');
    const store = transaction.objectStore(USER_STORE);
    const request = store.getAll();
    return new Promise<any[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const getOfflineResults = async () => {
    const db = await openDB();
    if (!db.transaction) return Promise.resolve([]); // SSR guard
    const transaction = db.transaction(RESULT_STORE, 'readonly');
    const store = transaction.objectStore(RESULT_STORE);
    const request = store.getAll();
    return new Promise<any[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const clearOfflineData = async () => {
    const db = await openDB();
    if (!db.transaction) return Promise.resolve(); // SSR guard
    const userTransaction = db.transaction(USER_STORE, 'readwrite');
    userTransaction.objectStore(USER_STORE).clear();
    const resultTransaction = db.transaction(RESULT_STORE, 'readwrite');
    resultTransaction.objectStore(RESULT_STORE).clear();

    return Promise.all([
        new Promise<void>(resolve => userTransaction.oncomplete = () => resolve()),
        new Promise<void>(resolve => resultTransaction.oncomplete = () => resolve()),
    ]);
};
