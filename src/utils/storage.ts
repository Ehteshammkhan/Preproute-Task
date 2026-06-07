const storage = {
  set: (key: string, value: unknown) => {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  },

  get: <T>(key: string): T | null => {
    try {
      const value =
        localStorage.getItem(key);

      return value
        ? JSON.parse(value)
        : null;
    } catch {
      return null;
    }
  },

  remove: (key: string) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  },
};

export default storage;