import { initializeApp, getApp, getApps } from 'firebase/app';
import { env } from '$env/dynamic/private';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc, 
  query, 
  orderBy, 
  where, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { IDatabaseService, Project, Consultation, Meeting } from './interface';

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export class FirestoreDatabaseService implements IDatabaseService {
  async getPendingConsultationsCount(): Promise<number> {
    try {
      const q = query(collection(db, 'pending_consultations'), where('status', '==', 'pending'));
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (e) {
      console.error('Error fetching pending consultations count:', e);
      return 0;
    }
  }

  async getPendingConsultations(): Promise<Consultation[]> {
    const q = query(collection(db, 'pending_consultations'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate 
          ? data.createdAt.toDate().toISOString() 
          : data.createdAt || null
      } as Consultation;
    });
  }

  async getConsultation(id: string): Promise<Consultation | null> {
    const docRef = doc(db, 'pending_consultations', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      createdAt: data.createdAt?.toDate 
        ? data.createdAt.toDate().toISOString() 
        : data.createdAt || null
    } as Consultation;
  }

  async createConsultation(data: Omit<Consultation, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'pending_consultations'), {
      ...data,
      createdAt: data.createdAt || new Date().toISOString()
    });
    return docRef.id;
  }

  async updateConsultation(id: string, data: Partial<Consultation>): Promise<void> {
    const docRef = doc(db, 'pending_consultations', id);
    const cleanedData = { ...data, updatedAt: new Date().toISOString() };
    
    // Remove undefined values to prevent FirebaseError
    const keys = Object.keys(cleanedData) as Array<keyof typeof cleanedData>;
    for (const key of keys) {
      if (cleanedData[key] === undefined) {
        delete cleanedData[key];
      }
    }
    
    await updateDoc(docRef, cleanedData);
  }

  async deleteConsultation(id: string): Promise<void> {
    const docRef = doc(db, 'pending_consultations', id);
    await deleteDoc(docRef);
  }

  async getProjects(): Promise<Project[]> {
    const q = query(collection(db, 'selected-projects'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title ?? '',
        tagline: data.tagline ?? '',
        description: data.description ?? '',
        role: data.role ?? '',
        timeline: data.date ?? '', // map date to timeline range
        status: data.status ?? 'In Progress',
        imageUrl: data.image ?? '', // map image to imageUrl
        techStack: data.techStack ?? [],
        links: data.links ?? { live: '', github: '' },
        createdAt: data.createdAt ?? null
      } as Project;
    });
  }

  async createProject(data: Omit<Project, 'id'>): Promise<string> {
    const projectData = {
      title: data.title,
      tagline: data.tagline,
      description: data.description,
      role: data.role,
      date: data.timeline, // map to database field
      status: data.status,
      image: data.imageUrl, // map to database field
      techStack: data.techStack,
      links: data.links,
      createdAt: data.createdAt || new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'selected-projects'), projectData);
    return docRef.id;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<void> {
    const docRef = doc(db, 'selected-projects', id);
    const projectData: any = {};
    if (data.title !== undefined) projectData.title = data.title;
    if (data.tagline !== undefined) projectData.tagline = data.tagline;
    if (data.description !== undefined) projectData.description = data.description;
    if (data.role !== undefined) projectData.role = data.role;
    if (data.timeline !== undefined) projectData.date = data.timeline;
    if (data.status !== undefined) projectData.status = data.status;
    if (data.imageUrl !== undefined) projectData.image = data.imageUrl;
    if (data.techStack !== undefined) projectData.techStack = data.techStack;
    if (data.links !== undefined) projectData.links = data.links;
    projectData.updatedAt = new Date().toISOString();
    
    await updateDoc(docRef, projectData);
  }

  async deleteProject(id: string): Promise<void> {
    const docRef = doc(db, 'selected-projects', id);
    await deleteDoc(docRef);
  }

  async createMeeting(data: Omit<Meeting, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'meetings'), {
      ...data,
      createdAt: data.createdAt || new Date().toISOString()
    });
    return docRef.id;
  }

  async uploadPaymentProof(consultationId: string, fileBuffer: Buffer | Uint8Array, fileName: string, contentType: string): Promise<string> {
    try {
      const storage = getStorage(app);
      const ext = fileName.split('.').pop() || 'jpg';
      const storagePath = `payment_proofs/${consultationId}_${Date.now()}.${ext}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, fileBuffer, { contentType });
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (e) {
      console.warn('Firebase Storage upload error, falling back to base64 data URL:', e);
      const base64 = Buffer.from(fileBuffer).toString('base64');
      return `data:${contentType};base64,${base64}`;
    }
  }
}

export const dbService = new FirestoreDatabaseService();
