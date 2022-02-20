const BlastCommand = {
    blast: async function(interaction, channel) {
        await interaction.reply('Hey from the blast command.');
    }
};

module.exports = BlastCommand;