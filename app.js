document.addEventListener('DOMContentLoaded', () =>{
    const width = 10
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]
 
    console.log(squares.length)
    //The tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1,width*2+2]
    ]

    const zTetromino = [
        [1, 2, width, width+1],
        [0, width, width+1, width*2+1],
        [1, 2, width, width+1],
        [0, width, width+1, width*2+1]
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const sTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1], //indexy
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, sTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    //randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random] [currentRotation]

    //draw the tetromino
    function draw()
    {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //undraw th Thetromino
    function undraw() 
    {
        current.forEach(index =>{
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''

        })
    }

    //assign functions to keyCodes
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft()
        } else if(e.keyCode === 38) {
            rotate()
        } else if(e.keyCode === 39) {
            moveRight()
        } else if(e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)


    //move down funcion
    function moveDown()
    {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //freeze function
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //start new tetromino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
        }
    }

    //move the tetromino left, unless is at the edge or is blocked
    function moveLeft()
    {
        undraw()
        const isALeftEdge = current.some(index => (currentPosition + index) % width ===0)

        if(!isALeftEdge) currentPosition -=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition +=1
        }

        draw()
    }

     //move the tetromino right, unless is at the edge or is blocked
    function moveRight()
    {
        undraw()

        const isARightEdge = current.some(index => (currentPosition + index) % width === 9)

        if(!isARightEdge) currentPosition +=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -=1
        }

        draw()
    }

//rotating the tetromino

    function rotate()
    {
        undraw()

            currentRotation ++
            if(currentRotation === current.length)
            {
                currentRotation = 0
            }
            current = theTetrominoes [random] [currentRotation]

            draw()
    }

    //show up next tetromino
   // const miniGrid = document.querySelector('.mini-grid')
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //L
        [1, 2, displayWidth, displayWidth+1], //z
        [1, displayWidth, displayWidth+1, displayWidth+2], //t
        [0, 1, displayWidth, displayWidth+1], //square
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //i
    ]
    //display the shape in mini grid
    function displayShape() {
        //remove the shape in tetromino form the entire grid
        displaySquares.forEach(index =>{
            index.classList.remove('tetromino')
            index.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index =>{
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //add functionality to buttons
    startBtn.addEventListener('click', () =>{
        if(timerId)
        {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 500)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })

    //add score
    function addScore()
    {
        for(let i = 0; i < 199; i +=width)
        {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken')))
            {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
                //console.log(squaresRemoved)
            }
        }
    }

    //game over
    function gameOver()
    {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
            scoreDisplay.innerHTML ='end'
            clearInterval(timerId)
        }
        
    }

})