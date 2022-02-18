import React, {useEffect, useState} from "react";
import {Player, Role, Room} from "../core/Interfaces";
import {useLocation, useNavigate} from "react-router-dom";
import {
    Button,
    CircularProgress, HStack, Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text, VStack
} from "@chakra-ui/react";
import RoleService from "../services/role/RoleService";
import {ChevronDownIcon} from "@chakra-ui/icons";
import PlayerService from "../services/player/PlayerService";
import RoomService from "../services/room/RoomService";
import wolf from "../assets/cards/were-wolf.svg";
import crazy from "../assets/cards/crazy.svg";
import red from "../assets/cards/villager-red.svg";
import blue from "../assets/cards/villager-blue.svg";
import yellow from "../assets/cards/villager-yellow.svg";
import {getCard} from "../core/Functions";

interface LocationState {
    room: Room,
    playerId: string,
    players: Player[]
}

interface Action {
    currentRole: string,
    currentCard: string,
    chosenLocation: string,
    sentRole: string
}

const GamePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const [myTurn, setMyTurn] = useState<boolean>(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [currentRole, setCurrentRole] = useState<string>();
    const [done, setDone] = useState<Player[]>([]);

    const [action, setAction] = useState<Action>({currentRole: "", currentCard: "", chosenLocation: "", sentRole: ""});

    const [, setSec] = useState<number>(0);
    useEffect(() => {
        const roleService = new RoleService();
        const playerService = new PlayerService();
        const roomService = new RoomService();
        const timer = setInterval(() => {
            setSec((currentSec) => {
                if (currentSec % 1 === 0) {
                    roleService.get(state.room.roomId, state.playerId).then((roles: Role[]) => {
                        if (roles.length === 2) {
                            state.players.forEach((player: Player) => {
                                if (player.playerId === state.playerId) {
                                    setCurrentRole(player.role);
                                }
                            });
                            setRoles(roles);
                            setMyTurn(true);
                        } else {
                            setMyTurn(false);
                        }
                    });
                    playerService.getByRoomId(state.room.roomId).then((res: Player[]) => {
                        setDone(res);
                    });
                    roomService.get(state.room.roomId).then((room: Room) => {
                        if (room.status === room.maxNum + 1 && action.currentRole !== "" && action.chosenLocation !== "" && action.sentRole !== "") {
                            navigate("/game/discussion", {
                                state: {
                                    action: action,
                                    playerId: state.playerId,
                                    roomId: state.room.roomId,
                                    players: state.players
                                },
                                replace: true
                            })
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
            {
                myTurn ?
                    <>
                        <Text pb={4}>_______ 現在の役職 _______</Text>
                        <VStack py={4} w={"70vw"}>
                            {
                                roles.map((role: Role) => {
                                    if (currentRole === role.name) {
                                        let counter = 0;
                                        return <>
                                            <Text>{currentRole}</Text>
                                            <Image
                                                src={getCard(role.name)}
                                                h={"20vw"}
                                            />
                                            {
                                                <Menu>
                                                    <MenuButton
                                                        colorScheme={"purple"}
                                                        as={Button}
                                                        rightIcon={<ChevronDownIcon/>}
                                                        _hover={{bg: "purple"}}
                                                        _active={{bg: "purple", transform: "scale(0.95)"}}
                                                        _focus={{focus: "none"}}
                                                    >
                                                        他の場所へ送る
                                                    </MenuButton>
                                                    <MenuList color={"black"}>
                                                        {
                                                            done.map((player: Player) => {
                                                                if (player.playerId !== state.playerId && player.status > 0) {
                                                                    return (
                                                                        <MenuItem
                                                                            onClick={() => {
                                                                                const roleService = new RoleService();
                                                                                roleService.update(state.room.roomId, player.playerId, role.cardNum, state.playerId).then(() => {
                                                                                    setAction({
                                                                                        currentRole: roles[0].name === currentRole ? roles[1].name : roles[0].name,
                                                                                        currentCard: roles[0].name === currentRole ? getCard(roles[1].name) : getCard(roles[0].name),
                                                                                        chosenLocation: player.location,
                                                                                        sentRole: currentRole
                                                                                    })
                                                                                    setMyTurn(false);
                                                                                });
                                                                            }}
                                                                        >
                                                                            {player.location}
                                                                        </MenuItem>
                                                                    )
                                                                } else {
                                                                    counter += 1;
                                                                    if (counter === state.room.maxNum) {
                                                                        return <MenuItem
                                                                            onClick={() => {
                                                                                const roleService = new RoleService();
                                                                                roleService.update(state.room.roomId, "hall", role.cardNum, state.playerId).then(() => {
                                                                                    setAction({
                                                                                        currentRole: roles[0].name === currentRole ? roles[1].name : roles[0].name,
                                                                                        currentCard: roles[0].name === currentRole ? getCard(roles[1].name) : getCard(roles[0].name),
                                                                                        chosenLocation: "集会場",
                                                                                        sentRole: currentRole
                                                                                    })
                                                                                    setMyTurn(false);
                                                                                });
                                                                            }}
                                                                        >
                                                                            集会場
                                                                        </MenuItem>
                                                                    } else {
                                                                        return undefined;
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    </MenuList>
                                                </Menu>
                                            }
                                        </>
                                    } else return undefined;
                                })
                            }
                        </VStack>
                        <Text pt={8} pb={4}>_____ 受け取った役職 _____</Text>
                        <VStack py={4} w={"70vw"}>
                            {
                                roles.map((role: Role) => {
                                    if (currentRole !== role.name) {
                                        let counter = 0;
                                        return <>
                                            <Text>{role.name}</Text>
                                            <Image
                                                src={getCard(role.name)}
                                                h={"20vw"}
                                            />
                                            <Menu>
                                                <MenuButton
                                                    colorScheme={"purple"}
                                                    as={Button}
                                                    rightIcon={<ChevronDownIcon/>}
                                                    _hover={{bg: "purple"}}
                                                    _active={{bg: "purple", transform: "scale(0.95)"}}
                                                    _focus={{focus: "none"}}
                                                >
                                                    他の場所へ送る
                                                </MenuButton>
                                                <MenuList color={"black"}>
                                                    {
                                                        done.map((player: Player) => {
                                                            if (player.playerId !== state.playerId && player.status > 0) {
                                                                return (
                                                                    <MenuItem
                                                                        onClick={() => {
                                                                            const roleService = new RoleService();
                                                                            roleService.update(state.room.roomId, player.playerId, role.cardNum, state.playerId).then(() => {
                                                                                setAction({
                                                                                    currentRole: currentRole as string,
                                                                                    currentCard: getCard(currentRole as string),
                                                                                    chosenLocation: player.location,
                                                                                    sentRole: role.name
                                                                                })
                                                                                setMyTurn(false);
                                                                            });
                                                                        }}
                                                                    >
                                                                        {player.location}
                                                                    </MenuItem>
                                                                )
                                                            } else {
                                                                counter += 1;
                                                                if (counter === state.room.maxNum) {
                                                                    return <MenuItem
                                                                        onClick={() => {
                                                                            const roleService = new RoleService();
                                                                            roleService.update(state.room.roomId, "hall", role.cardNum, state.playerId).then(() => {
                                                                                setAction({
                                                                                    currentRole: currentRole as string,
                                                                                    currentCard: getCard(currentRole as string),
                                                                                    chosenLocation: "集会場",
                                                                                    sentRole: role.name
                                                                                })
                                                                                setMyTurn(false);
                                                                            });
                                                                        }}
                                                                    >
                                                                        集会場
                                                                    </MenuItem>
                                                                } else {
                                                                    return undefined;
                                                                }
                                                            }
                                                        })
                                                    }
                                                </MenuList>
                                            </Menu>
                                        </>
                                    } else return undefined;
                                })
                            }
                        </VStack>
                    </>
                    :
                    <>
                        <Text pb={4}>_____ プレイヤー一覧 _____</Text>
                        <VStack py={4} w={"70vw"}>
                            {
                                state.players.map((player: Player) => {
                                    return <Text>{player.name}</Text>
                                })
                            }
                        </VStack>
                        <Text pt={4} pb={4}>________ 役職一覧 ________</Text>
                        <VStack py={4} w={"70vw"}>
                            <HStack>
                                <VStack px={2}>
                                    <Image src={wolf} h={"8vh"}/>
                                    <Text>人狼</Text>
                                </VStack>
                                {
                                    state.room.maxNum !== 3 &&
                                    <VStack px={2}>
                                        <Image src={crazy} h={"8vh"}/>
                                        <Text>狂人</Text>
                                    </VStack>
                                }
                            </HStack>
                            <HStack>
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
                        </VStack>
                        <HStack pt={4}>
                            <Text>他のプレイヤーが操作中です...</Text>
                            <CircularProgress isIndeterminate color={"purple"}/>
                        </HStack>
                    </>
            }
        </>
    );
}

export default GamePage;
