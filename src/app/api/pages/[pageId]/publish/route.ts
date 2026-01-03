import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import { withErrorHandling } from "@/lib/utils/route-handler";
import { publishPageSchema } from "@/lib/validators/page";
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "@/lib/utils/errors";
import { successResponse } from "@/lib/utils/api-response";

type RouteContext = {
  params: {
    pageId: string;
  };
};

export const POST = withErrorHandling(
  async (req: NextRequest, { params }: RouteContext) => {
    const session = await requireSession();
    const { slug, isPublished } = publishPageSchema.parse(await req.json());
    const { pageId } = await params;
    const page = await prisma.page.findUnique({
      where: { id: pageId },
    });

    if (!page) throw new NotFoundError("Page not found");
    if (page.ownerId !== session.user.id) throw new ForbiddenError();

    if (isPublished && slug) {
      const existing = await prisma.page.findFirst({
        where: {
          slug,
          isPublished: true,
          NOT: { id: pageId },
        },
        select: { id: true },
      });

      if (existing) {
        throw new ValidationError("Slug already in use");
      }
    }

    await prisma.page.update({
      where: { id: pageId },
      data: {
        slug: isPublished ? slug : null,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return successResponse(true, 200);
  }
);
