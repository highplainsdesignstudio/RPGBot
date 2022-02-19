const Dice = require('../modules/Dice');
const Players = require('../modules/Players');

const HealCommand = {
    _healValue: 0,
    get healValue() {
        return this._healValue;
    },
    set healValue(value) {
        this._healValue = value;
    },

    _player: {},
    get player() {
        return this._player;
    },
    set player(value) {
        this._player = value;
    },

    _target: {},
    get target() {
        return this._target;
    },
    set target(value) {
        this._target = value;
    },

    heal: async function(interaction) {

        if (interaction.targetMember.user.bot) {
            await interaction.reply({
                content: `${interaction.user} has targeted a bot! You can't target bots. Do something else.`,
                files: [{
                    attachment: './assets/bot.png'
                }]
            });
        } else {
            this.healValue = Dice.roll(6);
            this.checkUser(interaction);
            // Check if the target user's process variable exists.
            const targetIsDead = this.checkTarget(interaction);
            // console.log(process.env[`_${interaction.user.username}`]);
            // await interaction.reply(`${interaction.user} has attacked ${interaction.targetUser} for ${this.attackValue} points. ${interaction.targetUser} now has ${process.env[`_${interaction.targetUser.username}`]} hit points left.`);
            await interaction.reply({
                content: `${interaction.user} has healed ${interaction.targetUser} for ${this.healValue} points. ${interaction.targetUser} now has ${this.target.life} hit points left.`,
                files: [{
                    attachment: './assets/SpellBook03_96.png'
                }]
            });
        }
    },

    checkTarget: function(interaction) {
        this.target = Players.find(interaction.targetUser.username);
        this.target.life = this.target.life + this.healValue;
        Players.updateTarget(this.target);
    },

    checkUser: function(interaction) {
        this.player = Players.find(interaction.user.username);
        const exemptRoles = JSON.parse(process.env.TIMEOUT_EXEMPT);
        const isExempt = !exemptRoles.every(role => {
            if(interaction.member._roles.includes(role)) {
                return false;
            } else return true;
        });
        isExempt ? console.log('No Timeout.') : interaction.member.timeout(1000*30, 'You have healed another user!');
    },
}

module.exports = HealCommand;