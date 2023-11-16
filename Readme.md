# How to use : 

Create database (or retrieve if is already exist in the world)
and by passing the "TPlayerStats" type, you can access the auto completion in database.
```ts
const playerStats = new DataBase<TPlayerStats>('db_player_stats')
```

Also you can put what will be the default value if the database is new.
```ts
const playerStats = new DataBase<TPlayerStats>('db_player_stats', { kills: 0, deaths: 0, money: 1000 })
```

Then you can define some methods to perform action on your data at each steps of the database methods. So you can map some values with this method.
```ts
const playerStats = new DataBase<TPlayerStats>('db_player_stats', { kills: 0, deaths: 0, money: 1000 }, {
	afterLoad : (database: typeof playerStats) => {
		console.warn(`${database.name} > has been loaded !`);
	},
	beforeLoad : (database: typeof playerStats) => {
		console.warn(`${database.name} > will be loaded !`);
	},
	beforeSave : (database: typeof playerStats) => {
		console.warn(`${database.name} > will be saved !`);
	},
	afterSave : (database: typeof playerStats) => {
		console.warn(`${database.name} > has been saved !`);
	}
})
```

You can updates database values by applying values to the database.data 

```ts
playerStats.data.kills = 5;
playerStats.data.deaths = 0;
playerStats.data.money = 15774.45;
```

To retrieve data : 
```ts
console.warn(playerStats.data.kills)
```

To save Database : 
(You don't need to save every time you change a value, save is only to make sur datas are saved if the world crash ...)
```ts
playerStats.save()
```

## Database Exemples

```ts
import DataBase from 'database';

// define what type of data to be stored in the database
type TPlayerStats = {
	kills: number;
	deaths: number;
	money: number;
};

const playerStats = new DataBase<TPlayerStats>('db_player_stats', { kills: 0, deaths: 0, money: 1000 }, {
	afterLoad : (database: typeof playerStats) => {
		console.warn(`${database.name} > has been loaded !`);
	}
});

// change data like you want
playerStats.data.kills = 5;
playerStats.data.deaths = 0;
playerStats.data.money = 15774.45;

// you need to call "save" method to save the database
playerStats.save();

```

# Database Properties : 
```
Database(<:name>, <:default value>, <:Events Methods callback>)
```
```ts
new DataBase<object>( name: string, value?: object | null, eventsMethods?: TEventsMethods<TData>)

export type TEventsMethods<TData> = {
	beforeSave?: (database: DataBase<TData>) => void;
	afterSave?: (database: DataBase<TData>) => void;
	beforeLoad?: (database: DataBase<TData>) => void;
	afterLoad?: (database: DataBase<TData>) => void;
};
```
