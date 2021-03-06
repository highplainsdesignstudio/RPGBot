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

    attack: async function(interaction, channel) {
        this.targetUser = interaction.options.get('target');
        if (this.targetUser.bot || (interaction.user.id === this.targetUser.user.id)) {
            await interaction.reply({
                content: `${interaction.user} You can't target that person. Do something else.`,
                files: [{
                    attachment: './assets/bot.png'
                }]
            });
        } else {
            // Perform attack.
            await this.performAttack(interaction);

            // Check if target is dead.
            if(this.target.life <= 0) {
                await this.targetDied(interaction);
            }
        }
    },

    performAttack: async function(interaction) {
        this.attackValue = Dice.roll(6);
        // this.attackValue = 100;
       // Find user and target.
       this.user = Players.find(interaction.user.username);
       this.target = Players.find(this.targetUser.user.username);
       // Calculate attack value and update stats and target life.
       this.attackValue = Dice.modifiedAttackValue(this.attackValue, this.user.attack, this.target.defense);
       this.target.life = this.target.life - this.attackValue;
       this.user.damageDone = this.user.damageDone + this.attackValue;
       this.target.damageTaken = this.target.damageTaken + this.attackValue;
       // Update user and target.
       Players.updateTarget(this.user);
       Players.updateTarget(this.target);

        // Send the interaction with the results
        await interaction.reply({
            content: `${interaction.user} has attacked ${this.targetUser.member} for ${this.attackValue} points. ${this.targetUser.user.username} now has ${this.target.life>0 ? this.target.life : 'no'} hit points left.`,
            files: [{
                attachment: './assets/SpellBook03_89.png'
            }]
        });
        // Timeout the user if possible.
        Players.userTimeout(interaction, 30, "You have attacked someone!");
    },
    
    targetDied: async function(interaction) {
        // Check if target is timeout exempt and follow up the interaction.
        if(Players.targetTimeoutExempt(interaction)) {
            // target is exempt, send the followup.
            console.log('No Timeout');
            await interaction.followUp({
                content:`${this.targetUser.member} has been incapacitated!`,
                files: [{
                    attachment: './assets/Death.png'
                }]
            });
        } else { 
            // Timeout the target and send the followup.;
            await interaction.followUp({
                content:`${this.targetUser.member} has been incapacitated! They will be revived in 2 minutes.`,
                files: [{
                    attachment: './assets/Death.png'
                }]
            });
            Players.targetTimeout(interaction, 120, "You have lost all of your hit points.");
        }
        // Either way, reset the player life to 100, the stats to 1, +1 deaths stat, and update.
        this.target.life = 100;
        this.target.attack = 1;
        this.target.defense = 1;
        this.target.heal = 1;
        this.target.deaths = this.target.deaths + 1;
        Players.updateTarget(this.target);
        // Update the user's kills count.
        this.user.kills = this.user.kills + 1;
        Players.updateTarget(this.user);
    },
}

module.exports = AttackCommand;