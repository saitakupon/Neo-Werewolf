import {Result} from "../../core/Interfaces";
import axios, {AxiosResponse} from "axios";
import {BASE_URL, STAGE} from "../../core/Constants";

export default class ResultService {
    async get(roomId: string): Promise<Result> {
        let result: Result = {location: "", role: "", result: ""}
        await axios.get(BASE_URL + STAGE + 'result/' + roomId).then((res: AxiosResponse<any>) => {
            result = res.data as Result;
        });
        return result;
    }
}
