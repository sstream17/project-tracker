import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError, validateMethod, parseBody } from '@/lib/api-utils';

// GET /api/technologies/[id] - Get a technology by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    validateMethod(req, ['GET']);
    
    const technologyId = params.id;
    
    if (!technologyId) {
      throw new ApiError('Technology ID is required', 400);
    }

    const technology = await prisma.technology.findUnique({
      where: { id: technologyId },
    });

    if (!technology) {
      throw new ApiError('Technology not found', 404);
    }

    return NextResponse.json(technology);
  } catch (error) {
    return handleApiError(error);
  }
}