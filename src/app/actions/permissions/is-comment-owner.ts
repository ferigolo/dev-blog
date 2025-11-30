import prisma from "@/lib/prisma";
import getAuthenticatedUser from "@/utils/get-authenticated-user";

export async function isCommentOwner(
  commentId: string,
  throwError = false
) {
  const user = await getAuthenticatedUser();
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!user || comment?.authorId != user.id) {
    if (throwError)
      throw new Error(
        "Acesso negado: Você não tem permissão para alterar este comentário."
      );
    return false;
  }
  return true;
}
