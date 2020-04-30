const characterSheetLoadedEvent = new Event('bmCharacterSheetLoaded')
const premiumTarget = '#character-tools-target'
const normalTarget = '#character-sheet-target'
const sufixTarget = ' > .ct-character-sheet .ct-quick-info__ability'
const premiumPrefix = 'ddbc'
const normalPrefix = 'ct'
const defaultPrefixes = [premiumPrefix, normalPrefix]

// Wait for character sheet to load then trigger bmCharacterSheetLoaded event
const waitingForCharacterSheet = function () {
    const loadingCharacterSheet = setInterval(function () {
        const queryString = premiumTarget + sufixTarget + ',' + normalTarget + sufixTarget
        const characterSheetLoaded = document.querySelectorAll(queryString).length >= 1
        if (characterSheetLoaded) {
            document.dispatchEvent(characterSheetLoadedEvent)
            clearInterval(loadingCharacterSheet)
        }
    }, 100);
    document.addEventListener('bmCharacterSheetLoaded', function() {
        characterSheetLoaded()
    })
}
waitingForCharacterSheet()

// This function is called after the character sheet is loaded
const characterSheetLoaded = function() {
    replaceWithMetricUnits()
}

const replaceWithMetricUnits = function() {
    setInterval(function() {
        convertDistanceNumbers()
        convertRangeNumbers()
    }, 500)
}

// this case covers simple distances: distance-number
const convertDistanceNumbers = function() {
    const dnDivClass = 'distance-number'
    const dnNumberClass = '__number'
    const dnLabelClass = '__label'

    let distances = document.querySelectorAll(createMixQuery(dnDivClass, ...defaultPrefixes))
    distances.forEach(function(el) {
        const dnNumberSpan = el.querySelector(createMixQuery(dnDivClass + dnNumberClass, ...defaultPrefixes))
        const dnLabelSpan = el.querySelector(createMixQuery(dnDivClass + dnLabelClass, ...defaultPrefixes))
        replaceSimpleDistancWithMetric(el, dnNumberSpan, dnLabelSpan)
    })
}

// this case covers range weapons range attacks: combat-attack__range-value
const convertRangeNumbers = function() {
    const rnDivClass = 'combat-attack__range-value'
    const rnCloseClass = '-close'
    const rnLongClass = '-long'

    let distances = document.querySelectorAll(createMixQuery(rnDivClass, ...defaultPrefixes))
    distances.forEach(function (el) {
        const rnClose = el.querySelector(createMixQuery(rnDivClass + rnCloseClass, ...defaultPrefixes))
        const rnLong = el.querySelector(createMixQuery(rnDivClass + rnLongClass, ...defaultPrefixes))
        replaceRangeDistanceWithMetric(el, rnClose, rnLong)
    })
}