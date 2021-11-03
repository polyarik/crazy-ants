let appInterface = {};
let world = {};

function main() {
    appInterface = new AppInterface(constants, defaults);
    appInterface.applySettings();

    /*if (appInterface.firstRun)
        appInterface.applySettings();
    else
        appInterface.showSettingsMenu();*/
}