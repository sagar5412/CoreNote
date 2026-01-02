import { authOptions } from "@/lib/auth";
import {
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/utils/api-response";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: {
    pageId: string;
  };
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const { pageId } = await context.params;

    if (!pageId) {
      return notFoundResponse("Page not found");
    }
    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
        OR: [{ ownerId: session.user.id }, { isPublished: true }],
      },
      select: {
        id: true,
        title: true,
        icon: true,
        content: true,
        parentId: true,
        position: true,
        isPublished: true,
        slug: true,
        parent: {
          select: {
            id: true,
            title: true,
            icon: true,
          },
        },
      },
    });

    if (!page) {
      return notFoundResponse("Page not found");
    }

    return successResponse(page, 200);
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to fetch page", 500);
  }
}
