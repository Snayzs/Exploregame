const canvas = document.getElementById('myCanvas');
const c = canvas.getContext('2d');

canvas.height = window.innerWidth - 5;
canvas.width = window.innerHeight;

const offset = {
  x: -1150,
  y: -1200

}
// import the collision
tiledLength = 128
tiled = [
  {
    symbol: 955,
    color: 'red'
  },
  {
    symbol: 868,
    color: 'green'
  },
  {
    symbol: 750,
    color: 'orange'
  },
  {
    symbol: 862,
    color: 'yellow'
  }
]


let collisionMap = []
for (var i = 0; i < collision.length; i += tiledLength) {
  collisionMap.push(collision.slice(i, tiledLength + i))
}


let boundariesred = []
let boundariesyellow = []
let boundariesorange = []

collisionMap.forEach((row, i) => {
  row.forEach((cell, j) => {
    if (cell === tiled[0].symbol)
      boundariesred.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          color: tiled[0].color
        })
      )
  })
})

let arcCollisionMap = []
for (var i = 0; i < arcCollision.length; i += tiledLength) {
  arcCollisionMap.push(arcCollision.slice(i, tiledLength + i))
}


let arcBoundaries = []
arcCollisionMap.forEach((row, i) => {
  row.forEach((cell, j) => {
    if (cell === tiled[1].symbol)
      arcBoundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          color: tiled[1].color
        })
      )
    if (cell === tiled[2].symbol)
      boundariesorange.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          color: tiled[2].color
        })
      )
    if (cell === tiled[3].symbol)
      boundariesyellow.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          color: tiled[3].color
        })
      )
  })
})

let boundaries = [...boundariesred, ...boundariesyellow, ...boundariesorange]


function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width - zoom * 9 >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width - zoom * 9 &&
    (rectangle1.position.y + zoom * 4) + 50 <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}



// import the image
const map = new Image();
map.src = './assets/fullMap.png';

const foreground = new Image();
foreground.src = './assets/foreground.png';

const topground = new Image();
topground.src = './assets/topground.png';

const playerDownImage = new Image();
playerDownImage.src = './assets/down.png';

const playerUpImage = new Image();
playerUpImage.src = './assets/up.png';

const playerLeftImage = new Image();
playerLeftImage.src = './assets/left.png';

const playerRightImage = new Image();
playerRightImage.src = './assets/right.png';


// set property class
const player = new Sprite({
  position: {
    x: canvas.width / 2 - 128 / 4 / 2 * zoom,
    y: canvas.height / 2 - 32 / 2 * zoom
  },
  image: playerDownImage,
  frame: {
    max: 4
  },
  sprites: {
    down: playerDownImage,
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
  }
})


const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: map
});

const foregroundMap = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: foreground
});

const topGroundMap = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: topground
});



const keys = {
  left: {
    pressed: false
  },
  right: {
    pressed: false
  },
  up: {
    pressed: false
  },
  down: {
    pressed: false
  }
}

let isOnTop = false

//looping animation
const moveables = [
  background,
  foregroundMap,
  topGroundMap,
  ...boundaries,
  ...arcBoundaries,
]

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height)
  // Draw background
  background.draw();

  // Draw collision
  arcBoundaries.forEach(boundary => {
    //boundary.draw()
  })
  boundaries.forEach(boundary => {
    //boundary.draw()
  })

  // Draw player
  player.draw()

  // Draw foreground map
  foregroundMap.draw()

  if (isOnTop) {
    boundaries = boundaries.filter((e) => e.color != "yellow")
  }

  if (!isOnTop) {
    topGroundMap.draw()
    boundaries = boundaries.filter((e) => e.color != "orange")
  }

  //event handle
  movementPlayer()
}
animate();


// Controller buttons
const buttons = document.querySelectorAll('.button');

lastkey = ''
buttons.forEach((button, index) => {
  button.addEventListener('touchstart', () => {
    switch (index) {
      case 0:
        keys.left.pressed = true
        lastkey = 'left'
        break
      case 1:
        keys.right.pressed = true
        lastkey = 'right'
        break
      case 2:
        keys.up.pressed = true
        lastkey = 'up'
        break
      case 3:
        keys.down.pressed = true
        lastkey = 'down'
        break
    }
  });

  button.addEventListener('touchend', () => {
    switch (index) {
      case 0:
        keys.left.pressed = false
        break
      case 1:
        keys.right.pressed = false
        break
      case 2:
        keys.up.pressed = false
        break
      case 3:
        keys.down.pressed = false
        break
    }
  });
});


