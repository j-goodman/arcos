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
};

positions = {
    center: {
      x: 37.5,
      y: 60,
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
    cards.map((card) => {
        console.log('Drawing image', card)
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
    deck = [revolutionary, aristocrat, falseProphet, philosopher, general, king];
    deck.map((card, index) => {
      card.x = positions.center.x + 200 - index * 40;
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
    int = setInterval(() => {
        card.x += card.x > x ? -1 : 1;
        card.y += card.y > y ? -1 : 1;
        drawCards(canvas, ctx, cards);
    }, 32);
}
