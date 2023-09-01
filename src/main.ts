/* import DataBase from 'database'; */
import { world, system } from '@minecraft/server';
import CustomPlayer from 'customPlayer';
import DataBase from 'database';

// create or load if database exist
/* const plots = new DataBase('plots'); */

const plots = new DataBase<number>('plots')

plots.data = "dfazfa"

// change the data of the data base
/* plots.data.plot1 = {
	owners: 'JustRomain',
	trusted: ['Nova', 'Corentin'],
	createDate: Date.now(),
}; */

/* plots.data.message1 = 'data.message1'.repeat(10000),
plots.data.message2 = 'data.message2'.repeat(10000), */

// save data
plots.save();


world.beforeEvents.chatSend.subscribe((data) => {
	system.run(() => {
		plots.data = [data.message]
		plots.save()
		console.warn(plots.data)
	});
});
