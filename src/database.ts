import { ScoreboardObjective, world } from '@minecraft/server';

export default class DataBase<TData> {
	private static readonly MAX_CHAR: number = 32768;

	private objective: ScoreboardObjective = world.scoreboard.getObjective(this.name);

	public data: TData | null = null;

	constructor(public readonly name: string, value?: TData | null, private readonly onLoadCallback?: (data: DataBase<TData>) => void) {
		this.data = value;
		if (!this.exist()) this.create();
		else this.load();
		return this;
	}

	/*
    
    Database main methodes
    
    */

	public save(): void {
		if (!this.data) return;
		this.reset();

		let stringedData: string | Array<string> = JSON.stringify(this.data);

		if (stringedData.length >= DataBase.MAX_CHAR) {
			stringedData = this.chunckString(stringedData, DataBase.MAX_CHAR);
			stringedData.forEach((str, i) => this.objective.setScore(str, i));
		} else this.objective.setScore(stringedData, 0);
	}

	private load(): void {
		if (!this.objective?.getParticipants()[0]) return;

		const participants = this.objective.getParticipants();
		const dataArray: Array<string> = [];
		let oldScore: number = 0;

		participants.forEach((participant) => {
			const score = this.objective.getScore(participant);

			if (score - oldScore === 1 || score === 0 || score === participants.length - 1) dataArray[score] = participant.displayName;
			else {
				for (let i = 0; i < score - oldScore; i++) {
					dataArray[score - oldScore - i] = participant.displayName;
				}
			}
			oldScore = score;
		});

		if (dataArray.length > 0) this.data = JSON.parse(dataArray.join(''));

		if (this.onLoadCallback) this.onLoadCallback(this);
	}

	private reset(): void {
		if (this.objective?.getParticipants()?.length > 0)
			this.objective.getParticipants().map((participant) => this.objective.removeParticipant(participant));
	}

	private exist(): boolean {
		return !!world.scoreboard.getObjective(this.name);
	}

	private create(): void {
		this.objective = world.scoreboard.addObjective(this.name, this.name);
	}

	/*
		
		Database formating methods
		
	*/

	private chunckString(str: string, x: number = DataBase.MAX_CHAR): string[] {
		const chunks: string[] = [];
		for (let i = 0; i < str.length; i += x) {
			const chunk = str.slice(i, i + x);
			chunks.push(chunk);
		}
		return chunks;
	}
}
