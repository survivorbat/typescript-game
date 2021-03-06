import 'reflect-metadata';
import { IOutputHandler } from '../abstract/utils/IOutputHandler';
import { Elements } from '../elements/elements';
import { IInputHandler } from '../abstract/utils/IInputHandler';
import { inject, injectable } from '../../../node_modules/inversify';
import { TYPES } from '../constants/DependencyTypes';
import { IPlayer } from '../abstract/entities/IPlayer';
import { GameData } from '../constants/GameData';
import { container } from '../inversify.config';
import { COLORS } from '../constants/Colors';

@injectable()
export class Game {
	/**
     * @param outputHandler The output handler that will output lines to the screen
     * @param inputHandler The handler that will take care of the input
     * @param player The player object
     */
	constructor(
		@inject(TYPES.OutputHandler) private readonly outputHandler: IOutputHandler,
		@inject(TYPES.InputHandler) private readonly inputHandler: IInputHandler,
		@inject(TYPES.Player) private readonly player: IPlayer
	) {
		this.registerHandlers();
	}

	/**
     * Register event listeners
     */
	private registerHandlers() {
		Elements.inputElement.addEventListener('keypress', (event: KeyboardEvent) => {
			if (event.keyCode === 13) {
				this.inputHandler.addCommand(Elements.inputElement.value);
				this.inputHandler.execute();
				Elements.inputElement.value = '';
			}
		});

		Elements.inputElement.addEventListener('keyup', (event: KeyboardEvent) => {
			if (event.keyCode === 38) {
				Elements.inputElement.value = this.inputHandler.getCommand(
					this.inputHandler.commandHistoryPosition - 1
				);
			} else if (event.keyCode === 40) {
				Elements.inputElement.value = this.inputHandler.getCommand(
					this.inputHandler.commandHistoryPosition + 1
				);
			} else if (event.keyCode === 27) {
				Elements.inputElement.value = '';
			}
		});

		Elements.outputElement.addEventListener('click', () => {
			Elements.inputElement.focus();
		});
	}

	/**
     * Run the game
     */
	public run(): void {
		Elements.inputElement.focus();
		this.outputHandler.println('You wake up in a windowless room', COLORS.LIGHTGREEN);
		GameData.init(container);
		this.player.location = GameData.START;
		this.player.location.init(this.outputHandler);
	}
}
