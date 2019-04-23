const dotenv = require("dotenv").config();
const Spotify = require('node-spotify-api');
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);
const inquirer = require('inquirer');
const axios = require("axios");

console.log("Welcome to LIRI, how can I help you?\n")
inquirer.prompt([
    {
        type: "list",
        message: "What would you like to do?",
        choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
        name: "command"
    },
    {
        type: "input",
        message: "What would you like to search?",
        name: "choice"
    }
]).then(res => {
    switch (res.command) {
        case 'concert-this':
            concertThis(res.choice);
            break;
        case 'spotify-this-song':
            spotifyThis(res.choice);
            break;
        case 'movie-this':
            if (res.choice === "") {
                res.choice = "Mr. Nobody";
            }
            movieThis(res.choice);
            break;
        case 'do-what-it-says':
            doWhatItSays(res.choice);
            break;
        default: return;
    }
});

const concertThis = choice => {
    // const choiceArray = choice.split(" ");
    // const choiceString = choiceArray.join('+');
    const queryUrl = "https://rest.bandsintown.com/artists/" + choice + "/events?app_id=codingbootcamp";

    axios.get(queryUrl)
        .then(function (response) {
          const data = response.data;
          data.forEach(ele => {
              console.log("Venue Name: " + ele.venue.name);
              console.log("Venue Location: " + ele.venue.city + ", " + ele.venue.region + ", " + ele.venue.country);
              console.log("Date: " + ele.datetime +"\n");
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

const spotifyThis = choice => {

};

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

const doWhatItSays = choice => {

};