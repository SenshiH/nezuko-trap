const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const { cpuUsage } = require('process');
const agree = "✅";
const disagree = "❎";
const ytdl = require('ytdl-core');
const queue = new Map();

client.on("ready", () => {

    client.user.setStatus("online");

    var memberCount = client.users.size;
    var serverCount = client.guilds.size;
    console.log("--------------------------------------");
    console.log('Information du bot: Je fonctionne !')
    console.log(`Nom du bot: ${client.user.tag}!`);
    console.log(`Id du bot: ${client.user.id}`)
    console.log(`Token du bot: ${client.token}`)
    console.log("--------------------------------------");
    console.log('Information du client:')
    console.log("Serveurs: " + serverCount);
    console.log('--------------------------------------')
});

client.on('ready', () => {
    const activities = [
        "Faites n!aide pour avoir les commandes du bot !",
        "Made By Kiro"
    ];
    client.setInterval(() => {
        const index = Math.floor(Math.random() * activities.length);
        client.user.setActivity(activities[index], {
            type: "PLAYING"
        });
    }, 15000);
})


client.on('message', async message => {
    let prefix = config.prefix
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    const serverQueue = queue.get(message.guild.id);
    if (!message.guild) return;

    

    if (message.content == prefix + "aide"){
        const aideEmbed = new Discord.MessageEmbed()
            .setTitle("Voici la page d'aide !")
            .setThumbnail("https://i.ibb.co/BVShHmy/b054cc0b859901ef45dbb3e856b7f9b39db3c63ar1-2048-1989v2-uhq-removebg-preview.png")
            .setColor("RANDOM")
            .addField("**Administration :**", "__**Soon...**__")
            .addField("**Modération :**", "**__Soon...__**")
            .addField("**Utilitaire :**", "n!join, n!play [lien Youtube], n!leave, n!skip")
            .addField("**Fun :**", "n!rip, n!waifu")

        message.channel.send(aideEmbed)
        message.delete();

    }
 
    
      if (message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue); // On appel execute qui soit initialise et lance la musique soit ajoute à la queue la musique
        return;
      }
      if (message.content.startsWith(`${prefix}skip`)) {
          skip(message, serverQueue); // Permettra de passer à la musique suivante
          return;
      }  
      if (message.content.startsWith(`${prefix}stop`)) {
          stop(message, serverQueue); // Permettra de stopper la lecture
          return;
      }

    if (message.content == prefix + "join") {
        
        if (message.member.voice.channel) {
          const connection = await message.member.voice.channel.join();

        const messageEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Le bot a rejoint le salon vocal avec succès !")
            .setThumbnail("https://i.ibb.co/BVShHmy/b054cc0b859901ef45dbb3e856b7f9b39db3c63ar1-2048-1989v2-uhq-removebg-preview.png")
        
        message.channel.send(messageEmbed)
        message.delete();      

        } else {
            const alertEmbed = new Discord.MessageEmbed()
                .setTitle("Erreur !")
                .setThumbnail(client.user.avatarURL)
                .setColor("RANDOM")
                .setDescription("**Vous devez d'abord rejoindre un salon vocal !**")

            message.channel.send(alertEmbed);
        }
      }

    

    if (message.content == prefix + "leave"){
        
        if (message.member.voice.channel) {
            const deco = await message.member.voice.channel.leave();

            const messagesEmbed = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle("Le bot a été déconnecté avec succès !")
                .setThumbnail("https://i.ibb.co/BVShHmy/b054cc0b859901ef45dbb3e856b7f9b39db3c63ar1-2048-1989v2-uhq-removebg-preview.png")

            message.channel.send(messagesEmbed)
            message.delete();

        } else {
            const errorEmbed = new Discord.MessageEmbed()
                .setTitle("Erreur !")
                .setThumbnail(client.user.avatarURL)
                .setColor("RANDOM")
                .setDescription("Le bot n'est dans aucun salon vocal ou veuillez d'abord rejoindre !")

            message.channel.send(errorEmbed)
        }

    }

        if(message.content == prefix + "rip") {

            const ripEmbed = new Discord.MessageEmbed()
                .setImage("https://i.imgur.com/w3duR07.png")

            message.channel.send(ripEmbed)
            message.delete();

        }

        

        if(message.content == prefix + "purge"){

            const purgeEmbed = new Discord.MessageEmbed()
                .setTitle("Erreur !")
                .setColor("RED")
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande.")

            const msgpEmbed = new Discord.MessageEmbed()
                .setTitle("Erreur !")
                .setColor("RED")
                .setDescription("Veuillez indiquer un nombre de message à supprimer.")

            const emsgpEmbed = new Discord.MessageEmbed()
                .setTitle("Erreur !")
                .setColor("RED")
                .setDescription("Veuillez indiquer un nombre valide.")

            const ucmsgpEmbed = new Discord.MessageEmbed()
                .setTitle("Erreur !")
                .setColor("RED")
                .setDescription("Veuillez indiquer un nombre entre 1 et 100.")

            if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(purgeEmbed)
            let count = args[1]
            if (!count) return message.channel.send(msgpEmbed)
            if (isNaN(count)) return message.channel.send(emsgpEmbed)
            if (count < 1 || count > 100) return message.channel.send(ucmsgpEmbed)
            message.channel.bulkDelete(parseInt(count) + 1)

        }

        if(message.content == prefix + "waifu") {

            let rep2 = ["https://i.pinimg.com/564x/bd/58/43/bd58437a5b9063163ac933208a121457.jpg", "https://i.pinimg.com/736x/94/c8/6f/94c86f751ab3a3eecc7e3e067df8ea65.jpg", "https://www.nautiljon.com/images/perso/00/18/hestia_11581.jpg", "https://www.nautiljon.com/images/perso/00/69/kamado_nezuko_18296.jpg", "https://ih1.redbubble.net/image.949753770.5888/flat,750x1000,075,f.jpg", "https://cdn.shopify.com/s/files/1/1616/0283/products/demon-slayer-nezuko-kamado_360x.jpg?v=1614144125", "https://cinephilstore.com/32583-medium_default/replique-arme-demon-slayer-shinobu-kocho-a58.jpg", "https://adala-news.fr/wp-content/uploads/2012/11/Chitanda-Eru.jpg", "https://i.skyrock.net/5073/87635073/pics/3270349434_1_36_Umo3xXwd.jpg", "https://adala-news.fr/wp-content/uploads/2012/11/Kuroyukihime.jpg", "https://image.noelshack.com/fichiers/2015/35/1440680512-tohka-yatogami-tohka-yatogami-date-a-live-34807042-500-473.png", "https://adala-news.fr/wp-content/uploads/2012/11/Takanashi-Rikka.jpg", "https://www.nipponconnection.fr/wp-content/uploads/2013/12/lucy.jpg", "https://p4.wallpaperbetter.com/wallpaper/508/64/944/girl-tears-art-vocaloid-wallpaper-preview.jpg", "https://static.wikia.nocookie.net/assassination-classroom/images/9/9a/FemNagisa.jpg/revision/latest?cb=20160830194552&path-prefix=fr", "https://static.wikia.nocookie.net/power-meme-battle/images/1/1c/Pico_Origine.png/revision/latest/top-crop/width/360/height/450?cb=20210118201648&path-prefix=fr", "https://resize-elle.ladmedia.fr/r/625,,forcex/crop/625,437,center-middle,forcex,ffffff/img/var/plain_site/storage/images/loisirs/livres/news/manga-et-animes-les-personnages-feminins-sont-ils-enfin-debarrasses-des-cliches-3933881/94997878-1-fre-FR/Manga-et-animes-les-personnages-feminins-sont-ils-enfin-debarrasses-des-cliches.jpg", "https://4.bp.blogspot.com/-6D6-ILKP_-0/WpwwaOjRIsI/AAAAAAAAA2A/J66BknlvsLwANuCtxyz-1BUBANMmAdpzACLcBGAs/s1600/4fbacf8d-35c0-450a-a4a7-ccde2da06f7a.jpg", "https://static.wikia.nocookie.net/drstone/images/5/53/Ruri_Anime.png/revision/latest/smart/width/250/height/250?cb=20201207120645&path-prefix=fr", "https://i.servimg.com/u/f74/18/10/51/89/suzumi10.jpg", "https://pm1.narvii.com/6106/82ea938d5cde5788059eec3680286a84cdfe939e_hq.jpg", "https://www.nautiljon.com/images/actualite/00/28/1512643152378_image.jpg", "https://top-manga.fr/wp-content/uploads/2021/04/edens-zero-anime-rebecca-620x420.jpg", "https://www.justfocus.fr/wp-content/uploads/2015/03/No-game-no-life-shiro.jpg", "https://picadilist.com/wp-content/uploads/images/mini/img_l_270/7rtfhww.png", "https://i.pinimg.com/originals/b3/b5/17/b3b5174755b32b9af82a28101b40d7b4.jpg", "https://www.nipponconnection.fr/wp-content/uploads/2013/12/lucy.jpg", "https://image.tmdb.org/t/p/original/lJYv3eVHRJ8zBH8BGg5J2z6DdrQ.jpg"];
            let reptaille2 = Math.floor ((Math.random() * rep2.length));
            let question = args.slice(0).join("");

            const waifuEmbed = new Discord.MessageEmbed()
                .setTitle("Waifu 💓")
                .setDescription(`**${message.author.username}**, voici ta waifu !`)
                .setImage(rep2[reptaille2])
                .setColor("RANDOM")
                .setTimestamp();
            message.channel.send(waifuEmbed);
            message.delete();
 
            message.channel.send(waifuEmbed).then(async message =>{

                await message.react("💓")

            });

        }

        if(message.content == prefix + "invite") {

            const inviteEmbed = new Discord.MessageEmbed()
                .setTitle("Invite notre bot sur votre serveur !")
                .setColor("RANDOM")
                .setDescription("Merci d'ajouter notre bot à votre serveur ! :heart:")
                .addField("Invitation du bot :", "https://discordapp.com/oauth2/authorize?client_id=860530757487689759&scope=bot&permissions=1073217023")
                .addField("Support :", "https://discord.gg/hufYtnw3GX")
                .setImage("https://i.pinimg.com/originals/70/84/ff/7084ff1403f0ef039734e42435a469e2.gif")
                .setFooter("Nezuko Trap")
                .setThumbnail("https://i.ibb.co/BVShHmy/b054cc0b859901ef45dbb3e856b7f9b39db3c63ar1-2048-1989v2-uhq-removebg-preview.png")
                .setTimestamp()

            message.channel.send(inviteEmbed);

        }



});

