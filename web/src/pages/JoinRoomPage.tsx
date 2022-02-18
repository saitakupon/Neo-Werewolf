import React, {ChangeEvent, useEffect, useState} from "react";
import {Button, CircularProgress, HStack, Input, Text, Wrap} from "@chakra-ui/react";
import {useLocation, useNavigate} from "react-router-dom";
import PlayerService from "../services/player/PlayerService";
import RoomService from "../services/room/RoomService";
import {Player, Room} from "../core/Interfaces";

interface LocationState {
    playerId: string
}

const JoinRoomPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;
    const roomService = new RoomService();
    const playerService = new PlayerService();
    const [roomId, setRoomId] = useState<string>("");
    const roomIdHandler = (e: ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value);
    const [flag, setFlag] = useState<boolean>(false);
    const [, setSec] = useState<number>(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setSec((currentSec) => {
                if (flag && currentSec % 2 === 0) {
                    roomService.get(roomId).then((res: Room) => {
                        if (res.status === 1) {
                            playerService.getByRoomId(res.roomId).then((players: Player[]) => {
                                navigate("/game", {
                                    state: {
                                        room: res,
                                        playerId: state.playerId,
                                        players: players
                                    },
                                    replace: true
                                });
                            });
                        }
                    });
                }
                return currentSec + 1;
            });
        }, 1000);
        return () => {
            clearInterval(timer);
        }
    });
    return (
        <>
            {!flag && <>
                <HStack w={"80vw"}>
                    <Input
                        my={12}
                        mr={4}
                        size={"lg"}
                        value={roomId}
                        placeholder={"ルームIDを入力"}
                        _focus={{focus: "none"}}
                        onChange={roomIdHandler}
                        disabled={flag}
                    />
                    <Button
                        onClick={() => navigator.clipboard.readText().then((text: string) => {
                            setRoomId(text);
                        })}
                        colorScheme={"purple"}
                    >
                        ペースト
                    </Button>
                </HStack>
            </>}
            {flag && <Text p={12}>{"ルームID: " + roomId}</Text>}
            {flag && <CircularProgress isIndeterminate color={"purple"} p={12}/>}
            <Wrap p={12}>
                <Button
                    onClick={() => playerService.create(roomId, state.playerId).then(() => {
                        setFlag(true)
                    })}
                    colorScheme={"purple"}
                    disabled={flag}
                >
                    {flag ? "他のプレイヤーを待機中..." : "ルームへ参加"}
                </Button>
            </Wrap>
        </>
    );
}

export default JoinRoomPage;
