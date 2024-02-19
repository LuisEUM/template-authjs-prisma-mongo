"use server"
import * as z from "zod";
import { signIn } from "@/src/lib/actions/auth/auth";
import { redirect } from "next/dist/server/api-utils";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes/routes";
import { LoginSchema } from "../types/inside-schemas";

export const login = async (values:z.infer<typeof LoginSchema>)=>{
  const validatedFields = LoginSchema.safeParse(values)

if(!validatedFields.success){
  return {error: "Credenciales Incorrectas :("}
}
const {email, password} = validatedFields.data;
try {
  await signIn("credentials", {
    email,
    password,
    redirectTo: DEFAULT_LOGIN_REDIRECT
  })


} catch (error) {
  if (error instanceof AuthError){
    switch (error.type){
      case "CredentialsSignin": 
      return {error: "Credenciales Incorrectas :()"}
      default:
        return {error: "Algo salio mal :("}
    }
  }
  
  throw error
}

}