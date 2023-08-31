import { ScoreboardObjective, world } from '@minecraft/server';

export default class DataBase {
	private objective: ScoreboardObjective = world.scoreboard.getObjective(this.name);

	public data: object;

	constructor(private name: string) {
		if (!this.exist()) this.create();
		else this.load();
	}

	/*

        Data formating methods
    */

	private static convertToBinary(obj: object): string {
		const str = JSON.stringify(obj);
		let finalResult = '';
		for (let i = 0; i < str.length; i++) {
			finalResult += str[i].charCodeAt(0).toString(2);
		}
		return finalResult;
	}

	private static decodeBinary(str: string): string {
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

	public save(): void {
		this.reset();
		this.objective.setScore(DataBase.convertToBinary(this.data), 0);
	}

	private load(): void {
		if (this.objective.getParticipants()[0])
			this.data = JSON.parse(DataBase.decodeBinary(this.objective.getParticipants()[0].displayName.replaceAll(' ', '')));
		//this.objective.setScore(DataBase.convertToBinary(this.data), 0);
	}

	private reset(): void {
		if (this.objective.getParticipants()[0]) 
            this.objective.getParticipants().map((participant) => this.objective.removeParticipant(participant));
	}

	private exist(): boolean {
		return !!world.scoreboard.getObjective(this.name);
	}

	private create(): void {
		world.scoreboard.addObjective(this.name, this.name);
	}
}
