import { world } from '@minecraft/server';
export default class DataBase {
    constructor(name) {
        this.name = name;
        this.objective = world.scoreboard.getObjective(this.name);
        this.data = null;
        if (!this.exist())
            this.create();
        else
            this.load();
    }
    /*
    
    Database main methodes
    
    */
    save() {
        this.reset();
        let stringedData = JSON.stringify(this.data);
        if (stringedData.length >= 32768) {
            stringedData = this.chunckString(stringedData, 32768);
            stringedData.forEach((str) => this.objective.setScore(str, 0));
        }
        else
            this.objective.setScore(JSON.stringify(this.data), 0);
    }
    load() {
        if (!this.objective?.getParticipants()[0])
            return;
        let stringedData = '';
        this.objective.getParticipants().forEach((participant) => {
            console.warn(participant.displayName);
            stringedData += participant.displayName;
        });
        this.data = JSON.parse(stringedData);
        //this.data = JSON.parse(this.objective.getParticipants()[0].displayName);
    }
    reset() {
        if (this.objective?.getParticipants()[0])
            this.objective.getParticipants().map((participant) => this.objective.removeParticipant(participant));
    }
    exist() {
        return !!world.scoreboard.getObjective(this.name);
    }
    create() {
        world.scoreboard.addObjective(this.name, this.name);
    }
    /*
        
        Database formating methods
        
        */
    chunckString(str, x = 32768) {
        const chunks = [];
        for (let i = 0; i < str.length; i += x) {
            const chunk = str.slice(i, i + x);
            chunks.push(chunk);
        }
        return chunks;
    }
}
