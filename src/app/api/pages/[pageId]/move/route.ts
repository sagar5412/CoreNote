import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import { withErrorHandling } from "@/lib/utils/route-handler";
import { movePageSchema } from "@/lib/validators/page";
import { NotFoundError, ForbiddenError } from "@/lib/utils/errors";
import { successResponse } from "@/lib/utils/api-response";

type RouteContext = {
  params: {
    pageId: string;
  };
};

export const POST = withErrorHandling(
  async (req: NextRequest, context: RouteContext) => {
    const session = await requireSession();
    const { newParentId, newPosition } = movePageSchema.parse(await req.json());
    const { pageId } = await context.params;

    const page = await prisma.page.findUnique({
      where: { id: pageId },
    });

    if (!page) throw new NotFoundError("Page not found");
    if (page.ownerId !== session.user.id) throw new ForbiddenError();

    await prisma.$transaction(async (tx) => {
      await tx.page.updateMany({
        where: {
          ownerId: session.user.id,
          parentId: page.parentId,
          position: { gt: page.position },
        },
        data: {
          position: { decrement: 1 },
        },
      });

      await tx.page.updateMany({
        where: {
          ownerId: session.user.id,
          parentId: newParentId,
          position: { gte: newPosition },
        },
        data: {
          position: { increment: 1 },
        },
      });

      await tx.page.update({
        where: { id: pageId },
        data: {
          parentId: newParentId,
          position: newPosition,
        },
      });
    });

    return successResponse(true, 200);
  }
);
