import { ScoreboardIdentity, ScoreboardObjective, world } from '@minecraft/server';

export type TEventsMethods<TData> = {
	beforeSave?: (database: DataBase<TData>) => void;
	afterSave?: (database: DataBase<TData>) => void;
	beforeLoad?: (database: DataBase<TData>) => void;
	afterLoad?: (database: DataBase<TData>) => void;
};

export default class DataBase<TData> {
	private static readonly MAX_CHAR: number = 32768 - 1;

	private objective: ScoreboardObjective = world.scoreboard.getObjective(this.name);

	public data: TData | null = null;

	constructor(
		public readonly name: string,
		value?: TData | null,
		private readonly eventsMethods: TEventsMethods<TData> = {
			afterSave: () => {},
			afterLoad: () => {},
			beforeLoad: () => {},
			beforeSave: () => {},
		}
	) {
		this.data = value;
		if (!this.exist()) this.create();
		else this.load();
	}

	/*
    
    Database main methodes
    
    */

	public save(): void {
		if (!this.data) return;
		this.reset();

		if (this.eventsMethods.beforeSave) this.eventsMethods.beforeSave(this);
		let stringedData: string | Array<string> = JSON.stringify(this.data);

		if (stringedData.length >= DataBase.MAX_CHAR) {
			stringedData = this.chunckString(stringedData, DataBase.MAX_CHAR);
			stringedData.forEach((str, i) => this.objective.setScore(str, i));
		} else this.objective.setScore(stringedData, 0);
		if (this.eventsMethods.afterSave) this.eventsMethods.afterSave(this);
	}

	private load(): void {
		if (this.eventsMethods.beforeLoad) this.eventsMethods.beforeLoad(this);
		if (this.objective?.getParticipants()?.length < 0) return;

		const participants: Array<ScoreboardIdentity> = this.objective.getParticipants();

		const data: Array<string> = [];

		const maxScore: number = Math.max(...participants.map((participant) => this.objective.getScore(participant)));
		let oldScore: number = 0;

		this.objective.getParticipants().forEach((participant) => {
			const score = this.objective.getScore(participant);
			if (score === 0 || score - oldScore === 1 || score === maxScore) {
				data[score] = participant.displayName;
			} else {
				const diff = score - oldScore;
				for (let i = 0; i < diff; i++) {
					data[score - i] = participant.displayName;
				}
			}
			oldScore = score;
		});

		if (data.length > 0) this.data = JSON.parse(data.join(''));

		if (this.eventsMethods.afterLoad) this.eventsMethods.afterLoad(this);
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
