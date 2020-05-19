class MonsterStats {
    private _interval: number;
    private _observerConfig = { attributes: true, childList: true, subtree: true };
    private _observerTarget = document;
    private _monsterStatsContainerClass = ".mon-stat-block";
    private _utils: Utils;

    constructor(interval: number) {
        this._interval = interval;
        this._utils = new Utils;
    }

    private waitForPageToLoad(): void {
        const that = this;
        const pageLoading = setInterval(() => {
            const pageLoaded = that._utils.queryAll(that._monsterStatsContainerClass).length >= 1;
            if (pageLoaded) {
                that.afterPageLoaded();
                clearInterval(pageLoading);
            }
        }, this._interval);
    }

    private afterPageLoaded(): void {
        this.replaceUnits();
        new MutationObserver(this.convertUnitsInMonsterStats.bind(this)).observe(this._observerTarget, this._observerConfig);
    }

    private replaceUnits(): void {
        this.convertUnitsInMonsterStats();
    }

    private convertUnitsInMonsterStats() {
        const moreInfoClass = ".more-info-content";
        const statBlock = this._utils.queryAll(this._monsterStatsContainerClass + "," + moreInfoClass);
        const that = this;

        statBlock.forEach((el: any) => {
            if (!that._utils.checkIfNodeEmpty(el) && !that._utils.checkIfNodeHasClass(el, that._utils.convertedClass)) {
                const textNodes = that._utils.extractTextNodes(el);
                if (textNodes) {
                    textNodes.forEach((textNode: any) => {
                        if (!that._utils.checkIfTextNodeEmpty(textNode)) {
                            textNode.textContent = that._utils.convertMassFromPoundsToKilogramsInText(that._utils.convertDistanceFromImperialToMetricInText(textNode.textContent));
                        }
                    });
                    that._utils.markModified(el);
                }
            }
        });
    }

    public run(): void {
        this._utils.checkToggleInStorage("bmToggleStates", "msToggle", this.waitForPageToLoad.bind(this));
        this._utils.addStorageListener("bmToggleStates", "msToggle", this.waitForPageToLoad.bind(this));
    }
}

new MonsterStats(100).run();