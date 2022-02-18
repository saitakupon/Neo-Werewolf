export interface User {
    uid: string,
    name: string
}

export interface Room {
    roomId: string,
    createdBy: string,
    maxNum: number,
    playerNum: number,
    players: string[],
    status: number
}

export interface Player {
    playerId: string,
    name: string,
    room: string,
    role: string,
    location: string,
    status: number,
    voted: number
}

export interface Role {
    roleId: string,
    cardNum: number,
    name: string,
    owner: string,
    status: number
}

export interface Result {
    location: string,
    role: string,
    result: string
}
