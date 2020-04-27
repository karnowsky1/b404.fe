export const chunk = (list, chunkSize) =>
  list.reduce(
    (arr, item) => {
      const newArr = [...arr];
      const latest = newArr[newArr.length - 1];
      if (latest.length >= chunkSize) {
        newArr.push([item]);
      } else {
        latest.push(item);
      }
      return newArr;
    },
    [[]]
  );
