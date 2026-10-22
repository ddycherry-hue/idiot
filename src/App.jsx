import { Link, Outlet } from "react-router-dom"

function App() {
  return (
    <>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/">Продукты</Link>
        <Link to="/create">Добавить</Link>
      </nav>
      <Outlet />
    </>
  )
}

export default App
