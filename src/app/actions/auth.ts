"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // Redireciona para nossa rota de callback que já criamos
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/login/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error(error);
    redirect("/login?error=Google Login Failed");
  }

  // O Supabase retorna uma URL do Google para onde devemos enviar o usuário
  redirect(data.url);
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  // Pega os dados do form
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    redirect("/login?error=Invalid credentials");
  }

  revalidatePath("/", "layout");
  redirect("/admin"); // Redireciona para o admin após login
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  // Cria o usuário no Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Passamos o nome nos metadados para o nosso Trigger SQL pegar!
      data: {
        full_name: name,
      },
      // URL para onde o usuário vai após clicar no email de confirmação
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    redirect("/signup?error=Registration failed");
  }

  revalidatePath("/", "layout");
  redirect("/login?message=Check your email to confirm account");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}
