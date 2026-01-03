import { requireSession } from "@/lib/auth/require-session";
import { withErrorHandling } from "@/lib/utils/route-handler";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { NotFoundError, ForbiddenError } from "@/lib/utils/errors";
import { successResponse } from "@/lib/utils/api-response";

type RouteContext = {
  params: { pageId: string };
};

export const POST = withErrorHandling(
  async (req: NextRequest, { params }: RouteContext) => {
    const session = await requireSession();
    const { pageId } = await params;
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
