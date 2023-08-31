import { world } from '@minecraft/server';
export default class DataBase {
    constructor(name) {
        this.name = name;
        this.objective = world.scoreboard.getObjective(this.name);
        if (!this.exist())
            this.create();
        else
            this.load();
    }
    /*

        Data formating methods
    */
    static convertToBinary(obj) {
        const str = JSON.stringify(obj);
        let finalResult = '';
        for (let i = 0; i < str.length; i++) {
            finalResult += str[i].charCodeAt(0).toString(2);
        }
        return finalResult;
    }
    static decodeBinary(str) {
        let result = '';
        for (let i = 0; i < str.length; i += 8) {
            const octet = str.substr(i, 8);
            const decimalValue = parseInt(octet, 2);
            if (decimalValue !== 0) {
                const character = String.fromCharCode(decimalValue);
                result += character;
            }
        }
        return result;
    }
    /*
    
    Database main methodes
    
    */
    save() {
        this.reset();
        this.objective.setScore(DataBase.convertToBinary(this.data), 0);
    }
    load() {
        if (this.objective.getParticipants()[0])
            this.data = JSON.parse(DataBase.decodeBinary(this.objective.getParticipants()[0].displayName.replaceAll(' ', '')));
        //this.objective.setScore(DataBase.convertToBinary(this.data), 0);
    }
    reset() {
        if (this.objective.getParticipants()[0])
            this.objective.getParticipants().map((participant) => this.objective.removeParticipant(participant));
    }
    exist() {
        return !!world.scoreboard.getObjective(this.name);
    }
    create() {
        world.scoreboard.addObjective(this.name, this.name);
    }
}
