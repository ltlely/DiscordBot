// Load environment variables from .env file
require("dotenv").config();

// Import necessary packages
const axios = require('axios');
const { Client, GatewayIntentBits } = require("discord.js");

// Print out Discord bot token for debugging purposes
console.log(process.env.discord_token);

// Initial configuration for Axios to perform HTTP requests to RapidAPI
const options = {
    method: 'GET',
    url: 'https://indeed12.p.rapidapi.com/jobs/search',
    headers: {
        'X-RapidAPI-Key': process.env.indeed_token,
        'X-RapidAPI-Host': 'indeed12.p.rapidapi.com'
    }
};

// Create a new Discord Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// When the bot is ready, print out a message to the console
client.once("ready", () => {
    console.log("Bot Ready...");
});

// Listen to the "messageCreate" event, which triggers every time a new message is received
client.on("messageCreate", async message => {
    console.log(message);
    let content = message.content.split(", ");

    // Handle '!help' command
    if(message.content === "!help") {
        message.channel.send("Type !jobs (position) (city) EX: !jobs, software engineer intern, seattle");
        return;
    }

    // Check if the first part of the message is '!jobs'
    if (content[0] === "!jobs") {
        // Verify if the correct number of arguments are provided
        if(content.length !== 3) {
            message.channel.send("Invalid command. Type !jobs (position) (city) EX: !jobs, software engineer intern, seattle");
            return;
        }

        try {
            // Setup parameters for the HTTP request
            options.params = {
                query: content[1],
                location: content[2],
                page_id: '2',
                locality: 'us',
                fromage: '3'
            };

            // Make the HTTP request to RapidAPI
            const response = await axios.request(options);

            let reply = ""; 

            // Iterate over each job in the response
            response.data.hits.forEach((job, index) => {
                const position = encodeURIComponent(content[1]);
                const location = encodeURIComponent(content[2]);
                const jobSearchURL = `https://www.indeed.com/q-${position}-l-${location}-jobs.html`;
                const jobListing = `Job ${index + 1}: **${job.title}** at ${job.company_name}\n${jobSearchURL}\n\n`;
                reply += jobListing;
            });

            // Check if there are any job listings to reply with
            if (reply) {
                message.channel.send(reply);
            } else {
                message.channel.send('No jobs found for the given criteria.');
            }

        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred. Please try again.');
        }
    }
});

// Login to the Discord bot
client.login(process.env.discord_token);
