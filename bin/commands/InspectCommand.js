const Players = require('../modules/Players');

const InspectCommand = {
    _target: {},
    get target() {
        return this._target;
    },
    set target(value) {
        this._target = value;
    },
    
    inspect: async function(interaction) {
        if (interaction.targetMember.user.bot) {
            await interaction.reply({
                content: `${interaction.user} has targeted a bot! You can't target bots. Do something else.`,
                files: [{
                    attachment: './assets/bot.png'
                }]
            });
        } else {
            await this.performInspect(interaction);
        }
    },

    performInspect: async function(interaction) {
        this.target = Players.find(interaction.targetUser.username);
              // Send the interaction with the results
        await interaction.reply({
            content: `${interaction.user} has brazenly inspected ${interaction.targetUser}. ${interaction.targetUser.username} currently has ${this.target.life>0 ? this.target.life : 'no'} hit points left.\nTheir stats:\nAttack Power: ${this.target.attack}\nDefense: ${this.target.defense}\nHeal Power: ${this.target.heal}`,
            files: [{
                attachment: './assets/inspect.png'
            }]
        });
    }
}

module.exports = InspectCommand;