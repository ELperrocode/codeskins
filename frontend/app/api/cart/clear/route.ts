import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function DELETE(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/cart/clear`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Set-Cookie': response.headers.get('set-cookie') || '',
      },
    });
  } catch (error) {
    console.error('Cart clear API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 