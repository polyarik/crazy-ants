class AppInterface {
    constructor(constants, defaults) {
        this.constants = constants;
        this.defaults = defaults;

        if (false) { //check cookies
            //TODO: get settings from cookies

            //return that it's not the first run (so main showes settings menu)
        } else {
            this.setDefault();
            this.addCustomPlane('heart');
        }
    }

    setDefault() {
        this.speed = this.defaults.SPEED; // steps per sec
        this.antsRender = false;
        this.cellSizeRounding = true;
        this.planes = [];
    }

    addCustomPlane(name) {
        //TODO: get from cookies

        //TEMP
        switch (name) {
            case 'heart': {
                this.planes.push(
                    {
                        'gridType': 4,
                        //canvasId
                        'width': 16,
                        'height': 16,
                        'palette': [
                            {'color': 'hsl(0, 0%, 100%)', 'turn': -90}, // default color
                            {'color': 'hsl(0, 80%, 50%)', 'turn': 90}
                        ],
                        'ants': [
                            {
                                'lifetime': 50, // steps
                                'x': 6,
                                'y': 7,
                                'moveAngle': 90, // degr
                                'color': 'hsl(0, 0%, 60%)'
                            }
                        ]
                    }
                );
                break;
            }

            //
        }
    }


    // SETTINGS MENU FUNCTIONS

    showSettingsMenu() {
        document.body.innerHTML = `
            <div id="settings-menu">
                <div class="settings-menu-header">
                    <span class="settings-menu-title">Crazy Ants!</span>
                    <div class="button apply-btn" onclick="appInterface.applySettings()">▶</div>
                </div>

                <div class="settings">
                    <div class="settings-block settings-general"></div>
                    <div class="settings-block settings-planes"></div>
                    <div class="settings-block settings-plane"></div>
                    <div class="settings-block settings-colors"></div>
                    <div class="settings-block settings-color"></div>
                </div>
            </div>
        `;

        //<div class="settings-block settings-ants"></div>
        //<div class="settings-block settings-ant"></div>

        this.showGeneralSettings();
        this.showPlanesSettings();
        this.showPlaneSettings(0);

        //

        //settings menu: test
        document.querySelector('.settings').insertAdjacentHTML(
            'beforeend',
            `<div class="settings-block test-settings-block"></div>
            <div class="settings-block test-settings-block"></div>
            <div class="settings-block test-settings-block"></div>
            <div class="settings-block test-settings-block"></div>
            <div class="settings-block test-settings-block"></div>`
        );
    }

    showGeneralSettings() {
        const appInterface = this; //TODO: onlicks call this appInterface's methods (and not appInt from 'main.js') !!!

        document.querySelector('.settings-general').insertAdjacentHTML(
            'beforeend',
            `<div class="slider-panel settings-general-slider-panel">
                <div class="slider-val speed-slider-val">`+this.speed+`</div>
                <div class="slider-wrapper">
                    <div class="slider-min-val">1</div>
                    <input type="range" min="1" max="`+this.constants.MAX_SPEED+`" value="`+Math.min(this.speed, this.constants.MAX_SPEED)+`"
                        class="slider speed-slider" oninput="appInterface.setSpeed(+this.value)">
                    <div class="slider-max-val">inf</div>
                </div>
                <div class="slider-info">steps / sec</div>
            </div>

            <div class="settings-general-switch-panels">
                <div class="switch-panel switch-panel-ants-render">
                    <span class="switch-title">render ants</span>
                    <label class="switch switch-ants-render" oninput="appInterface.switchAntsRender()">
                        <input type="checkbox" `+(appInterface.antsRender ? 'checked' : '')+`>
                        <span class="switch-slider"></span>
                    </label>
                </div>

                <div class="switch-panel switch-panel-cell-size-rounding">
                    <span class="switch-title">round size of cell</span>
                    <label class="switch switch-cell-size-rounding" oninput="appInterface.switchCellSizeRounding()">
                        <input type="checkbox" `+(appInterface.cellSizeRounding ? 'checked' : '')+`>
                        <span class="switch-slider"></span>
                    </label>
                </div>
            </div`
        );
    }

    setSpeed(speed) {
        if (speed >= this.constants.MAX_SPEED)
            speed = Infinity;

        this.speed = speed;
        document.querySelector('.speed-slider-val').innerHTML = speed;
    }

    switchAntsRender() {
        this.antsRender = !this.antsRender;
    }

    switchCellSizeRounding() {
        this.cellSizeRounding = !this.cellSizeRounding;
    }

    //TODO: give planes as an argument
    showPlanesSettings() {
        const appInterface = this;

        document.querySelector('.settings-planes').insertAdjacentHTML(
            'beforeend',
            `<div class="planes-btns-wrapper">
                <div class="planes-btns"></div>
                <div class="button plane-add-btn" onclick="appInterface.addBlankPlane()">+</div>
            </div>`
        );

        const planesBtnsElem = document.querySelector('.planes-btns');

        for (let i in this.planes) {
            planesBtnsElem.insertAdjacentHTML(
                'beforeend',
                `<div class="plane-btn-wrapper">
                    <div class="button plane-btn `+( (this.planes[i].gridType == 6) ? 'hexagon' : '' )+`"
                        onclick="appInterface.showPlaneSettings(`+i+`)"></div>
                </div>`
            );

            //TODO: show each plane main color

            //TODO: somehow let user to delete plane; on right click show menu... ? | on double click ?
        }
    }

    showPlaneSettings(planeNum) {
        const planeBtns = document.getElementsByClassName('plane-btn');

        for (let i = 0, l = planeBtns.length; i < l; i++) {
            const planeBtn = planeBtns[i];

            if (i == planeNum) {
                planeBtn.innerHTML = '⚙';
                planeBtn.classList.add('plane-btn-active');
            } else {
                planeBtn.innerHTML = '';
                planeBtn.classList.remove('plane-btn-active');
            }
        }
        
        document.querySelector('.settings-plane').innerHTML = `
            <div class="switch-panel switch-panel-grid-type">
                <span class="switch-title">grid type</span>

                <div class="switch-wrapper">
                    <div class="switch-option">4</div>

                    <label class="switch switch-grid-type" oninput="appInterface.changePlaneGridType(`+planeNum+`)">
                        <input type="checkbox" `+( (this.planes[planeNum].gridType == 6) ? 'checked' : '' )+`>
                        <span class="switch-slider"></span>
                    </label>

                    <div class="switch-option">6</div>
                </div>
            </div>

            <div class="slider-panel settings-plane-width-slider-panel">
                <div class="slider-val plane-width-slider-val">`+this.planes[planeNum].width+`</div>
                <div class="slider-wrapper">
                    <div class="slider-min-val">1</div>
                    <input type="range" min="1" max="`+this.constants.MAX_PLANE_SIZE+`" value="`+this.planes[planeNum].width+`"
                        class="slider plane-width-slider" oninput="appInterface.setPlaneWidth(`+planeNum+`, +this.value)">
                    <div class="slider-max-val">`+this.constants.MAX_PLANE_SIZE+`</div>
                </div>
                <div class="slider-info">plane width</div>
            </div>
        
            <div class="slider-panel settings-plane-height-slider-panel">
                <div class="slider-val plane-height-slider-val">`+this.planes[planeNum].height+`</div>
                <div class="slider-wrapper">
                    <div class="slider-min-val">`+( (this.planes[planeNum].gridType == 4) ? '1' : '2' )+`</div>
                    <input type="range" min="`+( (this.planes[planeNum].gridType == 4) ? '1' : '2' )+`" max="`+this.constants.MAX_PLANE_SIZE+`"
                        step="`+( (this.planes[planeNum].gridType == 4) ? '1' : '2' )+`" value="`+this.planes[planeNum].height+`"
                        class="slider plane-height-slider" oninput="appInterface.setPlaneHeight(`+planeNum+`, +this.value)">
                    <div class="slider-max-val">`+this.constants.MAX_PLANE_SIZE+`</div>
                </div>
                <div class="slider-info">plane height</div>
            </div>
        `;

        this.showColorsSettings(planeNum);
    }

    addBlankPlane() {
        const appInterface = this;
        const planeNum = this.planes.length;
        
        this.planes.push({
            'gridType': 4,
            'width': this.defaults.PLANE_SIZE,
            'height': this.defaults.PLANE_SIZE,
            'palette': [
                {'color': 'hsl(0, 0%, 100%)', 'turn': -90}
            ],
            'ants': [
                {
                    'lifetime': this.defaults.ANT_LIFETIME,
                    'x': Math.floor(this.defaults.PLANE_SIZE / 2),
                    'y': Math.floor(this.defaults.PLANE_SIZE / 2),
                    'moveAngle': this.defaults.ANT_ANGLE,
                    'color': 'hsl(0, 0%, 60%)'
                }
            ]
        });

        document.querySelector('.planes-btns').insertAdjacentHTML(
            'beforeend',
            `<div class="plane-btn-wrapper">
                <div class="button plane-btn `+( (this.planes[planeNum].gridType == 6) ? 'hexagon' : '' )+`"
                    onclick="appInterface.showPlaneSettings(`+planeNum+`)"></div>
            </div>`
        );

        this.showPlaneSettings(planeNum);
    }

    changePlaneGridType(planeNum) {
        const plane = this.planes[planeNum];
        const planeBtn = document.getElementsByClassName('plane-btn')[planeNum];
        const planeHeightSlider = document.querySelector('.plane-height-slider');

        if (plane.gridType == 4) {
            //switch to 6
            plane.gridType = 6;
            planeBtn.classList.add('hexagon');

            //only even height value
            if (+planeHeightSlider.value % 2) {
                planeHeightSlider.value = +planeHeightSlider.value + 1;
                this.setPlaneHeight(planeNum, +planeHeightSlider.value);
            }

            document.querySelector('.plane-height-slider-val').innerHTML = planeHeightSlider.value;
            planeHeightSlider.min = 2;
            planeHeightSlider.step = 2;
            planeHeightSlider.previousElementSibling.innerHTML = 2;
        } else {
            //switch to 4
            plane.gridType = 4;
            planeBtn.classList.remove('hexagon');

            planeHeightSlider.step = 1;
            planeHeightSlider.min = 1;
            planeHeightSlider.previousElementSibling.innerHTML = 1;
        }
    }

    setPlaneWidth(planeNum, value) {
        const oldValue = this.planes[planeNum].width;

        this.planes[planeNum].width = value;
        document.querySelector('.plane-width-slider-val').innerHTML = value;

        if (value < oldValue) {
            // move ants
            const ants = this.planes[planeNum].ants;
            
            for (let i in ants) {
                const ant = ants[i];

                if (ant.x >= value)
                    ant.x = value - 1;
            }
        }

        //TODO: update ant setts: x,y sliders
    }

    setPlaneHeight(planeNum, value) {
        const oldValue = this.planes[planeNum].height;

        this.planes[planeNum].height = value;
        document.querySelector('.plane-height-slider-val').innerHTML = value;

        if (value < oldValue) {
            // move ants
            const ants = this.planes[planeNum].ants;
            
            for (let i in ants) {
                const ant = ants[i];

                if (ant.y >= value)
                    ant.y = value - 1;
            }
        }

        //TODO: update ant setts: x,y sliders
    }

    //TODO: give colors as an argument
    showColorsSettings(planeNum) {
        const appInterface = this; //TODO: onlicks call this appInterface's methods (and not appInt from 'main.js') !!!
        const colors = this.planes[planeNum].palette; // [color; turn]

        document.querySelector('.settings-colors').innerHTML = `
            <div class="colors-btns-wrapper">
                <div class="colors-btns"></div>
                <div class="button color-add-btn" onclick="appInterface.addNewColor(`+planeNum+`)">+</div>
            </div>
        `;

        const colorsBtnsElem = document.querySelector('.colors-btns');

        for (let i in colors) {
            colorsBtnsElem.insertAdjacentHTML(
                'beforeend',
                `<div class="color-btn-wrapper">
                    <div class="button color-btn" style="background-color: `+(colors[i].color)+` !important"
                        onclick="appInterface.showColorSettings(`+planeNum+`, `+i+`)"></div>
                </div>`
            );

            //TODO: side menu on right click?
        }

        this.showColorSettings(planeNum, 0);
    }

    showColorSettings(planeNum, colorNum) {
        const colorBtns = document.getElementsByClassName('color-btn');

        for (let i = 0, l = colorBtns.length; i < l; i++) {
            const colorBtn = colorBtns[i];

            if (i == colorNum) {
                colorBtn.innerHTML = '⚙';
                //colorBtn.style['border-color'] = this.planes[planeNum].palette[colorNum].color; //temp
                colorBtn.classList.add('color-btn-active');
            } else {
                colorBtn.innerHTML = '';
                colorBtn.classList.remove('color-btn-active');
            }
        }
        
        //TODO!
        document.querySelector('.settings-color').innerHTML = `
            ...
        `;
    }

    addNewColor(planeNum) {
        const appInterface = this;
        const colorNum = this.planes[planeNum].palette.length;

        const color = 'hsl(0, 100%, 100%)';
        const turn = 0;
        
        this.planes[planeNum].palette.push({
            'color': color,
            'turn': turn
        });

        document.querySelector('.colors-btns').insertAdjacentHTML(
            'beforeend',
            `<div class="color-btn-wrapper">
                <div class="button color-btn" style="background-color: `+color+` !important"
                    onclick="appInterface.showColorSettings(`+planeNum+`, `+colorNum+`)"></div>
            </div>`
        );

        this.showColorSettings(planeNum, colorNum);
    }

    // ...


    
    applySettings() {
        this.closeSettingsMenu();
        this.createCanvases();
        //
        this.run();
    }

    closeSettingsMenu() {
        const appInterface = this;

        document.body.innerHTML = `
            <div id="pause-menu">
                <div class="pause-menu-btns">
                    <div class="button pause-btn" onclick="appInterface.pause()">II</div>
                </div>
            </div>

            <div id="canvases" onclick="appInterface.pause()"></div>
        `;
    }

    createCanvases() {
        let parentElement = document.getElementById('canvases');

        for (let i in this.planes) {
            parentElement.insertAdjacentHTML(
                'beforeend', 
                `<div class='canvas-wrapper'>
                    <canvas id='plane`+i+`'></canvas>
                </div>`
            );

            this.planes[i].canvasId = 'plane' + i;
        }
    }

    //--------------------
    // PAUSE MENU FUNCTIONS

    showPauseMenu() {
        const appInterface = this;
        const maxSpeed = this.constants.MAX_SPEED;
        const speed = (world.speed > maxSpeed) ? maxSpeed : world.speed;

        document.getElementById('pause-menu').innerHTML = `
            <div class="pause-menu-btns">
                <div class="button pause-btn" onclick="appInterface.pause()">▶</div>
                <div class="button rerun-btn" onclick="appInterface.rerun()">⟲</div>
                <div class="button settings-btn" onclick="appInterface.showSettingsMenu()">⚙</div>
            </div>

            <div class="slider-panel pause-menu-speed-slider-panel">
                <div class="slider-val speed-slider-val">`+world.speed+`</div>
                <div class="slider-wrapper">
                    <div class="slider-min-val">1</div>
                    <input type="range" min="1" max="`+maxSpeed+`" value="`+speed+`"
                        class="slider speed-slider" oninput="appInterface.setWorldSpeed(+this.value)">
                    <div class="slider-max-val">inf</div>
                </div>
                <div class="slider-info">steps / sec</div>
            </div>
        `;
    }

    hidePauseMenu() {
        const appInterface = this;

        document.getElementById('pause-menu').innerHTML = `
            <div class="pause-menu-btns">
                <div class="button pause-btn" onclick="appInterface.pause()">II</div>
            </div>
        `;
    }

    showEndMenu() {
        const appInterface = this;

        document.getElementById('pause-menu').innerHTML = `
            <div class="pause-menu-btns">
                <div class="button hide-btn" onclick="appInterface.hideInterface()">📷</div>
                <div class="button rerun-btn" onclick="appInterface.rerun()">⟲</div>
                <div class="button settings-btn" onclick="appInterface.showSettingsMenu()">⚙</div>
            </div>
        `;
    }

    hideInterface() {
        document.getElementById('pause-menu').innerHTML = '';
    }

    run() {
        world = new World(this.settings);
    }

    rerun() {
        world.destroy();
        this.hidePauseMenu();
        this.run();
    }

    pause() {
        const isPaused = world.pause();

        if (isPaused) {
            if (typeof isPaused == 'number')
                this.showPauseMenu();
            else
                this.showEndMenu();
        } else
            this.hidePauseMenu();
    }

    setWorldSpeed(speed) {
        if (speed >= this.constants.MAX_SPEED)
            speed = Infinity;

        world.speed = speed;
        document.querySelector('.speed-slider-val').innerHTML = world.speed;
    }

    //-----------------

    get settings() {
        return {
            'speed': this.speed,
            'antsRender': this.antsRender,
            'cellSizeRounding': this.cellSizeRounding,
            'planes': this.planes
        };
    }
}