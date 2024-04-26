import { useConvexAuth, useMutation, useQuery} from "convex/react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { Id } from "../../../convex/_generated/dataModel";
import { useDispatch } from "react-redux";
import { login } from "../../redux/auth-slice";

const Home = () => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  //const [isProccessing, setIsProccessing] = useState<boolean>(false)
  const navigate = useNavigate()
  const { isLoaded, user } = useUser();
  const storeUser = useMutation(api.users.store);
  const getUserRoom = useMutation(api.users.getUserRoom)
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const dispatch = useDispatch()
  const [userName, setUserName] = useState<string | null>('')


  const fetchUser = useCallback(async () => {
    //const id = await storeUser();
    const userInfo:any = await getUserRoom();
    setUserId(userInfo.id)
    dispatch(login({username: user!.fullName, userId: userInfo.id}))
    setUserName(user!.fullName)
    if (userInfo.roomNumber !== '') {
      navigate(`/room/${userInfo.roomNumber}`)
    }
   
  }, [userId, user])
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login')
    } 
    if (!isLoading && isAuthenticated && isLoaded) {
      
      fetchUser()
    }
  },[isAuthenticated, fetchUser, dispatch, isLoading])
  const createRoom = useMutation(api.rooms.createRoom)
  const updateUserRoom = useMutation(api.users.updateUserRoom)
  const handleCreateRoom = useCallback(async () => {
    if (userId && userName) {
      const unique_id = uuid();
      const small_id = unique_id.slice(0, 8);
      try {
        await createRoom({roomNumber: small_id, numOfPeople: 1, host: user!.fullName ? user!.fullName : '', player: {username: userName, isReady: false, teamNumber: 0, isHost: true }})
        await updateUserRoom({id: userId, roomNumber: small_id})
        navigate(`/room/${small_id}`)
      } catch(error) {
        console.log(error)
      }
    }
    //navigate(`/room/${small_id}`)
  }, [userId])
  return (
    <div id="home-page" className="home-page h-2/4">
      <div className="home-page-wrapper flex justify-center items-center gap-2 h-2/4">
   
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={handleCreateRoom}>
              Create Room
          </button>
  
       <Link to={'join'}>
          <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">
              Join Room
          </button>
       </Link>
       

      </div>
      
    </div>
  );
};

export default Home;
