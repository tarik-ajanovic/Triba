let winAudio = document.querySelector('#winmusic');
winAudio.volume = 0.7;

let backgroundAudio = document.querySelector('#bgmusic');
backgroundAudio.volume = 0.5;

let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");

function playWin(){
	winAudio.play();
}

function stopWin(){
	winAudio.pause();
	winAudio.currentTime = 0;
}

function playMusic(){
	backgroundAudio.play();
}

function stopMusic(){
	backgroundAudio.pause();
	backgroundAudio.currentTime = 0;
}

var valid_moves = [];

function createGrid(m, n, custom){
	ctx.clearRect(0, 0, 500, 500);
	ctx.lineWidth = 1;

	centers = [] //{x,y}

	r = 10; //(500/n)/2-n;
	let spacingX = (500 - (2*r*n))/(n-1);
	let spacingY = (500 - (2*r*m))/(m-1);

	if (custom === false){
		for (let i = 0; i < m; i+=1){
			for (let j = 0; j < n; j+=1){
				ctx.beginPath();
				ctx.arc((j*(2*r+spacingX))+r, (i*(2*r+spacingY))+r, r, 0, 2 * Math.PI);
				ctx.fillStyle = 'rgba(229,204,34, 0.33)';
				ctx.fill();
				ctx.strokeStyle = 'rgba(229,204,34, 0.50)';
				ctx.stroke();
				centers.push({
					x: (j*(2*r+spacingX))+r,
					y: (i*(2*r+spacingY))+r
				})
			}
		}
	}
	if (custom === true){
		for (let i = 0; i < m; i+=1){
				for (let j = 0; j < n; j+=1){
					if(i>m/2-1 && j>n/2-1){
						ctx.beginPath();
						ctx.arc((j*(2*r+spacingX))+r, (i*(2*r+spacingY))+r, r, 0, 2 * Math.PI);
						ctx.fillStyle = 'rgba(229,204,34, 0.33)';
						ctx.fill();
						ctx.strokeStyle = 'rgba(229,204,34, 0.50)';
						ctx.stroke();
						centers.push({
							x: (j*(2*r+spacingX))+r,
							y: (i*(2*r+spacingY))+r
						})
						valid_moves.push({x: j, y: i});
					}
					else if(i<m/2 && j<n/2){
						ctx.beginPath();
						ctx.arc((j*(2*r+spacingX))+r, (i*(2*r+spacingY))+r, r, 0, 2 * Math.PI);
						ctx.fillStyle = 'rgba(229,204,34, 0.33)';
						ctx.fill();
						ctx.strokeStyle = 'rgba(229,204,34, 0.50)';
						ctx.stroke();
						centers.push({
							x: (j*(2*r+spacingX))+r,
							y: (i*(2*r+spacingY))+r
						})
						valid_moves.push({x: j, y: i});
					}
					else if(i+j === (m+n)/2-1){
						ctx.beginPath();
						ctx.arc((j*(2*r+spacingX))+r, (i*(2*r+spacingY))+r, r, 0, 2 * Math.PI);
						ctx.fillStyle = 'rgba(229,204,34, 0.33)';
						ctx.fill();
						ctx.strokeStyle = 'rgba(229,204,34, 0.50)';
						ctx.stroke();
						centers.push({
							x: (j*(2*r+spacingX))+r,
							y: (i*(2*r+spacingY))+r
						})
						valid_moves.push({x: j, y: i});
					}
				}
			}

		}
	return centers;
}

function isTriangle(coordinates) {
	// If the area of the triangle is 0 then the user hasn't inputted the valid triangle
	let a = Math.sqrt((coordinates.x2-coordinates.x1)**2 + (coordinates.y2-coordinates.y1)**2);
	let b = Math.sqrt((coordinates.x3-coordinates.x1)**2 + (coordinates.y3-coordinates.y1)**2);
	let c = Math.sqrt((coordinates.x3-coordinates.x2)**2 + (coordinates.y3-coordinates.y2)**2);

	let s = (a+b+c)/2;

	let ar = Math.sqrt(s*(s-a)*(s-b)*(s-c));

	//console.log("the area of the triangle is ", ar);
	return !(ar < 0.001 || isNaN(ar));
}

function segmentIntersection(x1,y1,x2,y2,x3,y3,x4,y4){
	//uradjeno po Bezierovim parametrima, formula sa https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
	//console.log("checking segment intersection for", x1,y1,x2,y2,x3,y3,x4,y4);
	const den = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

	//console.log("denominator is ", den);
	if (den === 0)	return false;

	let t = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / den;
	let u = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / den;


	return t >= 0 && t <= 1 && u >= 0 && u <= 1;


}

