import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import LogoutButton from "./LogoutButton"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {session.user?.email}</p>
      <p>Nama: {session.user?.name}</p>

      <LogoutButton />
    </div>
  )
}