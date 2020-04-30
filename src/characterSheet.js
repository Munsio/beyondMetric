const waitingForCharacterSheet = function () {
    const csLoadedEvent = new Event('biCsLoaded')
    const loadingCharacterSheet = setInterval(function () {
        const CharacterSheetLoaded = document.querySelectorAll('#character-tools-target > .ct-character-sheet .ct-quick-info__ability, #character-sheet-target > .ct-character-sheet .ct-quick-info__ability').length >= 1 ? true : false
        if (CharacterSheetLoaded) {
            document.dispatchEvent(csLoadedEvent)
            clearInterval(loadingCharacterSheet)
        }
    }, 100);

    document.addEventListener('biCsLoaded', function() {
        afterLoad()
    })
}

const afterLoad = function() {
    replaceWithNonRetardedUnits()
}

const replaceWithNonRetardedUnits = function() {
    setInterval(function() {
        distanceNumber()
        rangeNumber()
    }, 500)
}

const distanceNumber = function () {
    let distances = document.querySelectorAll('.ddbc-distance-number, .ct-distance-number')
    distances.forEach(function (el) {
        const distanceNumber = el.querySelector('.ddbc-distance-number__number, .ct-distance-number__number')
        const distanceLabel = el.querySelector('.ddbc-distance-number__label, .ct-distance-number__label')
        if (distanceNumber && distanceNumber.innerHTML && distanceLabel && distanceLabel.innerHTML) {
            if (!el.classList.contains('bi-modified')) {
                replaceRetardedUnit(distanceNumber, el)
                replaceRetardedLabel(distanceLabel, el)
                markModified(el)
            }
        }
    })
}

const rangeNumber = function() {
    let distances = document.querySelectorAll('.ddbc-combat-attack__range-value, .ct-combat-attack__range-value')
    distances.forEach(function (el) {
        const rangeValueClose = el.querySelector('.ddbc-combat-attack__range-value-close, .ct-combat-attack__range-value-close')
        const rangeValueLong = el.querySelector('.ddbc-combat-attack__range-value-long, .ct-combat-attack__range-value-long')
        if (rangeValueClose && rangeValueClose.innerHTML && rangeValueLong && rangeValueLong.innerHTML) {
            if (!el.classList.contains('bi-modified')) {
                replaceRetardedUnit(rangeValueClose, el)
                regexRetardedUnitOut(rangeValueLong, el)
                markModified(el)
            }
        }
    })
}

const replaceRetardedUnit = function (distanceHTML) {
    distanceHTML.innerHTML = (distanceHTML.innerHTML / 5) + ((distanceHTML.innerHTML / 5) / 2)
}

const replaceRetardedLabel = function (labelHTML) {
    labelHTML.innerHTML = 'm.'
}

const regexRetardedUnitOut = function (distanceHTML) {
    const newDistance = distanceHTML.innerHTML.slice(1, distanceHTML.innerHTML.length - 1)
    distanceHTML.innerHTML = (newDistance / 5) + ((newDistance / 5) / 2)
}

const markModified = function (htmlElement) {
    htmlElement.classList.add('bi-modified')
}

waitingForCharacterSheet()