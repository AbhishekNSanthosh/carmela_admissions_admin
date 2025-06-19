// src/app/api/users/route.ts

import { adminAuth } from '@lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const listUsersResult = await adminAuth.listUsers(1000);

    const users = listUsersResult.users.map(userRecord => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      customClaims: userRecord.customClaims || {},
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("🔥 Failed to list users:", error);
    return NextResponse.json(
      { error: 'Internal server error: Could not list users.' },
      { status: 500 }
    );
  }
}
