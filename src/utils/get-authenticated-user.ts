import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export default async function getAuthenticatedUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) return null;

    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    return dbUser;
  } catch (error) {
    console.error("Erro ao buscar usuário atual:", error);
    return null;
  }
}
