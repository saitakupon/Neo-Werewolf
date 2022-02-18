import React, {useEffect, useState} from "react";
import {Button, CircularProgress, Image, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react"
import {useLocation, useNavigate} from "react-router-dom";
import {Player, Result, Room} from "../core/Interfaces";
import {ChevronDownIcon} from "@chakra-ui/icons";
import PlayerService from "../services/player/PlayerService";
import RoomService from "../services/room/RoomService";
import ResultService from "../services/result/ResultService";

interface LocationState {
    action: Action,
    playerId: string,
    roomId: string,
    players: Player[]
}

interface Action {
    currentRole: string,
    currentCard: string,
    chosenLocation: string,
    sentRole: string
}

const DiscussionPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const [flag, setFlag] = useState<boolean>(false);
    const [, setSec] = useState<number>(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setSec((currentSec) => {
                if (flag && currentSec % 2 === 0) {
                    const roomService = new RoomService();
                    roomService.get(state.roomId).then((room: Room) => {
                        if (room.status === ((room.maxNum * 2) + 1)) {
                            console.log("終了")
                            const resultService = new ResultService();
                            resultService.get(state.roomId).then((res: Result) => {
                                navigate("/game/result", {
                                    state: {
                                        room: room,
                                        result: res
                                    },
                                    replace: true
                                })
                            });
                        }
                    })
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
            <Text p={12}>ディスカッションタイム</Text>
            <Text pb={4}>あなたの役職は「{state.action.currentRole}」です</Text>
            <Image src={state.action.currentCard} h={"20vw"}/>
            <Text pt={4}>あなたは「{state.action.chosenLocation}」へ</Text>
            <Text pb={4}>「{state.action.sentRole}」を送りました</Text>
            {flag ?
                <>
                    <CircularProgress isIndeterminate color={"purple"} pt={12}/>
                    <Button
                        m={12}
                        colorScheme={"purple"}
                        disabled={true}
                    >
                        投票済み
                    </Button>
                </>
                :
                <Menu>
                    <MenuButton
                        m={12}
                        colorScheme={"purple"}
                        as={Button}
                        rightIcon={<ChevronDownIcon/>}
                        _hover={{bg: "purple"}}
                        _active={{bg: "purple", transform: "scale(0.95)"}}
                        _focus={{focus: "none"}}
                    >
                        投票する
                    </MenuButton>
                    <MenuList color={"black"}>
                        {
                            state.players.map((player: Player) => {
                                if (player.playerId !== state.playerId) {
                                    return <MenuItem
                                        onClick={() => {
                                            setFlag(true);
                                            const playerService = new PlayerService();
                                            playerService.vote(player.playerId, state.roomId).then(() => {
                                            });
                                        }}
                                    >
                                        {player.location}
                                    </MenuItem>
                                } else return undefined;
                            })
                        }
                        <MenuItem
                            onClick={() => {
                                setFlag(true);
                                const playerService = new PlayerService();
                                playerService.vote("hall", state.roomId).then(() => {
                                })
                            }}
                        >
                            集会場
                        </MenuItem>
                    </MenuList>
                </Menu>
            }
        </>
    );
}

export default DiscussionPage;
