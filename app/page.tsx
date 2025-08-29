export default function Login() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col w-[400px] p-6 border border-black rounded-xl">
        <h1 className="text-lg font-semibold">Login</h1>
        <form className="mt-4 space-y-2" action="">
          <p>Username</p>
          <input
            type="text"
            className="w-full rounded-xl border px-3 py-2"
            placeholder="name@loa.edu.ph"
          />
          <p>Password</p>
          <input
            type="password"
            className="w-full rounded-xl border px-3 py-2"
            placeholder="••••••••"
          />
          <button className="w-full bg-[var(--brand-green)] text-white rounded-xl p-2 mt-4">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