function moveIsLegal(coordinates, firstPlayerMoves, secondPlayerMoves) {
	/* potrebno je provjeriti da li se duzi sacinjene od unesenih tacaka x1...x3 y1...y3 presjecaju sa vec unesenim potezima prvog i drugog igraca
	takodjer u slucaju da su pocetak ili kraj neke duzi jednaki sa pocetkom ili krajem neke druge tada potez nije legalan
	 */

	//console.log("checking legality of", coordinates.x1, coordinates.y1, coordinates.x2, coordinates.y2, coordinates.x3, coordinates.y3);

	if (!isTriangle(coordinates))	return false;

	let x1 = coordinates.x1; let y1 = coordinates.y1;
	let x2 = coordinates.x2; let y2 = coordinates.y2;
	let x3 = coordinates.x3; let y3 = coordinates.y3;



	for (let i = 0; i < firstPlayerMoves.length; i+=1) {
		let mx1 = firstPlayerMoves[i].x1;
		let my1 = firstPlayerMoves[i].y1;
		let mx2 = firstPlayerMoves[i].x2;
		let my2 = firstPlayerMoves[i].y2;
		let mx3 = firstPlayerMoves[i].x3;
		let my3 = firstPlayerMoves[i].y3;

		if (segmentIntersection(x1, y1, x2, y2, mx1, my1, mx2, my2) ||
			segmentIntersection(x1, y1, x2, y2, mx1, my1, mx3, my3) ||
			segmentIntersection(x1, y1, x2, y2, mx2, my2, mx3, my3) ||
			segmentIntersection(x1, y1, x3, y3, mx1, my1, mx2, my2) ||
			segmentIntersection(x1, y1, x3, y3, mx1, my1, mx3, my3) ||
			segmentIntersection(x1, y1, x3, y3, mx2, my2, mx3, my3) ||
			segmentIntersection(x2, y2, x3, y3, mx1, my1, mx2, my2) ||
			segmentIntersection(x2, y2, x3, y3, mx1, my1, mx3, my3) ||
			segmentIntersection(x2, y2, x3, y3, mx2, my2, mx3, my3))	{
			//console.log("Collision with first player's triangle");
			return false;
		}
	}

	for (let j = 0; j < secondPlayerMoves.length; j+=1) {
		let nx1 = secondPlayerMoves[j].x1;
		let ny1 = secondPlayerMoves[j].y1;
		let nx2 = secondPlayerMoves[j].x2;
		let ny2 = secondPlayerMoves[j].y2;
		let nx3 = secondPlayerMoves[j].x3;
		let ny3 = secondPlayerMoves[j].y3;

		if (segmentIntersection(x1, y1, x2, y2, nx1, ny1, nx2, ny2) ||
			segmentIntersection(x1, y1, x2, y2, nx1, ny1, nx3, ny3) ||
			segmentIntersection(x1, y1, x2, y2, nx2, ny2, nx3, ny3) ||
			segmentIntersection(x1, y1, x3, y3, nx1, ny1, nx2, ny2) ||
			segmentIntersection(x1, y1, x3, y3, nx1, ny1, nx3, ny3) ||
			segmentIntersection(x1, y1, x3, y3, nx2, ny2, nx3, ny3) ||
			segmentIntersection(x2, y2, x3, y3, nx1, ny1, nx2, ny2) ||
			segmentIntersection(x2, y2, x3, y3, nx1, ny1, nx3, ny3) ||
			segmentIntersection(x2, y2, x3, y3, nx2, ny2, nx3, ny3))	{
			//console.log("Collision with second player's triangle");
			return false;
		}
	}
	return true;
}

function winCondition(m,n,firstPlayerMoves, secondPlayerMoves, custom)	{
	console.log("checking if win condition is met");

	for (let x1 = 0; x1<n; x1+=1)
		for (let y1 = 0; y1<m; y1+=1)
			for (let x2 = 0; x2<n; x2+=1)
				for (let y2 = 0; y2<m; y2+=1)
					for (let x3 = 0; x3<n; x3+=1)
						for (let y3 = 0; y3<m; y3+=1){
							let coordinates = {
								x1: x1, y1: y1,
								x2: x2, y2: y2,
								x3: x3, y3: y3
							}
							if (custom){
								let firstValid=false;
								let secondValid=false;
								let thirdValid=false;
								let isValid = false;
								for (let i = 0; i<valid_moves.length; i+=1){
									if (x1 === valid_moves[i].x && y1 === valid_moves[i].y){
										firstValid=true;
									}
									if (x2 === valid_moves[i].x && y2 === valid_moves[i].y){
										secondValid=true;
									}
									if (x3 === valid_moves[i].x && y3 === valid_moves[i].y){
										thirdValid=true;
									}
								}
								if (firstValid && secondValid && thirdValid)	isValid=true;
								if (isValid){
									if (moveIsLegal(coordinates,firstPlayerMoves,secondPlayerMoves))	{
										console.log("there are still valid moves on the board", coordinates);
										return false;
									}
								}
							}
							else {
								if (moveIsLegal(coordinates,firstPlayerMoves,secondPlayerMoves))	{
									console.log("there are still valid moves on the board", coordinates);
									return false;
								}
							}

						}

	console.log("Win condition met");
	return true;

}

