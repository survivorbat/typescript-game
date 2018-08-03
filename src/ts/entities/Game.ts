import { IOutputHandler } from "../abstract/utils/IOutputHandler"
import { Elements } from "../elements/elements"
import { IInputHandler } from "../abstract/utils/IInputHandler"
import { Command } from "../utils/Command"
import { inject, injectable } from "../../../node_modules/inversify";
import { TYPES } from "../constants/Types";
import { IPlayer } from "../abstract/entities/IPlayer";
import { P1R1_BEDROOM } from "../constants/Rooms";
import { COLORS } from "../constants/Colors";
import { exists } from "fs";
import { ICommandFactory } from "../abstract/utils/ICommandFactory";
import { getCommandTypeFromString } from "../constants/CommandTypes";

@injectable()
export class Game {
    // Outputhandler
    private readonly outputHandler: IOutputHandler

    // Inputhandler
    private readonly inputHandler: IInputHandler

    // Player object
    private readonly player: IPlayer

    /**
     * @param outputHandler The output handler that will output lines to the screen
     * @param inputHandler The handler that will take care of the input
     * @param player The player object
     */
    constructor(
        @inject(TYPES.OutputHandler) outputHandler: IOutputHandler, 
        @inject(TYPES.InputHandler) inputHandler: IInputHandler, 
        @inject(TYPES.Player) player: IPlayer,
        @inject(TYPES.CommandFactory) commandFactory: ICommandFactory
    ) {
        if(!Elements.inputElement || !Elements.outputElement) {
            console.error("Not all html elements were defined in the Elements class, exiting script")
            window.stop()
        }

        this.player = player
        this.inputHandler = inputHandler
        this.outputHandler = outputHandler
        this.registerHandlers(commandFactory)
    }

    /**
     * Register event listeners
     */
    private registerHandlers(commandFactory: ICommandFactory) {
        Elements.inputElement.addEventListener("keypress", (event: KeyboardEvent) => {
            if(event.keyCode === 13) {
                const commandType = getCommandTypeFromString(Elements.inputElement.value)
                const commandObject = commandFactory.getInstanceFromType(commandType)
                this.inputHandler.addCommand(commandObject)
                this.inputHandler.execute()
                Elements.inputElement.value = ""
            }
        })

        // Elements.inputElement.addEventListener("keyup", (event: KeyboardEvent) => {
        //     if(event.keyCode === 38) {
        //         Elements.inputElement.value = this.inputHandler.getCommand(this.inputHandler.commandHistoryPosition-1)
        //     } else if(event.keyCode === 40) {
        //         Elements.inputElement.value = this.inputHandler.getCommand(this.inputHandler.commandHistoryPosition+1)
        //     }
        //     Elements.inputElement.setSelectionRange(Elements.inputElement.value.length, Elements.inputElement.value.length)
        // })
    }

    /**
     * Run the game
     */
    public run(): void {
        Elements.inputElement.focus()
        this.outputHandler.println(100, "You wake up in a windowless room")
        this.player.location = P1R1_BEDROOM
        this.player.location.init(this.outputHandler)
    }
}