import MovingDirection from "./movingDirection.js";
import pac0Image from "./images/btcMan0.png";
import pac1Image from "./images/btcMan1.png";
import pac2Image from "./images/btcMan2.png";
import wakaSound from "./sounds/waka.wav";
import powerSound from "./sounds/levanPolkka.wav";
import eatGhost from "./sounds/eat_ghost.wav";

export default class Pacman {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.currentMovingDirection = null;
    this.requestedMovingDirection = null;

    this.pacmanAnimationTimerDefault = 10;
    this.pacmanAnimationTimer = null;

    document.addEventListener("keydown", this.#keydown);
    this.#loadPacmanImages();

    this.pacmanRotation = this.Rotation.right;

    this.wakaSound = new Audio(wakaSound);
    this.powerDotSound = new Audio(powerSound);
    this.eatGhostSound = new Audio(eatGhost);

    this.powerDotActive = false;
    this.powerDotAboutToExpire = false;
    this.timers = [];

    this.madeFirstMove = false;
  }
  Rotation = {
    right: 0,
    down: 1,
    left: 2,
    up: 3,
  };

  draw(ctx, pause, enemies) {
    if (!pause) {
      this.#move();
      this.#animate();
    }
    this.#eatDot();
    this.#eatPowerDot();
    this.#eatGhost(enemies);

    const size = this.tileSize / 2;

    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);
    ctx.drawImage(
      this.pacmanImages[this.pacmanImageIndex],
      -size,
      -size,
      this.tileSize,
      this.tileSize
    );
    ctx.restore();
  }

  #loadPacmanImages() {
    const pacmanImage1 = new Image();
    pacmanImage1.src = pac0Image;

    const pacmanImage2 = new Image();
    pacmanImage2.src = pac1Image;

    const pacmanImage3 = new Image();
    pacmanImage3.src = pac2Image;

    const pacmanImage4 = new Image();
    pacmanImage4.src = pac1Image;

    this.pacmanImages = [
      pacmanImage1,
      pacmanImage2,
      pacmanImage3,
      pacmanImage4,
    ];

    this.pacmanImageIndex = 0;
  }
  #keydown = (event) => {
    // Up
    if (event.key === "ArrowUp") {
      if (this.currentMovingDirection === MovingDirection.down)
        this.currentMovingDirection = MovingDirection.up;
      this.requestedMovingDirection = MovingDirection.up;
      this.madeFirstMove = true;
    }
    // Down
    if (event.key === "ArrowDown") {
      if (this.currentMovingDirection === MovingDirection.up)
        this.currentMovingDirection = MovingDirection.down;
      this.requestedMovingDirection = MovingDirection.down;
      this.madeFirstMove = true;
    }
    // Left
    if (event.key === "ArrowLeft") {
      if (this.currentMovingDirection === MovingDirection.right)
        this.currentMovingDirection = MovingDirection.left;
      this.requestedMovingDirection = MovingDirection.left;
      this.madeFirstMove = true;
    }
    // Right
    if (event.key === "ArrowRight") {
      if (this.currentMovingDirection === MovingDirection.left)
        this.currentMovingDirection = MovingDirection.right;
      this.requestedMovingDirection = MovingDirection.right;
      this.madeFirstMove = true;
    }
  };

  #move() {
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            this.requestedMovingDirection
          )
        )
          this.currentMovingDirection = this.requestedMovingDirection;
      }
    }

    if (
      this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.currentMovingDirection
      )
    ) {
      this.pacmanAnimationTimer = null;
      this.pacmanImageIndex = 1;
      return;
    } else if (
      this.currentMovingDirection != null &&
      this.pacmanAnimationTimer == null
    ) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
    }

    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        this.y -= this.velocity;
        this.pacmanRotation = this.Rotation.up;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        this.pacmanRotation = this.Rotation.down;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        this.pacmanRotation = this.Rotation.left;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        this.pacmanRotation = this.Rotation.right;
        break;
      default:
        // Fallback-Code für den Fall, dass this.currentMovingDirection einen nicht erwarteten Wert hat
        break;
    }
  }
  #animate() {
    if (this.pacmanAnimationTimer === null) {
      return;
    }
    this.pacmanAnimationTimer--;
    if (this.pacmanAnimationTimer === 0) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
      this.pacmanImageIndex++;
      if (this.pacmanImageIndex === this.pacmanImages.length) {
        this.pacmanImageIndex = 0;
      }
    }
  }
  #eatDot() {
    if (this.tileMap.eatDot(this.x, this.y) && this.madeFirstMove) {
      this.wakaSound.play();
    }
  }

  #eatPowerDot() {
    if (this.tileMap.eatPowerDot(this.x, this.y)) {
      this.powerDotSound.play();
      this.powerDotActive = true;
      this.powerDotAboutToExpire = false;
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers = [];

      let powerDotTimer = setTimeout(() => {
        this.powerDotActive = false;
        this.powerDotAboutToExpire = false;
      }, 1000 * 10);

      this.timers.push(powerDotTimer);

      let powerDotAboutToExpireTimer = setTimeout(() => {
        this.powerDotAboutToExpire = true;
      }, 1000 * 3);

      this.timers.push(powerDotAboutToExpireTimer);
    }
  }

  #eatGhost(enemies) {
    if (this.powerDotActive) {
      const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
      collideEnemies.forEach((enemy) => {
        enemies.splice(enemies.indexOf(enemy), 1);
        this.eatGhostSound.play();
      });
    }
  }
}
