import {
  createBrowserRouter,
} from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import RoomJoinPage from "../pages/Room/RoomJoinPage";
import WaitingRoom from "../pages/Room/WaitingRoom";
import RoomPlay from "../pages/Room/RoomPlay";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/join",
        element: <RoomJoinPage />
      },
      {
        path: "/room/:roomId",
        element: <WaitingRoom />
      },
      {
        path: "/room/play",
        element: <RoomPlay />
      }
    ]
  },
]);

export default router
