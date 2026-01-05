import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Home from "@/components/Home"; // your landing page

export default async function EntryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <Home />;
  }

  const firstPage = await prisma.page.findFirst({
    where: {
      ownerId: session.user.id,
      parentId: null,
    },
    orderBy: { position: "asc" },
    select: { id: true },
  });

  if (!firstPage) {
    // later: auto-create first or welcome or previous viewed page
    return <div>No pages yet</div>;
  }

  redirect(`/${firstPage.id}`);
}
