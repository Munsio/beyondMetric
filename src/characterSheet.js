const characterSheetLoadedEvent = new Event('bmCharacterSheetLoaded')
const interval = 500
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
        const characterSheetLoaded = queryAll(queryString).length >= 1
        if (characterSheetLoaded) {
            document.dispatchEvent(characterSheetLoadedEvent)
            clearInterval(loadingCharacterSheet)
        }
    }, interval);
    document.addEventListener('bmCharacterSheetLoaded', function() {
        characterSheetLoaded()
    })
}
waitingForCharacterSheet()

// This function is called after the character sheet is loaded
const characterSheetLoaded = function() {
    replaceUnits()
}

const replaceUnits = function() {
    setInterval(function() {
        convertDistanceNumbers()
        convertRangeNumbers()
        convertUnitsInSnippets()
        convertDescriptions()
        convertWeightNumber()
    }, interval)
}

// this case covers simple distances: distance-number
const convertDistanceNumbers = function() {
    const dnDivClass = 'distance-number'
    const dnNumberClass = '__number'
    const dnLabelClass = '__label'

    let distances = queryAll(createMixQuery(dnDivClass, ...defaultPrefixes))
    distances.forEach(function(el) {
        const dnNumberSpan = el.querySelector(createMixQuery(dnDivClass + dnNumberClass, ...defaultPrefixes))
        const dnLabelSpan = el.querySelector(createMixQuery(dnDivClass + dnLabelClass, ...defaultPrefixes))
        replaceSimpleDistancWithMetric(el, dnNumberSpan, dnLabelSpan)
    })
}

const replaceSimpleDistancWithMetric = function(el, dnNumberSpan, dnLabelSpan) {
    if (!checkIfMarked(el, convertedClass)) {
        if (checkIfNotEmpty(dnNumberSpan, true)) {
            dnNumberSpan.innerHTML = calculateMetricDistance(dnNumberSpan.innerHTML)
        }
        if (checkIfNotEmpty(dnLabelSpan)) {
            changeLabelToMetric(dnLabelSpan)
        }
        markModified(el)
    }
}

// this case covers range weapons range attacks: combat-attack__range-value
const convertRangeNumbers = function() {
    const rnDivClass = 'combat-attack__range-value'
    const rnCloseClass = '-close'
    const rnLongClass = '-long'

    let distances = queryAll(createMixQuery(rnDivClass, ...defaultPrefixes))
    distances.forEach(function(el) {
        const rnClose = el.querySelector(createMixQuery(rnDivClass + rnCloseClass, ...defaultPrefixes))
        const rnLong = el.querySelector(createMixQuery(rnDivClass + rnLongClass, ...defaultPrefixes))
        replaceRangeDistanceWithMetric(el, rnClose, rnLong)
    })
}

const replaceRangeDistanceWithMetric = function(el, rnClose, rnLong) {
    if (!checkIfMarked(el, convertedClass)) {
        if (checkIfNotEmpty(rnClose, true)) {
            rnClose.innerHTML = calculateMetricDistance(rnClose.innerHTML)
        }
        if (checkIfNotEmpty(rnLong, true)) {
            rnLong.innerHTML = replaceLongRangeDistance(rnLong.innerHTML)
        }
        markModified(el)
    }
}

// this case covers all descriptions for premium users
// and for normal users:
// - item descriptions item-detail__description
// - action details action-detail__description
// - spell details spell-detail__description
const convertDescriptions = function() {
    const premiumClass = '.ddbc-html-content'
    const normalClasses = '.ct-item-detail__description, .ct-action-detail__description, .ct-spell-detail__description, .ct-snippet__content'
    const classes = premiumClass + ', ' + normalClasses

    let containers = queryAll(classes)
    containers.forEach(function(el) {
        replaceUnitsInTextWith(el)
    })
}

// this case covers snipets jsx-parser
const convertUnitsInSnippets = function() {
    const sDivClass = '.jsx-parser'

    let pContainers = queryAll(sDivClass)
    pContainers.forEach(function(el) {
        replaceUnitsInTextWith(el)
    })
}

const replaceUnitsInTextWith = function(el) {
    if (!checkIfMarked(el, convertedClass)) {
        let paragraphs = queryAll('p', el)
        paragraphs.forEach(function(p) {
            if (checkIfNotEmpty(p)){
                const textNodes = textNodesUnder(p)
                textNodes.forEach(function (tn) {
                    if (checkIfTextNodeNotEmpty(tn)) {
                        tn.textContent = calculateWeightInText(calculateMetricDistanceInText(tn.textContent))
                    }
                })
            }
        })
        markModified(el)
    }
}

// this case covers the conversion from lbs to kg
const convertWeightNumber = function() {
    const wnDivClass = 'weight-number'
    const wnNumberClass = '__number'
    const wnLabelClass = '__label'

    let weights = queryAll(createMixQuery(wnDivClass, ...defaultPrefixes))
    weights.forEach(function (el) {
        const wnNumberSpan = el.querySelector(createMixQuery(wnDivClass + wnNumberClass, ...defaultPrefixes))
        const wnLabelSpan = el.querySelector(createMixQuery(wnDivClass + wnLabelClass, ...defaultPrefixes))
        replaceWeightWithKilo(el, wnNumberSpan, wnLabelSpan)
    }) 
}

const replaceWeightWithKilo = function(el, wnNumberSpan, wnLabelSpan) {
    if (!checkIfMarked(el, convertedClass)) {
        if (checkIfNotEmpty(wnNumberSpan, true)) {
            wnNumberSpan.innerHTML = calculateKiloWeight(wnNumberSpan.innerHTML)
        }
        if (checkIfNotEmpty(wnLabelSpan)) {
            replaceLabelWithKilo(wnLabelSpan)
        }
        markModified(el)
    }
}