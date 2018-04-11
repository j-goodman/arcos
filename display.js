var canvas
var canvasHeight
var ctx
var cards = []
var opponentCards = []
var currentCards = []
var currentOpponentCards = []
var focusIndex = 5
var positions

onload = () => {
    //*//
    canvas = document.getElementById('canvas')
    canvas.style.transform = `translateY(${(window.innerHeight - canvas.getBoundingClientRect().height)/2}px)`

    positions.player.riverStart.y = canvas.height - 330
    positions.player.table.y = canvas.height / 2
    positions.opponent.riverStart.y = 30

    ctx = canvas.getContext('2d')
    cards = generateCards(drawCards.bind(null, canvas, ctx, cards), 'player')
    opponentCards = generateCards(drawCards.bind(null, canvas, ctx, opponentCards), 'opponent')
    initTouchControls()
    setTimeout(drawCards.bind(null, canvas, ctx, cards), 1000)
    currentCards = cards.map(card => { return card })
    currentOpponentCards = opponentCards.map(card => { return card })
}

positions = {
  player: {
    center: {
      x: 0,
      y: 0,
      z: 1,
      height: 1240,
      width: 940,
    },
    table: {
      x: 240,
      y: 0,
      z: 1,
      height: 640,
      width: 480,
    },
    offleft: {
      x: -1040,
      y: 0,
      z: 1,
      height: 1240,
      width: 940,
    },
    offright: {
      x: 1160,
      y: 0,
      z: 1,
      height: 1240,
      width: 940,
    },
    riverStart: {
      x: 0,
      y: 800,
      z: 1,
      height: 300,
      width: 216,
      fan: 152,
    }
  },
  opponent: {
    center: {
      x: 0,
      y: -2000,
      z: 1,
      height: 1240,
      width: 940,
    },
    offscreen: {
      x: 0,
      y: -1240,
      z: 1,
      height: 1240,
      width: 940,
    },
    table: {
      x: 240,
      y: 0,
      z: 1,
      height: 640,
      width: 480,
    },
    riverStart: {
      x: 0,
      y: 640,
      z: 1,
      height: 300,
      width: 216,
      fan: 152,
    }
  },
}

var Card = function (image, name) {
    this.image = new Image ()
    this.name = name
    this.imageLoaded = false
    this.image.onload = () => {
      this.imageLoaded = true
    }
    this.image.src = image
}

var clearCanvas = (canvas, ctx) => {
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  )
}

var drawCards = (canvas, ctx, cards) => {
    cards.map((card) => {
        ctx.drawImage(
            card.image,
            card.x,
            card.y,
            card.width,
            card.height,
        )
    })
}

var generateCards = (onCardLoad, holder) => {
    var aristocrat
    var deck = []
    var imageLoadTrigger
    //*//
    king = new Card ('./images/king.png', 'king')
    general = new Card ('./images/general.png', 'general')
    philosopher = new Card ('./images/philosopher.png', 'philosopher')
    falseProphet = new Card ('./images/false-prophet.png', 'false prophet')
    aristocrat = new Card ('./images/aristocrat.png', 'aristocrat')
    revolutionary = new Card ('./images/revolutionary.png', 'revolutionary')
    reverse = new Card ('./images/reverse.png', 'reverse')
    deck = [revolutionary, general, falseProphet, philosopher, aristocrat, king]
    deck.map((card, index) => {
        card.x = positions[holder].center.x
        card.y = positions[holder].center.y
        card.z = positions[holder].center.z
        card.height = positions[holder].center.height
        card.width = positions[holder].center.width
    })
    imageLoadTrigger = {
        loadCount: 0,
        finishedCount: deck.length,
        event: onCardLoad,
    }
    imageLoadTrigger.progress = function () {
        this.loadCount += 1
        if (this.loadCount == this.finishedCount) {
            this.event()
        }
    }.bind(imageLoadTrigger)
    deck.forEach((card) => {
        card.image.onload = imageLoadTrigger.progress
    })
    return deck
}

