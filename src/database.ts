import { world } from "@minecraft/server";

export default class DataBase {

    constructor(private name : string) {
        if (!this.exist())
            this.create()
    }


    private exist() : boolean {
        return !!world.scoreboard.getObjective(this.name)
    }

    private create() : void {
        world.scoreboard.addObjective(this.name, this.name)
    }

}