async function execute(message, serverQueue) {
    const args = message.content.split(" "); // On récupère les arguments dans le message pour la suite

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
    {
            return message.channel.send(alertEmbed);
    }
    const permissions = voiceChannel.permissionsFor(message.client.user); // On récupère les permissions du bot pour le salon vocal
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) { // Si le bot n'a pas les permissions
            return message.channel.send(
                "J'ai besoin des permissions pour rejoindre le salon et pour y jouer de la musique!"
            );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song     = {
            title: songInfo.videoDetails.title,
            url  : songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
            const queueConstruct = {
                    textChannel : message.channel,
                    voiceChannel: voiceChannel,
                    connection  : null,
                    songs       : [],
                    volume      : 1,
                    playing     : true,
            };

            // On ajoute la queue du serveur dans la queue globale:
            queue.set(message.guild.id, queueConstruct);
            // On y ajoute la musique
            queueConstruct.songs.push(song);

            try {
                    // On connecte le bot au salon vocal et on sauvegarde l'objet connection
                    var connection           = await voiceChannel.join();
                    queueConstruct.connection = connection;
                    // On lance la musique
                    play(message.guild, queueConstruct.songs[0]);
            }
            catch (err) {
                    //On affiche les messages d'erreur si le bot ne réussi pas à se connecter, on supprime également la queue de lecture
                    console.log(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(err);
            }
    }
    else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);

            const qmscEmbed = new Discord.MessageEmbed()
                .setTitle(`${song.title} a été ajouté à la queue !`)
                .setColor("GREEN")

            return message.channel.send(qmscEmbed);
    }

}

