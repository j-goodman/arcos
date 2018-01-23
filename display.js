var canvas;
var ctx;
var cards = [];
var focusIndex = 5;
var positions;

onload = () => {
    //*//
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    cards = generateCards(drawCards.bind(null, canvas, ctx, cards));
    initTouchControls();
};

positions = {
    center: {
      x: 0,
      y: 0,
      z: 1,
      height: 620,
      width: 470,
    },
    offleft: {
      x: -520,
      y: 0,
      z: 1,
      height: 620,
      width: 470,
    },
    offright: {
      x: 580,
      y: 0,
      z: 1,
      height: 620,
      width: 470,
    },
    offtop: {
      x: 0,
      y: -560,
      z: 1,
      height: 620,
      width: 470,
    },
    offbottom: {
      x: 0,
      y: 560,
      z: 1,
      height: 620,
      width: 470,
    },
}

var Card = function (image, name) {
    this.image = new Image ();
    this.name = name;
    this.imageLoaded = false;
    this.image.onload = () => {
      this.imageLoaded = true;
    }
    this.image.src = image;
};

var drawCards = (canvas, ctx) => {
    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
    cards.map((card) => {
        ctx.drawImage(
            card.image,
            card.x,
            card.y,
            card.width,
            card.height,
        );
    });
}

var generateCards = (onCardLoad) => {
    var aristocrat;
    var deck = [];
    var imageLoadTrigger;
    //*//
    king = new Card ('./images/king.png', 'king');
    general = new Card ('./images/general.png', 'general');
    philosopher = new Card ('./images/philosopher.png', 'philosopher');
    falseProphet = new Card ('./images/false-prophet.png', 'false prophet');
    aristocrat = new Card ('./images/aristocrat.png', 'aristocrat');
    revolutionary = new Card ('./images/revolutionary.png', 'revolutionary');
    reverse = new Card ('./images/reverse.png', 'reverse');
    deck = [revolutionary, general, falseProphet, philosopher, aristocrat, king];
    deck.map((card, index) => {
        card.x = positions.center.x;
        card.y = positions.center.y;
        card.z = positions.center.z;
        card.height = positions.center.height;
        card.width = positions.center.width;
    });
    imageLoadTrigger = {
      loadCount: 0,
      finishedCount: deck.length,
      event: onCardLoad,
    };
    imageLoadTrigger.progress = function () {
      this.loadCount += 1;
      if (this.loadCount == this.finishedCount) {
        this.event();
      }
    }.bind(imageLoadTrigger);
    deck.forEach((card) => {
      card.image.onload = imageLoadTrigger.progress;
    });
    return deck;
};

var moveTo = (card, x, y) => {
    var int;
    var frame;
    var totalFrames;
    var xDistance;
    var yDistance;
    //*//
    frame = 0;
    totalFrames = 8;
    xDistance = Math.abs(card.x - x);
    yDistance = Math.abs(card.y - y);
    int = window.setInterval(() => {
      frame += 1;
      if (frame >= totalFrames) {
        window.clearInterval(int);
      }
      card.x += (xDistance / totalFrames) * (card.x < x ? 1 : -1);
      card.y += (yDistance / totalFrames) * (card.y < y ? 1 : -1);
      drawCards(canvas, ctx, cards);
    }, 32);
}

var updateDeckDisplay = () => {
    cards.forEach((card, index) => {
        if (index < focusIndex) {
          moveTo(card, positions.offleft.x, positions.offleft.y);
        } else if (index > focusIndex) {
          moveTo(card, positions.offright.x, positions.offright.y);
        } else {
          moveTo(card, positions.center.x, positions.center.y);
        }
    });
}

window.swipeLeft = () => {
    focusIndex += focusIndex < cards.length - 1 ? 1 : 0;
    updateDeckDisplay();
};

window.swipeRight = () => {
    focusIndex -= focusIndex > 0 ? 1 : 0;
    updateDeckDisplay();
};

window.swipeUp = () => {
    var win;
    win = play(cards[focusIndex].name);
    if (win === true) {
        console.log(win);
    } else if (win === false) {
        // Remove the losing card from the player's hand
        cards = cards.filter((card) => {
            return card.name !== cards[focusIndex].name;
        });
    }
    updateDeckDisplay();
};

window.swipeDown = () => {
    // Reveal information about the selected card.
};
