class CharacterSheet {
    private _interval: number;
    private _observerConfig = { attributes: true, childList: true, subtree: true };
    private _observerTarget = document;
    private _utils: Utils;

    private _premiumTarget = "#character-tools-target";
    private _normalTarget = "#character-sheet-target";
    private _sufixTarget = " > .ct-character-sheet .ct-quick-info__ability";
    private _compactTarget = "> .ct-character-sheet .ct-skills";
    private _premiumPrefix = "ddbc";
    private _normalPrefix = "ct";

    constructor(interval: number) {
        this._interval = interval;
        this._utils = new Utils();
    }

    private waitForPageToLoad(): void {
        const that = this;
        const pageLoading = setInterval(() => {
            const pageLoaded = that._utils.queryAll(that.getPageQueryString()).length >= 1;
            if (pageLoaded) {
                that.afterPageLoaded();
                clearInterval(pageLoading);
            }
        }, this._interval);
    }

    private getPageQueryString(): string {
        const queryString = this._premiumTarget + this._sufixTarget + "," +
            this._normalTarget + this._sufixTarget + "," +
            this._premiumTarget + this._compactTarget + "," +
            this._normalTarget + this._compactTarget;

        return queryString;
    }

    private afterPageLoaded(): void {
        this.replaceUnits();
        new MutationObserver(this.replaceUnits.bind(this)).observe(this._observerTarget, this._observerConfig);
    }

    private replaceUnits(): void {
        this.convertDistanceNumber();
    }

    private createQuery(queryString: string): any {
        return this._utils.createQuery(queryString, this._premiumPrefix, this._normalPrefix);
    }

    private checkIfNodeConverted(el: any, convertedClass?: string): boolean {
        if (!convertedClass) {
            convertedClass = this._utils.convertedClass;
        }
        return this._utils.checkIfNodeHasClass(el, convertedClass);
    }

    // ------- distance-number ------- \\
    private convertDistanceNumber(): void {
        const that = this;
        const dn = "distance-number";
        const dnNumber = '__number'
        const dnLabel = "__label";

        const distances = this._utils.queryAll(this.createQuery(dn));
        distances.forEach((el: any) => {
            const dnNumberSpan = that._utils.query(that.createQuery(dn + dnNumber), el);
            const dnLabelSpan = that._utils.query(that.createQuery(dn + dnLabel), el);
            that.replaceDistanceNumber(el, dnNumberSpan, dnLabelSpan);
        });
    }

    private replaceDistanceNumber(el: any, dnNumber: any, dnLabel: any): void {
        if (!this.checkIfNodeConverted(el)) {
            if (!this._utils.checkIfNodeEmpty(dnNumber, true)) {
                dnNumber.innerHTML = this._utils.convertDistanceFromFeetToMeters(dnNumber.innerHTML);
            }
            if (!this._utils.checkIfNodeEmpty(dnLabel)) {
                this._utils.changeLabelFromImperialToMetric(dnLabel);
            }
            this._utils.markModified(el);
        }
    }
    // ------- distance-number ------- \\

    public run(): void {
        this._utils.checkToggleInStorage("bmToggleStates", "csToggle", this.waitForPageToLoad.bind(this));
        this._utils.addStorageListener("bmToggleStates", "csToggle", this.waitForPageToLoad.bind(this));
    }
}

new CharacterSheet(100).run();

