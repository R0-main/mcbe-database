HOW TO USE : 

```ts

// define what type of data to be stored in the database
type TPlayerStats = {
    kills : number;
    deaths : number;
    money : number;
}

// create database (or retrieve if is already exist in the world) 
// by passing the "TPlayerStats" type, you can access the auto completion in databaseData
const playerStats = new DataBase<TPlayerStats>('db_player_stats')

// change data like you want 
playerStats.data.kills = 5
playerStats.data.deaths = 0
playerStats.data.money = 15774.45

// you need to call "save" method to save the database
playerStats.save()
```
