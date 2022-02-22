const Dice = require('../modules/Dice');
const Players = require('../modules/Players');
const { attackValue, attack, target } = require('./AttackCommand');

const BlastCommand = {

    _targets: [],
    get targets() {
        return this._targets;
    },
    set targets(value) {
        this._targets = value;
    },

    blast: async function(interaction, channel) {
        this.targets = await this.findTargets(channel);
        await interaction.reply({
            content: `${interaction.user} has blasted the entrance of the room.`,
            files: [{
                attachment: './assets/blast.png'
            }]
        });
        await this.targets.forEach(target => {
            // Process the blast for each message.
            this.performBlast(interaction, channel, target);
        });
    },

    findTargets: async function(channel) {
        const messages = await channel.messages.fetch({limit:50});
        // remove the first message because it will be the interaction
        let targets = [];
        // Iterate through the messages here with the variable "messages". Theoretically, the message should be a user or a bot interaction initiated by a user, a message by a user, or a message by a bot.
        messages.every(message => {
            console.log(message.content)
            // Check if message author is a bot.
            if(message.author.bot) {
                // If it is a bot, get the interaction user as the stand in.
                if(message.interaction) targets.push(message.interaction.user);
               
            } else targets.push(message.member); // else the target is not a bot.
            
            // Check the size of the targets variable. If it is 3 in size, return false.
            if(targets.length >= 3) return false;
            else return true;
        });

        return targets;
    },

    performBlast: async function(interaction, channel, target) {
        const attackValue = Dice.roll(2);
        // const attackValue = 40;
        let _target = Players.find(target.username);
        _target.life = _target.life - attackValue;
        Players.updateTarget(_target);

        await interaction.followUp({
            content: `${target} was blasted for ${attackValue}. `
        });

        // Check if the target is dead and send a followUp if needed.
        if(_target.life <= 0) {
            // This could be checked for a timeout exempt player so that it won't say "they will be revived shortly." But, meh.
            await interaction.followUp({
                content:`${target} has been incapacitated! They will be revived shortly.`,
                files: [{
                    attachment: './assets/Death.png'
                }]
            });
            // Have to convert the target into a guildmember
            const targetMember = channel.members.get(target.id);
            // Timeout target if possible.
            Players.foundTargetTimeout(targetMember, 120, "You have lost all of your hit points.");
            // Change the life back to 100 and Players.updateTarget again.
            _target.life = 100;
            _target.life = 100;
            _target.attack = 1;
            _target.defense = 1;
            _target.heal = 1;
            Players.updateTarget(_target);
        }
    }
};

module.exports = BlastCommand;