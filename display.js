var canvas;
var ctx;
var cards = [];
var focusIndex = 0;
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

var Card = function (image) {
    this.image = new Image ();
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
    king = new Card ('./images/king.png');
    general = new Card ('./images/general.png');
    philosopher = new Card ('./images/philosopher.png');
    falseProphet = new Card ('./images/false-prophet.png');
    aristocrat = new Card ('./images/aristocrat.png');
    revolutionary = new Card ('./images/revolutionary.png');
    reverse = new Card ('./images/reverse.png');
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
    //*//
    int = window.setInterval(() => {
        card.x += card.x > x ? -60 : 60;
        // card.y += card.y > y ? -60 : 60;
        drawCards(canvas, ctx, cards);
        if (Math.abs(card.x - x) < 70 && Math.abs(card.y - y) < 70) {
          window.clearInterval(int);
          cards.pop();
        }
    }, 32);
}

window.swipeLeft = () => {
    moveTo(cards[cards.length-1], positions.offleft.x, positions.offleft.y);
}

window.swipeRight = () => {
    moveTo(cards[cards.length-1], positions.offright.x, positions.offright.y);
}

window.swipeUp = () => {
    console.log('^');
    moveTo(cards[cards.length-1], positions.offtop.y, positions.offtop.x);
}

window.swipeDown = () => {
    console.log('v');
    moveTo(cards[cards.length-1], positions.offbottom.y, positions.offbottom.x);
}
