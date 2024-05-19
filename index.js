class Board {
    constructor () {
        this.board = []
        for (let i =0;i<8;i++) {
            this.board.push([null,null,null,null, null,null, null,null ])
        }
    }
    get_image (x, y) {
        let row = rows[7-y]
        let div = row.querySelectorAll('div')[x]
        return div.querySelector('img')
    }
    remove_figure (figure) {
        this.board[figure.x][figure.y] = null
        let image = this.get_image(figure.x, figure.y)
        image.style.opacity = 0
    }
    set_figure (figure,new_x,new_y) {
        this.remove_figure(figure)
        figure.x = new_x
        figure.y = new_y
        this.board[new_x][new_y] = figure
        let image = this.get_image(figure.x, figure.y)
        image.style.opacity = 1
        figure.draw()
    }
    filter_figures_by_color (color) {
        let result = []
        for (let i=0; i<8;i++) {
            for (let j=0; j<8;j++) {
                if (this.board[i][j] != null) {
                    if (this.board[i][j].isWhite == color) {
                        result.push(this.board[i][j])
                    }
                }
            }
        }
        return result
    }
}
let board = new Board ()
let rows = document.querySelectorAll('.row')
let turn_container = document.querySelector(".turn-container")

class Figure  {
    constructor (x, y, isWhite, image ){
        this.x =x
        this.y =y
        board.board[x][y] = this
        this.isWhite = isWhite
        this.image = `./src/${ this.isWhite? 'white':'black' }_${image}.png` 
    }
    check_pre_turn (x, y, isRecursion) {
        // pre-turn (for checking defending own king)
        let enemies = board.filter_figures_by_color(!this.isWhite)
        let my_king = this.isWhite ?  white_king : black_king
        
        if (isRecursion && board.board[x][y] == null) {
            
            board.board[x][y] = this
            board.board[this.x][this.y] = null

            for (let i=0; i<enemies.length;i++) {
                if (enemies[i].check_turn(my_king.x, my_king.y, false)==true) {
                    board.board[x][y] = null
                    board.board[this.x][this.y] = this
                    return false
                }
            }

            board.board[x][y] = null
            board.board[this.x][this.y] = this
            return true
        }
    }
    draw () {
        let row = rows[7-this.y]
        let div = row.querySelectorAll('div')[this.x]
        let image = div.querySelector('img')
        image.src = this.image
        image.style.opacity = 1
    }
}
let isProhod = false
class Pawn extends Figure {
    constructor (x, y, isWhite) {
        super(x, y, isWhite, 'pawn')
        this.label = 'п'
    }
    check_turn(x, y, isRecursion=true) {
        if (this.check_pre_turn(x,y,isRecursion) == false) {
           return false
        }
        if (this.isWhite) {
        // WHITE
            if (Math.abs(x-this.x)==1 && y-this.y==1) {
                let last_turn = history[history.length-1]
                if (last_turn.figure.image.includes('pawn') && Math.abs(last_turn.start_pos[1] -last_turn.end_pos[1]) == 2 && last_turn.figure.x == x ) {
                    last_turn.figure.x = last_turn.end_pos[0]
                    last_turn.figure.y = last_turn.end_pos[1]
                    board.remove_figure(last_turn.figure)
                    isProhod = true
                    return true
                }

                        if (board.board[x][y] != null) {
                            if (board.board[x][y].isWhite != this.isWhite) {
                                return true
                            }
                            return false
                        }
                    }
            if (this.y == 1) {
            // BEGIN
                if (this.x == x) {
                    if (y-this.y < 3) {
                        if (y-this.y == 1) {
                            if (board.board[x][y] == null) {return true}
                        } 
                        if (y-this.y == 2) {
                            if (board.board[x][y] == null && board.board[x][y-1] == null) {return true}
                        } 
                    }
                } 

            } else {
                    
                    if (this.x==x && y-this.y==1 && board.board[x][y] == null) {
                        return true
                    }
            }
        } else {
        // BLACK
        if (Math.abs(x-this.x)==1 && y-this.y==-1) {
            let last_turn = history[history.length-1]
                if (last_turn.figure.image.includes('pawn') && Math.abs(last_turn.start_pos[1] -last_turn.end_pos[1]) == 2 && last_turn.figure.x == x ) {
                    last_turn.figure.x = last_turn.end_pos[0]
                    last_turn.figure.y = last_turn.end_pos[1]
                    board.remove_figure(last_turn.figure)
                    isProhod = true
                    return true
                }
            if (board.board[x][y] != null) {
                if (board.board[x][y].isWhite != this.isWhite) {
                    return true
                }
            }
        }
        if (this.y == 6) {
            // BEGIN
                if (this.x == x) {
                    if (y-this.y > -3) {
                        if (y-this.y == -1) {
                            if (board.board[x][y] == null) {return true}
                        } 
                        if (y-this.y == -2) {
                            if (board.board[x][y] == null && board.board[x][y+1] == null) {return true}
                        } 
                    }
                } 

            } else {
                    
                    if (this.x==x && y-this.y==-1 && board.board[x][y] == null) {
                        return true
                    }
            }

        }

    }
}

