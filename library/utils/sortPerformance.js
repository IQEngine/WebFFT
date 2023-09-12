function sortDescending(data) {
  // Extract arrays from data object
  let xArray = data[0].x;
  let yArray = data[0].y;
  let barColors = data[0].marker.color;

  // Create an array of objects from xArray, yArray, and barColors
  let combined = xArray.map((x, i) => ({ x: x, y: yArray[i], color: barColors[i] }));

  // Sort combined array by 'y' property in descending order
  combined.sort((a, b) => b.y - a.y);

  // Map sorted array back to original arrays
  const sortedXArray = combined.map((item) => item.x);
  const sortedYArray = combined.map((item) => item.y);
  const sortedBarColors = combined.map((item) => item.color);

  // Create a new data object with sorted arrays
  const sortedData = [
    {
      x: sortedXArray,
      y: sortedYArray,
      type: "bar",
      marker: { color: sortedBarColors },
    },
  ];

  return sortedData;
}

export default sortDescending;
