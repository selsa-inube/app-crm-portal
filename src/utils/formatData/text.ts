const truncateTextToMaxLength = (
  text: string | undefined | null,
  maxLength = 50,
) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

function capitalizeFirstLetterEachWord(text: string) {
  return text
    .toLowerCase()
    .replace(/(^|[\s\u200B])\w/g, (character) => character.toUpperCase());
}

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const capitalizeText = (text: string) => {
  const textWithoutSpaces = text.trim();
  return (
    textWithoutSpaces.trim().charAt(0).toUpperCase() +
    textWithoutSpaces.slice(1).toLowerCase()
  );
};

const capitalizeEachWord = (text: string) =>
  text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export {
  truncateTextToMaxLength,
  capitalizeFirstLetterEachWord,
  capitalizeFirstLetter,
  capitalizeText,
  capitalizeEachWord,
};
