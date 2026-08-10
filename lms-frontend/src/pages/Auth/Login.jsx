function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          LMS
        </h1>

        <p className="mb-6 text-gray-600">
          Learning Management System
        </p>

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
        />

        <button className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700">
          Login
        </button>
      </div>
    </div>
  )
}

export default Login