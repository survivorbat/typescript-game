import { IObject } from "./IObject";

export interface IRoom {
    roomCode: string

    roomLeft?: IRoom
    roomRight?: IRoom
    roomUp?: IRoom
    roomDown?: IRoom

    objects: Array<IObject>
}