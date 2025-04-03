import { NextResponse } from 'next/server';
import { hashPassword, encrypt } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('Please define MONGODB_URI environment variable');
    }

    console.log('Starting signup process...');
    await connectDB();
    console.log('Connected to MongoDB');
    
    const body = await request.json();
    console.log('Received request body:', { ...body, password: '[REDACTED]' });
    
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || !name) {
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      if (!name) missingFields.push('name');
      
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields 
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate name
    const trimmedName = name.trim();
    if (!trimmedName) {
      return NextResponse.json(
        { error: 'Please enter a valid name' },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('User already exists with email:', email);
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in or use a different email address.' },
        { status: 400 }
      );
    }

    // Create user
    console.log('Creating new user...');
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email,
      password: hashedPassword,
      name: trimmedName,
    });

    if (!user) {
      console.log('Failed to create user');
      throw new Error('Failed to create account');
    }

    console.log('User created successfully:', { id: user._id, email: user.email, name: user.name });

    // Create session
    const token = await encrypt({ id: user._id });
    const response = NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });

    // Set secure cookie options
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.message.includes('E11000')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please log in or use a different email address.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Unable to create your account at this time. Please try again later.' },
      { status: 500 }
    );
  }
} 