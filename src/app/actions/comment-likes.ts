"use server";

import prisma from "@/lib/prisma";
import getAuthenticatedUser from "@/utils/get-authenticated-user";
import { likeSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function toggleCommentLike(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Usuário deve estar autenticado");

  const validatedData = likeSchema.parse({
    commentId: formData.get("commentId"),
    userId: user.id,
  });

  const existingLike = await prisma.commentLikes.findUnique({
    where: {
      commentId_userId: {
        commentId: validatedData.commentId,
        userId: user.id,
      },
    },
  });

  if (existingLike) {
    await prisma.commentLikes.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    await prisma.commentLikes.create({
      data: {
        commentId: validatedData.commentId,
        userId: user.id,
      },
    });
  }

  // 4. Atualiza a tela
  revalidatePath(`/blog/[slug]`, "page");
}
