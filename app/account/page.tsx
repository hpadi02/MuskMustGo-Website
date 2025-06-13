import { useSession } from "@/components/mock-session-provider"

export default function AccountPage() {
  const { data: session } = useSession()

  return (
    <div>
      <h1>Account Page</h1>
      {session ? (
        <div>
          <p>Welcome, {session?.user?.name}!</p>
          <p>Email: {session?.user?.email}</p>
          <img src={session?.user?.image ?? ""} alt="User Profile" width={100} height={100} />
        </div>
      ) : (
        <p>Please sign in to view your account details.</p>
      )}
    </div>
  )
}
