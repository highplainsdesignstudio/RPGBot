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
        this.target = Players.find(interaction.targetUser.username);
        this.target.life = this.target.life - this.attackValue;
        Players.updateTarget(this.target);

        // Send the interaction with the results
        await interaction.reply({
            content: `${interaction.user} has attacked ${interaction.targetUser} for ${this.attackValue} points. ${interaction.targetUser.username} now has ${this.target.life>0 ? this.target.life : 'no'} hit points left.`,
            files: [{
                attachment: './assets/SpellBook03_89.png'
            }]
        });
        // Timeout the user if possible.
        Players.userTimeout(interaction, 30, "You have attacked someone!")
    },
    
    targetDied: async function(interaction) {
        // Check if target is timeout exempt and follow up the interaction.
        if(Players.targetTimeoutExempt(interaction)) {
            // target is exempt, send the followup.
            console.log('No Timeout');
            await interaction.followUp({
                content:`${interaction.targetUser} has been incapacitated!`,
                files: [{
                    attachment: './assets/Death.png'
                }]
            });
        } else { 
            // Timeout the target and send the followup.;
            interaction.followUp({
                content:`${interaction.targetUser.username} has been incapacitated! They will be revived in 2 minutes.`,
                files: [{
                    attachment: './assets/Death.png'
                }]
            });
            Players.targetTimeout(interaction, 120, "You have lost all of your hit points.");
        }
        // Either way, reset the player life to 100 and update.
        this.target.life = 100;
        Players.updateTarget(this.target);
    },
}

module.exports = AttackCommand;