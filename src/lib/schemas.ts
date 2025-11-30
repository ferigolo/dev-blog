import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(5, "Título muito curto."),
  body: z.string().min(10, "Conteúdo muito curto."),
});

export const commentSchema = z.object({
  text: z
    .string()
    .min(2, "O comentário deve ter pelo menos 2 caracteres.")
    .max(1000, "O comentário é muito longo (máx 1000)."),
  postId: z.string().uuid("ID do post inválido."),
});

export const likeSchema = z.object({
  commentId: z.uuid("ID do comentário inválido."),
  userId: z.uuid("ID do usuário inválida"),
});
