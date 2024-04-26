import { useMutation, useQuery } from "convex/react";
import { useCallback, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { updateUserRoom } from "../../../convex/users";
import { useNavigate } from "react-router-dom";

const RoomJoinPage = () => {
  const user = useSelector((state: RootState) => state.auth)
  console.log(user)
  const[roomNumber, setRoomNumber] = useState('')
  const[error, setError] = useState('');
  const joinRoom = useMutation(api.rooms.joinRoom)
  const addPlayerToRoom = useMutation(api.rooms.addPlayerToRoom) 
  const updateUserRoom = useMutation(api.users.updateUserRoom)
  const navigate = useNavigate()
  const handleJoinRoom = useCallback(async () => {
    if (roomNumber == '') {
      setError('Please enter room number')
      return;
    }
    console.log(roomNumber)
    const roomInfo = await joinRoom({roomNumber: roomNumber});
    if (roomInfo.length > 0) {
      setError('')
      await addPlayerToRoom({roomNumber: roomNumber, player: {username: user.username, isReady: false, teamNumber: 0, isHost:false}})
      console.log(user.userId)
      await updateUserRoom({roomNumber: roomNumber, id: user.userId})
      navigate(`/room/${roomNumber}`)
    } else {
      setError('Room number does not exit !')
    }
   
  }, [roomNumber])
  return (
    <div className="room-join-page h-2/4 flex items-center justify-center">
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Room Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Room Number"
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleJoinRoom}
            >
              Join
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="/"
            >
              Back
            </a>
          </div>
        </form>
        {error ?<p className="text-center text-red-500 text-xs">
          {error}
        </p> : ''}
      </div>
    </div>
  );
};

export default RoomJoinPage;