function skip(message, serverQueue) {
    if (!message.member.voice.channel) // on vérifie que l'utilisateur est bien dans un salon vocal pour skip
    {
            return message.channel.send(alertEmbed);
    }
    if (!serverQueue) // On vérifie si une musique est en cours
    {

            const amscEmbed = new Discord.MessageEmbed()
                .setTitle("Erreur !")
                .setColor("RED")
                .setDescription("Aucune lecture de musique en cours !")

            return message.channel.send(amscEmbed);
    }
    serverQueue.connection.dispatcher.end(); // On termine la musique courante, ce qui lance la suivante grâce à l'écoute d'événement
                                             // finish
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel) // on vérifie que l'utilisateur est bien dans un salon vocal pour skip
    {
            return message.channel.send(alertEmbed);
    }
    if (!serverQueue) // On vérifie si une musique est en cours
    {
            return message.channel.send(amscEmbed);
    }
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    console.log(song);
    const serverQueue = queue.get(guild.id); // On récupère la queue de lecture
    if (!song) { // Si la musique que l'utilisateur veux lancer n'existe pas on annule tout et on supprime la queue de lecture
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
    }
    // On lance la musique
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url, { filter: 'audioonly' }))
        .on("finish", () => { // On écoute l'événement de fin de musique
                serverQueue.songs.shift(); // On passe à la musique suivante quand la courante se termine
                play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolume(1); // On définie le volume

    const mscEmbed = new Discord.MessageEmbed()
        .setTitle(`Démarrage de la musique: ${song.title}`)
        .setColor("RANDOM")

    serverQueue.textChannel.send(mscEmbed);
}

client.login(config.token);