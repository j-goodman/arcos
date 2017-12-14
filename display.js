var canvas;
var ctx;
var cards = [];
var positions;

onload = () => {
    //*//
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    cards = generateCards();
    drawCards(canvas, ctx, cards);
    initTouchControls();
};

positions = {
    center: {
      x: 37.5,
      y: 60,
      z: 1,
      height: 540,
      width: 405,
    },
    offleft: {
      x: -480,
      y: 60,
      z: 1,
      height: 540,
      width: 405,
    },
    offright: {
      x: 560,
      y: 60,
      z: 1,
      height: 540,
      width: 405,
    },
    offtop: {
      x: 37.5,
      y: -560,
      z: 1,
      height: 540,
      width: 405,
    },
    offbottom: {
      x: 37.5,
      y: 560,
      z: 1,
      height: 540,
      width: 405,
    },
}

var Card = function (image) {
    this.image = new Image ();
    this.image.src = image;
};

var drawCards = (canvas, ctx, cards) => {
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

var generateCards = () => {
    var aristocrat;
    var deck = [];
    //*//
    king = new Card ('./images/king.png');
    general = new Card ('./images/general.png');
    philosopher = new Card ('./images/philosopher.png');
    falseProphet = new Card ('./images/false-prophet.png');
    aristocrat = new Card ('./images/aristocrat.png');
    revolutionary = new Card ('./images/revolutionary.png');
    reverse = new Card ('./images/reverse.png');
    deck = [reverse, revolutionary, general, falseProphet, philosopher, aristocrat, king, reverse];
    deck.map((card, index) => {
        card.x = positions.center.x; // + 200 - index * 40;
        card.y = positions.center.y;
        card.z = positions.center.z;
        card.height = positions.center.height;
        card.width = positions.center.width;
    });
    return deck;
};

var moveTo = (card, x, y) => {
    var int;
    //*//
    int = window.setInterval(() => {
        card.x += card.x > x ? -60 : 60;
        card.y += card.y > y ? -60 : 60;
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