function winner(firstPlayer){
	document.getElementById("hidden").style.display = "block";
	document.getElementById("player").style.display = "none";
	if (firstPlayer){
		text = "PLAYER 1 IS THE WINNER!";
		color = "#1eff00";
	}
	else {
		text = "PLAYER 2 IS THE WINNER";
		color = "#ff0000";
	}

	let w = document.getElementById("winner");
	w.innerText = text;
	w.style.color = color;

}

function replay(){
	startGame(mcoord,ncoord,cust);
}

var gameNo = 0;
var mcoord, ncoord, cust;
//The actual game
function startGame(m,n, custom){
	document.getElementById("hidden").style.display = "none";
	document.getElementById("player").style.display = "block";
	mcoord = m;
	ncoord = n;
	cust = custom;
	stopWin();
	playMusic();
	centers = createGrid(m,n,custom);

	xindex = 500/n;
	yindex = 500/m;

	gameNo+=1;
	let firstPlayer;
	firstPlayer = gameNo % 2 !== 0;

	if (firstPlayer) {
		document.getElementById("player").innerText = "Player 1's Turn";
		document.getElementById("player").style.color = "#1eff00";
	}
	else {
		document.getElementById("player").innerText = "Player 2's Turn";
		document.getElementById("player").style.color = "#ff0000";
	}

	elemLeft = c.offsetLeft + c.clientLeft;
	elemTop = c.offsetTop + c.clientTop;

	let points = [];

	let firstPlayerMoves = [];
	let secondPlayerMoves = [];

	/* IDEJA JE NAPRAVIT DODATNU MATRICU mxn zbog cuvanja manjih cifri u koju ce se pisat koordinate upisanih trouglova
	, otprilike je formula (centar-10)/500/m za x i 500/n za y i to floorat za indeks. Gornje funkcije za provjeru legalnosti bi trebale ostat iste
	ali nadam se da ce biti preciznije jer ce koordinate sustinski ici od 0 do m odnosno n
		nastaviti ici tom logikom i za kolizije trouglova, centers i points koristiti samo za crtanje po ekranu
		POGLEDAJ DOLJE KOMENTARE
	*/
	let moveNo = 0;
	c.addEventListener('click', function (event){
		let x = event.pageX - elemLeft;
		let y = event.pageY - elemTop;

		for (let i = 0; i < centers.length; i+=1){
			let x1 = centers[i].x;
			let y1 = centers[i].y;
			let distance = Math.sqrt((x-x1)**2+(y-y1)**2);

			if (distance < 10)	points.push({
				x: x1,
				y: y1
			});
		}
		if (points.length === 3) {
			const x1 = Math.floor(points[0].x/xindex);
			const y1 = m-1-Math.floor(points[0].y/yindex);
			const x2 = Math.floor(points[1].x/yindex);
			const y2 = m-1-Math.floor(points[1].y/yindex);
			const x3 = Math.floor(points[2].x/xindex);
			const y3 = m-1-Math.floor(points[2].y/yindex);

			let coordinates = {
				x1: x1, y1: y1,
				x2: x2, y2: y2,
				x3: x3, y3: y3
			}

			console.log("trying to draw", coordinates);
			if (moveIsLegal(coordinates, firstPlayerMoves, secondPlayerMoves)) {
				console.log("move is legal");
				moveNo +=1;
				console.log("Move number ", moveNo);
				ctx.lineWidth = 3;
				ctx.beginPath();
				ctx.moveTo(points[0].x, points[0].y);
				ctx.lineTo(points[1].x, points[1].y);
				ctx.lineTo(points[2].x, points[2].y);
				ctx.closePath();
				if (firstPlayer) ctx.strokeStyle = '#1eff00';
				else ctx.strokeStyle = '#ff0000';
				ctx.stroke();

				/*SUSTINSKI CE SE OVDJE DODAVAT U JEDNOSTAVNU MATRICU JER SE SA LOGOVANIM POTEZIMA PROVJERAVA VALIDNOST POTEZA
				* POTREBNO JE GORE U moveIsLegal konvertovat i stvari iz Points u LAGANI SISTEM
				* */

				if (firstPlayer) {
					firstPlayerMoves.push({
						x1: x1, y1: y1,
						x2: x2, y2: y2,
						x3: x3, y3: y3
					})
				}
				if (!firstPlayer) {
					secondPlayerMoves.push({
						x1: x1, y1: y1,
						x2: x2, y2: y2,
						x3: x3, y3: y3
					})
				}

				if (moveNo > 4)
					if (winCondition(m,n,firstPlayerMoves,secondPlayerMoves,custom)){
						stopMusic();
						winner(firstPlayer);
						playWin();
					}

				firstPlayer = !firstPlayer;
			}
			else console.log("illegal move");
			console.log("reseting input");
			points = [];
		}
		if (firstPlayer) {
			document.getElementById("player").innerText = "Player 1's Turn";
			document.getElementById("player").style.color = "#1eff00";
		}
		else {
			document.getElementById("player").innerText = "Player 2's Turn";
			document.getElementById("player").style.color = "#ff0000";
		}

	});

}