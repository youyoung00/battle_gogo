window.onload = function () {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    const margin = 30;
    const cw = (ch = canvas.width = canvas.height = 600 + margin * 2);
    const row = 18; // 바둑판 선 개수
    const rowSize = 600 / row; // 바둑판 한 칸의 너비
    const dolSize = 16;  // 바둑돌 크기
    let count = 0;
    // let msg = document.querySelector('.message');
    let btn1 = document.querySelector('#reload');
    // let btn2 = document.querySelector('#withdraw');
    let board = new Array(Math.pow(row + 1, 2)).fill(-1); // 144개의 배열을 생성해서 -1로 채움
    let history = new Array();
    // let checkDirection = [
    //   [1, -1],
    //   [1, 0],
    //   [1, 1],
    //   [0, 1],
    //   [-1, 1],
    //   [-1, 0],
    //   [-1, -1],
    //   [0, -1],
    // ];

    btn1.addEventListener('mouseup', () => {
        location.reload();
    });

    draw();

    // indexView(m); 바둑판 그리기 함수
    function draw() {
        ctx.fillStyle = '#dcbe75';
        ctx.fillRect(0, 0, cw, ch);
        for (let x = 0; x < row; x++) {
            for (let y = 0; y < row; y++) {
                let w = (cw - margin * 2) / row;
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 1;
                ctx.strokeRect(w * x + margin, w * y + margin, w, w);
            }
        }

        // 화점에 점 찍기
        for (let a = 0; a < 3; a++) {
            for (let b = 0; b < 3; b++) {
                ctx.fillStyle = 'black';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(
                    (3 + a) * rowSize + margin + a * 5 * rowSize,
                    (3 + b) * rowSize + margin + b * 5 * rowSize,
                    dolSize / 3,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    }

    // x,y 좌표를 배열의 index값으로 변환

    let xyToIndex = (x, y) => {
        return x + y * (row + 1);
    };

    // 배열 index값을 x,y좌표로 변환
    let indexToXy = (i) => {
        w = Math.sqrt(board.length);
        x = i % w;
        y = Math.floor(i / w);
        return [x, y];
    };

    //바둑알 그리기. 실제로는 바둑판까지 매번 통째로 그려줌
    drawCircle = (x, y) => {
        draw();
        drawRect(x, y);
        for (i = 0; i < board.length; i++) {
            // 모든 눈금의 돌의 유무,색깔 알아내기
            let a = indexToXy(i)[0];
            let b = indexToXy(i)[1];

            if (board[xyToIndex(a, b)] == 1) {
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(a * rowSize + margin, b * rowSize + margin, dolSize, 0, Math.PI * 2);
                ctx.fill();
            }
            if (board[xyToIndex(a, b)] == 2) {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(a * rowSize + margin, b * rowSize + margin, dolSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        let boardCopy = Object.assign([], board);
        history.push(boardCopy); //무르기를 위해서 판 전체 모양을 배열에 입력
    };
  
    // 방금 둔 바둑돌에 사각 표시
    drawRect = (x, y) => {
        let w = rowSize/2;
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.strokeRect(
          x * rowSize + margin - w,
          y * rowSize + margin - w,
          w + rowSize/2,
          w + rowSize/2
        );
      };

    // 마우스 클릭한 위치를 정확한 눈금 위치로 보정
    document.addEventListener('mouseup', (e) => {
        if (e.target.id == 'canvas') {
            let x = Math.round(Math.abs(e.offsetX - margin) / rowSize);
            let y = Math.round(Math.abs(e.offsetY - margin) / rowSize);
            console.log(e.offsetX, e.offsetY, x, y);
            if (e.offsetX > 10 && e.offsetX < 640 && e.offsetY > 10 && e.offsetY < 640) {
                
                if (board[xyToIndex(x, y)] != -1) {
                    console.log('돌이 놓여있는 곳에 둠');
                } else {
                    // 비어있는 자리이면, 순서에 따라서 흑,백 구분해서 그리는 함수 실행
                    count % 2 == 0
                        ? (board[xyToIndex(x, y)] = 1)
                        : (board[xyToIndex(x, y)] = 2);
                    count++;
                    drawCircle(x, y);
                }
            }
        }
    });

    class Player {
        constructor(black, white) {
            this.black = 1;
            this.white = 2;
        }

        other(self) {
            if (self == this.black) {
                return Player.black;
            } else {
                return Player.white;
            }
        }
    }
}
