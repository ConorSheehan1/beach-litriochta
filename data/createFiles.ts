const { readFileSync, writeFileSync } = require("fs");

// config
const minNumAnswers = 20;

const data = readFileSync("./data/IrishWords.txt");
// each word is on a new line, first 6 lines are comments
const words = data
  .toString()
  .split("\n")
  .slice(6, -1)
  .map((s: string) => s.toLowerCase());
const validWords = words.filter((word: string) => {
  if (word.length < 4) return false;
  const uniqueLetters = new Set(word);
  if (uniqueLetters.size > 7) return false;
  return true;
});

const pangrams = validWords.filter((word: string) => new Set(word).size == 7);

writeFileSync("./data/answers.txt", validWords.join("\n"));
writeFileSync("./data/pangrams.txt", pangrams.join("\n"));

const uniqueLetterCombinations = pangrams.reduce((acc: Set<string>, pangram: string) => {
  const uniqueLetters = new Set(pangram.split("").sort());
  acc.add(Array.from(uniqueLetters).join(""));
  return acc;
}, new Set());
const numPangrams = pangrams.length;
const numUniqueLetterCombinations = uniqueLetterCombinations.size;

// {numPangrams: 1047, numUniqueLetterCombinations: 931}
// console.log({ numPangrams, numUniqueLetterCombinations })

const allAnswers = [];

for (let offset = 0; offset < 7; offset++) {
  for (let i = 0; i < numUniqueLetterCombinations; i++) {
    const availableLetters = Array.from(uniqueLetterCombinations)[i] as string;
    // for each unique letter combination, choose middle letter in sequence
    // e.g. [0,1,2,3,4,5,6,0,1,2,3...], [1,2,3,4,5,6,0,1,2,3...]
    const middleLetter = availableLetters[(i + offset) % 7];
    const answers = validWords.filter((word: string) => {
      if (!word.includes(middleLetter)) return false;
      return word.split("").every((char: string) => availableLetters.includes(char));
    });
    if (answers.length >= minNumAnswers) {
      allAnswers.push({ answers, middleLetter, availableLetters });
    } // else {
    //   console.log({ availableLetters, middleLetter, len: answers.length })
    // }
  }
}

// TODO: add custom word list? try wordle.global word list?
// https://github.com/Hugo0/wordle
// IrishWords is missing basic words. e.g. reoite -> frozen, beans??
writeFileSync(
  "./data/allAnswers.ts",
  `export default ${JSON.stringify(allAnswers, null, 2)}`
);
