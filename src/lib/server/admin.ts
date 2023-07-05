import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { env } from '$env/dynamic/private'
import pkg from 'firebase-admin';

try {
  pkg.initializeApp({
    credential: pkg.credential.cert({
      projectId: env.SECRET_FB_PROJECT_ID,
      clientEmail: env.SECRET_FB_CLIENT_EMAIL,
      privateKey: env.SECRET_FB_PRIVATE_KEY,
    }),
  });
} catch (err: any) {
  if (!/already exists/u.test(err.message)) {
    console.error('Firebase Admin Error: ', err.stack)
  }
}

export const adminDB = getFirestore();
export const adminAuth = getAuth();