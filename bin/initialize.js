require('./env');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [

  {
    name: 'attack',
    type: 2
  },
  {
    name: 'blast',
    description: 'Blasts the last three speakers in the channel.'
  },
  {
    name: 'bolster',
    type: 2
  },
  {
    name: 'heal',
    type: 2
  },
  {
    name: 'inspect',
    type: 2
  },
  {
    name: 'intimidate',
    type: 2
  },
  {
    name: 'swing',
    description: 'Takes a swing at a random member of the room.'
  }
]; 

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();