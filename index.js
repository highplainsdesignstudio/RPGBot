require('./bin/initialize');

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const attackCommand = require('./bin/commands/AttackCommand');
const healCommand = require('./bin/commands/HealCommand');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
//   if (!interaction.isCommand()) return;
    if (interaction.commandName === 'attack') {
      attackCommand.attack(interaction);
    }

    if(interaction.commandName === 'heal') {
      healCommand.heal(interaction);
    }

});

client.login(process.env.TOKEN);