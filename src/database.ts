// @ts-ignore
import { ScoreboardObjective, world } from '@minecraft/server';

export default class DataBase <TData>{
	private objective: ScoreboardObjective = world.scoreboard.getObjective(this.name);

	public data: TData | null = null;

	constructor(private name: string) {
		if (!this.exist()) this.create();
		else this.load();
	}

	/*
    
    Database main methodes
    
    */

	public save(): void {
		this.reset();
		
		let stringedData: string | Array<string> = JSON.stringify(this.data);

		if (stringedData.length >= 32768) {
			stringedData = this.chunckString(stringedData, 32768);
			stringedData.forEach((str) => this.objective.setScore(str, 0));
		}else this.objective.setScore(JSON.stringify(this.data), 0)

	}

	private load(): void {
		if (!this.objective?.getParticipants()[0]) return;

		let stringedData: string = '';

		this.objective.getParticipants().forEach((participant) => {
			stringedData += participant.displayName;
		});

		this.data = JSON.parse(stringedData);
		//this.data = JSON.parse(this.objective.getParticipants()[0].displayName);
	}

	private reset(): void {
		if (this.objective?.getParticipants()[0]) this.objective.getParticipants().map((participant) => this.objective.removeParticipant(participant));
	}

	private exist(): boolean {
		return !!world.scoreboard.getObjective(this.name);
	}

	private create(): void {
		world.scoreboard.addObjective(this.name, this.name);
	}

	/*
		
		Database formating methods
		
		*/

	private chunckString(str: string, x: number = 32768): string[] {
		const chunks: string[] = [];
		for (let i = 0; i < str.length; i += x) {
			const chunk = str.slice(i, i + x);
			chunks.push(chunk);
		}
		return chunks;
	}
}
