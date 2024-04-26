import { Outlet } from 'react-router-dom'
import NavBar from './components/navbar/navbar'
import './index.css'

function App() {
 
  return (
    <div className="App">
      <NavBar />
      <Outlet />
    </div>
  )
}

export default App
