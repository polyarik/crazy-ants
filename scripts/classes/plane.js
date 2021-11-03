class Plane {
    // gridType, canvasId, width, height, palette: {color, turn}, ants
    constructor(settings, antsRender, cellSizeRounding) {
        this.antsRender = antsRender;
        this.cellSizeRounding = cellSizeRounding;

        this.initPalette( settings['palette'] );
        this.initCells( settings['width'], settings['height'] );
        this.initAnts( settings['ants'], settings['width'], settings['height'], settings['gridType'] );
        this.initCanvas(
            settings['canvasId'],
            settings['palette'],
            settings['ants'],
            settings['width'],
            settings['height'],
            settings['gridType'],
            cellSizeRounding
        );

        this.changedCells = {};
    }

    initPalette(palette) {
        this.palette = [];

        for (let i in palette) {
            this.palette[i] = palette[i].turn;
        }
    }

    initCells(width, height) {
        this.cells = [];

        for (let y = 0; y < height; y++) {
            this.cells[y] = new Array(width).fill(0);
        }
    }

    initAnts(settings, planeWidth, planeHeight, gridType) {
        this.Ants = [];
        this.deadAnts = [];

        for (let i in settings) {
            this.Ants[i] = new Ant( settings[i], planeWidth, planeHeight, gridType );
        }
    }

    initCanvas(canvasId, palette, ants, planeWidth, planeHeigt, gridType, cellSizeRounding) {
        let antPalette = [];

        for (let i in ants) {
            antPalette[i] = ants[i].color;
        }

        this.Canvas = new Canvas(canvasId, palette, antPalette, planeWidth, planeHeigt, gridType, cellSizeRounding);

		/*window.onresize = () => {
			this.resizeCanvas();
        }*/

		this.resizeCanvas();
    }

    resizeCanvas() {
        this.Canvas.resize();
		this.render();
    }

    moveAnts() {
        let livingAnts = false;

        for (let i = 0, l = this.Ants.length; i < l; i++) {
            if ( this.Ants[i] ) {
                const antPrevCoords = this.Ants[i].coords;
                const res = this.Ants[i].move();

                if (res) {
                    livingAnts = true;

                    this.switchCell(antPrevCoords);
                    const turn = this.getTurn(res);

                    if (turn)
                        this.Ants[i].turn = turn;
                } else {
                    this.deadAnts[i] = this.Ants[i];
                    delete this.Ants[i];
                }
            }
        }

        if (livingAnts)
            this.render(this.changedCells); // render only changed cells

        return livingAnts;
    }

    switchCell(coords) {
        const x = coords['x'];
        const y = coords['y'];
        const colorNum = this.cells[y][x];
        const colorsCount = this.palette.length;

        this.cells[y][x] = (colorNum + 1 < colorsCount) ? (colorNum + 1) : 0;

        if ( !this.changedCells[y] )
            this.changedCells[y] = {};
        this.changedCells[y][x] = this.cells[y][x];

        return true;
    }

    getTurn(cellCoords) {
        const x = cellCoords['x'];
        const y = cellCoords['y'];
        const colorNum = this.cells[y][x];

        return this.palette[colorNum];
    }

    render(changedCells) {
        let renderData = {'cells': []}; //TODO: render deadAnnts (with half opacity?)

        if (this.antsRender)
            renderData.ants = this.ants;

        if (changedCells) {
            renderData.cells = changedCells;
            renderData.changes = true;
            this.changedCells = {};
        } else
            renderData.cells = this.cells;

        this.Canvas.render(renderData);

        return true;
    }

    get ants() {
        const ants = this.Ants;
        let antsCoords = [];

        for (let i in ants) {
            antsCoords[i] = ants[i].coords;
        }

        return antsCoords;
    }
}
