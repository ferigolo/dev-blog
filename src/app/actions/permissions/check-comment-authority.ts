import { User } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import checkIsAdmin from "@/utils/check-is-admin";

export async function checkCommentAuthority(
  user: User | null,
  commentId: string,
  throwError = false
) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if ((!user || comment?.authorId != user.id) && !(await checkIsAdmin(user))) {
    if (throwError)
      throw new Error(
        "Acesso negado: Você não tem permissão para alterar este comentário."
      );
    return false;
  }
  return true;
}
