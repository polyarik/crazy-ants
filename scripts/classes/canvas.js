class Canvas {
    constructor(canvasId, palette, antPalette, planeWidth, planeHeight, gridType, cellSizeRounding) {
		this.element = document.getElementById(canvasId);
        this.ctx = this.element.getContext("2d");

        this.planeWidth = planeWidth; //TODO: don't save planeSize
        this.planeHeight = planeHeight;

        this.initPalette(palette, antPalette);
        this.calcCellSize = this.initCellSizeCalculation(planeWidth, planeHeight, gridType, cellSizeRounding);
        this.renderCell = this.initCellRender(planeWidth, planeHeight, gridType);
        //this.renderAnt = init //to get rid of saving plane sizes
    }

    initPalette(palette, antPalette) {
        this.palette = {'cells':[], 'ants': antPalette};

        for (let i in palette) {
            this.palette.cells[i] = palette[i].color;
        }

        //this.element.style.backgroundColor = this.palette.cells[0]; //add alpha = 50%
    }

    initCellSizeCalculation(planeWidth, planeHeight, gridType, cellSizeRounding) {
        if (gridType == 4) {
            if (cellSizeRounding) {
                return () => {
                    this.cellSize = Math.floor(
                        Math.min(
                            this.element.height / planeHeight,
                            this.element.width / planeWidth
                        )
                    );
                };
            } else {
                return () => {
                    this.cellSize = Math.min(
                        this.element.height / planeHeight,
                        this.element.width / planeWidth
                    );
                };
            }
        } else if (gridType == 6) {
            if (cellSizeRounding) {
                return () => {
                    /*this.cellSize = Math.floor(
                        Math.min(
                            this.element.width / (planeWidth + 0.5) / Math.sqrt(3), //x size
                            this.element.height / (planeHeight*0.75 + 0.25) / 2 //y size
                        )
                    );*/
    
                    this.cellSize = Math.min(
                        this.element.width / (planeWidth + 0.5) / Math.sqrt(3), //x size
                        this.element.height / (planeHeight*0.75 + 0.25) / 2 //y size
                    );
    
                    //this.cellSize = Math.floor(cellSize*Math.sqrt(3)) / Math.sqrt(3)
    
                    console.log('cell size:', this.cellSize);
                };
            } else {
                return () => {
                    this.cellSize = Math.min(
                        this.element.width / (planeWidth + 0.5) / Math.sqrt(3), //x size
                        this.element.height / (planeHeight*0.75 + 0.25) / 2 //y size
                    );

                    console.log('cell size:', this.cellSize);
                };
            }
        }

        //return false;
    }

    initCellRender(planeWidth, planeHeight, gridType) {
        let ctx = this.ctx;

        if (gridType == 4) {
            return (x, y, colorNum) => {
                const cellSize = this.cellSize;
                const offsetX = Math.round(this.element.width/2 - planeWidth*cellSize/2);
                const offsetY = Math.round(this.element.height/2 - planeHeight*cellSize/2);

                //ctx.clearRect(offsetX + x*cellSize, offsetY + y*cellSize, cellSize, cellSize);

                ctx.fillStyle = this.palette.cells[colorNum];
                ctx.fillRect(offsetX + x*cellSize, offsetY + y*cellSize, cellSize, cellSize);
            };
        }

        if (gridType == 6) {
            return (x, y, colorNum) => {
                //console.log("Canvas.renderCell"+gridType, x, y, colorNum);

                const cellSize = this.cellSize;
                // half from the difference between canvas width and the width of all the cells
                //why not: planeWidth + 0.5 ?!
                const offsetX = ( this.element.width - (planeWidth + 0.65)*Math.sqrt(3)*cellSize ) / 2;
                // half from the difference between canvas height and the height of all the cells
                const offsetY = ( this.element.height - (planeHeight*0.75 + 0.25)*2*cellSize ) / 2;

                const cellWidth = cellSize * Math.sqrt(3);
                const cellHeight = cellSize * 2;

                let realX = cellWidth*x + (y % 2 ? cellWidth/2 : 0) + offsetX; //Math.round?
                let realY = cellHeight*y * 0.75 + offsetY; //Math.round?

                // to render field from 0;0 with offsets = 0
                realX += cellSize
                realY += cellSize;

                ctx.beginPath();
                ctx.moveTo(realX + cellSize * Math.cos(Math.PI / 6), realY + cellSize * Math.sin(Math.PI / 6)); //Math.round?

                for (let side = 0; side < 7; side++) {
                    ctx.lineTo(
                        realX + cellSize * Math.cos(side * Math.PI / 3 + Math.PI / 6), //Math.round?
                        realY + cellSize * Math.sin(side * Math.PI / 3 + Math.PI / 6) //Math.round?
                    );
                }
                ctx.closePath();

                ctx.fillStyle = this.palette.cells[colorNum];
                ctx.fill();
            };
        }
    }

    resize() {
        //BUG: elements aren't become smaller
        this.element.width = this.element.parentNode.clientWidth;
        this.element.height = this.element.parentNode.clientHeight;

        this.calcCellSize();

        //
    }

    //calcCellSize()

    render(data) {
        let ctx = this.ctx;
        const cells = data.cells;

        //TODO: calc offsets here

        // render only changed cells
        if (data.changes) {
            for (let y in cells) {
                for ( let x in cells[y] ) {
                    const colorNum = cells[y][x];
                    this.renderCell(x, y, colorNum);
                }
            }
        } else {
            ctx.clearRect(0, 0, this.element.width, this.element.height);

            for (let y = 0, rowsCount = cells.length; y < rowsCount; y++) {
                for (let x = 0, rowLength = cells[y].length; x < rowLength; x++) {
                    const colorNum = cells[y][x];
                    this.renderCell(x, y, colorNum);
                }
            }
        }

        if (data.ants) {
            const ants = data.ants;

            for (let i in ants) {
                this.renderAnt( ants[i], i );
            }
        }
    }

    //renderCell(x, y, colorNum)

    //initAntRender? (with renderAnt on 6 grid)
    renderAnt(coords, colorNum) {
        const x = coords.x;
        const y = coords.y;

        const ctx = this.ctx;
        const cellSize = this.cellSize;
        const startX = Math.round(this.element.width/2 - this.planeWidth*cellSize/2) + cellSize/2;
        const startY = Math.round(this.element.height/2 - this.planeHeight*cellSize/2) + cellSize/2;
        const radius = Math.floor(cellSize / 2);

        ctx.strokeStyle = this.palette.ants[colorNum];
        ctx.fillStyle = this.palette.ants[colorNum];

        ctx.beginPath();
        ctx.arc(startX + x*cellSize, startY + y*cellSize, radius, 0, Math.PI*2, false);
        ctx.closePath();

        ctx.fill();
    }
}
