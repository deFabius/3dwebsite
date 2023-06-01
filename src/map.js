export function createMap(size) {
  const data = [];

  initialize();

  function initialize() {
    // for (let x = 0; x < size; x++) {
    //   const column = [];

    //   for (let y = 0; y < size; y++) {
    //     const tile = { x, y };
    //     column.push(tile);
    //   }

    //   data.push(column);
    // }
    const track = [ [-10, -10], [-9, -2], [-11, 6], [-2, 9], [5,12], [9, 3], [-2, 1], [-3,-5], [3, -12], [0, -14]]
    data.push(...track)
  }

  return {
    data,
    size,
  };
}
