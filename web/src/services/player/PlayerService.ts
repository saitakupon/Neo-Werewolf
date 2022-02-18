import axios, {AxiosResponse} from "axios";
import {BASE_URL, STAGE} from "../../core/Constants";
import {Player} from "../../core/Interfaces";


export default class PlayerService {
    async create(roomId: string, playerId: string): Promise<void> {
        await axios.post(BASE_URL + STAGE + "player/" + roomId + "/" + playerId);
    }

    async getByPlayerId(playerId: string): Promise<Player> {
        let player: Player = {playerId: "", name: "", room: "", role: "", location: "", status: 0, voted: 0}
        await axios.get(BASE_URL + STAGE + "player/by-player-id/" + playerId).then((res: AxiosResponse) => {
            player = {
                playerId: res.data.playerId,
                name: res.data.name,
                room: res.data.room,
                role: res.data.role,
                location: res.data.location,
                status: parseInt(res.data.status),
                voted: parseInt(res.data.voted)
            }
        });
        return player;
    }

    async getByRoomId(roomId: string): Promise<Player[]> {
        let players: Player[] = [];
        await axios.get(BASE_URL + STAGE + "player/by-room-id/" + roomId).then((arrayRes: AxiosResponse) => {
            arrayRes.data.forEach((res: any) => {
                players.push({
                    playerId: res.playerId,
                    name: res.name,
                    room: res.room,
                    role: res.role,
                    location: res.location,
                    status: parseInt(res.status),
                    voted: parseInt(res.voted)
                });
            });
        });
        return players;
    }

    async vote(playerId: string, roomId: string): Promise<void> {
        await axios.get(BASE_URL + STAGE + "player/vote/" + playerId + "/" + roomId);
    }
}
