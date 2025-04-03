import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { connectDB } from './mongodb';
import { User } from '@/models/User';

if (!process.env.JWT_SECRET) {
  throw new Error('Please define JWT_SECRET environment variable');
}

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function getSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    return await decrypt(token);
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

export async function getUser() {
  const session = await getSession();
  if (!session) return null;
  
  await connectDB();
  const user = await User.findById(session.id).select('_id email name');
  
  return user;
} 