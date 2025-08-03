import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError, validateMethod, parseBody } from '@/lib/api-utils';
import { createColor } from '@/lib/create-color';

type TagInput = {
  name: string;
  description?: string;
  color?: string;
};

// GET /api/tags - Get all tags
export async function GET(req: NextRequest) {
  try {
    validateMethod(req, ['GET']);
    
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { technologies: true }
        }
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(tags);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/tags - Create a new tag
export async function POST(req: NextRequest) {
  try {
    validateMethod(req, ['POST']);
    
    const { name, description, color } = await parseBody<TagInput>(req);

    if (!name) {
      throw new ApiError('Name is required', 400);
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        description,
        color: color || createColor(name),
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/tags - Update a tag
export async function PATCH(req: NextRequest) {
  try {
    validateMethod(req, ['PATCH']);
    
    const data = await parseBody<{ id: string } & Partial<TagInput>>(req);
    const { id, ...updateData } = data;

    if (!id) {
      throw new ApiError('Tag ID is required', 400);
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(tag);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/tags - Delete a tag
export async function DELETE(req: NextRequest) {
  try {
    validateMethod(req, ['DELETE']);
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new ApiError('Tag ID is required', 400);
    }

    await prisma.tag.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
