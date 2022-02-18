import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import PlayerService from "../services/player/PlayerService";
import {Player, Result, Role, Room} from "../core/Interfaces";
import RoleService from "../services/role/RoleService";
import {Button, HStack, Text, Image, VStack} from "@chakra-ui/react";
import blue from "../assets/cards/villager-blue.svg";
import yellow from "../assets/cards/villager-yellow.svg";
import red from "../assets/cards/villager-red.svg";
import crazy from "../assets/cards/crazy.svg";
import wolf from "../assets/cards/were-wolf.svg";

interface LocationState {
    room: Room,
    result: Result
}

const ResultPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const [players, setPlayers] = useState<Player[]>([]);
    const [hallRole, setHallRole] = useState<string>("");
    const [flag, setFlag] = useState<boolean>(false);

    useEffect(() => {
        const playerService = new PlayerService();
        const roleService = new RoleService();
        roleService.get(state.room.roomId, "hall").then((res: Role[]) => {
            setHallRole(res[0].name);
        })
        playerService.getByRoomId(state.room.roomId).then((res: Player[]) => {
            setPlayers(res);
        })
    }, [state.room.roomId])

    const getResult = () => {
        setFlag(true);
    }

    return (
        <>
            {
                flag ?
                    <>
                        <Text>「{state.result.location}」の「{state.result.role}」が追放され...</Text>
                        <Text pb={12} fontSize={'5xl'}>{state.result.result}</Text>
                        <VStack py={4}>
                            <HStack>
                                <VStack px={2}>
                                    <Image src={wolf} h={"8vh"}/>
                                    {
                                        players.map((player: Player) => {
                                            if (player.role === "人狼") {
                                                return <Text>{player.name}</Text>
                                            } else return undefined;
                                        })
                                    }
                                    {
                                        hallRole === "人狼" && <Text>集会場</Text>
                                    }
                                </VStack>
                                {
                                    state.room.maxNum !== 3 &&
                                    <VStack px={2}>
                                        <Image src={crazy} h={"8vh"}/>
                                        {
                                            players.map((player: Player) => {
                                                if (player.role === "狂人") {
                                                    return <Text>{player.name}</Text>
                                                } else return undefined;
                                            })
                                        }
                                        {
                                            hallRole === "狂人" && <Text>集会場</Text>
                                        }
                                    </VStack>
                                }
                            </HStack>
                            <HStack>
                                <VStack px={2}>
                                    <Image src={red} h={"8vh"}/>
                                    {
                                        players.map((player: Player) => {
                                            if (player.role === "村人(赤色)") {
                                                return <Text>{player.name}</Text>
                                            } else return undefined;
                                        })
                                    }
                                    {
                                        hallRole === "村人(赤色)" && <Text>集会場</Text>
                                    }
                                </VStack>
                                <VStack px={2}>
                                    <Image src={blue} h={"8vh"}/>
                                    {
                                        players.map((player: Player) => {
                                            if (player.role === "村人(青色)") {
                                                return <Text>{player.name}</Text>
                                            } else return undefined;
                                        })
                                    }
                                    {
                                        hallRole === "村人(青色)" && <Text>集会場</Text>
                                    }
                                </VStack>
                                <VStack px={2}>
                                    <Image src={yellow} h={"8vh"}/>
                                    {
                                        players.map((player: Player) => {
                                            if (player.role === "村人(黄色)") {
                                                return <Text>{player.name}</Text>
                                            } else return undefined;
                                        })
                                    }
                                    {
                                        hallRole === "村人(黄色)" && <Text>集会場</Text>
                                    }
                                </VStack>
                            </HStack>
                        </VStack>
                        <Button
                            mt={12}
                            colorScheme={"purple"}
                            onClick={() => {
                                navigate("/", {
                                    replace: true
                                });
                            }}
                        >
                            ホームへ戻る
                        </Button>
                    </>
                    :
                    <>
                        <Text fontSize={'5xl'} pt={12}>ゲーム終了</Text>
                        <Text pb={12}>お疲れ様でした！</Text>
                        <Button
                            m={12}
                            colorScheme={"purple"}
                            onClick={() => getResult()}
                        >
                            結果を表示
                        </Button>
                    </>
            }
        </>
    );
}

export default ResultPage;
