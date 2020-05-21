class Utils {
    private _convertedClass = "bm-converted-to-metric";
    private _distanceToMetricMap: { [key: string]: string } = {
        "ft.": "m.",
        "feet": "meters",
        "foot": "meter",
        "mile": "kilometres",
        "miles": "kilometres"
    };
    private _massToKilogramsMap: { [key: string]: string } = {
        "lb.": "kg.",
        "pounds": "kilograms",
        "pound": "kilogram"
    };

    get convertedClass(): string {
        return this._convertedClass;
    }

    public checkToggleInStorage(storageLocation: string, item: string, callback: Function): void {
        chrome.storage.sync.get(storageLocation, (result: any) => {
            const toggleStates = result.bmToggleStates;
            if (toggleStates && toggleStates[item] && callback) {
                callback();
            }
        });
    }

    public addStorageListener(storageLocation: string, item: string, callback: Function): void {
        chrome.storage.onChanged.addListener((changes: any) => {
            for (const key in changes) {
                if (changes.hasOwnProperty(key) && key === storageLocation) {
                    const oldValue = changes[key].oldValue;
                    const newValue = changes[key].newValue;
                    if (!oldValue || oldValue[item] !== newValue[item]) {
                        if (newValue[item]) {
                            callback();
                        } else {
                            location.reload();
                        }
                    }
                }
            }
        });
    }

    public query(queryString: string, targetNode: any = document): any {
        return targetNode.querySelector(queryString);
    }

    public queryAll(queryString: string, targetNode: any = document): any {
        return targetNode.querySelectorAll(queryString);
    }

    public extractTextNodes(targetNode: any): any {
        let node, textNodes = [], walk = document.createTreeWalker(targetNode, NodeFilter.SHOW_TEXT, null, false);
        while (node = walk.nextNode()) {
            textNodes.push(node);
        }
        return textNodes;
    }

    public checkIfNodeEmpty(targetNode: any, isSpecialValue?: boolean): boolean {
        if (targetNode && targetNode.innerHTML) {
            if (isSpecialValue) {
                return targetNode.innerHTML === "--";
            }
            return false;
        }
        return true;
    }

    public checkIfTextNodeEmpty(textNode: any): boolean {
        return textNode && textNode.textContent && textNode.textContent.length <= 0;
    }

    public createQuery(cls: string, premium: string, normal: string): string {
        const premiumString = "." + premium + "-" + cls;
        const normalString = "." + normal + "-" + cls;
        return premiumString + ", " + normalString;
    }

    public markModified(targetNode: any): void {
        targetNode.classList.add(this._convertedClass);
    }

    public checkIfNodeHasClass(targetNode: any, classToCheck: string): any {
        return targetNode.classList.contains(classToCheck);
    }

    private convertDistanceStringToMetric(ftString: string): string {
        return this._distanceToMetricMap[ftString] || "m.";
    }

    public changeLabelFromImperialToMetric(targetNode: any): void {
        targetNode.innerHTML = this.convertDistanceStringToMetric(targetNode.innerHTML);
    }

    private cleanCommas(text: string): string {
        return text.replace(",", "");
    }

    public convertStringToNumber(toConvert: string): number {
        const numberToReturn = Number(this.cleanCommas(toConvert));
        return isNaN(numberToReturn) ? -1 : numberToReturn;
    }

    private roundUp(nr: number): number {
        return Math.round((nr + Number.EPSILON) * 100) / 100;
    }

    public convertDistanceFromFeetToMeters(distanceString: string): number {
        const distance = this.convertStringToNumber(distanceString) / 5;
        return this.roundUp(distance + distance / 2);
    }

    private convertDistanceFromMilesToKilometers(distanceString: string): number {
        const distance = this.convertStringToNumber(distanceString);
        return this.roundUp(distance * 1.6);
    }

    public convertLongRangeDistanceFromFeetToMeters(distanceString: string): string {
        const distance = this.cleanCommas(distanceString.slice(1, distanceString.length - 1));
        return "(" + this.convertDistanceFromFeetToMeters(distance) + ")";
    }

    private convertDistanceFromFeetToMetersInText(text: string): string {
        const that = this;
        text = text.replace(/([0-9]{1,3}(,[0-9]{3})+) (feet)/g, (_0, number: string, _1, label: string) => {
            return that.convertDistanceFromFeetToMeters(number) + " " + that.convertDistanceStringToMetric(label);
        });
        text = text.replace(/([0-9]+) (feet)/g, (_0, number: string, label: string) => {
            return that.convertDistanceFromFeetToMeters(number) + " " + that.convertDistanceStringToMetric(label);
        });
        text = text.replace(/([0-9]+)-(foot)/g, (_0, number: string, label: string) => {
            return that.convertDistanceFromFeetToMeters(number) + "-" + that.convertDistanceStringToMetric(label);
        });
        text = text.replace(/([0-9]+) (ft.)/g, (_0, number: string, label: string) => {
            return that.convertDistanceFromFeetToMeters(number) + " " + that.convertDistanceStringToMetric(label);
        });
        text = text.replace(/([0-9]+) cubic (foot)/g, (_0, number: string, _1) => {
            // TODO Replace this to be generic
            return that.convertDistanceFromFeetToMeters(number) + " cubic " + that.convertDistanceStringToMetric("feet");
        });
        text = text.replace(/(range of )([0-9]+)\/([0-9]+)/g, (_0, words: string, smallRange: string, bigRange: string) => {
            return words + that.convertDistanceFromFeetToMeters(smallRange) + "/" + that.convertDistanceFromFeetToMeters(bigRange);
        });
        text = text.replace(/(range )([0-9]+)\/([0-9]+)/g, (_0, words: string, smallRange: string, bigRange: string) => {
            return words + that.convertDistanceFromFeetToMeters(smallRange) + "/" + that.convertDistanceFromFeetToMeters(bigRange);
        });
        return text;
    }

    private convertDistanceFromMilesToKilometersInText(text: string): string {
        const that = this;
        text = text.replace(/([0-9]+) (mile)/g, (_0, number: string, label: string) => {
            return that.convertDistanceFromMilesToKilometers(number) + " " + that.convertDistanceStringToMetric(label);
        });
        text = text.replace(/([0-9]{1,3}(,[0-9]{3})+) (miles)/g, (_0, number: string, _1, label: string) => {
            return that.convertDistanceFromMilesToKilometers(number) + " " + that.convertDistanceStringToMetric(label);
        });
        text = text.replace(/([0-9]+) (miles)/g, (_0, number: string, label: string) => {
            return that.convertDistanceFromMilesToKilometers(number) + " " + that.convertDistanceStringToMetric(label);
        });
        return text;
    }

    public convertDistanceFromImperialToMetricInText(text: string): string {
        text = this.convertDistanceFromFeetToMetersInText(text);
        text = this.convertDistanceFromMilesToKilometersInText(text);
        return text;
    }

    private convertMassStringToKilograms(lbString: string): string {
        return this._massToKilogramsMap[lbString] || "lb.";
    }

    public changeLabelFromPoundsToKilograms(targetNode: any): void {
        targetNode.innerHTML = this.convertMassStringToKilograms(targetNode.innerHTML);
    }

    public convertMassFromPoundsToKilograms(massString: string): number {
        const mass = this.convertStringToNumber(massString);
        return mass / 2;
    }

    public convertMassFromPoundsToKilogramsInText(text: string): string {
        const that = this;
        text = text.replace(/([0-9]+) (pounds)/g, (_0, number: string, label: string) => {
            return that.convertMassFromPoundsToKilograms(number) + " " + that.convertMassStringToKilograms(label);
        });
        text = text.replace(/([0-9]+) (pound)/g, (_0, number: string, label: string) => {
            return that.convertMassFromPoundsToKilograms(number) + " " + that.convertMassStringToKilograms(label);
        });
        text = text.replace(/([0-9]+) (lb.)/g, (_0, number: string, label: string) => {
            return that.convertMassFromPoundsToKilograms(number) + " " + that.convertMassStringToKilograms(label);
        });
        return text
    }

}