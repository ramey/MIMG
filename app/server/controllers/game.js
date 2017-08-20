const apiURL = require('./../../../config/api.json').apiURL;
const numQuestions = require('./../../../config/game.json').numQuestions;

const game = (req, res) => {
    res.render('game', {title: 'Game'});
};



module.exports = {
    game
}