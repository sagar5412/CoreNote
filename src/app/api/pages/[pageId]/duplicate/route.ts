import { requireSession } from "@/lib/auth/require-session";
import { successResponse } from "@/lib/utils/api-response";
import { ForbiddenError, NotFoundError } from "@/lib/utils/errors";
import { withErrorHandling } from "@/lib/utils/route-handler";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { JsonNull } from "@prisma/client/runtime/client";
import { Prisma } from "@/generated/prisma/client";
import { title } from "process";

type RouteContext = {
  params: {
    pageId: string;
  };
};

async function duplicatePageTree(
  tx: Prisma.TransactionClient,
  pageId: string,
  newParentId: string | null,
  ownerId: string
) {
  const page = await tx.page.findUnique({
    where: {
      id: pageId,
    },
    include: {
      children: true,
    },
  });

  if (!page) return;

  const cloned = await tx.page.create({
    data: {
      title: `${page.title} (Copy)`,
      icon: page.icon,
      coverImage: page.coverImage,
      content: page.content ?? JsonNull,
      ownerId: ownerId,
      parentId: newParentId,
      position: page.position,
    },
  });

  for (const child of page.children) {
    await duplicatePageTree(tx, child.id, cloned.id, ownerId);
  }
  return cloned;
}

export const POST = withErrorHandling(
  async (_req: NextRequest, context: RouteContext) => {
    const session = await requireSession();
    const { pageId } = await context.params;

    const page = await prisma?.page.findUnique({
      where: {
        ownerId: session.user.id,
        id: pageId,
      },
    });

    if (!page) {
      throw new NotFoundError();
    }
    if (page.ownerId !== session.user.id) throw new ForbiddenError();
    const duplicatePage = await prisma.$transaction(async (tx) => {
      await tx.page.updateMany({
        where: {
          ownerId: session.user.id,
          parentId: page.parentId,
          position: { gt: page.position },
        },
        data: {
          position: { increment: 1 },
        },
      });

      const newPage = await tx.page.create({
        data: {
          title: page.title,
          icon: page.icon,
          coverImage: page.coverImage,
          content: page.content ?? JsonNull,
          ownerId: session.user.id,
          parentId: page.parentId,
          position: page.position,
        },
      });

      const children = await tx.page.findMany({
        where: {
          ownerId: session.user.id,
          parentId: page.id,
        },
      });

      for (const child of children) {
        await duplicatePageTree(tx, child.id, newPage.id, session.user.id);
      }
      return newPage;
    });
    return successResponse(
      {
        id: duplicatePage.id,
        title: duplicatePage.title,
      },
      200
    );
  }
);
