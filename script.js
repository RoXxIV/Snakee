window.onload = function(){ //By default, it is fired when the entire page loads, including its content (images, CSS, scripts, etc.).
//------------MES VARIAIABLEs---------------
 
    const canvasWidth = 900;
    const canvasHeight = 600;
    const blockSize = 30;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const widthInBlocks = canvasWidth / blockSize;
    const heightInBLocks = canvasHeight / blockSize;
    const centreX = canvasWidth /2;
    const centreY = canvasHeight /2;
    let delay;
    let snakee;
    let applee;
    let score;
    let timeout;

    init();

//---------CREATION DU CANVAS----------------

    function init(){
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            canvas.style.border = "30px solid #e5e5e5";
            canvas.style.margin = "50px auto";
            canvas.style.display = "block";
            document.body.appendChild(canvas);
            launch();
    };

    //--------START------------

    function launch(){
        snakee = new Snake([[6, 4], [5, 4], [4,4], [3, 4], [2, 4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        clearTimeout(timeout);
        delay = 100;
        refreshCanvas();
    };

//------------REFRESH CANVAS----------------

    function refreshCanvas(){
            snakee.advance();

            if(snakee.checkCollision()){
                 gameOver();
            }else{
                if(snakee.isEatingApple(applee)){
                     score++;
                     snakee.ateApple = true;
                     do{
                         applee.setNewPosition();
                     }while(applee.isOnSnake(snakee));

                     if(score % 5 == 0){
                         speedUp();
                     };
                };
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                /* supprime tout contenu précédemment dessiné
                ctx.clearRect(x, y, largeur, hauteur) */
                drawScore();
                snakee.draw();
                applee.draw();
                timeout = setTimeout(refreshCanvas,delay);
            };    
    };
//--------SPEED UP-----------
    function speedUp(){
        delay -= 5;
    }
//--------GAME OVER------------

    function gameOver(){
        ctx.save();
        ctx.font = "bold 50px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "miffle";
        ctx.strokeStyle = "#e5e5e5";
        ctx.lineWidth = 5;
        ctx.strokeText("Game Over!", centreX, centreY - 180);
        ctx.fillText("Game Over!", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText('Press " Space " to play again!', centreX, centreY - 250);
        ctx.fillText('Press " Space " to play again!', centreX, centreY - 250);
        ctx.restore();
    }


//------------AFFICHE SCORE----------------

    function drawScore(){
        ctx.save();
        ctx.font = "bold 30px sans-serif";
        ctx.fillStyle = "#2d4059";
        ctx.textAlign = "center";
        ctx.fillText(score.toString(), 28, canvasHeight - 570);
        ctx.restore();
    };

//-----------DESSINE BLOC----------------------

    function drawBlock(ctx, position){
        const x = position[0] * blockSize;
        const y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    };

//--------------MON SERPENT--------------------

    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;

        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#2d4059";
            for(let i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            };
            ctx.restore(); 
        };

        this.advance = function(){
            const nextPosition = this.body[0].slice();
                switch(this.direction){
                    case "left":
                        nextPosition[0] -= 1;
                        break;
                    case "right":
                        nextPosition[0] += 1;
                        break;
                    case "down":
                        nextPosition[1] += 1;
                        break;
                    case "up":
                        nextPosition[1] -= 1;
                        break;
                    default:
                        throw("invalid direction");
                };

            this.body.unshift(nextPosition);
            if(!this.ateApple){
                this.body.pop();
            }else{
                this.ateApple = false;
            };  
        };

        this.setDirection = function (newDirection){
            let allowedDirections;
            switch(this.direction){
                case "left": 
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break; 
                default:
                    throw("invalid direction");
            }; 
            if(allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            };
        };

        this.checkCollision = function(){
            let wallCollision = false;
            let snakeCollision = false;
            const head = this.body[0];
            const rest = this.body.slice(1);
            const snakeX = head[0];
            const snakeY = head[1];
            const minX = 0;
            const minY = 0;
            const maxX = widthInBlocks - 1;
            const maxY = heightInBLocks - 1;
            const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            const isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

                if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                    wallCollision = true;
                };

                for(let i = 0; i < rest.length; i++){
                    
                    if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                        snakeCollision = true;
                    };
                };
                return wallCollision || snakeCollision;
        };

        this.isEatingApple = function(appleToEat){
            const head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                return true;
            }else{
                false;
            };
        };
    };

//------------MA POMME-----------------

    function Apple(position){

        this.position = position;

        this.draw = function(){
            const radius = blockSize / 2;
            const x = this.position[0] * blockSize + radius;
            const y = this.position[1] * blockSize + radius;
            ctx.save();
            ctx.fillStyle = "#ea5455";
            ctx.shadowColor = 'red';
ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };

        this.setNewPosition = function(){
            const newX =Math.round(Math.random() * (widthInBlocks - 1));
            const newY =Math.round(Math.random() * (heightInBLocks - 1));
            this.position = [newX, newY];
        };

        this.isOnSnake = function(snakeToCheck){
            let isOnSnake = false;
            for(let i = 0; i < snakeToCheck.body.length; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                };
            };
            return isOnSnake;
        };
    };

//----------COMMANDES CLAVIER--------------
    document.onkeydown = function handleKeyDown(e){
        const key = e.keyCode;
        let newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                launch();
                return;
            default:
                return;
        };
        snakee.setDirection(newDirection);
    };  
      
};

