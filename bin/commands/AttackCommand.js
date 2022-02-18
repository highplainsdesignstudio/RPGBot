const Dice = require('../modules/Dice');
const Players = require('../modules/Players');

const AttackCommand = {
    _attackValue: 0,
    get attackValue() {
        return this._attackValue;
    },
    set attackValue(value) {
        this._attackValue = value;
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

    attack: async function(interaction) {
        // Generate an attack value.
        // this.generateAttackValue();
        this.attackValue = Dice.roll(6);
        // Check if the user's process variable exists.
        this.checkUser(interaction);
        // Check if the target user's process variable exists.
        this.checkTarget(interaction);
        // console.log(process.env[`_${interaction.user.username}`]);
        // await interaction.reply(`${interaction.user} has attacked ${interaction.targetUser} for ${this.attackValue} points. ${interaction.targetUser} now has ${process.env[`_${interaction.targetUser.username}`]} hit points left.`);
        await interaction.reply({
            content: `${interaction.user} has attacked ${interaction.targetUser} for ${this.attackValue} points. ${interaction.targetUser} now has ${this.target.life} hit points left.`,
            files: [{
                attachment: './assets/SpellBook03_89.png'
            }]
        });
    },

    checkTarget: function(interaction) {
        this.target = Players.find(interaction.targetUser.username);
        this.target.life = this.target.life - this.attackValue;
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
        isExempt ? console.log('No Timeout.') : interaction.member.timeout(1000*30, 'You have attacked another user!');
    },
}

module.exports = AttackCommand;