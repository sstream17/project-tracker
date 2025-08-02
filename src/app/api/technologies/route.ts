import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError, validateMethod, parseBody } from '@/lib/api-utils';

type TechnologyInput = {
  name: string;
  description?: string;
};

// GET /api/technologies - Get all technologies
export async function GET(req: NextRequest) {
  try {
    validateMethod(req, ['GET']);
    
    const technologies = await prisma.technology.findMany({
      include: {
        tags: {
          include: {
            technologies: true
          }
        },
        _count: {
          select: { projects: true }
        }
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(technologies);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/technologies - Create a new technology
export async function POST(req: NextRequest) {
  try {
    validateMethod(req, ['POST']);
    
    const { name, description } = await parseBody<TechnologyInput>(req);

    if (!name) {
      throw new ApiError('Name is required', 400);
    }

    const technology = await prisma.technology.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(technology, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/technologies - Update a technology
export async function PATCH(req: NextRequest) {
  try {
    validateMethod(req, ['PATCH']);
    
    const data = await parseBody<{ id: string } & Partial<TechnologyInput>>(req);
    const { id, ...updateData } = data;

    if (!id) {
      throw new ApiError('Technology ID is required', 400);
    }

    const technology = await prisma.technology.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(technology);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/technologies - Delete a technology
export async function DELETE(req: NextRequest) {
  try {
    validateMethod(req, ['DELETE']);
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new ApiError('Technology ID is required', 400);
    }

    await prisma.technology.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
