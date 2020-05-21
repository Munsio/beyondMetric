class CharacterSheet {
    private _interval: number;
    private _observerConfig = { attributes: true, childList: true, subtree: true };
    private _observerTarget = document;
    private _utils: Utils;

    private _premiumTarget = "#character-tools-target";
    private _normalTarget = "#character-sheet-target";
    private _sufixTarget = " > .ct-character-sheet .ct-quick-info__ability";
    private _compactTarget = "> .ct-character-sheet .ct-component-carousel";
    private _premiumPrefix = "ddbc";
    private _normalPrefix = "ct";
    private _globalWeight = -1;

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

    private createQuery(queryString: string): any {
        return this._utils.createQuery(queryString, this._premiumPrefix, this._normalPrefix);
    }

    private checkIfNodeConverted(el: any, convertedClass?: string): boolean {
        if (!convertedClass) {
            convertedClass = this._utils.convertedClass;
        }
        return this._utils.checkIfNodeHasClass(el, convertedClass);
    }

    private afterPageLoaded(): void {
        this.replaceUnits();
        new MutationObserver(this.replaceUnits.bind(this)).observe(this._observerTarget, this._observerConfig);
    }

    private replaceUnits(): void {
        this.convertDistanceNumber();
        this.convertRangeNumber();
        this.convertWeightNumber();
        this.convertText();
        this.hideEasterEgg();
    }

    // ------- distance-number ------- \\
    private convertDistanceNumber(): void {
        const that = this;
        const dn = "distance-number";
        const dnNumber = "__number";
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

    // ------- combat-attack__range-value ------- \\
    private convertRangeNumber(): void {
        const that = this;
        const rn = "combat-attack__range-value";
        const rnClose = "-close";
        const rnLong = "-long";

        const distances = this._utils.queryAll(this.createQuery(rn));
        distances.forEach((el: any) => {
            const rnCloseSpan = that._utils.query(that.createQuery(rn + rnClose), el);
            const rnLongSpan = that._utils.query(that.createQuery(rn + rnLong), el);
            that.replaceRangeNumber(el, rnCloseSpan, rnLongSpan);
        });
    }

    private replaceRangeNumber(el: any, rnCloseSpan: any, rnLongSpan: any): void {
        if (!this.checkIfNodeConverted(el)) {
            if (!this._utils.checkIfNodeEmpty(rnCloseSpan, true)) {
                rnCloseSpan.innerHTML = this._utils.convertDistanceFromFeetToMeters(rnCloseSpan.innerHTML);
            }
            if (!this._utils.checkIfNodeEmpty(rnLongSpan, true)) {
                rnLongSpan.innerHTML = this._utils.convertLongRangeDistanceFromFeetToMeters(rnLongSpan.innerHTML);
            }
            this._utils.markModified(el);
        }
    }
    // ------- combat-attack__range-value ------- \\

    // ------- weight-number ------- \\
    private isGlobalWeight(parent: any): boolean {
        const playerWeight = "ct-equipment-overview__weight-carried-amount";
        return this._utils.checkIfNodeHasClass(parent, playerWeight);
    }

    private resetGlobalWeightIfChanged(el: any, globalWeight: any): void {
        if (!this._utils.checkIfNodeEmpty(globalWeight)) {
            const weight = this._utils.convertStringToNumber(globalWeight.innerHTML);
            if (this._globalWeight !== weight) {
                if (this._globalWeight !== -1 && this.checkIfNodeConverted(el)) {
                    el.classList.remove(this._utils.convertedClass);
                }
                this._globalWeight = this._utils.convertMassFromPoundsToKilograms(globalWeight.innerHTML);
            }
        }
    }

    private convertWeightNumber(): void {
        const that = this;
        const wn = "weight-number";
        const wnNumber = "__number";
        const wnLabel = "__label";

        const containers = this._utils.queryAll(this.createQuery(wn));
        containers.forEach((el: any) => {
            const wnNumberSpan = that._utils.query(that.createQuery(wn + wnNumber), el);

            if (this.isGlobalWeight(el.parentNode)) {
                this.resetGlobalWeightIfChanged(el, wnNumberSpan);
            }

            const wnLabelSpan = that._utils.query(that.createQuery(wn + wnLabel), el);
            that.replaceWeightNumber(el, wnNumberSpan, wnLabelSpan);
        });
    }

    private replaceWeightNumber(el: any, wnNumber: any, wnLabel: any): void {
        if (!this.checkIfNodeConverted(el)) {
            if (!this._utils.checkIfNodeEmpty(wnNumber, true)) {
                wnNumber.innerHTML = this._utils.convertMassFromPoundsToKilograms(wnNumber.innerHTML);
            }
            if (!this._utils.checkIfNodeEmpty(wnLabel)) {
                this._utils.changeLabelFromPoundsToKilograms(wnLabel);
            }
            this._utils.markModified(el);
        }
    }
    // ------- weight-number ------- \\

    private convertText() {
        this.convertDescriptions();
        this.convertSnippets();
        this.convertSenses();
    }

    // ------- descriptions ------- \\
    // This case covers all descriptions for premium users and for normal users:
    //     - item descriptions item-detail__description
    //     - action details action-detail__description
    //     - spell details spell-detail__description
    //     - features snippets snippet__content
    private convertDescriptions(): void {
        const that = this;
        const premium = ".ddbc-html-content";
        const normal = ".ct-item-detail__description, " +
            ".ct-action-detail__description, " +
            ".ct-spell-detail__description, " +
            ".ct-snippet__content";
        const classes = premium + ", " + normal;

        const containers = this._utils.queryAll(classes);
        containers.forEach((el: any) => {
            that.replaceImperialInText(el);
        });
    }
    // ------- descriptions ------- \\

    // ------- jsx-parser (snippets) ------- \\
    private convertSnippets(): void {
        const that = this;
        const snippets = ".jsx-parser";
        const containers = this._utils.queryAll(snippets);

        containers.forEach((el: any) => {
            that.replaceImperialInText(el);
        });
    }
    // ------- jsx-parser (snippets) ------- \\

    private replaceImperialInText(el: any) {
        if (!this.checkIfNodeConverted(el)) {
            const that = this;
            const paragraphs = this._utils.queryAll("p", el);
            paragraphs.forEach((p: any) => {
                if (!this._utils.checkIfNodeEmpty(p)) {
                    const textNodes = this._utils.extractTextNodes(p);
                    textNodes.forEach((tn: any) => {
                        tn.textContent = this._utils.convertMassFromPoundsToKilogramsInText(this._utils.convertDistanceFromImperialToMetricInText(tn.textContent));
                    });
                }
            });
            this._utils.markModified(el);
        }
    }

    // ------- senses__summary ------- \\
    private convertSenses(): void {
        const senses = ".ct-senses__summary";
        const containers = this._utils.queryAll(senses);

        containers.forEach((el: any) => {
            if (!this.checkIfNodeConverted(el)) {
                if (!this._utils.checkIfNodeEmpty(el)) {
                    el.innerHTML = this._utils.convertDistanceFromImperialToMetricInText(el.innerHTML);
                }
                this._utils.markModified(el);
            }
        });
    }
    // ------- senses__summary ------- \\


    private hideEasterEgg(): void {
        const that = this;
        const sr = "spells-spell__range";
        const origin = "-origin";

        const containers = this._utils.queryAll(this.createQuery(sr));
        containers.forEach((el: any) => {
            if (that._utils.checkIfNodeHasClass(document.body, "party-time-enabled")) {

                const label = that._utils.query(that.createQuery(sr + origin), el);
                if (!that.checkIfNodeConverted(el) && !that._utils.checkIfNodeEmpty(label) && label.innerHTML === "Touch") {
                    const br = document.createElement("BR");
                    const joke = document.createElement("DIV");

                    joke.innerHTML = "but in m.";
                    joke.style.fontSize = "10px";
                    joke.style.height = "auto";
                    joke.style.padding = "0";

                    br.classList.add("party-time-enabled-meters-joke");
                    joke.classList.add("party-time-enabled-meters-joke");
                    joke.classList.add("mm-nav-item__label");

                    el.appendChild(br);
                    el.appendChild(joke);

                    that._utils.markModified(el);
                }
            } else {
                if (that.checkIfNodeConverted(el)) {
                    const containers = that._utils.queryAll(".party-time-enabled-meters-joke", el);
                    containers.forEach((joke: any) => {
                        joke.remove();
                    });
                    el.classList.remove(that._utils.convertedClass);
                }
            }
        });
    }

    public run(): void {
        this._utils.checkToggleInStorage("bmToggleStates", "csToggle", this.waitForPageToLoad.bind(this));
        this._utils.addStorageListener("bmToggleStates", "csToggle", this.waitForPageToLoad.bind(this));
    }
}

new CharacterSheet(100).run();

