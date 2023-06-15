import React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import TileMap from "./tileMap";
import overSound from "./sounds/gameOver.wav";
import winSound from "./sounds/gameWin.wav";

const BtcMan = () => {
  useEffect(() => {
    const tileSize = 32;
    const velocity = 2;

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const tileMap = new TileMap(tileSize);
    const pacman = tileMap.getPacman(velocity);
    const enemies = tileMap.getEnemies(velocity);

    let gameOver = false;
    let gameWin = false;
    const gameOverSound = new Audio(overSound);
    const gameWinSound = new Audio(winSound);

    tileMap.setCanvasSize(canvas);

    function gameLoop() {
      tileMap.draw(ctx);
      drawGameEnd();
      pacman.draw(ctx, pause(), enemies);
      enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
      checkGameOver();
      checkGameWin();
    }
    function checkGameOver() {
      if (!gameOver) {
        gameOver = isGameOver();
        if (gameOver) {
          gameOverSound.play();
        }
      }
    }
    function isGameOver() {
      return enemies.some(
        (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
      );
    }

    function checkGameWin() {
      if (!gameWin) {
        gameWin = tileMap.didWin();
        if (gameWin) {
          gameWinSound.play();
        }
      }
    }
    function pause() {
      return !pacman.madeFirstMove || gameOver || gameWin;
    }

    function drawGameEnd() {
      if (gameOver || gameWin) {
        const text = gameOver ? "Game Over" : "You Win!";
        const rectHeight = 80;
        const gradientColors = ["magenta", "blue", "red"];

        drawBackgroundRect(rectHeight);
        drawText(text, rectHeight, gradientColors);
      }
    }

    function drawBackgroundRect(rectHeight) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, canvas.height / 3.2, canvas.width, rectHeight);
    }

    function drawText(text, rectHeight, gradientColors) {
      const fontSize = 75;
      const font = `${fontSize}px comic sans`;
      const gradient = createGradient(gradientColors);

      ctx.font = font;
      ctx.fillStyle = gradient;
      ctx.fillText(text, 10, canvas.height / 2);
    }

    function createGradient(gradientColors) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradientColors.forEach((color, index) => {
        const stop = index / (gradientColors.length - 1);
        gradient.addColorStop(stop, color);
      });

      return gradient;
    }

    const interval = setInterval(gameLoop, 1000 / 75);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <Body>
      <Heading>Pac-Man</Heading>
      <GameCanvas id="gameCanvas"></GameCanvas>
    </Body>
  );
};

export default BtcMan;

const GameCanvas = styled.canvas`
  box-shadow: 10px 10px 20px black;
`;

const Heading = styled.h1`
  text-align: center;
  font-family: "Comic Sans MS", cursive;
  color: lightgrey;
`;

const Body = styled.body`
  display: flex;
  flex-direction: column;
  align-items: center;

  overflow: hidden;
  height: 60rem;
  background: linear-gradient(
    0deg,
    rgb(17, 51, 161) 0%,
    rgb(136, 34, 195) 100%
  );
`;