class Rook extends Figure {
    constructor (x, y, isWhite) {
        super(x, y, isWhite, 'rook')
        this.label = 'Л'
    }
    check_turn(x,y,isRecursion=true) {
        if (this.check_pre_turn(x,y,isRecursion) == false) {
            return false
        }
        if (this.x - x == 0 || this.y - y == 0) {
            let delta_x = 0
            if (this.x != x) { delta_x = (x-this.x) / Math.abs(x-this.x) }
            
            let delta_y = 0
            if (this.y != y) { delta_y = (y-this.y) / Math.abs(y-this.y) }

            for (let i =1; i< Math.max(Math.abs(this.x-x), Math.abs(this.y-y));i++ ) {
                if (board.board[this.x+delta_x*i][this.y+delta_y*i] != null) {
                    return false
                }
            }
            return true

        }
        return false
    }
}

class King extends Figure {
    constructor(x, y, isWhite) {
        super(x, y, isWhite, 'king')
        this.label = 'Кр'
    }
    check_turn(x,y,isRecursion=true) {
        if (Math.abs(this.x-x) in [1,0] && Math.abs(this.y-y) in [0,1] ) {
            // figure
            if (board.board[x][y] != null) {
                // my color figure
                if (board.board[x][y].isWhite == this.isWhite) {
                    return false
                } else {
                    // pre-turn
                    let remove_figure = board.board[x][y]
                    board.board[x][y] = this
                    board.board[this.x][this.y] = null
                    
                    let enemies = board.filter_figures_by_color(!this.isWhite)


                    for (let i=0; i<enemies.length;i++) {
                        if (enemies[i].check_turn(x, y, false)==true) {
                            board.board[x][y] = remove_figure
                            board.board[this.x][this.y] = this
                            return false
                        }
                    }
                    board.board[x][y] = remove_figure
                    board.board[this.x][this.y] = this
                    return true
                }

            } else {
                // null cell
                let enemies = board.filter_figures_by_color(!this.isWhite)
                board.board[x][y] = this
                board.board[this.x][this.y] = null
                for (let i=0; i<enemies.length;i++) {
                    if (enemies[i].check_turn(x, y, false)==true) {
                        board.board[x][y] = null
                        board.board[this.x][this.y] = this
                        return false
                    }
                }
                board.board[x][y] = null
                board.board[this.x][this.y] = this
                return true
            }
        }
    }
}

class Queen extends Figure {
    constructor(x, y, isWhite) {
        super(x, y, isWhite, "queen")
        this.label = 'Ф'
    }
    check_turn(x,y, isRecursion=true) {
        if (this.check_pre_turn(x,y,isRecursion) == false) {
            return false
        }
        if (this.x - x == 0 || this.y - y == 0 || Math.abs(this.x - x) == Math.abs(this.y - y)) {
            let delta_x = 0
            if (this.x != x) { delta_x = (x-this.x) / Math.abs(x-this.x) }
            
            let delta_y = 0
            if (this.y != y) { delta_y = (y-this.y) / Math.abs(y-this.y) }

            for (let i =1; i< Math.max(Math.abs(this.x-x),Math.abs(this.y-y));i++ ) {
                if (board.board[this.x+delta_x*i][this.y+delta_y*i] != null) {
                    return false
                }
            }
            return true

        }
        return false
    }
}
class Knight extends Figure {
    constructor (x,y,isWhite){
        super(x,y,isWhite, 'knight')
        this.label = 'К'
    }
    check_turn(x,y, isRecursion=true) {
        if (this.check_pre_turn(x,y,isRecursion) == false) {
            return false
        }
        return Math.abs(this.x-x) === 2 && Math.abs(this.y-y) === 1 || Math.abs(this.x-x) === 1 && Math.abs(this.y-y) === 2
    }
}
class Bishop extends Figure {
    constructor (x,y,isWhite){
        super(x,y,isWhite, 'bishop')
        this.label = 'С'
    }
    check_turn(x,y, isRecursion=true) {
        if (this.check_pre_turn(x,y,isRecursion) == false) {
            return false
        }
        // Check turn available
        if (Math.abs(this.x - x) == Math.abs(this.y - y)) {
            let delta_x = 0
            if (this.x != x) { delta_x = (x-this.x) / Math.abs(x-this.x) }
            
            let delta_y = 0
            if (this.y != y) { delta_y = (y-this.y) / Math.abs(y-this.y) }

            for (let i =1; i< Math.max(Math.abs(this.x-x),Math.abs(this.y-y));i++ ) {
                if (board.board[this.x+delta_x*i][this.y+delta_y*i] != null) {
                    return false
                }
            }
            return true

        }
        return false
    }
}
let figures = []
/* Pawns */
for (let i=0; i<8;i++) {
    figures.push(new Pawn(i,1, true))
}

