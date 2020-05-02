const interval = 500
const observerConfig = { attributes: true, childList: true, subtree: true }
const observerTarget = document

const monsterStatsContainerClass = '.mon-stat-block'


// Wait for monster stats to load then trigger bmCharacterSheetLoaded event
const waitingForCharacterSheet = function () {
    const loadingCharacterSheet = setInterval(function () {
        const monsterStatsLoaded = queryAll(monsterStatsContainerClass).length >= 1
        if (monsterStatsLoaded) {
            monsterStatsAfterLoad()
            clearInterval(loadingCharacterSheet)
        }
    }, interval);
}
waitingForCharacterSheet()

// This function is called after the monster stats were loaded
const monsterStatsAfterLoad = function () {
    replaceUnits()
    new MutationObserver(replaceUnits).observe(observerTarget, observerConfig)
}

const replaceUnits = function () {
    setInterval(function () {
        convertUnitsInMonsterText()
    }, interval)
}

// this case covers monster descriptions mon-stat-block and monster extra info more-info-content
const convertUnitsInMonsterText = function() {
    const moreInfoClass = '.more-info-content'
    const statBlock = queryAll(monsterStatsContainerClass + ',' + moreInfoClass)

    statBlock.forEach(function(el) {
        if (checkIfNotEmpty(el) && !checkIfMarked(el, convertedClass)) {
            const textNodes = textNodesUnder(el)
            textNodes.forEach(function (tn) {
                if (checkIfTextNodeNotEmpty(tn)){
                    tn.textContent = calculateWeightInText(calculateMetricDistanceInText(tn.textContent))
                }
            })
            markModified(el)
        }
    })
}