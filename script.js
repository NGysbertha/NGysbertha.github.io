//The graphics of the ping pong game will be drawn with JavaScript. Meaning, we need to call the canvas using its id that we used in the html file.
const canvas = document.getElementById('canvas');

//Even though the canvas was called above, I still can't draw anything on it without the context. For the context, I'm going to use 2d since the ping pong game I'm re-creating is a simple 2d gane. If the game I was re-creating is in 3d, then I would have to put 3d instead of 2d.
const ctx = canvas.getContext('2d');

//Ping pong net variables
const netWidth = 4;
const netHeight = canvas.height;

//Ping pong paddle variables
const paddleWidth = 10;
const paddleHeight = 100;

//Ping pong controls variables 
//The controls are set to false so that the controls can function when they are PRESSED
let upArrowPressed = false;
let downArrowPressed = false;





//Objects
//Net 
const net = {
    x: canvas.width / 2 - netWidth / 2,
    y: 0,
    width: netWidth,
    height: netHeight,
    color: "#FFFFFF"
};

//User ping pong paddle
const user = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#FFFFFF",
    score: 0
};

//Computer ping pong paddle
const ai = {
    x: canvas.width - (paddleWidth + 10),
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#FFFFFF",
    score: 0
};

//Ping pong ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 7,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: "#FFFFFF"
};





//Functions to draw objects 
//function responsible for drawing the ping pong net 
function drawNet() {
    ctx.fillStyle = net.color;
    ctx.fillRect(net.x, net.y, net.width, net.height);
}

//function responsible for drawing the score(s)
function drawScore(x, y, score) {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "35px Montserrat";
    ctx.fillText(score, x, y);
}

//function responsible for drawing the ping pong paddle(s)
function drawPaddle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

//function responsible for drawing the ping pong ball
//arc syntax: arc(x, y, radius, startAngle, endAngle, antiClockwise_or_not)
function drawBall(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}





//Paddle movement
//Ping pong controls 
window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);

//Controls gets triggered when they are PRESSED
//Key codes --> https://css-tricks.com/snippets/javascript/javascript-keycodes/ 
function keyDownHandler(e) {
    switch (e.keyCode) {
        //Up arrow key code
        case 38:
            //Set variable to true 
            upArrowPressed = true;
            //Stop interaction
            break;

        //Down arrow key code
        case 40:
            //Set variable to true 
            downArrowPressed = true;
            //Stop interaction
            break;

    }
}





//Controls get triggered when RELEASED
function keyUpHandler(e) {
    switch (e.keyCode) {
        //Up arrow key code
        case 38:
            //Set variable to true 
            upArrowPressed = false;
            //Stop interaction
            break;

        //Down arrow key code
        case 40:
            //Set variable to true 
            downArrowPressed = false;
            //Stop interaction
            break;

    }
}





//Reset the ping pong ball after score
function reset() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;

    //changes the ping pong ball's direction
    ball.velocityX = -ball.velocityX;
    ball.velocityY = -ball.velocityY;
}





//Let's the ping pong ball collide with the paddles.
function collisionDetect(player, ball) {
    player.top = player.y;
    player.right = player.x + player.width;
    player.bottom = player.y + player.height;
    player.left = player.x;

    ball.top = ball.y - ball.radius;
    ball.right = ball.x + ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;

    return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
}





//Update the actions being done during the game
function update() {
    //User's paddle movement
    if (upArrowPressed && user.y > 0) {
        user.y -= 8;
    }
    else if (downArrowPressed && (user.y < canvas.height - user.height)) {
        user.y += 8;
    }

    //Ball movement (hit top - or bottom wall)
    //the if else statement below detects the top and bottom walls and let's the ball bounce off them
    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        ball.velocityY = -ball.velocityY;
    }

    //if ball hits on the right wall
    if (ball.x + ball.radius >= canvas.width) {
        //user scores 1 point
        user.score += 1;
        reset();
    }

    //if ball hits on the left wall
    if (ball.x - ball.radius <= 0) {
        //computer scores 1 point
        ai.score += 1;
        reset();
    }

    //Move ping pong ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //Computer's paddle movement
    ai.y += ((ball.y - (ai.y + ai.height / 2))) * 0.09;

    //Impact detection on paddles
    let player = (ball.x < canvas.width / 2) ? user : ai;

    if (collisionDetect(player, ball)) {
        //default angle is 0 degrees
        let angle = 0;

        //if the ping pong ball hits the top of the paddle
        if (ball.y < (player.y + player.height / 2)) {
            // then -1 * Math.PI / 4 = -45 degrees
            angle = -1 * Math.PI / 4;
        } else if (ball.y > (player.y + player.height / 2)) {
            //if the ping pong ball hits the bottom of the paddle then angle will be Math.PI / 4 = 45 degrees
            angle = Math.PI / 4;
        }

        //change velocity of ball according to which paddle the ping pong ball hit
        ball.velocityX = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);

        //increase the speed of the ping pong ball's movement 
        ball.speed += 0.05;
    }
}





//Draw the ping pong table with the render function and style the table. The render function is responsible for drawing on the canvas.
function render() {
    ctx.fillStyle = "#A8A65C";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawNet();
    //User's score
    //Width / 4 --> Score will end up on the left side. 
    //4 comes from dividing the x-axis into 4 equal pieces and 6 comes from dividing the y-axis into 6 equal pieces.
    drawScore(canvas.width / 4, canvas.height / 6, user.score);
    //Computer's score
    //3 * Width / 4 --> Score will end up on the right side. 
    //4 comes from dividing the x-axis into 4 equal pieces and 6 comes from dividing the y-axis into 6 equal pieces.
    drawScore(3 * canvas.width / 4, canvas.height / 6, ai.score);
    //User's paddle
    drawPaddle(user.x, user.y, user.width, user.height, user.color);
    //Computer's paddle 
    drawPaddle(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawBall(ball.x, ball.y, ball.radius, ball.color);
}





//Game loop is one of the most important functions. The reason for this is because it is responsible for the constant actions being done during the game.
function gameLoop() {
    update();
    render();
}

//setInterval will be used to let the game run 60 fps. setInterval is used for time (millieseconds)
setInterval(gameLoop, 1000 / 60);