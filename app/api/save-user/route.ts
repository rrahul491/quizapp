import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, phone, password, agreedToTerms } = await request.json();

    if (!email || !phone || !password || !agreedToTerms) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }

    await sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      agreed_to_terms BOOLEAN NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`;

    await sql`INSERT INTO users (email, phone, password, agreed_to_terms)
      VALUES (${email}, ${phone}, ${password}, ${agreedToTerms});`;

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}


