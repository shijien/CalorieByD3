function getStorageItem(itemName) {
    let myStorage = window.localStorage;
    return JSON.parse(myStorage.getItem(itemName));
}

function setStorageItem(itemName, items) {
    let myStorage = window.localStorage;
    myStorage.setItem(itemName, JSON.stringify(items));
    return items;
}

module.exports = {
    getStorageItem: getStorageItem,
    setStorageItem: setStorageItem
};