function movePlayer(direction, sprite) {
  player.moving = true;
  player.image = player.sprites[direction];

  let moving = true;

  for (let i = 0; i < boundaries.length; i++) {
    boundary = boundaries[i];
    const adjustedBoundaryPosition = { ...boundary.position };

    switch (direction) {
      case 'up':
        adjustedBoundaryPosition.y += 3;
        break;
      case 'down':
        adjustedBoundaryPosition.y -= 3;
        break;
      case 'left':
        adjustedBoundaryPosition.x += 3;
        break;
      case 'right':
        adjustedBoundaryPosition.x -= 3;
        break;
    }

    if (rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: adjustedBoundaryPosition,
        },
      })) {
      moving = false;
      break;
    }
  }

  for (let i = 0; i < arcBoundaries.length; i++) {
    boundary = arcBoundaries[i];
    const adjustedBoundaryPosition = { ...boundary.position };

    switch (direction) {
      case 'up':
        adjustedBoundaryPosition.y += 3;
        break;
      case 'down':
        adjustedBoundaryPosition.y -= 3;
        break;
      case 'left':
        adjustedBoundaryPosition.x += 3;
        break;
      case 'right':
        adjustedBoundaryPosition.x -= 3;
        break;
    }

    if (rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: adjustedBoundaryPosition,
        },
      }) && boundary.color == 'green') {
      if (player.position.y + player.height > boundary.position.y && direction == 'up') {
        isOnTop = true
        boundaries = boundaries.concat(boundariesorange)
      } else {
        isOnTop = false
        boundaries = boundaries.concat(boundariesyellow)
      }
    }
  }

  if (moving) {
    moveables.forEach(moveable => {
      switch (direction) {
        case 'up':
          moveable.position.y += 3;
          break;
        case 'down':
          moveable.position.y -= 3;
          break;
        case 'left':
          moveable.position.x += 3;
          break;
        case 'right':
          moveable.position.x -= 3;
          break;
      }
    });
  }
}

function movementPlayer() {
  player.moving = false;

  if (keys.up.pressed && lastkey == 'up') {
    movePlayer('up', player.sprites.up);
  } else if (keys.down.pressed && lastkey == 'down') {
    movePlayer('down', player.sprites.down);
  } else if (keys.left.pressed && lastkey == 'left') {
    movePlayer('left', player.sprites.left);
  } else if (keys.right.pressed && lastkey == 'right') {
    movePlayer('right', player.sprites.right);
  }
}



/*function movementPlayer() {
  let moving = true
  player.moving = false
  if (keys.up.pressed && lastkey == 'up') {
    player.moving = true
    player.image = player.sprites.up

    for (let i = 0; i < boundaries.length; i++) {
      boundary = boundaries[i]
      if (rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3
            }
          }
        })){
        moving = false
        break
      }
    }
    if (moving)
      moveables.forEach(moveable => moveable.position.y += 3)
  } else
  if (keys.down.pressed && lastkey == 'down') {
    player.moving = true
    player.image = player.sprites.down

    for (let i = 0; i < boundaries.length; i++) {
      boundary = boundaries[i]
      if (rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3
            }
          }
        })) {
        moving = false
        break
      }
    }
    if (moving)
      moveables.forEach(moveable => moveable.position.y -= 3)
  } else
  if (keys.left.pressed && lastkey == 'left') {
    player.moving = true
    player.image = player.sprites.left

    for (let i = 0; i < boundaries.length; i++) {
      boundary = boundaries[i]
      if (rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y
            }
          }
        })) {
        moving = false
        break
      }
    }
    if (moving)
      moveables.forEach(moveable => moveable.position.x += 3)
  } else
  if (keys.right.pressed && lastkey == 'right') {
    player.moving = true
    player.image = player.sprites.right

    for (let i = 0; i < boundaries.length; i++) {
      boundary = boundaries[i]
      if (rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y
            }
          }
        })) {
        moving = false
        break
      }
    }
    if (moving)
      moveables.forEach(moveable => moveable.position.x -= 3)
  }
}*/