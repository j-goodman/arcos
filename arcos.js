var opponent = {};
var player = {};

var wins = {
    // Object to store which cards win against which cards.
    'king': {
        'king': 'draw',
        'general': true,
        'philosopher': true,
        'false prophet': true,
        'aristocrat': true,
        'revolutionary': false
    },
    'general': {
        'king': false,
        'general': 'draw',
        'philosopher': false,
        'false prophet': true,
        'aristocrat': false,
        'revolutionary': true
    },
    'philosopher': {
        'king': false,
        'general': true,
        'philosopher': 'draw',
        'false prophet': true,
        'aristocrat': false,
        'revolutionary': true
    },
    'false prophet': {
        'king': false,
        'general': false,
        'philosopher': false,
        'false prophet': 'draw',
        'aristocrat': true,
        'revolutionary': true
    },
    'aristocrat': {
        'king': false,
        'general': true,
        'philosopher': true,
        'false prophet': false,
        'aristocrat': 'draw',
        'revolutionary': false
    },
    'revolutionary': {
        'king': true,
        'general': false,
        'philosopher': false,
        'false prophet': false,
        'aristocrat': true,
        'revolutionary': 'draw'
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
        this.discarded.push(this.cards.splice(index, 1)[0]);
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
    opponent.rememberMove([opponent.hand.cards, player.hand.cards], defense, attack, wins[defense][attack]);
    console.log(attack, defense);
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
    console.log('Player:', player.hand.cards);
    console.log('Opponent:', opponent.hand.cards);
    return playerWins;
}

opponent.chooseCard = function () {
    var best = false;
    choices = [];
    var i;
    var memKey = this.memKey([this.hand.cards, player.hand.cards]);
    if (!this.mem[memKey]) { // If it's never seen this gamestate before
        // Filter out cards that can only possibly lose
        choices = this.hand.cards.filter((card) => {
            return player.hand.cards.filter((playerCard) => {
                return wins[card][playerCard];
            }).length > 0;
        });
        if (choices.length === 0) { choices = this.hand.cards; }
    } else {
        var cardScore;
        for (i=0 ; i<this.hand.cards.length ; i++) {
            cardScore = this.mem[memKey][this.hand.cards[i][0]];
            if (best === false) {
                best = cardScore;
            } else if (best < cardScore) {
                best = cardScore;
            }
        }
        for (i=0 ; i<this.hand.cards.length ; i++) {
            cardScore = this.mem[memKey][this.hand.cards[i][0]];
            if (cardScore === best) {
                choices.push(this.hand.cards[i]);
            }
        }
        console.log('*', choices.length, '*');
    }
    var choice = choices[Math.floor(Math.random() * choices.length)];
    return choice;
}

if (window.localStorage.getItem('arcos-opponent-memory')) {
    opponent.mem = JSON.parse(window.localStorage.getItem('arcos-opponent-memory'));
} else {
    opponent.mem = {};
}

opponent.memKey = function (state /* state = [ownHand, playerHand] */) {
    var memKey;
    var contracted = [[],[]];
    state[0].sort().map((card) => {contracted[0].push(card[0]);});
    state[1].sort().map((card) => {contracted[1].push(card[0]);});
    memKey = contracted[0].join('') + '-' + contracted[1].join('');
    return memKey;
}

opponent.rememberMove = function (state, move, enemyMove, success) {
    var memKey = this.memKey(state);
    if (!this.mem[memKey]) {
        this.mem[memKey] = {
            'k': 0,
            'g': 0,
            'p': 0,
            'f': 0,
            'a': 0,
            'r': 0,
        };
    }
    this.mem[memKey][move[0]] += success ? 0 : -1;
    state[0].map((card) => {  // Consider what the outcomes of other available moves would have been
        success = wins[card][enemyMove];
        if (success !== 'draw') {
            this.mem[memKey][card[0]] += success ? 1 : -1;
        }
    });
};

var reset = function () {
    clear();
    window.localStorage.setItem('arcos-opponent-memory', JSON.stringify(opponent.mem));
    opponent.hand = new Hand ();
    player.hand = new Hand ();
};

opponent.hand = new Hand ();
player.hand = new Hand ();
var play = player.play.bind(player);

console.log('Use the \'play\' function to play one of your cards, as in \'play(\'king\')\' or \'play(\'revolutionary\')\'');
