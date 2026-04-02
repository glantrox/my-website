import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";

// Konfigurasi Anda
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, // <--- Ini penyebab utamanya
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Fungsi untuk upload massal
 * @param {Array} dataArray - Array berisi objek JSON
 * @param {string} collectionName - Nama koleksi target
 */
const bulkUpload = async (dataArray, collectionName) => {
    // Batas Firestore adalah 500 operasi per batch
    const BATCH_SIZE = 500;
    const chunks = [];

    // Memecah data menjadi potongan-potongan kecil
    for (let i = 0; i < dataArray.length; i += BATCH_SIZE) {
        chunks.push(dataArray.slice(i, i + BATCH_SIZE));
    }

    // Proses setiap chunk
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const batch = writeBatch(db);
        const colRef = collection(db, collectionName);

        chunk.forEach((item) => {
            const docRef = doc(colRef);
            batch.set(docRef, item);
        });

        try {
            await batch.commit();
            console.log(`Batch ${i + 1} dari ${chunks.length} berhasil diunggah (${chunk.length} item).`);
        } catch (error) {
            console.error(`Gagal mengunggah batch ${i + 1}:`, error);
        }
    }

    console.log("Proses selesai.");
};


// Contoh penggunaan:
import data from './data.json' with { type: 'json' };
bulkUpload(data, "selected-projects");
