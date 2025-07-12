import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError, validateMethod, parseBody } from '@/lib/api-utils';

type ProjectTechnology = {
  id: string;
  projectId: string;
  technologyId: string;
  technology: {
    id: string;
    name: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
};

// GET /api/projects/[id]/technologies - Get all technologies for a project
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
      include: {
        technologies: {
          include: {
            technology: true
          }
        }
      }
    });

    if (!project) {
      throw new ApiError('Project not found', 404);
    }

    const technologies = project.technologies.map((pt: ProjectTechnology) => ({
      ...pt.technology,
      projectTechnologyId: pt.id
    }));

    return NextResponse.json(technologies);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/projects/[id]/technologies - Add a technology to a project
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    validateMethod(req, ['POST']);
    
    const projectId = params.id;
    const { technologyId } = await parseBody<{ technologyId: string }>(req);

    if (!projectId || !technologyId) {
      throw new ApiError('Project ID and Technology ID are required', 400);
    }

    // Check if the project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new ApiError('Project not found', 404);
    }

    // Check if the technology exists
    const technology = await prisma.technology.findUnique({
      where: { id: technologyId },
    });

    if (!technology) {
      throw new ApiError('Technology not found', 404);
    }

    // Check if the relationship already exists
    const existing = await prisma.projectTechnology.findFirst({
      where: {
        projectId,
        technologyId
      }
    });

    if (existing) {
      throw new ApiError('This technology is already added to the project', 400);
    }

    const projectTechnology = await prisma.projectTechnology.create({
      data: {
        projectId,
        technologyId,
      },
      include: {
        technology: true
      }
    });

    return NextResponse.json(projectTechnology.technology, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/projects/[id]/technologies/[techId] - Remove a technology from a project
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; techId: string } }
) {
  try {
    validateMethod(req, ['DELETE']);
    
    const { id: projectId, techId: technologyId } = params;

    if (!projectId || !technologyId) {
      throw new ApiError('Project ID and Technology ID are required', 400);
    }

    // Find and delete the relationship
    const projectTech = await prisma.projectTechnology.findFirst({
      where: {
        projectId,
        technologyId
      }
    });

    if (!projectTech) {
      throw new ApiError('Technology not found in project', 404);
    }

    await prisma.projectTechnology.delete({
      where: {
        id: projectTech.id
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
