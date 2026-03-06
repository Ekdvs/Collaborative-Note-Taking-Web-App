import { Outlet } from 'react-router-dom'
import './App.css'

function App() {


  return (
    <>
      <div className="w-full min-h-screen bg-primary flex flex-col">
      

      <div className="flex-1 ">
        <Outlet />
      </div>

      
    </div>
    </>
  )
}

export default App
