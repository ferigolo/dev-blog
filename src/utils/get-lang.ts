import { Language } from "@/generated/prisma/enums";

export function getLang(lang?: string | undefined): Language {
  return lang ? (lang as Language) : ("pt" as Language);
}