for (let i=0; i<8;i++) {
    figures.push(new Pawn(i,6, false))
}
/* Kings */
figures.push(new King(4,0, true))
let white_king = figures[figures.length-1]
figures.push(new King(4,7, false))
let black_king = figures[figures.length-1]

/* Queens */
figures.push(new Queen(3,0, true))

figures.push(new Queen(3, 7, false))

/* Rook */
figures.push(new Rook(0,0, true))
figures.push(new Rook(7,0, true))

figures.push(new Rook(0,7, false))
figures.push(new Rook(7,7, false))

figures.push(new Knight(1,0, true))
figures.push(new Knight(6,0, true))

figures.push(new Knight(1,7, false))
figures.push(new Knight(6,7, false))
figures.push(new Bishop(2,0,true))
figures.push(new Bishop(5,0,true))

figures.push(new Bishop(2,7,false))
figures.push(new Bishop(5,7,false))

for (let i=0; i<figures.length;i++) {
    figures[i].draw()
}

const abc = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h'
}
let history = []
// history.push(turn)

const history_list = document.querySelector('.history-list')

let chooseFigure = null
let last_cell = null
let isWhiteTurn = true


function turn (c, row) {
    board.remove_figure(chooseFigure)
        
        isWhiteTurn = !isWhiteTurn
        
        if (last_cell != null) { 
            last_cell.style.backgroundColor = ''
            last_cell = null
        }
        if (isWhiteTurn) {
            turn_container.style.color = "white"
            turn_container.innerHTML = "Ход белых"
        } else {
            turn_container.style.color = "black"
            turn_container.innerHTML = "Ход чёрных"
        }
        let new_history_element = document.createElement("li")
        new_history_element.innerHTML = `${chooseFigure.label}${ isProhod==true||board.board[c][7-row]!=null ? ':' : ' '}${abc[chooseFigure.x]}${chooseFigure.y+1}-${abc[c]}${8-row}`
        isProhod = false
        history_list.appendChild(new_history_element)
        history.push({figure:chooseFigure, start_pos: [chooseFigure.x, chooseFigure.y], end_pos:[c, 7-row] })
        board.set_figure(chooseFigure, c, 7-row )
        chooseFigure = null
}

for (let row = 0; row<rows.length; row++) {
    let cells = rows[row].querySelectorAll('div')
    for (let c = 0; c<cells.length; c++) {
        cells[c].addEventListener('click', function () {
            if (board.board[c][7-row] != null) {
                if (chooseFigure != null) {
                    if (board.board[c][7-row].isWhite == chooseFigure.isWhite) {
                        chooseFigure = board.board[c][7-row]
                        if (last_cell != null) { last_cell.style.backgroundColor = ''}
                        // BLUE
                        let image = board.get_image(c, 7-row)
                        image.style.backgroundColor = '#00CF0050' 
                        last_cell = image
                    } else {
                        if (chooseFigure.check_turn(c, 7-row)) {
                        turn (c, row)}
                    }
                } else {
                    if (isWhiteTurn == board.board[c][7-row].isWhite) {
                        chooseFigure = board.board[c][7-row]
                        if (last_cell != null) { last_cell.style.backgroundColor = ''}
                        // BLUE
                        let image = board.get_image(c, 7-row)
                        image.style.backgroundColor = '#00CF0050' 
                        last_cell = image
                    }
                }
            } else {
                if (chooseFigure != null) {
                    
                    if (chooseFigure.check_turn(c, 7-row)) {
                            turn(c, row)
                            
                        
                    }
                }
            }
        })
    }

}
