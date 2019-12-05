window.addEventListener('load', () => {
    retrieveArray('opponent-card').map(card => {
        card.src = 'images/reverse.png'
    })
    let playerCards = retrieve('player-cards')
    playerCards.innerHTML = ''
    player.hand.cards.map(name => {
        let card = document.createElement('img')
        card.className = `${name}-card active-card card`
        card.src = `images/${name}.png`
        playerCards.appendChild(card)
    })
    setupCardEvents()
})

let setupCardEvents = () => {
    cardNames.map(name => {
        let card = retrieve(`${name}-card`)
        if (card && card.className.includes('active-card')) {
            card.src = `images/${name}.png`
            card.name = name
            card.addEventListener('click', chooseCard)
            card.addEventListener('mouseenter', () => {
                softDeclare(fullTitles[name])
            })
        }
    })
}

let retrieve = className => {
    return document.getElementsByClassName(className)[0]
}

let retrieveArray = className => {
    return Array.from(document.getElementsByClassName(className))
}

let fieldLocked = false

let chooseCard = evt => {
    if (fieldLocked) {
        return false
    }
    fieldLocked = true
    let data = player.play(evt.target.name)
    let win = data[0]
    let playerCard = data[1]
    let opponentCard = data[2]

    retrieve('player-card-slot').src = `images/${playerCard}.png`
    retrieve('opponent-card-slot').src = `images/reverse-reverse.png`

    setTimeout(() => {
        retrieve('opponent-card-slot').classList.remove('flipped')
    }, 400)

    setTimeout(() => {
        retrieve('opponent-card-slot').src = `images/${opponentCard}.png`
        declare(interactionDescriptions[playerCard][opponentCard] || interactionDescriptions[opponentCard][playerCard])
    }, 500)

    setTimeout(() => {
        if (win === 'draw') {
            let pair = [retrieve('opponent-card-slot'), retrieve('player-card-slot')]
            pair.map(card => {
                card.style.backgroundImage = `url(${card.src})`
                card.src = 'images/hold.png'
            })
            return false
        }
        let loser = win ? retrieve('opponent-card-slot') : retrieve('player-card-slot')
        loser.style.backgroundImage = `url(${loser.src})`
        loser.style.opacity = .6
        loser.src = 'images/red-x.png'
    }, 1100 * timescale)

    setTimeout(resetField, 1750 * timescale)
}

let resetField = () => {
    let slots = [retrieve('player-card-slot'), retrieve('opponent-card-slot')]
    fieldLocked = false
    slots.map(slot => {
        slot.src = 'images/blank.png'
        slot.style.backgroundImage = ''
        slot.style.opacity = 1
    })
    slots[1].classList.add('flipped')
    slots[1].src = 'images/reverse-blank.png'
    let opponentCards = retrieve('opponent-cards')
    opponentCards.innerHTML = ''
    opponent.hand.cards.map(name => {
        let card = document.createElement('img')
        card.className = 'opponent-card card'
        card.src = 'images/reverse.png'
        opponentCards.appendChild(card)
    })
    opponent.hand.holding.map(name => {
        let card = document.createElement('img')
        card.className = 'card'
        card.style.backgroundImage = `url(images/${name}.png)`
        card.src = 'images/hold.png'
        opponentCards.appendChild(card)
    })
    opponent.hand.discarded.reverse().map(name => {
        let card = document.createElement('img')
        card.className = 'opponent-card card'
        card.style.backgroundImage = `url(images/${name}.png)`
        card.style.opacity = .6
        card.src = 'images/red-x.png'
        opponentCards.appendChild(card)
    })

    let playerCards = retrieve('player-cards')
    playerCards.innerHTML = ''
    player.hand.cards.map(name => {
        let card = document.createElement('img')
        card.className = `${name}-card active-card card`
        card.src = `images/${name}.png`
        playerCards.appendChild(card)
    })
    player.hand.holding.map(name => {
        let card = document.createElement('img')
        card.className = 'card'
        card.style.backgroundImage = `url(images/${name}.png)`
        card.src = 'images/hold.png'
        playerCards.appendChild(card)
    })
    player.hand.discarded.reverse().map(name => {
        let card = document.createElement('img')
        card.className = 'card'
        card.style.backgroundImage = `url(images/${name}.png)`
        card.style.opacity = .6
        card.src = 'images/red-x.png'
        playerCards.appendChild(card)
    })

    setupCardEvents()

    timescale = Math.floor(timescale * 100 * .85) / 100
    timescale = timescale <= 1 ? 1 : timescale
}

let declareLock = false
let declareLockTimer = null

let declare = (message, time=2000) => {
    declareLock = true
    retrieve('card-info-bar').innerText = message
    clearInterval(declareLockTimer)
    declareLockTimer = setTimeout(() => {
        declareLock = false
    }, time)
}

let softDeclare = message => {
    if (!declareLock) {
        retrieve('card-info-bar').innerText = message
    }
}

let cardNames = [
    'king',
    'aristocrat',
    'general',
    'philosopher',
    'false-prophet',
    'revolutionary'
]
let fullTitles = {
    'king': 'The King',
    'aristocrat': 'The Aristocrat',
    'general': 'The General',
    'philosopher': 'The Philosopher',
    'false-prophet': 'The False Prophet',
    'revolutionary': 'The Revolutionary'
}

let interactionDescriptions = {
    // Object to store which cards win against which cards.
    'king': {
        'king': 'DRAW',
        'general': 'The KING executes the GENERAL.',
        'philosopher': 'The KING executes the PHILOSOPHER.',
        'false-prophet': 'The KING executes the FALSE PROPHET.',
        'aristocrat': 'The KING executes the ARISTOCRAT.',
        'revolutionary': false
    },
    'general': {
        'king': false,
        'general': 'DRAW',
        'philosopher': false,
        'false-prophet': 'The GENERAL has the FALSE PROPHET shot.',
        'aristocrat': false,
        'revolutionary': 'The GENERAL has the REVOLUTIONARY shot.'
    },
    'philosopher': {
        'king': false,
        'general': 'The PHILOSOPHER outlives the GENERAL.',
        'philosopher': 'DRAW',
        'false-prophet': 'The PHILOSOPHER exposes the FALSE PROPHET.',
        'aristocrat': false,
        'revolutionary': 'The PHILOSOPHER hijacks the REVOLUTIONARY.'
    },
    'false-prophet': {
        'king': false,
        'general': false,
        'philosopher': false,
        'false-prophet': 'DRAW',
        'aristocrat': 'The FALSE PROPHET fools the ARISTOCRAT.',
        'revolutionary': 'The FALSE PROPHET fools the REVOLUTIONARY.'
    },
    'aristocrat': {
        'king': false,
        'general': 'The ARISTOCRAT buys the GENERAL.',
        'philosopher': 'The ARISTOCRAT buys the PHILOSOPHER.',
        'false-prophet': false,
        'aristocrat': 'DRAW',
        'revolutionary': false
    },
    'revolutionary': {
        'king': 'The REVOLUTIONARY murders the KING.',
        'general': false,
        'philosopher': false,
        'false-prophet': false,
        'aristocrat': 'The REVOLUTIONARY murders the ARISTOCRAT.',
        'revolutionary': 'DRAW'
    },
}
