import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            LMS
          </h1>
          <p className="mt-2 text-gray-500">
            Learning Management System
          </p>
        </div>

        <div className="space-y-4">
          <Input placeholder="Email" />
          <Input placeholder="Password" />

          <Button>Login</Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Enter your credentials to continue
        </p>
      </div>
    </div>
  )
}

export default Login