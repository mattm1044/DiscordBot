var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var ServerID = bot.channels[channelID].guild_id;
       
        //args = args.splice(1);
        logger.info(args);
        switch(cmd) {
            case 'roll':
                var min = 1; 
                var max = parseInt(args[1]) + 1 || 101;  
                var random = Math.floor(Math.random() * (max - min)) + min;
                bot.sendMessage({
                    to: channelID,
                    message: user + ' rolled a ' + random
                });
            break;

            case 'teams':
                if (Number.isInteger(parseInt(args[1]))) { 
                    var players = args.slice(2);
                    var numTeams = parseInt(args[1]); 
                }
                else { 
                    var players = args.slice(1); 
                    var numTeams = 2;
                }

                shuffle(players);

                var teams = assignTeams(players, numTeams);
                var output = "";

                for (let i = 0; i < teams.length; i++){
                    output += printTeam(teams[i], i+1);
                }

                bot.sendMessage({
                    to: channelID,
                    message: output
                });
                
            break;

            case 'kick':
                var UserID = args[1].slice(2, -1);
                bot.sendMessage({
                    to: channelID,
                    message: "See ya later " + (args[1]) + " :)"
                });
                bot.kick({
                    serverID: ServerID,
                    userID: UserID
                });
            break;

            case 'ban':
                var UserID = args[1].slice(2, -1);
                bot.sendMessage({
                    to: channelID,
                    message: "See ya never " + (args[1]) + " :)"
                });
                bot.ban({
                    serverID: ServerID,
                    userID: UserID
                });
            break;

            case 'gimp':
                var UserID = args[1].slice(2, -1);
                var textChannels = Object.values(bot.servers[ServerID].channels).filter(c => c.type == 0);
                bot.sendMessage({
                    to: channelID,
                    message: (args[1]) + " has been Deafened and Muted."
                });
                bot.deafen({
                    serverID: ServerID,
                    userID: UserID
                });
                bot.mute({
                    serverID: ServerID,
                    userID: UserID
                });
                //bot.editChannelPermissions({}); add code to remove ability to read chat once library is updated
            break;

            case 'ungimp':
                var UserID = args[1].slice(2, -1);
                //var textChannels = Object.values(bot.servers[serverID].channels).filter(c => c.type == 2)
                bot.sendMessage({
                    to: channelID,
                    message: (args[1]) + " is no longer Deafened and Muted."
                });
                bot.undeafen({
                    serverID: ServerID,
                    userID: UserID
                });
                bot.unmute({
                    serverID: ServerID,
                    userID: UserID
                });
                //bot.editChannelPermissions({}); add code to restore ability to read chat once library is updated
            break;
         }
     }
});

//shuffles the values of an array around randomly
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function assignTeams(players, numTeams){
    var i = 0;
    var teams = [];

    for (let n = 0; n < numTeams; n++){
        teams.push([]);
    }

    while (i < players.length){
        for (let j = 0; j < numTeams; j++){
            if (players[i] != null){
                teams[j].push(players[i]);
                i++; 
            }
        }
    }
    return teams;
}

function printTeam(team, teamNum) {
    var message = "Team " + teamNum + " is:"
    for (let i = 0; i < team.length; i++){
        message += " " + team[i];
    }
    message += "\n"
    return message;
}