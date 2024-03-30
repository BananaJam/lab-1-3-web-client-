const form = document.getElementById("questionary")


form.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(form);
    const data = {};
    for (let key of formData.keys()) {
        data[key] = formData.get(key);
    }
    
    temp = JSON.parse(localStorage.getItem('data'));
    if (temp == null) {
        temp = [];
    }
    temp.push(data)
    console.log(temp);
    localStorage.setItem('data', JSON.stringify(temp));
});

const data = JSON.parse(localStorage.getItem('data'));

const faculty = document.getElementById("faculty_res");
const date = document.getElementById("date_res");
const points = document.getElementById("points_res");

results_faculty = document.getElementById("result-faculty");
results_date = document.getElementById("result-date");
results_points = document.getElementById("result-avg_point");

function UpdateResults() {
    faculty.innerHTML = JSON.stringify(data.filter((item) => item.faculty == results_faculty.value));
    date.innerHTML = JSON.stringify(data.filter((item) => item.date == results_date.value));
    points.innerHTML = JSON.stringify(data.filter((item) => item.avg_point > results_points.value));
}

results_faculty.onchange = UpdateResults;

results_date.onchange = UpdateResults;

results_points.onchange = UpdateResults;
// Test

const testData = fetch('./testData.json')
                .then((response) => response.json())
                .then((data) => {

                    test_title = document.getElementById("test__form-title");

                    test_title.innerHTML = data.title;

                    test_form = document.getElementById("test_container");

                    data.questions.forEach((question, q_index) => {
                        div = document.createElement("div");
                        div.setAttribute("class", "row");
                        test_form.appendChild(div);

                        question_title = document.createElement("h3");
                        question_title.innerHTML = question.question;
                        div.appendChild(question_title);

                        question_select = document.createElement("select");
                        question_select.setAttribute("name", `question_${q_index}`);

                        div.appendChild(question_select);

                        question.answers.forEach((answer, a_index) => {

                            answer_input = document.createElement("option");
                            answer_input.setAttribute("value", a_index);
                            answer_input.innerHTML = answer;
                            question_select.appendChild(answer_input);

                        });
                    });

                    test = document.getElementById("test");
                    correct_answers = document.getElementById("correct");

                    test.addEventListener('submit', function(event) {
                        event.preventDefault();
                        const formData = new FormData(test);
                        correct = 0;
                        Array.from(formData.keys()).forEach((key, index) => {
                            if (formData.get(key) == data.questions[index].correct) {
                                correct++;
                            }
                        });
                        correct_answers.innerHTML = `Правильних відповідей: ${correct}`;
                    })
                })

// Game

let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');

canvas.onclick = function() {
    canvas.requestPointerLock();
    document.scro
    }

let touch_variables = {};

class Ball {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = 5;

    this.changeAngle(0);
    this.movement = 0;

  }
  changeAngle(angle) {
    if(angle == 0) angle = 1; // angle cannot be equal to 0;
    this.angle = angle;
    this.radians = this.angle / (180 * Math.PI) * 10;
    this.xunits = Math.cos(this.radians) * this.speed;
    this.yunits = Math.sin(this.radians) * this.speed;
  }
  angleTo(x, y) {
    this.changeAngle(Math.atan2(y - this.y, x - this.x));
  }
  render() {
    this.x += this.xunits;
    this.y += this.yunits;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "white";
    this.movement += this.speed;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.save();
    ctx.shadowColor = '#999';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 15;
    ctx.shadowOffsetY = 15;
    ctx.strokeStyle = "purple";
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    if(this.xunits > 0) opponent.moveTo(this.ghostPath(opponent.x));

  }
  ghostPath(toX) {
    let {x, y} = this;
    while(x < toX) {
      x += this.xunits;
      y += this.yunits;
    } 
    return {x, y};
  }
}
class Player {
  constructor(x, y, width, height, ctx) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.ctx = ctx;
    this.speed = 5;

    this.up = false;
    this.down = false;
    this.innerColor = "rgb(255, 255, 255)";
    this.outerColor = "rgb(255, 255, 255)";
  }
  changeCoords(x, y) {
    this.x = x;
    this.y = y;
  }
  drawBG() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, canvas.width / 2 - 10, canvas.height);
  }
  render() {
    let ctx = this.ctx;
    this.drawBG();
    ctx.beginPath();
    ctx.fillStyle = this.innerColor;
    ctx.strokeStyle = this.outerColor;

    if (this.up) {
      if (this.y > 0) this.y -= this.speed;
    } else if (this.down) {
      if (this.y < canvas.height - 100) this.y += this.speed;
    }

    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
    ctx.fill();

  }
  direction(dir) {
    switch (dir) {
      case "down":
        this.y += 50;

        break;
      case "up":
        this.y -= 50;

        break;
    }
  }
}
class Opponent extends Player {
  constructor(x, y, width, height, ctx, innerColor, outerColor) {
    super(x, y, width, height, ctx);
    this.innerColor = innerColor;
    this.outerColor = outerColor;
    this.count = 0;
  }
  drawBG() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(canvas.width / 2 + 10, 0, canvas.width / 2, canvas.height);
  }
  moveTo({x, y}) {
    //Opponent AI
    //Every second step there is a 50% chance of a much smaller
    //Move towards the intersection of the ball
    //On the Y axis.
    if(y > 0 && y < canvas.height) {
    let step = (this.y - (y - this.height / 2)) / this.speed/2;
    if(this.count % 2) (Math.random() > .5) ? this.y -= step : this.y -= step / 4;
    this.count++;
    }
  }
}

