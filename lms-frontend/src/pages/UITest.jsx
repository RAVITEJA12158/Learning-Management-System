import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import Footer from '../components/layout/Footer'
function UITest() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">React Fundamentals</h2>
              <Badge>Active</Badge>
            </div>

            <p className="mt-2 text-gray-600">
              Learn React fundamentals.
            </p>

            <div className="mt-4">
              <Input placeholder="Search courses" />
            </div>

            <div className="mt-4">
              <Button>Enroll</Button>
            </div>
          </Card>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default UITest