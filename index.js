require('./bin/initialize');

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const attackCommand = require('./bin/commands/AttackCommand');
const blastCommand = require('./bin/commands/BlastCommand');
const bolsterCommand = require('./bin/commands/BolsterCommand');
const healCommand = require('./bin/commands/HealCommand');
const inspectCommand = require('./bin/commands/InspectCommand');
const intimidateCommand = require('./bin/commands/IntimidateCommand');
const swingCommand = require('./bin/commands/SwingCommand');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
//   if (!interaction.isCommand()) return;
  if(interaction.commandName == 'arm') armCommand.arm(interaction);

  if (interaction.commandName === 'attack') attackCommand.attack(interaction);

  if(interaction.commandName === 'blast') {
    client.channels.fetch(interaction.channelId)
      .then(channel => {
        blastCommand.blast(interaction, channel);
      })
    ;
  }

  if (interaction.commandName === 'bolster') bolsterCommand.bolster(interaction);

  if(interaction.commandName === 'heal') healCommand.heal(interaction);

  if(interaction.commandName === 'inspect') inspectCommand.inspect(interaction);

  if(interaction.commandName === 'intimidate') intimidateCommand.intimidate(interaction);

  if(interaction.commandName === 'swing') {
    client.channels.fetch(interaction.channelId)
      .then(channel => {
        swingCommand.swing(interaction, channel);
      })
    ;
  }

});

client.login(process.env.TOKEN);