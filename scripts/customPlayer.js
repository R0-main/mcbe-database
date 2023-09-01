import { Player } from "@minecraft/server";
export default class CustomPlayer extends Player {
    constructor() {
        super(...arguments);
        this.ranks = [];
        this.activate = false;
    }
    spawn() {
    }
}
class SpawnCommands extends Commands {
    onExecute(data) {
        fiafhaifha;
    }
}
