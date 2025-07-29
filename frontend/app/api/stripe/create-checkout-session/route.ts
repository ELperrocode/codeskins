import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get all cookies from the request
    const cookies = request.headers.get('cookie') || '';
    
    const response = await fetch(`${BACKEND_URL}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    // Create response with proper headers
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });
    
    // Copy any Set-Cookie headers from backend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('Set-Cookie', setCookieHeader);
    }
    
    return nextResponse;
  } catch (error) {
    console.error('Stripe checkout API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 