var moveTo = (card, x, y, width, height) => {
    var int
    var frame
    var totalFrames
    var xDistance
    var yDistance
    var widthDifference
    var heightDifference
    //*//
    width = width ? width : card.width
    height = height ? height : card.height
    frame = 0
    totalFrames = 8
    xDistance = Math.abs(card.x - x)
    yDistance = Math.abs(card.y - y)
    widthDifference = Math.abs(card.width - width)
    heightDifference = Math.abs(card.height - height)
    int = window.setInterval(() => {
        frame += 1
        card.x += (xDistance / totalFrames) * (card.x < x ? 1 : -1)
        card.y += (yDistance / totalFrames) * (card.y < y ? 1 : -1)
        card.width += (widthDifference / totalFrames) * (card.width > x ? 1 : -1)
        card.height += (heightDifference / totalFrames) * (card.height > y ? 1 : -1)
        if (frame >= totalFrames) {
          window.clearInterval(int)
          card.width = width
          card.height = height
        }
        clearCanvas(canvas, ctx)
        drawCards(canvas, ctx, currentCards)
        drawCards(canvas, ctx, currentOpponentCards)
    }, 32)
}

var updateDeckDisplay = () => {
    cards.forEach((card, index) => {
        if (index < focusIndex) {
          moveTo(card, positions.player.offleft.x, positions.player.offleft.y, positions.player.offleft.width, positions.player.offleft.height)
        } else if (index > focusIndex) {
          moveTo(card, positions.player.offright.x, positions.player.offright.y, positions.player.offright.width, positions.player.offright.height)
        } else {
          moveTo(card, positions.player.center.x, positions.player.center.y, positions.player.center.width, positions.player.center.height)
        }
    })
}

var zoomOut = () => {
    let pos = positions.player.riverStart
    cards.forEach((card, index) => {
        moveTo(card, pos.x + (index * pos.fan), pos.y, pos.width, pos.height)
    })
    pos = positions.opponent.riverStart
    opponentCards.forEach((card, index) => {
        moveTo(card, pos.x + (index * pos.fan), pos.y, pos.width, pos.height)
    })
}

var zoomIn = () => {
    let pos = positions.player.center
    cards.forEach((card, index) => {
        moveTo(card, pos.x, pos.y, pos.width, pos.height)
    })
    pos = positions.opponent.center
    opponentCards.forEach((card, index) => {
        moveTo(card, pos.x, pos.y, pos.width, pos.height)
    })
}

window.swipeLeft = () => {
    focusIndex += focusIndex < cards.length - 1 ? 1 : 0
    updateDeckDisplay()
}

window.swipeRight = () => {
    focusIndex -= focusIndex > 0 ? 1 : 0
    updateDeckDisplay()
}

window.swipeUp = () => {
    setTimeout(() => {
        play(cards[focusIndex].name)

        let playerPlay = cards.filter(card => {
            return card.name === playerChoice
        })[0]
        let opponentPlay = opponentCards.filter(card => {
            return card.name === opponentChoice
        })[0]
        opponentCards = opponentCards.filter(card => {
            return card !== opponentPlay
        }).concat([opponentPlay])
        cards = cards.filter(card => {
            return card !== playerPlay
        }).concat([playerPlay])
        currentOpponentCards = opponentCards.map(card => { return card })
        currentCards = cards.map(card => { return card })

        setTimeout(() => {
            currentOpponentCards = opponentCards.filter(card => {
              return opponent.hand.cards.includes(card.name)
            })
            currentCards = cards.filter(card => {
              return player.hand.cards.includes(card.name)
            })
            zoomOut()
            setTimeout(() => {
                zoomIn()
            }, 500)
        }, 2000)

        moveTo(playerPlay, positions.player.table.x, positions.player.table.y, positions.player.table.width, positions.player.table.height)
        moveTo(opponentPlay, positions.opponent.table.x, positions.opponent.table.y, positions.opponent.table.width, positions.opponent.table.height)
    }, 300)
    zoomOut()
}

window.swipeDown = () => {
    updateDeckDisplay()
}
