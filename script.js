"use strict";
const Player = (symbol) => {
	let choice = [];
	return { symbol, choice };
};

const gameBoard = (() => {
	const fields = document.querySelectorAll(".field");
	let board = ["", "", "", "", "", "", "", "", ""];
	fields.forEach((field) => {
		field.addEventListener("click", (e) => {
			if (!gameController.gameFinished() && e.target.innerText == "") {
				board[field.id] = gameController.getPlayer();
				if (board[field.id] == "X") {
					field.style.color = "var(--playerX-color)";
				} else {
					field.style.color = "var(--playerO-color)";
				}
				field.innerText = board[field.id];
				gameController.playRound(field.id);
				gameController.gameFinished();
			}
		});
	});

	const winCombo = [
		[0, 1, 2], //horizontal
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6], //vertical
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8], //diagonal
		[2, 4, 6],
	];

	const winningPlayerCombo = [];

	const reset = () => {
		board = ["", "", "", "", "", "", "", "", ""];
		for (let field of fields) {
			field.innerText = "";
			field.style.backgroundColor = "var(--sub-color)";
		}
	};
	return { fields, winCombo, winningPlayerCombo, reset };
})();

const gameController = (() => {
	const playerX = Player("X");
	const playerO = Player("O");
	let winner = null;
	let round = 1;
	let finished = false;
	const playRound = (fieldIdx) => {
		if (!gameFinished()) {
			if (getPlayer() == playerX.symbol) {
				playerX.choice.push(parseInt(fieldIdx));
				checkWinner(playerX);
			} else if (getPlayer() == playerO.symbol) {
				playerO.choice.push(parseInt(fieldIdx));
				checkWinner(playerO);
			}
			round++;
		}
	};

	const getPlayer = () => {
		if (round % 2 != 0) {
			return "X";
		}
		return "O";
	};

	const gameFinished = () => {
		if (winner != null || round == 10) {
			displayController.updateRestartBtn();
			finished = true;
		}
		displayController.updateBoardField(finished);
		displayController.updateMessage(finished);
		return finished;
	};

	const checkWinner = (player) => {
		let playerCombo = player.choice;
		const winCombo = gameBoard.winCombo;
		let intersectCombo = [];
		for (let i = 0; i < winCombo.length; i++) {
			intersectCombo = winCombo[i]
				.filter((x) => {
					return playerCombo.indexOf(x) != -1;
				})
				.sort();
			if (isEqual(winCombo[i], intersectCombo)) {
				winner = player;
				winner.choice = intersectCombo;
			}
		}
		return winner;
	};

	const isEqual = (a, b) => JSON.stringify(a) == JSON.stringify(b);

	const reset = () => {
		winner = null;
		round = 1;
		finished = false;
		playerO.choice = [];
		playerX.choice = [];
	};

	const getWinner = () => winner;

	return { playRound, getPlayer, gameFinished, checkWinner, reset, getWinner };
})();

const displayController = (() => {
	const fields = document.querySelectorAll(".field");
	const turnMsg = document.getElementById("msg-turn-span");
	const turnMsgDefault = turnMsg.innerText;
	const winMsg = document.getElementById("msg-win");
	const winMsgDefault = winMsg.innerText;
	const restartBtn = document.getElementById("restart-btn");

	restartBtn.addEventListener("click", () => {
		gameBoard.reset();
		gameController.reset();
		turnMsg.innerText = turnMsgDefault;
		winMsg.innerText = winMsgDefault;
		restartBtn.style.display = "none";
	});

	const updateMessage = (isFinished) => {
		if (!isFinished) {
			turnMsg.innerText = `Player ${gameController.getPlayer()} turn`;
		} else {
			if (gameController.getWinner() != null) {
				winMsg.innerText = `Player ${gameController.getWinner().symbol} wins!`;
			} else {
				winMsg.innerText = "It's a Tie!";
			}
		}
	};

	const updateRestartBtn = () => {
		restartBtn.style.display = "block";
	};

	const addFieldHover = () => {
		for (let field of fields) {
			field.classList.add("field-hover");
			field.style.cursor = "pointer";
		}
	};
	const removeFieldHover = () => {
		for (let field of fields) {
			field.classList.remove("field-hover");
			field.style.cursor = "default";
		}
	};

	const updateBoardField = (isFinished) => {
		if (isFinished && gameController.getWinner() != null) {
			let winCombo = gameController.getWinner().choice;
			for (let i = 0; i < winCombo.length; i++) {
				let fieldIdx = winCombo[i];
				gameBoard.fields[fieldIdx].style.backgroundColor = "var(--sub-color-hover)";
			}
			removeFieldHover();
		} else {
			addFieldHover();
		}
	};

	return { updateMessage, updateRestartBtn, updateBoardField };
})();
