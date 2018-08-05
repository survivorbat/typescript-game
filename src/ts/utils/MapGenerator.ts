import { injectable, inject } from '../../../node_modules/inversify';
import { IMapGenerator } from '../abstract/utils/IMapGenerator';
import { TYPES } from '../constants/Types';
import { IPlayer } from '../abstract/entities/IPlayer';
import { IOutputHandler } from '../abstract/utils/IOutputHandler';
import { IRoom } from '../abstract/entities/IRoom';

@injectable()
export class MapGenerator implements IMapGenerator {
	constructor(
		@inject(TYPES.Player) private readonly player: IPlayer,
		@inject(TYPES.OutputHandler) private readonly outputHandler: IOutputHandler
	) {}

	public generateMap(room: IRoom) {
		this.mapRoom(room, null, this.player.roomsVisited, 0);
	}

	private mapRoom(room: IRoom, previousRoom: IRoom | null, roomHistory: Array<IRoom>, depth: number): void {
		if (!roomHistory.includes(room)) {
			this.outputHandler.println(`${this.getDepth(depth)}- ???`);
		} else {
			this.outputHandler.println(`${this.getDepth(depth)}- ${room.roomName}`);
		}
		room.adjacentRooms.forEach((adjacentRoom: IRoom) => {
			if (adjacentRoom === previousRoom) {
				return;
			}
			this.mapRoom(adjacentRoom, room, roomHistory, depth + 1);
		});
	}

	private getDepth(depth: number): string {
		let result: string = '';
		for (let i: number = 0; i < depth; i++) {
			result += '   ';
		}
		return result;
	}
}
