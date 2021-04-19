//Hosted from https://replit.com/@FranklinUme/SmiteBot#index.js
//Pinged from https://uptimerobot.com/dashboard#787893643



//Setup Bot
const { Client, MessageEmbed } = require("discord.js");
require("dotenv").config();






//Import Data
const itemData = require("./items");
const godData = require("./gods");








//Functions
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



function generateRandomBuild(godName, type) {
  let build = "";
  let usableItems = getUsableItems(type);
  let randomItems = shuffle(usableItems);

  for (let i = 0; i < 6; i++) {
    build += usableItems[i] + "\n";
  }
  return build;
}



function getUsableItems(type) {
  let finalItems = [];

  for (let i = 0; i < itemData.Items.length; i++) {
    if (
      itemData.Items[i].tier === 3 &&
      (itemData.Items[i].type === type || itemData.Items[i].type === "Both")) 
    {
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
      ) 
      {
        finalItems.push(itemData.Items[i].name);
      }
    }
    let chosen = shuffle(finalItems)
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
    let chosen = shuffle(finalItems)
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




//Initialise BOT
const client = new Client();
client.login(process.env.BOT_TOKEN);
client.on("ready", () => {
  console.log("Bot is ready");
});





//BOT Commands
client.on("message", (msg) => {
  switch (msg.content) {
    case "!info":
      msg.reply(
          "I make randomm builds init.\n To get a random build, type '!build'\n If you just want a God, type '!god'");
      break;

    case "!god":
        let god2 = generateRandomGod();
        let godImg2 = generateImage(god2);
        const embed2 = new MessageEmbed()
        .setTitle("Your Random God")
        .setColor(0xff0000)
        .setDescription(msg.author.tag + " is " + god2 + "\n")
        .setImage(godImg2)
      msg.reply(embed2);
      break;

    case "!build":
      let god = generateRandomGod();
      let type = "";
      for (let i = 0; i < godData.Gods.length; i++) if (godData.Gods[i].name === god) type = godData.Gods[i].powerType;
      let godImg = generateImage(god);
      let build = generateRandomBuild(god, type);
      let starter = generateRandomStarter(type);
      let boots = generateRandomBoots(type);
      const embed = new MessageEmbed()
        .setTitle("Random Build")
        .setColor(0xffff00)
        .setDescription(msg.author.tag + " here is your build\n\n")
        .setThumbnail(godImg)
        .addField("God", god)
        .addField("Starter", starter)
        .addField("Boots", boots)
        .addField("Items", build);
      msg.reply(embed);
      break;

    default:
  }
});
