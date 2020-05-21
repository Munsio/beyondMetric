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
// - features snippets snippet__content
const convertDescriptions = function() {
    const premiumClass = '.ddbc-html-content'
    const normalClasses = 
        '.ct-item-detail__description, '   + 
        '.ct-action-detail__description, ' + 
        '.ct-spell-detail__description, '  +
        '.ct-snippet__content'

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
                textNodes.forEach(function(tn) {
                    if (checkIfTextNodeNotEmpty(tn)) {
                        tn.textContent = calculateWeightInText(calculateMetricDistanceInText(tn.textContent))
                    }
                })
            }
        })
        markModified(el)
    }
}

// this case covers senses summary senses__summary
const covertSenses = function() {
    const sensesClass = '.ct-senses__summary'
    let containers = queryAll(sensesClass)
    containers.forEach(function(el) {
        el.textContent = calculateMetricDistanceInText(el.textContent)
    })
}

// this case covers the conversion from lbs to kg
const convertWeightNumber = function() {
    const wnDivClass = 'weight-number'
    const wnNumberClass = '__number'
    const wnLabelClass = '__label'

    let weights = queryAll(createMixQuery(wnDivClass, ...defaultPrefixes))
    weights.forEach(function(el) {
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


waitForSwitchToBeTriggered('bmToggleStates', 'csToggle', waitingForCharacterSheet)
addStorageListener('bmToggleStates', 'csToggle', waitingForCharacterSheet)