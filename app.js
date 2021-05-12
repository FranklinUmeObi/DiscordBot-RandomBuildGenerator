//Setup
const { Client, MessageEmbed } = require("discord.js");
require("dotenv").config();

//uncomment these 3 on repl
//const keepAlive = require("./server")
//const mySecret = process.env['BOT_TOKEN']
//keepAlive()


//Import Data
const itemData = require("./items");
const godData = require("./gods");
const insultData = require("./insults");




//Initialise BOT
const client = new Client();
client.login(process.env.BOT_TOKEN);
client.on("ready", () => {console.log("Bot is ready");});





//---------------------------------------------------------------
//---------------------------------------------------------------
//On Message Input
//---------------------------------------------------------------
//---------------------------------------------------------------
client.on("message", (msg) => {
  let botOutput;

  switch (msg.content) {
    case "!info":
      commandInfo(msg, botOutput);
      break;

    case "!steve":
      commandSteve(msg, botOutput);
      break;

    case "!god":
      commandGod(msg, botOutput);
      break;

    case "!mage":
      commandClass(msg, "Mage", botOutput);
      break;

    case "!hunter":
      commandClass(msg, "Hunter", botOutput);
      break;

    case "!assassin":
      commandClass(msg, "Assassin", botOutput);
      break;

    case "!warrior":
      commandClass(msg, "Warrior", botOutput);
      break;

    case "!guardian":
      commandClass(msg, "Guardian", botOutput);
      break;

    case "!build":
      commandBuild(msg, botOutput);
      break;

    default:
  }
});






//---------------------------------------------------------------
//---------------------------------------------------------------
//BOT Commands
//---------------------------------------------------------------
//---------------------------------------------------------------
function commandInfo(msg, botOutput) {
  botOutput = new MessageEmbed()
    .setTitle("Franks Smite Bot Commands")
    .setColor(0x4444ff)
    .setDescription("Here is all the things this bot can do\n")
    .addField("!info", "Pull up the info on this bot")
    .addField("!god", "Generate a random smite god")
    .addField("!build", "Generate a random build for a god")
    .addField("!steve", "Generate a random insult directed at steve")
    .addField("!mage, !hunter, etc", "Generate a random god of that class");
  msg.reply(botOutput);
}

function commandSteve(msg, botOutput) {
  let n = insultData.Insults.length;
  let index = getRandomInt(n);
  let insult = insultData.Insults[index - 1];
  botOutput = new MessageEmbed()
    .setTitle("Steve")
    .setColor(0x007700)
    .setDescription(insult);
  msg.reply(botOutput);
}

function commandGod(msg, botOutput) {
  let god2 = generateRandomGod();
  let godImg2 = generateImage(god2);
  botOutput = new MessageEmbed()
    .setTitle("Your Random God")
    .setColor(0xa1a1a1)
    .setDescription(msg.author.tag + " is " + god2 + "\n")
    .setImage(godImg2);
  msg.reply(botOutput);
}

function commandBuild(msg, botOutput) {
  let god = generateRandomGod();
  let type = "";
  for (let i = 0; i < godData.Gods.length; i++)
    if (godData.Gods[i].name === god) type = godData.Gods[i].powerType;
  let godImg = generateImage(god);
  let build = generateRandomBuild(type);
  let starter = generateRandomStarter(type);
  let boots = generateRandomBoots(type);
  botOutput = new MessageEmbed()
    .setTitle("Random Build")
    .setColor(0xffff00)
    .setDescription(msg.author.tag + " here is your build\n\n")
    .setThumbnail(godImg)
    .addField("God", god)
    .addField("Starter", starter)
    .addField("Boots", boots)
    .addField("Items", build);
  msg.reply(botOutput);
}

function commandClass(msg, wantedClass, botOutput) {
  let godOfClass = generateRandomGodOfClass(wantedClass);
  let godOfClassImg = generateImage(godOfClass);
  botOutput = new MessageEmbed()
    .setTitle("Your Random God")
    .setColor(0xa1a1a1)
    .setDescription(msg.author.tag + " is " + godOfClass + "\n")
    .setImage(godOfClassImg);
  msg.reply(botOutput);
}






//---------------------------------------------------------------
//---------------------------------------------------------------
//Helper Functions
//---------------------------------------------------------------
//---------------------------------------------------------------

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}




function generateRandomGod() {
  let gods = [];
  for (let i = 0; i < godData.Gods.length; i++) gods.push(godData.Gods[i].name);
  let randomNum = getRandomInt(godData.Gods.length - 1);
  let randomGod = gods[randomNum];
  return randomGod;
}




function generateImage(godName) {
  let god = godName;
  god = god.replace(/\s+/g, "-").toLowerCase();
  return `https://webcdn.hirezstudios.com/smite/god-cards/${god}.jpg`;
}




function generateRandomBuild(type) {
  let build = "";
  let usableItems = getUsableItems(type);
  let randomItems = shuffle(usableItems);

  for (let i = 0; i < 6; i++) {
    build += randomItems[i] + "\n";
  }
  return build;
}




function getUsableItems(type) {
  let finalItems = [];

  for (let i = 0; i < itemData.Items.length; i++) {
    if (
      itemData.Items[i].tier === 3 &&
      (itemData.Items[i].type === type || itemData.Items[i].type === "Both")
    ) {
      finalItems.push(itemData.Items[i].name);
    }
  }
  return finalItems;
}




function generateRandomStarter(type) {
  let finalItems = [];
  for (let i = 0; i < itemData.Items.length; i++) {
    if (
      itemData.Items[i].tier === 2 &&
      itemData.Items[i].starter === true &&
      (itemData.Items[i].type === type || itemData.Items[i].type === "Both")
    ) {
      finalItems.push(itemData.Items[i].name);
    }
  }
  let chosen = shuffle(finalItems);
  return chosen[0];
}




function generateRandomBoots(type) {
  let finalItems = [];

  for (let i = 0; i < itemData.Items.length; i++) {
    if (
      itemData.Items[i].tier === 3 &&
      itemData.Items[i].shoes === true &&
      (itemData.Items[i].type === type || itemData.Items[i].type === "Both")
    ) {
      finalItems.push(itemData.Items[i].name);
    }
  }
  let chosen = shuffle(finalItems);
  return chosen[0];
}




function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}




function generateRandomGodOfClass(godClass) {
  let gods = [];
  for (let i = 0; i < godData.Gods.length; i++) {
    if (godData.Gods[i].type === godClass) gods.push(godData.Gods[i].name);
  }

  let randomNum = getRandomInt(gods.length - 1);
  let randomGod = gods[randomNum];
  return randomGod;
}




//Hosted from https://replit.com/@FranklinUme/SmiteBot#index.js
//Pinged from https://uptimerobot.com/dashboard#787893643