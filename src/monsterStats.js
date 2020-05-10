const interval = 100
const observerConfig = { attributes: true, childList: true, subtree: true }
const observerTarget = document

const monsterStatsContainerClass = '.mon-stat-block'

chrome.storage.sync.get('bmToggleStates', function(result) {
    const toggleStates = result.bmToggleStates
    if (toggleStates.msToggle) {
        waitingForMonsterStats()
    }
})

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        if (key === 'bmToggleStates') {
            const oldValue = storageChange.oldValue
            const newValue = storageChange.newValue
            if (oldValue.msToggle !== newValue.msToggle) {
                if (newValue.msToggle) {
                    waitingForMonsterStats()
                } else {
                    location.reload()
                }
            }
        }
    }
})

// Wait for monster stats to load then trigger bmCharacterSheetLoaded event
const waitingForMonsterStats = function() {
    const loadingCharacterSheet = setInterval(function () {
        const monsterStatsLoaded = queryAll(monsterStatsContainerClass).length >= 1
        if (monsterStatsLoaded) {
            monsterStatsAfterLoad()
            clearInterval(loadingCharacterSheet)
        }
    }, interval);
}

// This function is called after the monster stats were loaded
const monsterStatsAfterLoad = function() {
    replaceUnits()
    new MutationObserver(replaceUnits).observe(observerTarget, observerConfig)
}

const replaceUnits = function() {
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