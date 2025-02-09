import { kickBanEmbedBuilder } from "../struct/kickBanEmbedBuilder.js";
import { getTextChannelFromID } from "../util/helpers.js";
import { config } from "../config/config.js";
import { AuditLogEvent } from "discord.js";
import { Event } from "djs-handlers";

export default new Event("guildBanAdd", async (guildBan) => {
  const ban = guildBan.partial ? await guildBan.fetch() : guildBan;

  console.log(`${ban.user.tag} was banned from ${ban.guild}.`);

  const fetchedLogs = await ban.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MemberBanAdd,
  });

  const banAuditLog = fetchedLogs.entries.first();

  if (!banAuditLog) {
    throw new Error("Cannot find BanLog.");
  }

  const { executor, target, action, reason } = banAuditLog;

  if (!executor || !target || action !== AuditLogEvent.MemberBanAdd) {
    throw new Error("Cannot find executor or target from the Audit Log.");
  }

  const executingMember = await ban.guild.members.fetch(executor.id);

  if (!config.logChannel) return;

  const banLog = await getTextChannelFromID(guildBan.guild, config.logChannel);

  if (target.id === ban.user.id) {
    const banEmbed = new kickBanEmbedBuilder(
      ban.user,
      executingMember,
      "ban",
      reason
    );

    banLog.send({ embeds: [banEmbed] });
  } else {
    throw new Error(
      "The IDs of the target in the AuditLog and the target from the Event did not match."
    );
  }
});
