import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Button, CircularProgress, HStack, Image, Text, useToast, VStack, Wrap} from "@chakra-ui/react";
import RoomService from "../services/room/RoomService";
import PlayerService from "../services/player/PlayerService";
import {Player, Room} from "../core/Interfaces";
import wolf from "../assets/cards/were-wolf.svg";
import crazy from "../assets/cards/crazy.svg";
import red from "../assets/cards/villager-red.svg";
import blue from "../assets/cards/villager-blue.svg";
import yellow from "../assets/cards/villager-yellow.svg";

interface LocationState {
    playerId: string
}

const CreateRoomPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const state = location.state as LocationState;
    const [roomId, setRoomId] = useState<string>("取得中...");
    const [, setSec] = useState<number>(0);
    const [flag, setFlag] = useState<boolean>(false);

    const createRoom = (maxNum: number) => {
        const roomService = new RoomService();
        const playerService = new PlayerService();
        roomService.create(state.playerId, maxNum).then((res: { roomId: string }) => {
            playerService.create(res.roomId, state.playerId).then(() => {
                setRoomId(res.roomId);
            })
        })
    }

    useEffect(() => {
        const roomService = new RoomService();
        const playerService = new PlayerService();
        const timer = setInterval(() => {
            setSec((currentSec) => {
                if (currentSec % 2 === 0) {
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
        flag ?
            <>
                <Text p={12}>
                    ルームID:
                    <Button
                        bg={"#282c34"}
                        _hover={{bg: "#282c34"}}
                        _active={{bg: "#282c34", transform: "scale(0.95)"}}
                        _focus={{focus: "none"}}
                        style={{
                            fontSize: "calc(10px + 2vmin)"
                        }}
                        onClick={() => {
                            navigator.clipboard.writeText(roomId).then(() => {
                                toast({
                                    title: "ルームIDをコピーしました",
                                    status: "info",
                                    duration: 1500,
                                    position: "top",
                                })
                            });
                        }}
                    >
                        {roomId}
                    </Button>
                </Text>
                <CircularProgress isIndeterminate color={"purple"} p={12}/>
                <Wrap p={12}>
                    <Button
                        colorScheme={"purple"}
                        disabled={true}
                    >
                        他のプレイヤーを待機中...
                    </Button>
                </Wrap>
            </>
            :
            <>
                <VStack>
                    <VStack py={8} w={"70vw"}>
                        <HStack>
                            <VStack px={2}>
                                <Image src={wolf} h={"8vh"}/>
                                <Text>人狼</Text>
                            </VStack>
                        </HStack>
                        <HStack pb={2}>
                            <VStack px={2}>
                                <Image src={red} h={"8vh"}/>
                                <Text>村人</Text>
                            </VStack>
                            <VStack px={2}>
                                <Image src={blue} h={"8vh"}/>
                                <Text>村人</Text>
                            </VStack>
                            <VStack px={2}>
                                <Image src={yellow} h={"8vh"}/>
                                <Text>村人</Text>
                            </VStack>
                        </HStack>
                        <Button
                            onClick={() => {
                                setFlag(true);
                                createRoom(3);
                            }}
                            colorScheme={"purple"}
                            _hover={{bg: "purple"}}
                            _active={{bg: "purple", transform: "scale(0.95)"}}
                            _focus={{focus: "none"}}
                        >
                            3人でプレイ
                        </Button>
                    </VStack>
                    <VStack py={8} w={"70vw"}>
                        <HStack>
                            <VStack px={2}>
                                <Image src={wolf} h={"8vh"}/>
                                <Text>人狼</Text>
                            </VStack>
                            <VStack px={2}>
                                <Image src={crazy} h={"8vh"}/>
                                <Text>狂人</Text>
                            </VStack>
                        </HStack>
                        <HStack pb={2}>
                            <VStack px={2}>
                                <Image src={red} h={"8vh"}/>
                                <Text>村人</Text>
                            </VStack>
                            <VStack px={2}>
                                <Image src={blue} h={"8vh"}/>
                                <Text>村人</Text>
                            </VStack>
                            <VStack px={2}>
                                <Image src={yellow} h={"8vh"}/>
                                <Text>村人</Text>
                            </VStack>
                        </HStack>
                        <Button
                            onClick={() => {
                                setFlag(true);
                                createRoom(4);
                            }}
                            _hover={{bg: "purple"}}
                            _active={{bg: "purple", transform: "scale(0.95)"}}
                            _focus={{focus: "none"}}
                            colorScheme={"purple"}
                        >
                            4人でプレイ
                        </Button>
                    </VStack>
                </VStack>
            </>
    );
}

export default CreateRoomPage;
