import { NextRequest } from "next/server";
import { successResponse } from "@/lib/utils/api-response";
import prisma from "@/lib/prisma";
import { JsonNull } from "@prisma/client/runtime/client";
import { withErrorHandling } from "@/lib/utils/route-handler";
import { requireSession } from "@/lib/auth/require-session";
import { updatePageSchema } from "@/lib/validators/page";
import { ForbiddenError, NotFoundError } from "@/lib/utils/errors";

type RouteContext = {
  params: {
    pageId: string;
  };
};

export const GET = withErrorHandling(
  async (req: NextRequest, context: RouteContext) => {
    const session = await requireSession();

    const { pageId } = await context.params;

    if (!pageId) {
      throw new NotFoundError("Page not found");
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
      throw new NotFoundError("Page not found");
    }

    return successResponse(page, 200);
  }
);

export const PUT = withErrorHandling(
  async (req: NextRequest, context: RouteContext) => {
    const session = await requireSession();
    const body = updatePageSchema.parse(await req.json());
    const { pageId } = await context.params;

    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: { ownerId: true },
    });

    if (!page) throw new NotFoundError("Page not found");
    if (page.ownerId !== session.user.id) throw new ForbiddenError();
    await prisma.page.update({
      where: { id: pageId },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.coverImage !== undefined && {
          coverImage: body.coverImage,
        }),
        ...(body.content !== undefined && {
          content: body.content ?? JsonNull,
        }),
      },
    });

    return successResponse(true, 200);
  }
);

export const DELETE = withErrorHandling(
  async (_req: NextRequest, context: RouteContext) => {
    const session = await requireSession();
    const { pageId } = await context.params;
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: { ownerId: true },
    });
    if (!page) throw new NotFoundError("Page not found");
    if (page.ownerId !== session.user.id) throw new ForbiddenError();
    await prisma.page.delete({
      where: { id: pageId },
    });
    return successResponse(true, 200);
  }
);
