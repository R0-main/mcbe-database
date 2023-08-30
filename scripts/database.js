import { world } from "@minecraft/server";
export default class DataBase {
    constructor(name) {
        this.name = name;
        if (!this.exist())
            this.create();
    }
    exist() {
        return !!world.scoreboard.getObjective(this.name);
    }
    create() {
        world.scoreboard.addObjective(this.name, this.name);
    }
}
