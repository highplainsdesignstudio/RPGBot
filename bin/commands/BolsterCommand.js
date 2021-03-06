const Dice = require('../modules/Dice');
const Players = require('../modules/Players');

const BolsterCommand = {
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

    bolster: async function(interaction) {
        this.targetUser = interaction.options.get('target');
        if (this.targetUser.bot) {
            await interaction.reply({
                content: `${interaction.user} has targeted a bot! You can't target bots. Do something else.`,
                files: [{
                    attachment: './assets/bot.png'
                }]
            });
        } else {
            await this.performBolster(interaction);
        }
    },

    performBolster: async function(interaction) {
        this.attackBoost = Dice.roll(3);
        this.defenseBoost = Dice.roll(3);
        this.healBoost = Dice.roll(3);
        this.target = Players.find(this.targetUser.user.username);

        // Update the boost values to max the stats to 50. 
        this.attackBoost = (this.target.attack + this.attackBoost) <= 50 ? this.attackBoost : (50 - this.target.attack);
        this.defenseBoost = (this.target.defense + this.defenseBoost) <= 50 ? this.defenseBoost : (50 - this.target.defense);
        this.healBoost = (this.target.heal + this.healBoost) <= 50 ? this.healBoost : (50 - this.target.heal);

        this.target.attack = (this.target.attack + this.attackBoost) <= 50 ? (this.target.attack + this.attackBoost) : 50;
        this.target.defense = (this.target.defense + this.defenseBoost) <= 50 ? (this.target.defense + this.defenseBoost) : 50;
        this.target.heal = (this.target.heal + this.healBoost) <= 50 ? (this.target.heal + this.healBoost) : 50;
        Players.updateTarget(this.target);
        // Send the interaction with the results
        await interaction.reply({
            content: `${interaction.user} has bolstered ${this.targetUser.member}! ${this.targetUser.user.username}'s attack power has increased by ${this.attackBoost} to ${this.target.attack}, defense has increased by ${this.defenseBoost} to ${this.target.defense}, and heal power has increased by ${this.healBoost} to ${this.target.heal}.`,
            files: [{
                attachment: './assets/bolster.png'
            }]
        });
        // Timeout the user if possible.
        Players.userTimeout(interaction, 60, "You have bolstered someone!");
    }

}

module.exports = BolsterCommand;