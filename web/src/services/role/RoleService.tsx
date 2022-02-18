import axios, {AxiosResponse} from "axios";
import {BASE_URL, STAGE} from "../../core/Constants";
import {Role} from "../../core/Interfaces";


export default class RoleService {
    async get(roomId: string, playerId: string): Promise<Role[]> {
        let roles: Role[] = [];
        await axios.get(BASE_URL + STAGE + "role/" + roomId + "/" + playerId).then((arrayRes: AxiosResponse<any>) => {
            arrayRes.data.forEach((res: any) => {
                roles.push({
                    roleId: res.roleId,
                    cardNum: parseInt(res.cardNum),
                    name: res.name,
                    owner: res.name,
                    status: parseInt(res.status)
                });
            })
        });
        return roles;
    }
    async update(roomId: string, playerId: string, cardNum: number, current: string): Promise<void> {
        await axios.get(BASE_URL + STAGE + "role/" + roomId + "/" + playerId + "/" + cardNum.toString() + "/" + current);
    }
}
