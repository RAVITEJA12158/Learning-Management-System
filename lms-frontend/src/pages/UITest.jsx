import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'

function UITest() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold">UI Test</h1>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Card Test</h2>
          <Badge>Active</Badge>
        </div>

        <p className="mt-2 text-gray-600">
          Working.
        </p>

        <div className="mt-4">
          <Input placeholder="Search courses" />
        </div>

        <div className="mt-4">
          <Button>Enroll</Button>
        </div>
      </Card>
    </div>
  )
}

export default UITest