const truncateTextToMaxLength = (text: string, maxLength = 50) => {
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

export {
  truncateTextToMaxLength,
  capitalizeFirstLetterEachWord,
  capitalizeFirstLetter,
};
