"use server";

import { translateText } from "@/lib/translator";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import checkIsAdmin from "@/utils/check-is-admin";
import getAuthenticatedUser from "@/utils/get-authenticated-user";
import Attachment from "@/components/post-form";

export async function incrementPostView(id: string) {
  try {
    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error("Erro ao incrementar contador de views: ", error);
  }
}

export async function createPost(formData: FormData) {
  const user = await getAuthenticatedUser();
  const isAdmin = await checkIsAdmin(user);

  if (!user || !isAdmin) throw new Error("Usuário precisar ser admin");

  const attachments = formData.get("attachments") as string;
  const attachmentsObj = attachments
    ? (JSON.parse(attachments) as Attachment[])
    : [];

  const titlePt = formData.get("title") as string;
  const bodyPt = formData.get("body") as string;

  // Tradução
  const [titleEn, bodyEn] = await Promise.all([
    translateText(titlePt, "en"),
    translateText(bodyPt, "en"),
  ]);

  // Slug
  const slug = titlePt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-");

  await prisma.post.create({
    data: {
      slug,
      published: true,
      authorId: user.id,
      translations: {
        create: [
          { lang: "pt", title: titlePt, body: bodyPt },
          { lang: "en", title: titleEn, body: bodyEn },
        ],
      },
      attachments: {
        create: attachmentsObj.map((att: Attachment) => ({
          name: att.name,
          url: att.url,
          type: att.type,
        })),
      },
    },
  });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updatePost(id: string, formData: FormData) {
  const user = await getAuthenticatedUser();
  await checkIsAdmin(user, true);

  const titlePt = formData.get("title") as string;
  const bodyPt = formData.get("body") as string;

  const [titleEn, bodyEn] = await Promise.all([
    translateText(titlePt, "en"),
    translateText(bodyPt, "en"),
  ]);

  // Atualiza usando transação para garantir integridade
  await prisma.$transaction([
    prisma.postTranslation.updateMany({
      where: { postId: id, lang: "pt" },
      data: { title: titlePt, body: bodyPt },
    }),
    prisma.postTranslation.updateMany({
      where: { postId: id, lang: "en" },
      data: { title: titleEn, body: bodyEn },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath(`/blog`); // Limpa cache do blog
  redirect("/admin");
}

export async function deletePost(id: string) {
  const user = await getAuthenticatedUser();
  await checkIsAdmin(user, true);
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin");
}
