import MovingDirection from "./movingDirection.js";
import normalGhostImage from "./images/ghost1.png";
import normalGhostImage1 from "./images/ghost2.png";
import normalGhostImage2 from "./images/ghost3.png";
import scaredGhost1Image from "./images/scaredGhost.png";
import scaredGhost2Image from "./images/scaredGhost2.png";

export default class Enemy {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.#loadImages();

    this.movingDirection = Math.floor(
      Math.random() * Object.keys(MovingDirection).length
    );

    this.directionTimerDefault = this.#random(10, 25);
    this.directionTimer = this.directionTimerDefault;

    this.scaredAboutToExpireTimerDefault = 10;
    this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
  }

  draw(ctx, pause, pacman) {
    if (!pause) {
      this.#move();
      this.#changeDirection();
    }
    this.#setImage(ctx, pacman);
  }

  collideWith(pacman) {
    const size = this.tileSize / 2;
    if (
      this.x < pacman.x + size &&
      this.x + size > pacman.x &&
      this.y < pacman.y + size &&
      this.y + size > pacman.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  #loadImages() {
    this.normalGhost = new Image();
    this.normalGhost.src = normalGhostImage;

    this.normalGhost1 = new Image();
    this.normalGhost1.src = normalGhostImage1;

    this.normalGhost2 = new Image();
    this.normalGhost2.src = normalGhostImage2;

    this.scaredGhost = new Image();
    this.scaredGhost.src = scaredGhost1Image;

    this.scaredGhost2 = new Image();
    this.scaredGhost2.src = scaredGhost2Image;

    this.image = this.normalGhost;
  }

  #setImage(ctx, pacman) {
    if (pacman.powerDotActive) {
      this.#setImageWhenPowerDotIsActive(pacman);
    } else {
      this.image = this.normalGhost;
    }
    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
  }

  #setImageWhenPowerDotIsActive(pacman) {
    if (pacman.powerDotAboutToExpire) {
      this.scaredAboutToExpireTimer--;
      if (this.scaredAboutToExpireTimer === 0) {
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
        if (this.image === this.scaredGhost) {
          this.image = this.scaredGhost2;
        } else {
          this.image = this.scaredGhost;
        }
      }
    } else {
      this.image = this.scaredGhost;
    }
  }

  #changeDirection() {
    this.directionTimer--;
    let newMoveDirection = null;
    if (this.directionTimer === 0) {
      this.directionTimer = this.directionTimerDefault;
      newMoveDirection = Math.floor(
        Math.random() * Object.keys(MovingDirection).length
      );
    }

    if (
      newMoveDirection !== null &&
      this.movingDirection !== newMoveDirection
    ) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            newMoveDirection
          )
        ) {
          this.movingDirection = newMoveDirection;
        }
      }
    }
  }

  #move() {
    if (
      !this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.movingDirection
      )
    ) {
      switch (this.movingDirection) {
        case MovingDirection.up:
          this.y -= this.velocity;
          break;
        case MovingDirection.down:
          this.y += this.velocity;
          break;
        case MovingDirection.left:
          this.x -= this.velocity;
          break;
        case MovingDirection.right:
          this.x += this.velocity;
          break;
        default:
          // Fallback-Code für den Fall, dass direction einen nicht erwarteten Wert hat
          break;
      }
    }
  }

  #random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
