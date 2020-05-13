const convertedClass = 'bm-converted-to-metric'

const waitForSwitchToBeTriggered = function (querryStirng, toggleType, callback) {
    chrome.storage.sync.get(querryStirng, function (result) {
        const toggleStates = result.bmToggleStates
        if (toggleStates[toggleType]) {
            callback()
        }
    })
}

const addStorageListener = function (querryStirng, toggleType, callback) {
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (var key in changes) {
            var storageChange = changes[key];
            if (key === querryStirng) {
                const oldValue = storageChange.oldValue
                const newValue = storageChange.newValue
                if (oldValue[toggleType] !== newValue[toggleType]) {
                    if (newValue[toggleType]) {
                        callback()
                    } else {
                        location.reload()
                    }
                }
            }
        }
    })
}

const queryAll = function (query, target = document) {
    return target.querySelectorAll(query)
}

const query = function (query, target = document) {
    return target.querySelector(query)
}

const textNodesUnder = function (el) {
    let n
    let a = []
    let walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false)

    while (n = walk.nextNode()) {
        a.push(n)
    }

    return a;
}

const createMixQuery = function (cls, premium, normal) {
    const premiumString = '.' + premium + '-' + cls
    const normalString = '.' + normal + '-' + cls
    const returnString = premiumString + ', ' + normalString
    return returnString
}

const checkIfNotEmpty = function (el, isValue) {
    if (el && el.innerHTML) {
        if (isValue) {
            return el.innerHTML !== '--'
        }
        return true
    }
    return false
}

const checkIfTextNodeNotEmpty = function (textNode) {
    return textNode && textNode.textContent && textNode.textContent.length > 0
}

const markModified = function (htmlElement) {
    htmlElement.classList.add(convertedClass)
}

const checkIfMarked = function (htmlElement, classToCheck) {
    return htmlElement.classList.contains(classToCheck)
}

const feetStringEquivalent = function (ftString) {
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
        case 'mile':
            mString = 'kilometres'
            break
        case 'miles':
            mString = 'kilometres'
            break
        default:
            break
    }

    return mString
}

const changeLabelToMetric = function (label) {
    label.innerHTML = feetStringEquivalent(label.innerHTML)
}

const roundUpToTwoDecibles = function (number) {
    return Math.round((number + Number.EPSILON) * 100) / 100
}

const cleanCommas = function (text) {
    return text.replace(',', '')
}

const calculateMetricDistance = function (distance) {
    distance = cleanCommas(distance)
    const d5 = distance / 5
    return roundUpToTwoDecibles(d5 + d5 / 2)
}

const calculateMileToKm = function (distance) {
    distance = cleanCommas(distance)
    return roundUpToTwoDecibles(distance * 1.6)
}

const replaceLongRangeDistance = function (distance) {
    const newDistance = distance.slice(1, distance.length - 1)
    return calculateMetricDistance(newDistance)
}

const calculateMetricDistanceInText = function (text) {
    text = text.replace(/([0-9]{1,3}(,[0-9]{3})+) (feet)/g, function (match, number, notUsed, label) {
        return calculateMetricDistance(number) + ' ' + feetStringEquivalent(label)
    })
    text = text.replace(/([0-9]+) (feet)/g, function (match, number, label) {
        return calculateMetricDistance(number) + ' ' + feetStringEquivalent(label)
    })
    text = text.replace(/([0-9]+)-(foot)/g, function (match, number, label) {
        return calculateMetricDistance(number) + '-' + feetStringEquivalent(label)
    })
    text = text.replace(/([0-9]+) (ft.)/g, function (match, number, label) {
        return calculateMetricDistance(number) + ' ' + feetStringEquivalent(label)
    })
    text = text.replace(/([0-9]+) cubic (foot)/g, function (match, number, label) {
        return calculateMetricDistance(number) + ' cubic ' + feetStringEquivalent('feet') //TODO make it more generic
    })
    text = text.replace(/([0-9]+) (mile)/g, function (match, number, label) {
        return calculateMileToKm(number) + ' ' + feetStringEquivalent(label)
    })
    text = text.replace(/([0-9]{1,3}(,[0-9]{3})+) (miles)/g, function (match, number, notUsed, label) {
        return calculateMileToKm(number) + ' ' + feetStringEquivalent(label)
    })
    text = text.replace(/([0-9]+) (miles)/g, function (match, number, label) {
        return calculateMileToKm(number) + ' ' + feetStringEquivalent(label)
    })
    text = text.replace(/(range of )([0-9]+)\/([0-9]+)/g, function (match, words, smallRange, bigRange) {
        return words + calculateMetricDistance(smallRange) + '/' + calculateMetricDistance(bigRange)
    })
    text = text.replace(/(range )([0-9]+)\/([0-9]+)/g, function (match, words, smallRange, bigRange) {
        return words + calculateMetricDistance(smallRange) + '/' + calculateMetricDistance(bigRange)
    })

    return text
}

const poundsStringEquivalent = function (lbString) {
    let kgString = 'kilogram'

    switch (lbString) {
        case 'lb.':
            kgString = 'kg.'
            break;
        case 'pounds':
            kgString = 'kilograms'
            break
        case 'pound':
            kgString = 'kilogram'
            break
        default:
            break
    }

    return kgString
}

const calculateKiloWeight = function (weight) {
    return weight / 2
}

const replaceLabelWithKilo = function (label) {
    label.innerHTML = poundsStringEquivalent(label.innerHTML)
}

const calculateWeightInText = function (text) {
    text = text.replace(/([0-9]+) (pounds)/g, function (match, number, label) {
        return calculateKiloWeight(number) + ' ' + poundsStringEquivalent(label)
    })
    text = text.replace(/([0-9]+) (pound)/g, function (match, number, label) {
        return calculateKiloWeight(number) + ' ' + poundsStringEquivalent(label)
    })
    text = text.replace(/([0-9]+) (lb.)/g, function (match, number, label) {
        return calculateKiloWeight(number) + ' ' + poundsStringEquivalent(label)
    })

    return text
}