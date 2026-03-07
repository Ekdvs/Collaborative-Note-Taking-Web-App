import { Outlet } from 'react-router-dom'
import './App.css'
import { Toaster } from 'react-hot-toast'

function App() {


  return (
    <>
      <div className="w-full min-h-screen bg-primary flex flex-col">
      <Toaster position="top-right" />

      <div className="flex-1 ">
        <Outlet />
      </div>

      
    </div>
    </>
  )
}

export default App
