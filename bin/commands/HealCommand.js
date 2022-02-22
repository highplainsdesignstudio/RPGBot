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

    _user: {},
    get user() {
        return this._user;
    },
    set user(value) {
        this._user = value;
    },

    heal: async function(interaction) {
        this.targetUser = interaction.options.get('target');
        if (this.targetUser.bot) {
            await interaction.reply({
                content: `${interaction.user} has targeted a bot! You can't target bots. Do something else.`,
                files: [{
                    attachment: './assets/bot.png'
                }]
            });
        } else {
            this.performHeal(interaction);
            // Can check for max life in the future.
        }
    },

    performHeal: async function(interaction) {
        this.healValue = Dice.roll(6);
        this.user = Players.find(interaction.user.username);
        this.target = Players.find(this.targetUser.user.username);
        this.healValue = Dice.modifiedHealValue(this.healValue, this.user.heal);
        this.target.life = (this.target.life + this.healValue) <= 200 ? (this.target.life + this.healValue) : 200;
        Players.updateTarget(this.target);

        // Sent reply with results
        await interaction.reply({
            content: `${interaction.user} has healed ${this.targetUser.member} for ${this.healValue} points. ${this.targetUser.user.username} now has ${this.target.life} hit points left.`,
            files: [{
                attachment: './assets/SpellBook03_96.png'
            }]
        });
        // Timeout the user if possible.
        Players.userTimeout(interaction, 30, "You have attacked someone!")
    }
}

module.exports = HealCommand;