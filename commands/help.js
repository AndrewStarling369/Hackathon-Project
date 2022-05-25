const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const help = new MessageEmbed()
  .setColor('#FF7F50')
  .setTitle('Help')
  .setDescription(
    'utilizare comenzi:\n **/help** - about\n **/verify** - member verification\n **/authorise** - member identification/authorization'
  )
  .setThumbnail('https://i.imgur.com/m96gO6X.png');

module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('info'),
  async execute(interaction) {
    await interaction.reply({ embeds: [help], ephemeral: true });
  },
};
