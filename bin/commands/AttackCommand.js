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
        
        if (interaction.targetMember.user.bot) {
            await interaction.reply({
                content: `${interaction.user} has targeted a bot! You can't target bots. Do something else.`,
                files: [{
                    attachment: './assets/bot.png'
                }]
            });
        } else {
            this.attackValue = Dice.roll(6);
            // this.attackValue = 100;
            // Check if the user's process variable exists.
            this.checkUser(interaction);
            // Check if the target user's process variable exists.
            const targetIsDead = this.checkTarget(interaction);
            // console.log(process.env[`_${interaction.user.username}`]);
            // await interaction.reply(`${interaction.user} has attacked ${interaction.targetUser} for ${this.attackValue} points. ${interaction.targetUser} now has ${process.env[`_${interaction.targetUser.username}`]} hit points left.`);
            if (targetIsDead) {
                await interaction.reply({
                    content: `${interaction.user} has attacked ${interaction.targetUser} for ${this.attackValue} points. ${interaction.targetUser.username} has been incapacitated! They will be revived in 2 minutes.`,
                    files: [{
                        attachment: './assets/Death.png'
                    }]
                });
            } else {
                await interaction.reply({
                    content: `${interaction.user} has attacked ${interaction.targetUser} for ${this.attackValue} points. ${interaction.targetUser} now has ${this.target.life} hit points left.`,
                    files: [{
                        attachment: './assets/SpellBook03_89.png'
                    }]
                });
            }
        }


    },

    checkIfDead: function(interaction, target) {
        if(target.life <= 0) {
            const isExempt = this.targetTimeoutExempt(interaction);
            try {
                isExempt ? console.log('is exempt') : interaction.targetMember.timeout(1000*120, 'You have died.');
            } catch (error) {
                console.log(error);
            }
            return true;
        } else return false;
    },

    checkTarget: function(interaction) {
        this.target = Players.find(interaction.targetUser.username);
        this.target.life = this.target.life - this.attackValue;
        const targetIsDead = this.checkIfDead(interaction, this.target);
        if(targetIsDead) this.target.life = 100;
        Players.updateTarget(this.target);
        return targetIsDead;
    },

    checkUser: function(interaction) {
        this.player = Players.find(interaction.user.username);
        const isExempt = this.userTimeoutExempt(interaction);
        isExempt ? console.log('No Timeout.') : interaction.member.timeout(1000*30, 'You have attacked another user!');
    },

    targetTimeoutExempt: function(interaction) {
        const exemptRoles = JSON.parse(process.env.TIMEOUT_EXEMPT);
        const isExempt = !exemptRoles.every(role => {
            if(interaction.targetMember._roles.includes(role)) {
                return false;
            } else return true;
        });
        return isExempt;
    },

    userTimeoutExempt: function(interaction) {
        const exemptRoles = JSON.parse(process.env.TIMEOUT_EXEMPT);
        const isExempt = !exemptRoles.every(role => {
            if(interaction.member._roles.includes(role)) {
                return false;
            } else return true;
        });
        return isExempt;
    }
}

module.exports = AttackCommand;