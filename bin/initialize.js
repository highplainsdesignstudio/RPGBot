require('./env');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { user } = require('./commands/AttackCommand');

const commands = [
  {
    name: 'attack',
    type: 1,
    description: 'Attacks a target.',
    options: [
      {
        name: 'target',
        description: 'The target you wish to attack.',
        type: 6,
        required: true
      }
    ]
  },
  {
    name: 'blast',
    description: 'Blasts the last three speakers in the channel.'
  },
  {
    name: 'bolster',
    type: 1,
    description: `Bolsters a target and increases target's stats.`,
    options: [
      {
        name: 'target',
        description: 'The target you wish to bolster.',
        type: 6,
        required: true
      }
    ]
  },
  {
    name: 'heal',
    type: 1,
    description: 'Heals a target.',
    options: [
      {
        name: 'target',
        description: 'The target you wish to heal.',
        type: 6,
        required: true
      }
    ]
  },
  {
    name: 'inspect',
    type: 1,
    description: 'Inspects a target and displays their stats.',
    options: [
      {
        name: 'target',
        description: ' The target you wish to inspect.',
        type: 6,
        required: true
      }
    ]
  },
  {
    name: 'intimidate',
    type: 1,
    description: 'Intimidates a target and reduces their stats.',
    options: [
      {
        name: 'target',
        description: 'The target you wish to intimidate.',
        type: 6,
        required: true
      }
    ]
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