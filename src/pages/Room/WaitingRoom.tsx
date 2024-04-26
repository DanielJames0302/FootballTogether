import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import PlayerImage from "../../../public/images/player-avatar.jpg";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


interface Player {
  username: string;
  isReady: boolean;
  teamNumber: number;
  isHost: boolean;
}

const WaitingRoom = () => {
  const { roomId } = useParams();
  const user = useSelector((state: RootState) => state.auth);
  const [players, setPlayers] = useState<Player[] | null>([]);
  const [isReady, setIsReady] = useState<string>("Not Ready");
  const updateUserInRoom = useMutation(api.rooms.updateUserInRoom);
  const getRoom = useMutation(api.rooms.getRoom);
  const getHost = useMutation(api.rooms.getHost);
  const [host, setHost] = useState<string | null>('')
  const [error, setError] = useState<String>('')
  const fetchRoomData = useCallback(async () => {
    if (roomId) {
      const currentPlayers: Player[] | null = await getRoom({ roomNumber: roomId });
      const currHost: string | null = await getHost({roomNumber: roomId});
      setHost(currHost);
      setPlayers(currentPlayers ? currentPlayers : []);
     
    }
  }, [
    roomId,
    players,
    setPlayers
  ]);

  useEffect(() => {
    fetchRoomData();
  }, [fetchRoomData]);

  const handleChooseTeam = useCallback(
    async (team: number) => {
      if (players && roomId && user) {
        console.log(user.username);
        const nextPlayers = players?.map((player: Player) => {
          if (player.username === user.username) {
            return {
              ...player,
              teamNumber: team,
            };
          } else {
            return player;
          }
        });
        await updateUserInRoom({ roomNumber: roomId, players: nextPlayers });
      }
    },
    [players, setPlayers, user, roomId]
  );
  const handleIsReady = useCallback(async () => {
    if (roomId && players) {
      const nextPlayers = players?.map((player: Player) => {
        if (player.username === user.username) {
          const newReady = player.isReady ? false : true;
          return {
            ...player,
            isReady: player.isReady ? false: true,
          };
        } else {
          return player;
        }
      });
      console.log(nextPlayers)
      setIsReady(prev =>  prev == "Ready" ? "Not ready" : "Ready");
      await updateUserInRoom({ roomNumber: roomId, players: nextPlayers });
    }
  }, [players, setPlayers, user, roomId, isReady]);
  const handlePlay = useCallback(() => {
    players?.forEach(player => {
      if (player.isReady == false) {
        setError('Players are not ready');
        console.log('players not ready')
        return;
      }
      console.log('play game')
    })
  }, [players])
  return (
    <div className="h-3/4 flex flex-row justify-center">
      <div className="flex items-center justify-center h-full flex-row gap-24">
        <div className="team1 flex flex-col h-full gap-3">
          <p className="text-4xl text-blue-500 font-bold mt-9"> Team 1</p>
          {players!.length > 0 && players?.map((player: Player, id) =>
            player.teamNumber == 1 ? (
              <div
                key={id}
                className="player-tag flex flex-col items-center justify-center gap-3"
              >
                <div className="thumbnail w-10">
                  <img
                    className="w-10 object-cover"
                    src={PlayerImage}
                    alt="player"
                  />
                </div>
                <p className="text-xl">{player.username}</p>
              </div>
            ) : (
              ""
            )
          )}
        </div>
        <div className="flex items-center justify-center flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-xs">
              <div className="bg-white shadow-md rounded p-8 h-2/4 flex flex-col items-center justify-center">
                <p className="font-bold text-2xl"> Your Room Number</p>
                <p className="text-2xl">{roomId}</p>
              </div>
            </div>
          </div>
          <div className="player-list flex flex-row gap-9">
            {players!.length > 0 && players!.map((player: Player, id) =>
              player.teamNumber == 0 ? (
                <div
                  key={id}
                  className="player-tag flex flex-col items-center justify-center gap-3"
                >
                  <div className="thumbnail w-10">
                    <img
                      className="w-10 object-cover"
                      src={PlayerImage}
                      alt="player"
                    />
                  </div>
                  <p className="text-xl">{player.username}</p>
                </div>
              ) : (
                ""
              )
            )}
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => handleChooseTeam(1)}
            >
              Team 1
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => handleChooseTeam(2)}
            >
              Team 2
            </button>
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              className={
                isReady == "Not ready"
                  ? "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  : "bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              }
              type="button"
              onClick={handleIsReady}
            >
              {isReady}
            </button>
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              
            >
              {host} is host
            </button>
          </div>
          {host == user.username ?  <div className="flex items-center justify-between gap-3">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handlePlay}
              
            >
              Play
            </button>
            {error ? <p>{error}</p> : ''}
          </div> : ''}
         
        </div>
        <div className="team2 flex flex-col h-full gap-3">
          <p className="text-4xl text-green-500 font-bold mt-9"> Team 2</p>
          {players!.length > 0 && players?.map((player: Player, id) =>
            player.teamNumber == 2 ? (
              <div
                key={id}
                className="player-tag flex flex-col items-center justify-center gap-3"
              >
                <div className="thumbnail w-10">
                  <img
                    className="w-10 object-cover"
                    src={PlayerImage}
                    alt="player"
                  />
                </div>
                <p className="text-xl">{player.username}</p>
              </div>
            ) : (
              ""
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
