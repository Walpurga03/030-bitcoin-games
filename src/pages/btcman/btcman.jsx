import React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import TileMap from "./tileMap";
import overSound from "./sounds/gameOver.wav";
import winSound from "./sounds/gameWin1.wav";

const BtcMan = () => {
  useEffect(() => {
    const tileSize = 64;
    const velocity = 4;

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
      // Die TileMap auf dem Canvas zeichnen
      tileMap.draw(ctx);

      // Das Spielende zeichnen, falls erforderlich
      drawGameEnd();

      // Pacman auf dem Canvas zeichnen und Spielstatus übergeben
      pacman.draw(ctx, pause(), enemies);

      // Gegner auf dem Canvas zeichnen und Spielstatus übergeben
      enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));

      // Überprüfen, ob das Spiel verloren wurde
      checkGameOver();

      // Überprüfen, ob das Spiel gewonnen wurde
      checkGameWin();
    }
    function checkGameOver() {
      if (!gameOver) {
        // Überprüfen, ob das Spiel verloren wurde
        gameOver = isGameOver();

        if (gameOver) {
          // Wenn das Spiel verloren wurde, den Game Over Sound abspielen
          gameOverSound.play();
        }
      }
    }

    function isGameOver() {
      // Überprüfen, ob mindestens ein Gegner existiert, der die Bedingung erfüllt
      return enemies.some(
        (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
      );
    }

    function checkGameWin() {
      if (!gameWin) {
        // Überprüfen, ob das Spiel gewonnen wurde
        gameWin = tileMap.didWin();

        if (gameWin) {
          // Wenn das Spiel gewonnen wurde, den Game Win Sound abspielen
          gameWinSound.play();
        }
      }
    }
    function pause() {
      // Überprüfen, ob das Spiel pausiert werden soll
      return !pacman.madeFirstMove || gameOver || gameWin;
    }

    function drawGameEnd() {
      if (gameOver || gameWin) {
        // Überprüfen, ob das Spiel verloren oder gewonnen wurde
        const text = gameOver ? "Game Over" : "You Win!";
        const rectHeight = 80;
        const gradientColors = ["magenta", "blue", "red"];

        // Hintergrundrechteck zeichnen
        drawBackgroundRect(rectHeight);

        // Text zeichnen
        drawText(text, rectHeight, gradientColors);
      }
    }

    function drawBackgroundRect(rectHeight) {
      ctx.fillStyle = "black";
      ctx.fillRect(64, canvas.height / 2.6, canvas.width - 128, 100);
    }

    function createGradient(gradientColors) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradientColors.forEach((color, index) => {
        const stop = index / (gradientColors.length - 1);
        gradient.addColorStop(stop, color);
      });

      return gradient;
    }

    function drawText(text, rectHeight, gradientColors) {
      const fontSize = 75;
      const font = `${fontSize}px comic sans`;
      const gradient = createGradient(gradientColors);
      ctx.font = font;
      ctx.fillStyle = gradient;
      ctx.fillText(text, 275, 245);
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
