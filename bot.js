const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
const prefix = '!'

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


let board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
let turn = 'x';
let gameActive = false;

function printBoard(message) {
  const boardMsg = `
${board[0][0]} | ${board[0][1]} | ${board[0][2]}
---------
${board[1][0]} | ${board[1][1]} | ${board[1][2]}
---------
${board[2][0]} | ${board[2][1]} | ${board[2][2]}
  `;
  message.channel.send(`\`\`\`${boardMsg}\`\`\``);
  message.channel.send(`Next turn ${turn}`)
}

client.on('messageCreate', message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  
  switch (command){
	case 'help':
		message.reply('later');
		break;
	case 'ttt':
		message.reply('Starting game');
		gameActive=true;
		printBoard(message);
		break;
	case 'mv':
		if (gameActive==true) {
			if (board[args[0]][args[1]] === ' ' && args.length === 2) {
				board[args[0]][args[1]]=turn;
				turn = (turn === 'x') ? 'o' : 'x';
				check(message);
				printBoard(message);
			}
		} else {message.reply('No active game');}
		break;
	}
});

function check(message) {
  const winPatterns = [
    // rows
    [ [0, 0], [0, 1], [0, 2] ],
    [ [1, 0], [1, 1], [1, 2] ],
    [ [2, 0], [2, 1], [2, 2] ],
    // columns
    [ [0, 0], [1, 0], [2, 0] ],
    [ [0, 1], [1, 1], [2, 1] ],
    [ [0, 2], [1, 2], [2, 2] ],
    // diagonals
    [ [0, 0], [1, 1], [2, 2] ],
    [ [0, 2], [1, 1], [2, 0] ]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    const valA = board[a[0]][a[1]];
    const valB = board[b[0]][b[1]];
    const valC = board[c[0]][c[1]];

    if (valA !== ' ' && valA === valB && valB === valC) {
      gameActive = false;
      message.channel.send(`Player **${valA.toUpperCase()}** wins!`);
    }
  }
  const allFilled = board.flat().every(cell => cell !== ' ');
  if (allFilled) {
    gameActive = false;
    message.channel.send('Draw');
  }
}
client.login(token);
