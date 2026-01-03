import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import { withErrorHandling } from "@/lib/utils/route-handler";
import { NotFoundError, ForbiddenError } from "@/lib/utils/errors";
import { successResponse } from "@/lib/utils/api-response";
import { JsonNull } from "@prisma/client/runtime/client";

type RouteContext = {
  params: {
    pageId: string;
  };
};

export const GET = withErrorHandling(
  async (req: NextRequest, { params }: RouteContext) => {
    const session = await requireSession();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);
    const cursor = searchParams.get("cursor");
    const { pageId } = await params;

    const parent = await prisma.page.findUnique({
      where: { id: pageId },
      select: { ownerId: true },
    });
    if (!parent) throw new NotFoundError("Page not found");
    if (parent.ownerId !== session.user.id) throw new ForbiddenError();

    if (cursor) {
      const cursorValidate = await prisma.page.findUnique({
        where: {
          id: cursor,
        },
        select: {
          parentId: true,
          ownerId: true,
        },
      });
      if (!cursorValidate) throw new NotFoundError("Invalid cursor");
      if (cursorValidate.parentId !== pageId)
        throw new NotFoundError("Cursor doesn't belong to this page");
      if (cursorValidate.ownerId !== session.user.id)
        throw new ForbiddenError();
    }

    const children = await prisma.page.findMany({
      where: {
        ownerId: session.user.id,
        parentId: pageId,
      },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: { position: "asc" },
      select: {
        id: true,
        title: true,
        icon: true,
        parentId: true,
        position: true,
        _count: {
          select: { children: true },
        },
      },
    });

    const hasMore = children.length > limit;
    const items = hasMore ? children.slice(0, limit) : children;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return successResponse(
      {
        items,
        nextCursor,
      },
      200
    );
  }
);
