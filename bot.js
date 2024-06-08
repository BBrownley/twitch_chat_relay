require("dotenv").config();
const tmi = require("tmi.js");

const { Client, GatewayIntentBits } = require("discord.js");
const DCclient = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Define configuration options
const opts = {
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_BOT_OAUTH,
  },
  channels: ["twitchchat_gaming"],
};

// Create a client with our options
const twitchClient = new tmi.client(opts);

// Register our event handlers (defined below)
twitchClient.on("message", onMessageHandler);
twitchClient.on("connected", onConnectedHandler);

// Connect to Twitch:
twitchClient.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  // Remove whitespace from chat message
  const user = context.username;
  const message = msg.trim();

  if (self || user === "twitchchat_gaming") {
    return;
  } // Ignore messages from the bots

  const channel = DCclient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
  channel.send(`${user}: ${message}`);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

// Login to disc bot
DCclient.on("ready", () => {
  console.log(`Logged in as ${DCclient.user.tag}!`);
});

DCclient.login(process.env.DISCORD_BOT_TOKEN);
