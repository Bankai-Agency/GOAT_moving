import { redirect } from "next/navigation";

export default function AdminRoot() {
  // The proxy redirects anonymous visitors to /admin/login; a session lands here.
  redirect("/admin/dashboard");
}
