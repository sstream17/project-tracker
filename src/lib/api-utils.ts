import { NextResponse } from 'next/server';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class ApiError extends Error {
  statusCode: number;
  headers?: Record<string, string>;

  constructor(message: string, statusCode: number = 400, options?: { headers?: Record<string, string> }) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    this.headers = options?.headers;
  }
}

export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { 
        status: error.statusCode,
        headers: error.headers
      }
    );
  }
  
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
};

export const validateMethod = (
  request: Request,
  allowedMethods: HttpMethod[]
): HttpMethod => {
  const method = request.method as HttpMethod;
  
  if (!method || !allowedMethods.includes(method)) {
    throw new ApiError(
      `Method ${method} Not Allowed`,
      405,
      { 
        headers: { 'Allow': allowedMethods.join(', ') }
      }
    );
  }
  
  return method;
};

export const parseBody = async <T>(request: Request): Promise<T> => {
  try {
    return await request.json();
  } catch (error) {
    throw new ApiError('Invalid JSON body', 400);
  }
};
