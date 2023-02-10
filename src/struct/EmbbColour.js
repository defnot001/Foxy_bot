import { EmbedBuilder } from "discord.js";
import { config } from "../config/config.js";

export class EmbbColour extends EmbedBuilder {
  constructor(user, data) {
    super(data);
    this.setColor(config.mainEmbedColour);
  }
}
