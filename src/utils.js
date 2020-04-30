const convertedClass = 'bm-converted-to-metric'

const queryAll = function(query, target=document) {
    return target.querySelectorAll(query)
}

const createMixQuery = function(cls, premium, normal) {
    const premiumString = '.' + premium + '-' + cls
    const normalString = '.' + normal + '-' + cls
    const returnString = premiumString + ', ' + normalString
    return returnString
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

const feetStringEquivalent = function(ftString) {
    let mString = 'meter'

    switch (ftString) {
        case 'ft.':
            mString = 'm.'
            break;
        case 'feet':
            mString = 'meters'
            break
        case 'foot':
            mString = 'meter'
            break
        default:
            break;
    }

    return mString
}

const changeLabel = function(label) {
    label.innerHTML = feetStringEquivalent(label.innerHTML)
}

const calculateMetricDistance = function(distance) {
    const d5 = distance / 5
    return d5 + d5 / 2
}

const replaceLongRangeDistance = function(distance) {
    const newDistance = distance.slice(1, distance.length - 1)
    return calculateMetricDistance(newDistance)
}

const calculateMetricDistanceInText = function(text) {
    text = text.replace(/([0-9]+) (feet)/g, function(match, number, label) {
        return calculateMetricDistance(number) + ' ' + feetStringEquivalent(label)
    })    
    text = text.replace(/([0-9]+)-(foot)/g, function(match, number, label) {
        return calculateMetricDistance(number) + '-' + feetStringEquivalent(label)
    })   
    text = text.replace(/([0-9]+) (ft.)/g, function(match, number, label) {
        return calculateMetricDistance(number) + ' ' + feetStringEquivalent(label)
    })

    return text
}