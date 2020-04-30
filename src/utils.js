const convertedClass = 'bm-converted-to-metric'

const createMixQuery = function(cls, premium, normal) {
    const premiumString = '.' + premium + '-' + cls
    const normalString = '.' + normal + '-' + cls
    const returnString = premiumString + ', ' + normalString
    return returnString
}

const replaceSimpleDistancWithMetric = function(el, dnNumberSpan, dnLabelSpan) {
    if (!checkIfMarked(el, convertedClass)) {
        if (checkIfNotEmpty(dnNumberSpan, true)) {
            dnNumberSpan.innerHTML = calculateMetricDistance(dnNumberSpan.innerHTML)
        }
        if (checkIfNotEmpty(dnLabelSpan)) {
            changeLabel(dnLabelSpan)
        }
        markModified(el)
    }
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

const checkIfNotEmpty = function(el, isDistance) {
    if (el && el.innerHTML) {
        if (isDistance) {
            return el.innerHTML !== '--'
        }
        return true
    }
    return false
}

const markModified = function(htmlElement) {
    htmlElement.classList.add(convertedClass)
}

const checkIfMarked = function(htmlElement, classToCheck) {
    return htmlElement.classList.contains(classToCheck)
}

const changeLabel = function(label) {
    label.innerHTML = 'm.'
}

const calculateMetricDistance = function(distance) {
    const d5 = distance / 5
    return d5 + d5 / 2
}

const replaceLongRangeDistance = function(distance) {
    const newDistance = distance.slice(1, distance.length - 1)
    return calculateMetricDistance(newDistance)
}