import { IRoom } from "../abstract/entities/IRoom";
import { IObject } from "../abstract/entities/IObject";

export class Room implements IRoom {
    roomCode: string

    roomLeft?: IRoom
    roomRight?: IRoom
    roomUp?: IRoom
    roomDown?: IRoom

    objects: Array<IObject> = new Array<IObject>()

    constructor(roomCode: string) {
        this.roomCode = roomCode
    }
}