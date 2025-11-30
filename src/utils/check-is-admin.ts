import { Role } from "@/generated/prisma/enums";
import { User } from "@/generated/prisma/client";

export default async function checkIsAdmin(
  user: User | null,
  throwError = false
) {
  if (!user || user.role !== Role.ADMIN) {
    if (throwError)
      throw new Error("Acesso negado: Requer privilégios de Administrador.");
    return false;
  }
  return true
}