function adjust_for_dpi(canvas_ele) {
  canvas_ele.style.width = "100%";
  canvas_ele.style.height = "100%";

  let canvas_gcs = getComputedStyle(canvas_ele);
  let canvas_css_width = canvas_gcs.getPropertyValue('width')
    .slice(0, -2);
  let canvas_css_height = canvas_gcs.getPropertyValue('height')
    .slice(0, -2);

  let dpi = window.devicePixelRatio;

  let setAttr = canvas_ele.setAttribute.bind(canvas_ele);
  setAttr('width', canvas_css_width * dpi);
  setAttr('height', canvas_css_height * dpi);

  let setCss = canvas_ele.style;
  setCss.width = canvas_css_width;
  setCss.height = canvas_css_height;
}

function drawBG(ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw_center_line(ctx) {
  let currentX = canvas.width / 2,
    currentY = 0;
  ctx.moveTo(currentX, currentY);
  let buffer = 2;
  let numberOfDashes = 30;
  let bufferSize = numberOfDashes * buffer;
  let heightOfDash = canvas.height / numberOfDashes;
  for (let i = 0; i < numberOfDashes; i++) {
    currentY += heightOfDash;
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.beginPath();
    currentY += buffer;
    ctx.moveTo(currentX, currentY);
  }
}

function init_ball(ctx) {
  ctx.beginPath();
  let ball_x = canvas.width / 2;
  let ball_y = canvas.height / 2;
  let ball_radius = 5;
  ctx.arc(ball_x, ball_y, ball_radius, 0, 2 * Math.PI);
  ball = new Ball(ball_x, ball_y, ball_radius);
  ctx.fillStyle = "white";
  ctx.save();
  ctx.shadowColor = '#999';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 15;
  ctx.shadowOffsetY = 15;
  ctx.strokeStyle = "purple";
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function init_paddles(ctx) {

  function draw_player() {
    ctx.beginPath();
    let paddle_x = canvas.width / 4;
    let paddle_y = canvas.height / 2 - 50;
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.rect(paddle_x, paddle_y, 10, 100);
    ctx.stroke();
    ctx.fill();
    player = new Player(paddle_x, paddle_y, 2, 100, ctx);
  }

  function draw_opponent() {
    ctx.beginPath();
    let paddle_x = canvas.width / 4 * 3;
    let paddle_y = canvas.height / 2 - 50;
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.rect(paddle_x, paddle_y, 10, 100);
    ctx.stroke();
    ctx.fill();
    opponent = new Opponent(paddle_x, paddle_y, 2, 100, ctx, "rgb(255, 255, 255)", "rgb(255, 255, 255)");
  }
  draw_player();
  draw_opponent();

}

function add_keys(player, canvas) {
  document.onkeydown = function(e) {
    e.preventDefault();
    switch (e.keyCode) {
      case 38:
        player.direction('up');
        break;
      case 40:
        player.direction('down');
        break;
    }
  }
  window.focus();
}
function add_touch(player, canvas) {
  
  document.addEventListener('touchstart', (e) => {
    touch_variables.yStart = e.touches[0].clientY;
  })
  document.addEventListener('touchmove', (e) => {
   
   
   player.y += (e.touches[0].clientY - touch_variables.yStart)/5;
   
    
  });
}
function draw_scores(ctx) {
  ctx.fillStyle = "white";
  ctx.fillText("Player: " + player_points, 20, 30);
  ctx.fillText("Opponent: " + opponent_points, canvas.width - 100, 30);
}
function check_for_collisions() {
  // if ball is at goal
  if (ball.x > canvas.width || ball.x < 0) {

  if (ball.x > canvas.width) addPoint("player");
  if (ball.x < 0) addPoint("opponent");
    
    
  } else if (ball.y >= canvas.height - ball.radius || ball.y <= 0 + ball.radius) {
    ball.changeAngle(360 - ball.angle);
    if (ball.y >= canvas.height - ball.radius) ball.y = canvas.height - ball.radius - 1;
    if (ball.y <= 0 + ball.radius) ball.y = ball.radius + 1;
  }
  //if player paddle collision
  if (ball.x - ball.radius < player.x + player.width && ball.x + ball.radius > player.x + player.width &&
ball.y - ball.radius > player.y && ball.y + ball.radius < player.y + player.height && ball.xunits < 0) {
   ball.changeAngle( Math.floor(Math.random() * (175 - 180) + 175) - ball.angle);
   
  }
  //if opponent paddle collision
    if (ball.x + ball.radius > opponent.x - opponent.width && ball.x - ball.radius < opponent.x + opponent.width &&
ball.y - ball.radius >= opponent.y && ball.y + ball.radius <= opponent.y + opponent.height && ball.xunits > 0) {
    ball.changeAngle( Math.floor(Math.random() * (185 - 175) + 175) - ball.angle);
  }
  
  function addPoint(playerORopponent) {
    switch(playerORopponent) {
      case "player": 
        player_points += 1;
      break;
      case "opponent":
        opponent_points += 1;
      break;
                           }
    ball.changeAngle(180 - ball.angle);
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    
  }
}

function redraw() {
  adjust_for_dpi(canvas);
  drawBG(ctx);
  draw_center_line(ctx);
}

adjust_for_dpi(canvas);
window.addEventListener('resize', redraw);

let player, opponent, ball;
let player_points = 0;
let opponent_points = 0;

init_paddles(ctx);
init_ball(ctx);
add_keys(player, canvas);
add_touch(player, canvas);

function draw() {
  drawBG(ctx);
  draw_center_line(ctx);
  player.render(); // render player

  let random = Math.floor((Math.random() * 10) + 1); // render opponent and make random actions
  //let randomDirection = (random > 5) ? "down" : "up";
  //if (Math.random() > .5) opponent.direction(randomDirection);
  
  
  opponent.render();
  ball.render();

 

  check_for_collisions();
  draw_scores(ctx);
  requestAnimationFrame(draw);

}
requestAnimationFrame(draw);