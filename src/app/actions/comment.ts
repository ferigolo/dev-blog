"use server";

import prisma from "@/lib/prisma";
import getAuthenticatedUser from "@/utils/get-authenticated-user";
import { checkCommentAuthority } from "./permissions/check-comment-authority";
import { revalidatePath } from "next/cache";

export async function createComment(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Usuário deve estar autenticado')

  const postId = formData.get("postId") as string;
  const text = formData.get("text") as string;

  if (!text || text.trim() === "") return;

  await prisma.comment.create({
    data: {
      text,
      postId,
      authorId: user.id,
    },
  });

  revalidatePath(`/blog/[slug]`, "page");
}

export async function updateComment(commentId: string, formData: FormData) {
  const user = await getAuthenticatedUser();
  await checkCommentAuthority(user, commentId, true);

  const text = formData.get("text") as string;
  if (!text || text.trim() === "") return;

  await prisma.comment.update({
    where: { id: commentId },
    data: { text },
  });

  revalidatePath(`/blog/[slug]`, "page");
}

export async function deleteComment(commentId: string) {
  const user = await getAuthenticatedUser();

  await checkCommentAuthority(user, commentId, true); // Verifica se é dono ou admin

  await prisma.comment.delete({
    where: { id: commentId },
  });

  revalidatePath(`/blog/[slug]`, "page");
}
