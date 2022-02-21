const Players = require('../modules/Players');

const InspectCommand = {
    _target: {},
    get target() {
        return this._target;
    },
    set target(value) {
        this._target = value;
    },

    _targetUser: {},
    get targetUser() {
        return this._targetUser;
    },
    set targetUser(value) {
        this._targetUser = value;
    },
    
    inspect: async function(interaction) {
        this.targetUser = interaction.options.get('target');
        if (this.targetUser.bot) {
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
        this.target = Players.find(this.targetUser.user.username);
              // Send the interaction with the results
        await interaction.reply({
            content: `${interaction.user} has brazenly inspected ${this.targetUser.member}. ${this.targetUser.user.username} currently has ${this.target.life>0 ? this.target.life : 'no'} hit points left.\nTheir stats:\nAttack Power: ${this.target.attack}\nDefense: ${this.target.defense}\nHeal Power: ${this.target.heal}`,
            files: [{
                attachment: './assets/inspect.png'
            }]
        });
    }
}

module.exports = InspectCommand;