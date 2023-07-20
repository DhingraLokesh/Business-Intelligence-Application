const getFieldDataFromJSON = (excel, fieldName) => {
  return excel.map((item) => item[fieldName]);
};

const checkIsNaN = (excel) => {
  const dateRegex = /^\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4}$/;
  const uniqueFieldsSet = new Set();

  excel.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (!isNaN(Number(value)) || dateRegex.test(value)) {
        uniqueFieldsSet.add(key);
      }
    });
  });

  return Array.from(uniqueFieldsSet);
};

const hasNullOrUndefinedEmptyString = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    const row = arr[i];
    for (let j = 0; j < row.length; j++) {
      const value = row[j];

      if (value === null || value === undefined) {
        console.log(`Field at row ${i}, column ${j} is null or undefined.`);
        return true;
      }

      if (typeof value === "string" && value.trim() === "") {
        console.log(`Field at row ${i}, column ${j} is an empty string.`);
        return true;
      }
    }
  }

  console.log("No null, undefined, or empty string fields found.");
  return false;
};

const getPieChartData = (excel, fieldName) => {
  const data = getFieldDataFromJSON(excel, fieldName);
  const frequencyMap = data.reduce((map, item) => {
    map[item] = (map[item] || 0) + 1;
    return map;
  }, {});

  const keysArray = Object.keys(frequencyMap);
  const valuesArray = Object.values(frequencyMap);
  return { keysArray, valuesArray };
};

export {
  getFieldDataFromJSON,
  getPieChartData,
  checkIsNaN,
  hasNullOrUndefinedEmptyString,
};
