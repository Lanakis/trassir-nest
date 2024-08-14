export const Merge = (source, dist) => {
  for (const key of Object.keys(source)) {
    if (key in dist) {
      try {
        dist[key] = source[key];
      } catch (error) {
        console.error(`Failed to merge key "${key}":`, error);
      }
    }
  }
  return dist;
};

export const RemoveEmptyAndArray = <T extends object>(source: T): T => {
  const result = {} as T;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];

      if (value !== undefined && value !== null && !Array.isArray(value) && typeof value !== 'object') {
        result[key] = value;
      }
    }
  }

  return result;
};
