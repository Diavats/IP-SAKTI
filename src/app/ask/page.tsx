import { redirect } from "next/navigation";

// /ask is now the home route ("/") - this stays only so old links don't 404.
export default function AskRedirect() {
  redirect("/");
}
