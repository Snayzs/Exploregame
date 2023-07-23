const zoom = 3;
class Sprite {
  constructor({ position, image, frame = { max: 1 }, sprites = {}, zoom = 3 }) {
    this.position = position
    this.image = image
    this.zoom = zoom
    this.frame = {
      ...frame,
      val: 0,
      ellapsed: 0
    }
    this.moving = false
    this.sprites = sprites

    this.image.onload = () => {
      this.width = this.image.width / this.frame.max * this.zoom
      this.height = this.image.height * this.zoom
    }
  }

  draw() {
    c.drawImage(
      this.image,
      this.frame.val * this.width / this.zoom,
      0,
      this.image.width / this.frame.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frame.max * this.zoom,
      this.image.height * this.zoom,
    );
    //get animation loop
    if (!this.moving) return
    if (this.frame.max > 0)
      this.frame.ellapsed++

    if (this.frame.ellapsed % 12 == 0) {
      if (this.frame.val < this.frame.max - 1) this.frame.val++
      else this.frame.val = 0
    }
  }
}

const tiledSize = 8
class Boundary {
  static width = tiledSize * zoom
  static height = tiledSize * zoom
  constructor({ position, color = 'green', }) {
    this.position = position
    this.width = tiledSize * zoom
    this.height = tiledSize * zoom
    this.color = color
  }

  draw() {
    c.fillStyle = this.color
    c.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }
}