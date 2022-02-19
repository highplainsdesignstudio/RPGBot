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


    swing: async function(interaction, channel) {

        const missCheck = Dice.roll(100);
        if(missCheck <= 30) {
            await this.missSwing(interaction);
            // await interaction.reply({
            //     content: `${interaction.user} took a swing in a crowded room! What did they think would happen? ${interaction.user.username} didn't hit anything and fell over.`,
            //     files: [{
            //         attachment: './assets/miss.png'
            //     }]
            // });
        } else {
            // Get a random player to hit.
            this.found = this.findTarget(channel);
            // if the user is a bot, miss the swing.
            if(this.found.user.bot) {
                // Send the missed reply.
                await this.missSwing(interaction);
                // await interaction.reply({
                //     content: `${interaction.user} took a swing in a crowded room! What did they think would happen? ${interaction.user.username} didn't hit anything and fell over.`,
                //     files: [{
                //         attachment: './assets/miss.png'
                //     }]
                // });
                // // Timeout the user if possible.
                // Players.userTimeoutExempt(interaction) ? console.log('No Timeout') : interaction.member.timeout(1000*30, 'You have attacked another user!');

            } else {
                await this.performSwing(interaction);
                // // The target is valid, set the attackValue
                // this.attackValue = Dice.roll(6);
                // const _target = Players.find(target.user.username);
                // _target.life = _target.life - this.attackValue;
                // Players.updateTarget(_target);

                // // Send the reply informing the results.
                // interaction.reply({
                //     content: `You took a wild swing in a crowded room! How unfortunate for ${target.user} who was standing in the way and took the hit for ${this.attackValue} points. ${target.user.username} now has ${_target.life>0 ? _target.life : 'no'} hit points.`,
                //     files: [{
                //         attachment: './assets/swing.png'
                //     }]
                // });

                //  If target is dead
                if(this.target.life <= 0) {
                    await this.targetDied(interaction);
                    // // Check if target is timeout exempt and follow up the interaction.
                    // if(Players.targetTimeoutExempt(interaction)) {
                    //     // target is exempt, send the followup.
                    //     console.log('No Timeout');
                    //     interaction.followUp({
                    //         content:`${interaction.targetUser.username} has been incapacitated!`,
                    //         files: [{
                    //             attachment: './assets/Death.png'
                    //         }]
                    //     });
                    // } else { 
                    //     // Timeout the target and send the followup.
                    //     interaction.targetMember.timeout(1000*120, 'You have died!');
                    //     interaction.followUp({
                    //         content:`${interaction.targetUser.username} has been incapacitated! They will be revived in 2 minutes.`,
                    //         files: [{
                    //             attachment: './assets/Death.png'
                    //         }]
                    //     });
                    // }
                    // // Either way, reset the player life to 100 and update.
                    // _target.life = 100;
                    // Players.updateTarget(_target);
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
        this.timeoutUser(interaction);
        // Players.userTimeoutExempt(interaction) ? console.log('No Timeout') : interaction.member.timeout(1000*30, 'You have attacked another user!');
    },

    performSwing: async function(interaction) {
        // The target is valid, set the attackValue
        this.attackValue = Dice.roll(6);
        // this.attackValue = 100;
        this.target = Players.find(this.found.user.username);
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
        this.timeoutUser(interaction);
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
            // Timeout the target and send the followup.
            // The interaction.targetMember won't work because this was a slash command
            // interaction.targetMember.timeout(1000*120, 'You have died!');
            interaction.followUp({
                content:`${interaction.targetUser.username} has been incapacitated! They will be revived in 2 minutes.`,
                files: [{
                    attachment: './assets/Death.png'
                }]
            });
        }
        // Either way, reset the player life to 100 and update.
        this.target.life = 100;
        Players.updateTarget(this.target);
    },

    timeoutUser: function(interaction) {
        Players.userTimeoutExempt(interaction) ? console.log('No Timeout') : interaction.member.timeout(1000*30, 'You have been timed out by the RPG Bot.');
    }

}

module.exports = SwingCommand;