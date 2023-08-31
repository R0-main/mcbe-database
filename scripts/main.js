import DataBase from 'database';
import { world, system } from '@minecraft/server';
const plots = new DataBase('plots');
console.warn(plots.data);
world.beforeEvents.chatSend.subscribe((data) => {
    system.run(() => {
        plots.data = {
            test: 'hello world',
        };
        plots.save();
    });
});
