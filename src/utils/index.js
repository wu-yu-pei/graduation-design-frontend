const localStorageWithExpiry = {
  setItem(key, value, expiryInMinutes) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + expiryInMinutes * 60 * 1000, // 转换为毫秒
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  getItem(key) {
    const itemStr = localStorage.getItem(key);
    // 如果没有找到对应的值，直接返回 null
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // 检查是否过期
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key); // 如果过期，移除项并返回 null
      return null;
    }

    return item.value; // 如果未过期，返回值
  },

  removeItem(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};

export default localStorageWithExpiry;