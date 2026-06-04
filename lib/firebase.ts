/**
 * Firebase client SDK initialisation.
 *
 * All config comes from NEXT_PUBLIC_ env vars so the bundle never hard-codes
 * credentials. If any required var is missing the module exports null values
 * and the app falls back to localStorage-only mode gracefully.
 *
 * Required env vars (add to .env.local and Vercel project settings):
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  orderBy,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore'

// ─── Config ──────────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
)

// ─── Singletons ───────────────────────────────────────────────────────────────

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

if (isConfigured && typeof window !== 'undefined') {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  auth = getAuth(app)
  db   = getFirestore(app)
}

export { auth, db, isConfigured }

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export async function signInWithGoogle(): Promise<User> {
  if (!auth) throw new Error('Firebase not configured')
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  if (!auth) throw new Error('Firebase not configured')
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  if (!auth) throw new Error('Firebase not configured')
  const result = await createUserWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function signOut(): Promise<void> {
  if (!auth) return
  await firebaseSignOut(auth)
}

export function onAuthChange(cb: (user: User | null) => void): () => void {
  if (!auth) { cb(null); return () => {} }
  return onAuthStateChanged(auth, cb)
}

// ─── Firestore project helpers ────────────────────────────────────────────────

export interface FirestoreProjectMeta {
  id: string
  name: string
  mode: string
  updatedAt: string
}

/** Save full project state to Firestore under users/{uid}/projects/{projectId} */
export async function saveProjectToFirestore(
  uid: string,
  projectId: string,
  payload: Record<string, unknown>
): Promise<void> {
  if (!db) throw new Error('Firestore not configured')
  const ref = doc(db, 'users', uid, 'projects', projectId)
  await setDoc(ref, { ...payload, _updatedAt: serverTimestamp() }, { merge: true })
}

/** Load a single project from Firestore */
export async function loadProjectFromFirestore(
  uid: string,
  projectId: string
): Promise<Record<string, unknown> | null> {
  if (!db) return null
  const ref = doc(db, 'users', uid, 'projects', projectId)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as Record<string, unknown>) : null
}

/** List all projects for a user (metadata only) */
export async function listProjectsFromFirestore(
  uid: string
): Promise<FirestoreProjectMeta[]> {
  if (!db) return []
  const col = collection(db, 'users', uid, 'projects')
  const q = query(col, orderBy('_updatedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      name: data.projectMeta?.name ?? 'Untitled',
      mode: data.mode ?? 'custom',
      updatedAt: data.projectMeta?.updatedAt ?? new Date().toISOString(),
    }
  })
}

/** Delete a project from Firestore */
export async function deleteProjectFromFirestore(
  uid: string,
  projectId: string
): Promise<void> {
  if (!db) return
  await deleteDoc(doc(db, 'users', uid, 'projects', projectId))
}
