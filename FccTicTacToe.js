$(document).ready(function () {
    'use strict';
    
    var turn, turnstaken = 0, spot = 1, opponent, player1, player2, gameinprogress = false, player1picks = [], player2picks = [], usedspots = [];
    
    function reset() { //resets everything for a new game
        $("#player1x, #computer").prop("checked", true);
        $(".btn").html("&nbsp");
        $(".btn").css("cursor", "default");
        $("input, #start").css("cursor", "pointer");
        $("input, #start").prop("disabled", false);
        gameinprogress = false;
        turnstaken = 0;
        player1picks = [];
        player2picks = [];
        usedspots = [];
        spot = 1;
        $(".turn").html("X goes first");
    } //end reset();
    
    function checkforwinner(array) { //this cycles through the array to see if any of the three numbers add up to 15, which would give a winner
        var i, j, k;
        for (i = 0; i < array.length; i++) {
            for (j = i + 1; j < array.length; j++) {
                for (k = j + 1; k < array.length; k++) {
                    if (array[i] + array[j] + array[k] === 15) {
                        return true;
                    }
                }
            }
        }
        return false;
    } //end checkforwinner()

    function checkifused(x) { //checks if current spot clicked has already been used
        var i;
        for (i = 0; i < usedspots.length; i++) {
            if (x === usedspots[i]) {
                return true;
            }
        }
        return false;
    } //end checkifused
    
    function findspot(array) { //this finds what move to do, looks for first available in best moves, only used in computerturn()
        var i, j, move;
        for (i = 0; i < array.length; i++) {
            for (j = 0; j < usedspots.length; j++) {
                if (!checkifused(array[i])) {
                    move = array[i];
                    return move;
                }
            }
        }
    } //end findspot()
    
    function endofturn(array) {
        turnstaken += 1;
        if (checkforwinner(array)) { //winner this turn
            alert(turn + " wins!");
            reset();
        } else if (usedspots.length === 9) { //all spots useds - its a tie
            alert("It's a Tie");
            reset();
        } else { //no winner - no tie
            if (turn === "Player 2") { //@ end of player 2's turn
                $(".turn").html("Player 1's turn"); //changes display of whose turn it is next
                turn = "Player 1"; //changes whose turn it is, so next click will go to correct section of js
            } else { //@ end of player 1's turn
                $(".turn").html("Player 2's turn"); //changes display of whose turn it is next
                turn = "Player 2"; //changes whose turn it is, so next click will go to correct section of js   
                if (opponent === "computer") { //goes to computers turn if oppenent = computer
                    computerturn();
                }
            }
        }
    } //end endofturn()
    
    function computerturn() {
        var i, j, k, l, move, bestmoves = [];

        for (i = 0; i < player2picks.length; i++) { //this pushes any winning moves to an array
            for (j = i + 1; j < player2picks.length; j++) {
                if (15 - player2picks[i] - player2picks[j] > 0 && 15 - player2picks[i] - player2picks[j] < 10) {
                    bestmoves.push(15 - player2picks[i] - player2picks[j]);
                }
            }
        } //end find winning moves
        
        for (i = 0; i < player1picks.length; i++) { //this pushes any blocking moves to an array
            for (j = i + 1; j < player1picks.length; j++) {
                if (15 - player1picks[i] - player1picks[j] > 0 && 15 - player1picks[i] - player1picks[j] < 10) {
                    bestmoves.push(15 - player1picks[i] - player1picks[j]);
                }
            }
        } //end find blocking moves

        if (turnstaken === 1) { //this will be the computers move on his first turn, ...player went first - computer second
            bestmoves.push(5); //first choice is center
            do { //second choice is a random corner
                move = 1 + Math.floor(Math.random() * 9);
            } while (move % 2 !== 0); //this gets random even# between 1&9 for cpu to pick random corner
            bestmoves.push(move);
        }
        
        if (turnstaken === 3) { //this will be the computer 2nd move, 4th overall
            if (player1picks[1] % 2 === 0 && (player1picks[0] === 5 || player1picks[1] === 5)) { //meaning player 1's 2nd pick is a corner
                do { //this gets random corner if player has a corner and center 
                    move = 1 + Math.floor(Math.random() * 9);
                } while (move % 2 !== 0 || (checkifused(move)));
                bestmoves.push(move);
            } else { 
                do { //this gets random edge if the above condition is not met
                    move = 1 + Math.floor(Math.random() * 9);
                } while (move % 2 === 0 && move !== 5);
                bestmoves.push(move);
            }
        }

        do { //this pushes a random unused spot to the array to ensure a move is made
            move = 1 + Math.floor(Math.random() * 9);
        } while (checkifused(move));
        bestmoves.push(move);

        spot = findspot(bestmoves);
        player2picks.push(spot);
        usedspots.push(spot);
        $("#btn" + spot).html(player2); //this fills in the board with X or O
        endofturn(player2picks);
    } //end computerturn
    
    $("#start").click(function () { //sets variables when start is clicked
        if (!gameinprogress) {
            gameinprogress = true;
            player1 = $('input:radio[name=player1]:checked').val();
            opponent = $('input:radio[name=player2]:checked').val();
            if (player1 === "X") {
                player2 = "O";
            } else { //player1 === "O"
                player2 = "X";
            } //end if/else
            $(".btn").css("cursor", "pointer");
            $("input, #start").css("cursor", "default");
            $("input, #start").attr('disabled', 'disabled');
            if (player2 === "X" && opponent === "computer") { //this is the first turn of the game (X goes first)
                do {
                    spot = 1 + Math.floor(Math.random() * 9);
                } while (spot % 2 !== 0); //this gets random even# between 1&9 for cpu's first turn, ...so it picks a corner
                turnstaken += 1;
                player2picks.push(spot);
                usedspots.push(spot);
                $("#btn" + spot).html("X");
                $(".turn").html("Player 1's turn");
                turn = "Player 1";
            } else if (player2 === "X" && opponent === "human") {
                $(".turn").html("Player 2's turn");
                turn = "Player 2";
            } else { //player1 === "X"
                $(".turn").html("Player 1's turn");
                turn = "Player 1";
            } //end first turn of game
        } //end if(!gameinprogress)
    }); //end $("#start").click
    
    $("#reset").click(function () { //calls reset() when clicked
        reset();
    }); //end $("#reset").click
    
    $(".btn").click(function () {
        if (gameinprogress) { //can only click spots if gameinprogress === true
            spot = parseInt($(this).attr("value")); //gives value of what box was clicked
            
            if (!checkifused(spot)) { //this happens if the spot clicked is not already used
                if (turn === "Player 1") { //this means its player1's turn and they just picked a spot
                    player1picks.push(spot);
                    usedspots.push(spot);
                    $("#btn" + spot).html(player1); //this fills in the board with X or O
                    endofturn(player1picks);
                } else if (turn === "Player 2") { //this means its player2's turn and they just picked a spot
                    player2picks.push(spot);
                    usedspots.push(spot);
                    $("#btn" + spot).html(player2); //this fills in the board with X or O
                    endofturn(player2picks);
                } //end of turn
            } //end if(!checkifused(current))
        } //end if(gameinprogress)
    }); //end $(".btn").click
}); //end $(document).ready