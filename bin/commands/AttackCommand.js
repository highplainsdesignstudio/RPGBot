const AttackCommand = {
    _atk: 0,

    attack: async function(interaction) {
        // Generate an attack value.
        this.generateAttackValue();
        // Check if the user's process variable exists.
        this.checkUser(interaction);
        // Check if the target user's process variable exists.
        this.checkTarget(interaction);
        // console.log(process.env[`_${interaction.user.username}`]);
        // await interaction.reply(`${interaction.user} has attacked ${interaction.targetUser} for ${this.attackValue} points. ${interaction.targetUser} now has ${process.env[`_${interaction.targetUser.username}`]} hit points left.`);
        await interaction.reply({
            content: `${interaction.user} has attacked ${interaction.targetUser} for ${this.attackValue} points. ${interaction.targetUser} now has ${process.env[`_${interaction.targetUser.username}`]} hit points left.`,
            files: [{
                attachment: './assets/SpellBook03_89.png'
            }]
        })
    },

    get attackValue() {
        return this._atk;
    },

    set attackValue(value) {
        this._atk = value;
    },

    checkTarget: function(interaction) {
        if(process.env[`_${interaction.targetUser.username}`]) {
            // if the variable exists, subtract the attack value from the existing value.
            let targetLife = parseInt(process.env[`_${interaction.targetUser.username}`]);
            targetLife = targetLife - this.attackValue;
            process.env[`_${interaction.targetUser.username}`] = targetLife;
  
        } else { // else the variable doesn't exist 
            // Create the user's process variable.
            process.env[`_${interaction.targetUser.username}`] = '100'; // This is the user's start life.
            // subtract the attack value from the existing value.
            let targetLife = parseInt(process.env[`_${interaction.targetUser.username}`]);
            targetLife = targetLife - this.attackValue;
            process.env[`_${interaction.targetUser.username}`] = targetLife;
        }
    },

    // checkUser: function(interaction) {
    //     if(process.env[`_${interaction.user.username}`]) {
    //         // if the variable exists just timeout the attacker.
    //         const exemptIds = JSON.parse(process.env.TIMEOUT_EXEMPT);
    //         exemptIds.includes(interaction.user.id) ? console.log('No Timeout.') : interaction.member.timeout(1000*30, 'You have attacked another user!');
    //       } else { // else the variable doesn't exist 
    //           // Create the user's process variable.
    //           process.env[`_${interaction.user.username}`] = '100'; // This is the user's start life.
    //           //  timeout the attacker.
    //           const exemptIds = JSON.parse(process.env.TIMEOUT_EXEMPT);
    //           exemptIds.includes(interaction.user.id) ? console.log('No Timeout.') : interaction.member.timeout(1000*30, 'You have attacked another user!');
    //       }
    // },

    checkUser: function(interaction) {
        if(process.env[`_${interaction.user.username}`]) {
            // if the variable exists just timeout the attacker.
            const exemptRoles = JSON.parse(process.env.TIMEOUT_EXEMPT);
            const isExempt = !exemptRoles.every(role => {
                if (interaction.member._roles.includes(role)){
                    return false;
                } else return true;
            });
            isExempt ? console.log('No Timeout.') : interaction.member.timeout(1000*30, 'You have attacked another user!');

        } else { // else the variable doesn't exist 
            // Create the user's process variable.
            process.env[`_${interaction.user.username}`] = '100'; // This is the user's start life.
            //  timeout the attacker.
            const exemptRoles = JSON.parse(process.env.TIMEOUT_EXEMPT);
            const isExempt = !exemptRoles.every(role => {
                if (interaction.member._roles.includes(role)){
                    return false;
                } else return true;
            });
            isExempt ? console.log('No Timeout.') : interaction.member.timeout(1000*30, 'You have attacked another user!');
        }
    },

    generateAttackValue: function() {
        const attack = Math.floor(Math.random() * 20) + 1;
        this.attackValue = attack;
    }
}

module.exports = AttackCommand;