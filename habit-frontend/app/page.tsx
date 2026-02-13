import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-2">Consistency Tracker</h1>
      <p className="text-gray-500 mb-6">Build discipline. Track habits.</p>

      <div className="flex gap-4">
        <Link href="/login">
          <button className="border px-6 py-2 rounded">Login</button>
        </Link>

        <Link href="/signup">
          <button className="bg-black text-white px-6 py-2 rounded">
            Signup
          </button>
        </Link>
      </div>
    </main>
  );
}