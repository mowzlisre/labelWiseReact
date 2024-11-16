// indexedDB.js
import { openDB } from 'idb';

const DATABASE_NAME = 'LabelWise';
const STORE_NAME = 'dataStore';
const DATABASE_VERSION = 1;

// Initialize or open the IndexedDB database
export const initDB = async () => {
    return openDB(DATABASE_NAME, DATABASE_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        },
    });
};

// Save data to IndexedDB
export const saveDataToIndexedDB = async (data) => {
    const db = await initDB();
    await db.put(STORE_NAME, data);
};

// Retrieve all data from IndexedDB
export const getAllDataFromIndexedDB = async () => {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
};

// Delete data from IndexedDB by ID
export const deleteDataFromIndexedDB = async (id) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
};
