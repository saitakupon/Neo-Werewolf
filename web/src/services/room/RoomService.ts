import axios, {AxiosResponse} from "axios";
import {BASE_URL, STAGE} from "../../core/Constants";
import {Room} from "../../core/Interfaces";


export default class RoomService {
    async create(createdBy: string, maxNum: number): Promise<{ roomId: string }> {
        let roomId: string = "";
        await axios.post(BASE_URL + STAGE + "room/" + createdBy + "/" + maxNum.toString()).then((res: AxiosResponse<any>) => {
            roomId = res.data.roomId;
        });
        return {roomId: roomId};
    }

    async get(roomId: string): Promise<Room> {
        let room: Room = {roomId: "", createdBy: "", maxNum: 0, playerNum: 0, players: [], status: 0};
        await axios.get(BASE_URL + STAGE + "room/check/" + roomId).then((res: AxiosResponse<any>) => {
            room = {
                roomId: res.data.roomId,
                createdBy: res.data.createdBy,
                maxNum: parseInt(res.data.maxNum),
                playerNum: parseInt(res.data.playerNum),
                players: res.data.players,
                status: parseInt(res.data.status)
            }
        });
        return room;
    }
}
