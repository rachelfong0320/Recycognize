// app/api/company/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log('GET request params:', { userId });

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // GET /brands/{userId} - Get by user ID
    const apiGatewayUrl = `https://1qpqvcemec.execute-api.us-east-1.amazonaws.com/dev/brands/${userId}`;
    
    console.log('Fetching from API Gateway:', apiGatewayUrl);
    
    const response = await fetch(apiGatewayUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('API Gateway response status:', response.status);
    
    if (!response.ok) {
      // If we get a 404, it means no company data exists yet (which is okay)
      if (response.status === 404) {
        return NextResponse.json({ 
          success: true, 
          data: null,
          message: 'No company data found' 
        });
      }
      
      const errorText = await response.text();
      console.error('API Gateway error response:', errorText);
      throw new Error(`API Gateway returned ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('API Gateway success response:', result);
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    console.error('Error fetching from API Gateway:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const companyData = await request.json();
    
    console.log('Sending to API Gateway:', companyData);
    console.log('--------------------------------');

    // Forward the request to your API Gateway
    const apiGatewayUrl = 'https://1qpqvcemec.execute-api.us-east-1.amazonaws.com/dev/brands';
    
    const response = await fetch(apiGatewayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyData),
    });
    
    console.log('API Gateway POST response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Gateway error response:', errorText);
      throw new Error(`API Gateway returned ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('API Gateway POST success response:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Company data saved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error forwarding to API Gateway:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save company data' },
      { status: 500 }
    );
  }
}