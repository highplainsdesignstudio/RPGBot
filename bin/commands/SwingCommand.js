const Dice = require('../modules/Dice');
const Players = require('../modules/Players');

const SwingCommand = {
    _attackValue: 0,
    get attackValue() {
        return this._attackValue;
    },
    set attackValue(value) {
        this._attackValue = value;
    },

    _found: '',
    get found() {
        return this._found;
    },
    set found(value) {
        this._found = value;
    },

    _target: '',
    get target() {
        return this._target;
    },
    set target(value) {
        this._target = value;
    },

    _user: {},
    get user() {
        return this._user;
    },
    set user(value) {
        this._user = value;
    },

    swing: async function(interaction, channel) {
        const missCheck = Dice.roll(100);
        if(missCheck <= 30) {
            await this.missSwing(interaction);
        } else {
            // Get a random player to hit.
            this.found = this.findTarget(channel);
            // if the user is a bot, miss the swing.
            if(this.found.user.bot) {
                // Send the missed reply.
                await this.missSwing(interaction);
            } else {
                // The target is valid. performSwing.
                await this.performSwing(interaction);
                //  If target is dead
                if(this.target.life <= 0) {
                    await this.targetDied(interaction);
                }
            }
        }
    },

    findTarget: function(channel) {
        const size = channel.members.size;
        const swingIndex = Dice.roll(size) - 1;
        const _channel = channel.members.toJSON();
        return channel.members.at(swingIndex);
    },

    missSwing: async function(interaction) {
        await interaction.reply({
            content: `${interaction.user} took a swing in a crowded room! What did they think would happen? ${interaction.user.username} didn't hit anything and fell over.`,
            files: [{
                attachment: './assets/miss.png'
            }]
        });

        // Timeout the user if possible.
        Players.userTimeout(interaction, 30, "You threw a punch in public!")
    },

    performSwing: async function(interaction) {
        // The target is valid, set the attackValue
        this.attackValue = Dice.roll(6);
        // this.attackValue = 100;
        this.user = Players.find(interaction.user.username);
        this.target = Players.find(this.found.user.username);
        this.attackValue = Dice.modifiedAttackValue(this.attackValue, this.user.attack, this.target.defense);
        this.target.life = this.target.life - this.attackValue;
        Players.updateTarget(this.target);

        // Send the reply informing the results.
        await interaction.reply({
            content: `${interaction.user} took a wild swing in a crowded room! How unfortunate for ${this.found.user} who was standing in the way and took the hit for ${this.attackValue} points. ${this.target.username} now has ${this.target.life>0 ? this.target.life : 'no'} hit points.`,
            files: [{
                attachment: './assets/swing.png'
            }]
        });

        // Timeout the user if possible.
        Players.userTimeout(interaction, 30, "You threw a punch in public!")
    },

    targetDied: async function(interaction) {
        // Check if target is timeout exempt and follow up the interaction.
        if(Players.foundTargetTimeoutExempt(this.found)) {
            // target is exempt, send the followup.
            console.log('No Timeout');
            interaction.followUp({
                content:`${this.found.user} has been incapacitated!`,
                files: [{
                    attachment: './assets/Death.png'
                }]
            });
        } else { 
            // Timeout the target and send the followup.;
            interaction.followUp({
                content:`${this.found.user} has been incapacitated! They will be revived in 2 minutes.`,
                files: [{
                    attachment: './assets/Death.png'
                }]
            });
            // Timeout the found target if possible.
            Players.foundTargetTimeout(interaction, this.found, 120, 'Someone punched you and you lost all of your hit points.');
        }
        // Either way, reset the player life to 100 and update.
        this.target.life = 100;
        Players.updateTarget(this.target);
    },

}

module.exports = SwingCommand;