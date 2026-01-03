import { NextRequest } from "next/server";
import { successResponse } from "@/lib/utils/api-response";
import prisma from "@/lib/prisma";
import { createPageSchema } from "@/lib/validators/page";
import { JsonNull } from "@prisma/client/runtime/client.js";
import { requireSession } from "@/lib/auth/require-session";
import { withErrorHandling } from "@/lib/utils/route-handler";
import { NotFoundError } from "@/lib/utils/errors";

async function ValidateParentId(parentId: string) {
  if (parentId) {
    const page = await prisma.page.findUnique({
      where: {
        id: parentId,
      },
    });
    if (!page) {
      throw new NotFoundError("Parent page not found");
    }
  }
}

export const GET = withErrorHandling(async (req: NextRequest) => {
  const session = await requireSession();
  const { searchParams } = new URL(req.url);
  const parentIdParam = searchParams.get("parentId");

  const parentId = parentIdParam === null ? null : parentIdParam;
  await ValidateParentId(parentId!);
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
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const session = await requireSession();

  const body = await req.json();
  const validatedBody = createPageSchema.parse(body);

  await ValidateParentId(validatedBody.parentId!);

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
  return successResponse(page, 201);
});
