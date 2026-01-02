import { authOptions } from "@/lib/auth";
import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/utils/api-response";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createPageSchema } from "@/lib/validators/page";
import z from "zod";
import { JsonNull } from "@prisma/client/runtime/client.js";
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse();
    }
    const { searchParams } = new URL(req.url);
    const parentIdParam = searchParams.get("parentId");

    const parentId = parentIdParam === null ? null : parentIdParam;

    const pages = await prisma.page.findMany({
      where: {
        ownerId: session.user.id,
        parentId: parentId,
      },
      select: {
        id: true,
        title: true,
        icon: true,
        parentId: true,
        position: true,
        _count: {
          select: {
            children: true,
          },
        },
      },
      orderBy: {
        position: "asc",
      },
    });
    return successResponse(pages, 200);
  } catch (error) {
    return errorResponse("Failed to fetch pages", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const body = await req.json();
    const validatedBody = createPageSchema.parse(body);

    if (validatedBody.parentId) {
      const parentPage = await prisma.page.findFirst({
        where: {
          ownerId: session.user.id,
          id: validatedBody.parentId,
        },
      });

      if (!parentPage) {
        return errorResponse("Parent page not found", 404);
      }
    }

    const page = await prisma.$transaction(async (tx) => {
      const lastSibling = await tx.page.findFirst({
        where: {
          ownerId: session.user.id,
          parentId: validatedBody.parentId,
        },
        orderBy: {
          position: "desc",
        },
        select: {
          position: true,
        },
      });

      const nextPosition = lastSibling ? lastSibling.position + 1 : 0;

      return await tx.page.create({
        data: {
          title: validatedBody.title,
          icon: validatedBody.icon,
          coverImage: validatedBody.coverImage,
          content: validatedBody.content ?? JsonNull,
          ownerId: session.user.id,
          parentId: validatedBody.parentId ?? null,
          position: nextPosition,
        },
        select: {
          id: true,
          title: true,
          icon: true,
          parentId: true,
          position: true,
        },
      });
    });
    return successResponse(page, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid request data", 400);
    }
    return errorResponse("Failed to create page", 500, error);
  }
}
