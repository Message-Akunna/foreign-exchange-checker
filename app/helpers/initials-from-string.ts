export const initialsFromString = (...val: (string | undefined)[]) => {
  // Filter out undefined, null, and empty strings, then join and split by space
  const valArr = val
    .filter((i) => i?.trim()) // Remove undefined, null, and empty strings
    .join(" ")
    .split(" ")
    .filter(Boolean); // Remove any remaining empty elements from split

  // Check if the filtered array is empty
  if (valArr.length === 0) {
    return ""; // Return an empty string if no valid inputs
  }

  // Get the first initial
  const firstStrCapitalized = valArr[0].charAt(0).toUpperCase();

  // Get the second initial if available
  const secondStrCapitalized =
    valArr.length > 1
      ? valArr[1].charAt(0).toUpperCase()
      : (valArr[0].charAt(1).toUpperCase() ?? "");

  return `${firstStrCapitalized}${secondStrCapitalized}`;
};
