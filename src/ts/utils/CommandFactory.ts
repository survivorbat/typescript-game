import { ICommandFactory } from '../abstract/utils/ICommandFactory';
import { ICommand } from '../abstract/utils/ICommand';
import { Command } from './Command';
import { inject, injectable } from '../../../node_modules/inversify';
import { ICommandExecutor } from '../abstract/utils/ICommandExecutor';
import { UnknownCommandExecutor } from './commandexecutors/UnknownCommandExecutor';
import { HelpExecutor } from './commandexecutors/HelpExecutor';
import { InventoryExecutor } from './commandexecutors/InventoryExecutor';
import { ObserveExecutor } from './commandexecutors/ObserveExecutor';
import { MapExecutor } from './commandexecutors/MapExecutor';
import { MoveToExecutor } from './commandexecutors/MoveToExecutor';
import { ClearExecutor } from './commandexecutors/ClearExecutor';
import { UseExecutor } from './commandexecutors/UseExecutor';
import { DropExecutor } from './commandexecutors/DropExecutor';
import { PickupExecutor } from './commandexecutors/PickupExecutor';
import { ICommandType } from '../abstract/utils/ICommandType';
import { CommandTypes } from '../constants/CommandTypes';

@injectable()
export class CommandFactory implements ICommandFactory {
	constructor(
		@inject(UnknownCommandExecutor) private readonly unknownCommandExecutor: ICommandExecutor,
		@inject(HelpExecutor) private readonly helpExecutor: ICommandExecutor,
		@inject(InventoryExecutor) private readonly inventoryExecutor: ICommandExecutor,
		@inject(ObserveExecutor) private readonly observeExecutor: ICommandExecutor,
		@inject(MapExecutor) private readonly mapExecutor: ICommandExecutor,
		@inject(MoveToExecutor) private readonly movetoExecutor: ICommandExecutor,
		@inject(ClearExecutor) private readonly clearExecutor: ICommandExecutor,
		@inject(UseExecutor) private readonly useExecutor: ICommandExecutor,
		@inject(DropExecutor) private readonly dropExecutor: ICommandExecutor,
		@inject(PickupExecutor) private readonly pickupExecutor: ICommandExecutor
	) {}

	getCommandFromString(command: string): ICommand {
		const commandArray = command.split(' ');
		const commandNoun = commandArray[0];

		delete commandArray[0];
		const commandArguments = commandArray.join(' ').trim().toLocaleLowerCase();

		let returnCommand: ICommand | null = null;

		CommandTypes.forEach((commandType: ICommandType) => {
			if (commandType.name == commandNoun || commandType.shortcut == commandNoun) {
				returnCommand = new Command(commandArguments, this[commandType.name + 'Executor'], command);
			}
		});

		return returnCommand || new Command(commandArguments, this.unknownCommandExecutor, command);
	}
}
