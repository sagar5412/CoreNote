import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Home from "@/components/Home";
import { welcomeContent } from "@/components/WelcomePage";

export default async function EntryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <Home />;
  }

  let firstPage = await prisma.page.findFirst({
    where: {
      ownerId: session.user.id,
      parentId: null,
    },
    orderBy: { position: "asc" },
    select: { id: true },
  });

  if (!firstPage) {
    firstPage = await prisma.page.create({
      data: {
        title: "Welcome to CoreNote",
        icon: "👋",
        content: welcomeContent(),
        ownerId: session.user.id,
        position: 0,
      },
      select: { id: true },
    });
  }

  redirect(`/${firstPage.id}`);
}
