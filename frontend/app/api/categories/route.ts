import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    
    // Build the backend URL
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const url = new URL('/api/categories', backendUrl);
    
    if (active) {
      url.searchParams.set('active', active);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Categories API error:', error);
    return Response.json(
      { success: false, message: 'Error fetching categories' },
      { status: 500 }
    );
  }
} 