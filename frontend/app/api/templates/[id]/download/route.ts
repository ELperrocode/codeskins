import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Template ID is required' },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/templates/${id}/download`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.message || 'Download failed' },
        { status: response.status }
      );
    }

    // Get the file data
    const fileData = await response.arrayBuffer();
    
    // Get headers from backend response
    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
    const contentDisposition = response.headers.get('Content-Disposition') || 'attachment';
    const contentLength = response.headers.get('Content-Length');

    // Create response with file data
    const fileResponse = new NextResponse(fileData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
        'Content-Length': contentLength || '',
        'Cache-Control': 'no-cache',
      },
    });

    return fileResponse;

  } catch (error) {
    console.error('Download proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 