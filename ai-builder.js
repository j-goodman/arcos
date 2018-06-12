let instantiateNewBot = (chooseMethod=alphaMethods.chooseCard) => {
    let bot = {}
    bot.hand = new Hand ()
    bot.mem = {}
    bot.chooseCard = chooseMethod
    bot.memKey = opponent.memKey
    bot.rememberMove = opponent.rememberMove
    return bot
}

let alphaMethods = {}
alphaMethods.chooseCard = (player, opponent) => {
    var best = false
    choices = []
    var i
    var memKey = player.memKey([player.hand.cards, opponent.hand.cards])
    if (!player.mem[memKey]) { // If it's never seen this gamestate before
        // Filter out cards that can only possibly lose
        choices = player.hand.cards.filter((card) => {
            return opponent.hand.cards.filter((opponentCard) => {
                return wins[card][opponentCard]
            }).length > 0
        })
        if (choices.length === 0) { choices = player.hand.cards }
    } else {
        for (i=0 ; i<player.hand.cards.length ; i++) {
            let cardScore = player.mem[memKey][player.hand.cards[i][0]]
            if (best === false) {
                best = cardScore
            } else if (best < cardScore) {
                best = cardScore
            }
        }
        for (i=0 ; i<player.hand.cards.length ; i++) {
            cardScore = player.mem[memKey][player.hand.cards[i][0]]
            if (cardScore === best) {
                choices.push(player.hand.cards[i])
            }
        }
    }
    let choice = choices[Math.floor(Math.random() * choices.length)]
    // console.log(`${player.name || 'Unnamed'} choosing from...`, player.mem[memKey])
    // console.log(choice)
    return choice
}

let bravoMethods = {}
bravoMethods.chooseCard = (player, opponent) => {
    return player.hand.cards[Math.floor(Math.random() * player.hand.cards.length)]
}

let charlieMethods = {}
charlieMethods.chooseCard = (player, opponent) => {
    let charlie = player
    let map = {
        'aristocrat': 0,
        'false-prophet': 0,
        'general': 0,
        'king': 0,
        'philosopher': 0,
        'revolutionary': 0,
    }
    charlie.hand.cards.map(card => {
        opponent.hand.cards.map(opponentCard => {
            if (wins[card][opponentCard]) {
                map[card] += 1
            } else if (wins[card][opponentCard] === false) {
                map[card] -= 1
            }
        })
    })
    let best = Infinity * -1
    let choice = null
    charlie.hand.cards.map(card => {
        if (map[card] > best) {
            best = map[card]
            choice = card
        }
    })
    charlie.hand.cards = charlie.hand.cards.reverse()
    return choice
}

let playGames = (firstPlayer, secondPlayer, numberOfGames) => {
    let count = 0
    while (count < numberOfGames) {
        count += 1
        playGame(firstPlayer, secondPlayer)
    }
    return 'Finished.'
}

let playGame = (firstPlayer, secondPlayer) => {
    let escape = 100
    while (firstPlayer.hand.cards.length > 0 && secondPlayer.hand.cards.length > 0 && escape > 0) {
        playRound(firstPlayer, secondPlayer)
        escape -= 1
    }
    // console.log('Resetting game...');
    firstPlayer.hand = new Hand ()
    secondPlayer.hand = new Hand ()
    if (escape <= 0) {
        firstPlayer.mem['afgkpr-afgkpr'][['a', 'f', 'g', 'k', 'p', 'r'][Math.floor(Math.random() * 6)]] += 1
        secondPlayer.mem['afgkpr-afgkpr'][['a', 'f', 'g', 'k', 'p', 'r'][Math.floor(Math.random() * 6)]] += 1
        return 'DRAW'
    }
    return firstPlayer.hand.cards > 0 ? firstPlayer : secondPlayer
}

let playRound = function (player, opponent) {
    var gameOver;
    var card = player.chooseCard(player, opponent)
    var tuple = playHand(player, opponent, card);
    var playerWins = tuple[1];
    var reply = tuple[0];

    playerChoice = card;

    if (playerWins === 'draw') {
        player.hand.hold(card);
        opponent.hand.hold(reply);
        // console.log('DRAW')
    } else {
        opponent.hand.restore();
        player.hand.restore();
        if (playerWins) {
            opponent.hand.discard(reply);
        } else {
            player.hand.discard(card);
        }
    }
    // console.log(player.name || 'First Player:', player.hand.cards);
    // console.log(opponent.name || 'Second Player:', opponent.hand.cards);
    gameOver = gameIsOver(player, opponent);
    if (gameOver) {
        // console.log(gameOver);
    }
    // window.localStorage.setItem('arcos-opponent-memory', JSON.stringify(opponent.mem));
    return [playerWins, card, reply];
};

let playHand = function (player, opponent, attack) {
    if (!player.hand.cards.includes(attack)) { return '!' }
    var defense = opponent.chooseCard(opponent, player);
    opponent.rememberMove([opponent.hand.cards, player.hand.cards], defense, attack, wins[defense][attack]);
    player.rememberMove([player.hand.cards, opponent.hand.cards], attack, defense, wins[attack][defense]);
    // console.log(attack, defense);
    return [defense, wins[attack][defense]];
}

let gameIsOver = function (player, opponent) {
  var win = false;
  if (player.hand.cards.length === 0 && opponent.hand.cards.length > 0) {
    win = 'COMPUTER WINS';
  } else if (opponent.hand.cards.length === 0 && player.hand.cards.length > 0) {
    win = 'YOU WIN';
  } else if (player.hand.cards.length === 0 && opponent.hand.cards.length === 0) {
    player.hand.restore();
    opponent.hand.restore();
  }
  return win;
};

let alpha = instantiateNewBot(alphaMethods.chooseCard)
let alphaPrime = instantiateNewBot(alphaMethods.chooseCard)
let bravo = instantiateNewBot(bravoMethods.chooseCard)
let charlie = instantiateNewBot(charlieMethods.chooseCard)

playGames(alpha, charlie, 200)
playGames(alpha, bravo, 100)
playGames(alphaPrime, charlie, 100)
playGames(alpha, alphaPrime, 3200)
playGames(alpha, bravo, 3)
playGames(alpha, charlie, 2)

if (Object.keys(opponent.mem).length < 2500) {
    opponent.mem = alpha.mem
}
