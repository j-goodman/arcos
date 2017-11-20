var opponent = {};
var player = {};

var wins = {
    // Object to store which cards win against which cards.
    'king': {
        'general': true,
        'philosopher': true,
        'false prophet': true,
        'aristocrat': true,
        'revolutionary': false
    },
    'general': {
        'king': false,
        'philosopher': false,
        'false prophet': true,
        'aristocrat': false,
        'revolutionary': true
    },
    'philosopher': {
        'king': false,
        'general': true,
        'false prophet': true,
        'aristocrat': false,
        'revolutionary': true
    },
    'false prophet': {
        'king': false,
        'general': false,
        'philosopher': false,
        'aristocrat': true,
        'revolutionary': true
    },
    'aristocrat': {
        'king': false,
        'general': true,
        'philosopher': true,
        'false prophet': false,
        'revolutionary': false
    },
    'revolutionary': {
        'king': true,
        'general': false,
        'philosopher': false,
        'false prophet': false,
        'aristocrat': true
    },
}

var Hand = function () {
    this.cards = ['king', 'general', 'philosopher', 'false prophet', 'aristocrat', 'revolutionary'];
    this.discarded = []; // Cards that have been killed and removed from play.
    this.holding = []; // Cards that are temporarily unusable while a tie is resolved.
}

Hand.prototype.discard = function (card) {
    var index = this.cards.indexOf(card)
    if (index > -1) {
        this.discarded.push(this.cards.splice(index, 1));
        return true;
    }
}

Hand.prototype.hold = function (card) {
    var index = this.cards.indexOf(card)
    if (index > -1) {
        this.holding.push(this.cards.splice(index, 1)[0]);
        return true;
    }
}

Hand.prototype.restore = function () {
    if (this.holding.length) {
        this.cards = this.cards.concat(this.holding);
        this.holding = [];
        return true;
    }
}

player.playHand = function (attack) {
    if (!this.hand.cards.includes(attack)) { return '!' }
    var defense = opponent.chooseCard();
    console.log(attack, defense);
    if (attack === defense) { return [defense, 'draw']; }
    return [defense, wins[attack][defense]];
}

player.play = function (card) {
    var tuple = this.playHand(card);
    var playerWins = tuple[1];
    var reply = tuple[0];
    if (playerWins === 'draw') {
        player.hand.hold(card);
        opponent.hand.hold(reply);
    } else {
        opponent.hand.restore();
        player.hand.restore();
        if (playerWins) {
            opponent.hand.discard(reply);
        } else {
            player.hand.discard(card);
        }
    }
    return playerWins;
}

opponent.chooseCard = function () {
    var choice = this.hand.cards[Math.floor(Math.random() * this.hand.cards.length)];
    return choice;
}

opponent.hand = new Hand ();
player.hand = new Hand ();
