import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError, validateMethod, parseBody } from '@/lib/api-utils';

// GET /api/projects/[id] - Get a project by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    validateMethod(req, ['GET']);

    const projectId = params.id;

    if (!projectId) {
      throw new ApiError('Project ID is required', 400);
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new ApiError('Project not found', 404);
    }

    return NextResponse.json(project);
  } catch (error) {
    return handleApiError(error);
  }
}