const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageCollector,
} = require('discord.js');

const channelTarget = '974229677436719135';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('authorise')
    .setDescription('key bypass'),
  async execute(interaction) {
    if (!interaction.member.roles.cache.has('973533624815198318')) {
      return interaction.reply({
        content:
          'You do not have a verified role. Please verify yourself first.',
        ephemeral: true,
      });
    } else {
      if (interaction.channel.id !== channelTarget) {
        interaction.channel
          .send({
            content: `You can t use this command here, please make sure you are in <#${channelTarget}> channel`,
            ephemeral: true,
          })
          .then((msg) => setTimeout(() => msg.delete(), 10000));
      } else {
        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('moreinfo')
              .setLabel('More Info')
              .setStyle('SECONDARY')
            // .setDisabled(true)
          )
          .addComponents(
            new MessageButton()
              .setCustomId('important')
              .setLabel('Important')
              .setStyle('DANGER')
            // .setDisabled(true)
          );
        const linkRow = new MessageActionRow().addComponents(
          // ...
          new MessageButton()
            .setLabel('Cnnect')
            .setStyle('LINK')
            .setURL('http://127.0.0.1:5500/index.html#')
        );
        const embed = new MessageEmbed()
          .setColor('#FF7F50')
          .setTitle('Verify your assets')
          .setAuthor({
            name: 'MateBot',
            iconURL: 'https://i.imgur.com/m96gO6X.png',
          })
          .setURL('https://i.imgur.com/m96gO6X.png')
          .setDescription(
            'This connection is private, and therefore we are just the middleman, so please be aware of that aspect, do not take it for granted, and be cautious.'
          );

        await interaction.reply({
          content: 'Last step to get you setup!',
          ephemeral: true,
          embeds: [embed],
          components: [row, linkRow],
        });
      }
    }

    const moreinfoMessage = new MessageEmbed()
      .setColor('#FF7F50')
      .setTitle('More Information')
      .setDescription(
        'This process is made for the exact same reason as our previous one, to protect the integrity of the server'
      )
      .addField('Contact Us', 'matebot@protonmail.com', true);

    const importantMessage = new MessageEmbed()
      .setColor('#DC143C')
      .setTitle('Important')
      .setDescription('...')
      .addField('Instructions', 'Things to know beforehand', true)
      .addFields(
        { name: 'Step 1', value: '...' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Step 2', value: '...', inline: true },
        { name: 'Step 3', value: '...', inline: true }
      );

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: 'BUTTON',
      time: 15000,
    });

    collector.on('collect', async (i) => {
      if (i.customId === 'moreinfo') {
        await i.reply({
          ephemeral: true,
          embeds: [moreinfoMessage],
        });
      } else if (i.customId === 'important') {
        await i.reply({
          ephemeral: true,
          embeds: [importantMessage],
        });
      }
    });
  },
};
