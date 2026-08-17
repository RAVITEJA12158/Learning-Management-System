function Sidebar() {
  return (
    <aside className="min-h-screen w-64 bg-white p-6 shadow">
      <h2 className="mb-6 text-lg font-bold">Menu</h2>

      <nav className="space-y-3">
        <p>Dashboard</p>
        <p>Courses</p>
        <p>Assignments</p>
        <p>Quizzes</p>
        <p>Profile</p>
      </nav>
    </aside>
  )
}

export default Sidebar