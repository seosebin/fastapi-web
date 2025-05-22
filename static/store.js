// localStorage 연동 유틸 함수
export function setStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getStore(key, defaultValue = null) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
}

export function clearStore(keys = []) {
    keys.forEach(key => localStorage.removeItem(key));
}
