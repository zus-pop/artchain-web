"use client";

export default function DashboardPage() {
  //   const router = useRouter();
  //   const { isAuthenticated, user } = useAuth()

  //   useEffect(() => {
  //     if (!isAuthenticated) {
  //       // Redirect to auth page if not authenticated
  //       router.push("/auth")
  //       return
  //     }

  //     // Redirect based on user role
  //     if (user?.role === "ADMIN") {
  //       router.push("/dashboard/admin")
  //     } else if (user?.role === "STAFF") {
  //       router.push("/dashboard/staff")
  //     } else {
  //       // For COMPETITOR and GUARDIAN, redirect to home or show access denied
  //       router.push("/")
  //     }
  //   }, [isAuthenticated, user, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
