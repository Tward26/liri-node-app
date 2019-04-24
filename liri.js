//node.js required packages
const dotenv = require("dotenv").config();
const Spotify = require('node-spotify-api');
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);
const inquirer = require('inquirer');
const axios = require("axios");
const moment = require('moment');
const fs = require("fs");

//to do still - spotify, do whatit says, append files to log

//Main App functionality using inquirer
console.log("Welcome to LIRI, how can I help you?\n")
inquirer.prompt([
    {
        type: "list",
        message: "What would you like to do?",
        choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
        name: "command"
    }
]).then(res => {
    switch (res.command) {
        case 'concert-this':
            inquirer.prompt([
                {
                    type: "input",
                    message: "What band would you like to find concerts for?",
                    name: "choice"
                }]).then(res => {
                    if (res.choice === "") {
                        res.choice = "baroness";
                    }
                    concertThis(res.choice);
                    fs.appendFileSync('./log.txt', `\n\nconcertThis(${res.choice})`);
                });
            break;
        case 'spotify-this-song':
            inquirer.prompt([
                {
                    type: "input",
                    message: "What song would you like to look up?",
                    name: "choice"
                }]).then(res => {
                    if (res.choice === "") {
                        res.choice = "The Sign Ace of Base"
                    }
                    spotifyThis(res.choice);
                    fs.appendFileSync('./log.txt', `\n\nspotifyThis(${res.choice})`);
                });
            break;
        case 'movie-this':
            inquirer.prompt([
                {
                    type: "input",
                    message: "What movie would you like more information about?",
                    name: "choice"
                }]).then(res => {
                    if (res.choice === "") {
                        res.choice = "Mr. Nobody";
                    }
                    movieThis(res.choice);
                    fs.appendFileSync('./log.txt', `\n\nmovieThis(${res.choice})`);
                });
            break;
        case 'do-what-it-says':
            fs.readFile("./random.txt", "utf8", function (error, data) {
                if (error) {
                    return console.log(error);
                }
                const dataArray = data.split(",");
                switch (dataArray[0]) {
                    case 'spotifyThis':
                        spotifyThis(dataArray[1]);
                        fs.appendFileSync('./log.txt', `\n\nspotifyThis(${dataArray[1]})`);
                        break;
                    case 'movieThis':
                        movieThis(dataArray[1]);
                        fs.appendFileSync('./log.txt', `\n\nmovieThis(${dataArray[1]})`);
                        break;
                    case 'concertThis':
                        concertThis(dataArray[1]);
                        fs.appendFileSync('./log.txt', `\n\nconcertThis(${dataArray[1]})`);
                        break;
                }
            });
            break;
        default: return;
    }
});

//Bands in town axios call

const concertThis = choice => {
    const choiceArray = choice.split(" ");
    const choiceString = choiceArray.join('+');
    const queryUrl = "https://rest.bandsintown.com/artists/" + choiceString + "/events?app_id=codingbootcamp";
    axios.get(queryUrl)
        .then(function (response) {
            const data = response.data;
            data.forEach(ele => {
                console.log("\nVenue Name: " + ele.venue.name);
                console.log("Venue Location: " + ele.venue.city + ", " + ele.venue.region + ", " + ele.venue.country);
                const momentDate = moment(ele.datetime);
                console.log("Date: " + momentDate.format("MM/DD/YYYY h:mm A"));
                const text = `\n\nVenue Name: ${ele.venue.name}\nVenue Location: ${ele.venue.city}, ${ele.venue.region}, ${ele.venue.country}\nDate: ${momentDate.format("MM/DD/YYYY h:mm A")}`;
                fs.appendFileSync('./log.txt', text);
            });
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });

};

//Spotify axios call

const spotifyThis = choice => {
    spotify
        .search({ type: 'track', query: choice, limit: 5 })
        .then(function (response) {
            for (let i = 0; i < response.tracks.items.length; i++) {
                console.log("\nArtist: " + response.tracks.items[i].artists[0].name);
                console.log("Song Title: " + response.tracks.items[i].name);
                console.log("Song Preview URL: " + response.tracks.items[i].preview_url);
                console.log("Album Title: " + response.tracks.items[i].album.name);
                const text = `\n\nArtist: ${response.tracks.items[i].artists[0].name}\nSong Title: ${response.tracks.items[i].name}\nSong Preview URL: ${response.tracks.items[i].preview_url}\nAlbum title: ${response.tracks.items[i].album.name}`;
                fs.appendFileSync('./log.txt', text);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
};

//OMDB axios call

const movieThis = choice => {
    const choiceArray = choice.split(" ");
    const choiceString = choiceArray.join('+');
    const queryUrl = "http://www.omdbapi.com/?t=" + choiceString + "&plot=short&apikey=bd06e9f3";

    axios.get(queryUrl)
        .then(function (response) {
            console.log("\nTitle: " + response.data.Title);
            console.log("Year Released: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Production Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot Summary: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            const text = `\n\nTitle: ${response.data.Title}\nYear Released: ${response.data.Year}\nIMDB Rating: ${response.data.imdbRating}\nRotten Tomatoes Rating: ${response.data.Ratings[1].Value}\nProduction Country: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot Summary: ${response.data.Plot}\nActors: ${response.data.Actors}`;
            fs.appendFileSync('./log.txt', text);

        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });

};