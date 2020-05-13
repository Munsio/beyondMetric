const csToggle = query('#csToggle')
const msToggle = query('#msToggle')
const toggles = queryAll('#csToggle, #msToggle')

const loadValuesToToggle = function () {
    chrome.storage.sync.get('bmToggleStates', function (result) {
        const toggleStates = result.bmToggleStates

        csToggle.checked = toggleStates && toggleStates.csToggle ? true : false
        msToggle.checked = toggleStates && toggleStates.msToggle ? true : false
    })
}

const saveChanges = function () {
    const bmToggleStates = {
        'csToggle': csToggle.checked,
        'msToggle': msToggle.checked
    }

    chrome.storage.sync.set({ 'bmToggleStates': bmToggleStates })
}

document.addEventListener('DOMContentLoaded', function () {
    loadValuesToToggle()
})

toggles.forEach(el => {
    el.addEventListener('change', function (ev) {
        saveChanges()
    })
})