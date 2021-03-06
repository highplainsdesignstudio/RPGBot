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
        // TODO: Here, the target should stop being updated if the target is the user.
        this.healValue = Dice.modifiedHealValue(this.healValue, this.user.heal);
        if(interaction.user.id === this.targetUser.user.id) this.user.life = (this.user.life + this.healValue) <= 200 ? (this.user.life + this.healValue) : 200;
        else this.target.life = (this.target.life + this.healValue) <= 200 ? (this.target.life + this.healValue) : 200;

        this.user.healsDone = this.user.healsDone + this.healValue; // Updates the user.healsDone value.
        // update the healsTaken values.
        (interaction.user.id === this.targetUser.user.id) ? this.user.healsTaken = this.user.healsTaken + this.healValue : this.target.healsTaken = this.target.healsTaken + this.healValue;

        // Update the targets.
        Players.updateTarget(this.user); 
        if(interaction.user.id !== this.targetUser.user.id) Players.updateTarget(this.target);

        // Send reply with results
        await interaction.reply({
            content: `${interaction.user} has healed ${this.targetUser.member} for ${this.healValue} points. ${this.targetUser.user.username} now has ${(interaction.user.id === this.targetUser.user.id) ? this.user.life :this.target.life} hit points left.`,
            files: [{
                attachment: './assets/SpellBook03_96.png'
            }]
        });
        // Timeout the user if possible.
        Players.userTimeout(interaction, 30, "You have attacked someone!")
    }
}

module.exports = HealCommand;