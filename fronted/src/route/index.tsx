import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/register";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/Dashboard";


const router =  createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
        {path: "/", element: <h1>Home</h1>},
        {path: "/register", element: <Register />},
        {path: "/login", element: <Login />},
        {path: "/dashboard", element: <Dashboard/>},
        {path: "/forgot", element: <h1>Comming Soon</h1>},
        {path: "/*", element: <NotFound/>}
    ]
  },
]);


export default router;