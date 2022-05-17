const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('key bypass'),
  async execute(interaction) {
    if (interaction.member.roles.cache.has('973533624815198318')) {
      return interaction.reply({
        content:
          'You do have a verified role. Please move along or check /help command for more information regarding what functionalities we provide.',
        ephemeral: true,
      });
    }
    const channel = '974229677436719135';
    const memberRole = '973533624815198318';
    const verifyEmoji = '✅';

    let embed = new MessageEmbed()
      .setColor('#FF7F50')
      .setTitle('Verification')
      .setDescription(
        'Check the mark to get acces on the server - by doing so you ll accept the rules above'
      )
      .addField(
        'Authorization',
        'To receive more access to particular channels, the need to identify yourself is mandatory, but this step can be done at any time with no pressure by using the /authorise command.',
        true
      )
      .addField(
        'WARNING',
        'This message will automatically be deleted in 10 seconds.',
        true
      );
    let messageEmbed = await interaction.channel.send({
      content: 'Required Field',
      ephemeral: true,
      embeds: [embed],
    });
    messageEmbed.react(verifyEmoji);
  },
};
