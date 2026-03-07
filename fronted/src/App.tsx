import { Outlet } from 'react-router-dom'
import './App.css'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/NavBar'

function App() {


  return (
    <>
      <div className="w-full min-h-screen bg-primary flex flex-col">
      <Toaster position="top-right" />
      <Navbar/>

      <div className="flex-1 ">
        <Outlet />
      </div>

      
    </div>
    </>
  )
}

export default App
