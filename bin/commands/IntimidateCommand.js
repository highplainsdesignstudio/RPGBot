const Dice = require('../modules/Dice');
const Players = require('../modules/Players');

const IntimidateCommand = {
    _attackBoost: 0,
    get attackBoost() {
        return this._attackBoost;
    },
    set attackBoost(value) {
        this._attackBoost = value;
    },

    _defenseBoost: 0,
    get defenseBoost() {
        return this._defenseBoost;
    },
    set defenseBoost(value) {
        this._defenseBoost = value;
    },

    _healBoost: 0,
    get healBoost() {
        return this._healBoost;
    },
    set healBoost(value) {
        this._healBoost = value;
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

    intimidate: async function(interaction) {
        this.targetUser = interaction.options.get('target');
        if (this.targetUser.bot || (this.targetUser.user.id === interaction.user.id)) {
            await interaction.reply({
                content: `${interaction.user} You can't target that person. Do something else.`,
                files: [{
                    attachment: './assets/bot.png'
                }]
            });
        } else {
            await this.performIntimidate(interaction);
        }
    },

    performIntimidate: async function(interaction) {
        this.attackBoost = Dice.roll(3);
        this.defenseBoost = Dice.roll(3);
        this.healBoost = Dice.roll(3);
        this.target = Players.find(this.targetUser.user.username);
        this.target.attack = (this.target.attack - this.attackBoost) >= 0 ? this.target.attack - this.attackBoost : 0;
        this.target.defense = (this.target.defense - this.defenseBoost) >= 0 ? this.target.defense - this.defenseBoost : 0;
        this.target.heal = (this.target.heal - this.healBoost) >= 0 ? this.target.heal - this.healBoost : 0;
        Players.updateTarget(this.target);
        // Send the interaction with the results
        await interaction.reply({
            content: `${interaction.user} has intimidated ${this.targetUser.member}! ${this.targetUser.user.username}'s attack power has decreased by ${this.attackBoost} to ${this.target.attack}, defense has decreased by ${this.defenseBoost} to ${this.target.defense}, and heal power has decreased by ${this.healBoost} to ${this.target.heal}.`,
            files: [{
                attachment: './assets/intimidate.png'
            }]
        });
        // Timeout the user if possible.
        Players.userTimeout(interaction, 60, "You have intimidated someone!");
    }
};

module.exports = IntimidateCommand;