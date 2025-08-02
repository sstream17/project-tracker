import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError, validateMethod, parseBody } from '@/lib/api-utils';

type ProjectInput = {
  title: string;
  description?: string;
  status: 'IDEA' | 'IN_PROGRESS' | 'STABLE' | 'COMPLETE';
};

// GET /api/projects - Get all projects
export async function GET(req: NextRequest) {
  try {
    validateMethod(req, ['GET']);
    
    const projects = await prisma.project.findMany({
      include: {
        technologies: {
          include: {
            tags: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/projects - Create a new project
export async function POST(req: NextRequest) {
  try {
    validateMethod(req, ['POST']);
    
    const data = await parseBody<ProjectInput>(req);
    const { title, description, status } = data;

    if (!title) {
      throw new ApiError('Title is required', 400);
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        status: status || 'IDEA',
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/projects - Update a project
export async function PATCH(req: NextRequest) {
  try {
    validateMethod(req, ['PATCH']);
    
    const data = await parseBody<{ id: string } & Partial<ProjectInput>>(req);
    const { id, ...updateData } = data;

    if (!id) {
      throw new ApiError('Project ID is required', 400);
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(project);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/projects - Delete a project
export async function DELETE(req: NextRequest) {
  try {
    validateMethod(req, ['DELETE']);
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new ApiError('Project ID is required', 400);
    }

    await prisma.project.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
