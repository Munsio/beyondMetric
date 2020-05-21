class Popup {
    private _csToggleString = "#csToggle";
    private _msToggleString = "#msToggle";
    private _togglesString = "#csToggle, #msToggle";
    private _csToggle: any;
    private _msToggle: any;
    private _toggles: any;
    private _utils: Utils;

    constructor() {
        this._utils = new Utils();
        this._csToggle = this._utils.query(this._csToggleString);
        this._msToggle = this._utils.query(this._msToggleString);
        this._toggles = this._utils.queryAll(this._togglesString);
    }

    private loadToggleValuesFromStorage(): void {
        const that = this;

        chrome.storage.sync.get("bmToggleStates", function (result) {
            const toggleStates = result.bmToggleStates;
            if (toggleStates) {
                that._csToggle.checked = toggleStates.csToggle ? true : false;
                that._msToggle.checked = toggleStates.msToggle ? true : false;
            }
        });
    }

    private saveChanges(): void {
        const bmToggleStates = {
            "csToggle": this._csToggle.checked,
            "msToggle": this._msToggle.checked
        };

        chrome.storage.sync.set({ "bmToggleStates": bmToggleStates });
    }

    public run(): void {
        const that = this;

        document.addEventListener("DOMContentLoaded", () => {
            that.loadToggleValuesFromStorage();
        });

        this._toggles.forEach((toggle: any) => {
            toggle.addEventListener("change", () => {
                that.saveChanges();
            });
        });
    }
}

new Popup().run();