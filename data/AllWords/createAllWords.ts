// This script adds missing words and removes unwanted words from the original wordlist
// https://github.com/LindaKeating/foclach/blob/main/src/IrishWords.txt
// modified manually to strip additional tabs and only include words

import { readFileSync, writeFileSync }  from "fs";

const fileToLowerCaseArray = (filePath: string): Array<any> => {
  const data = readFileSync(filePath);
  return data
    .toString()
    .split("\n")
    .map((s: string) => s.toLowerCase());
}

const originalWords = fileToLowerCaseArray("./data/AllWords/IrishWords.txt");
const removedWordsSet = new Set(fileToLowerCaseArray("./data/AllWords/wordsRemoved.txt"));
const addedWords = fileToLowerCaseArray("./data/AllWords/wordsAdded.txt");

const allWords = originalWords
  .concat(addedWords)
  .filter(word => !removedWordsSet.has(word))
  .sort();

writeFileSync("./data/AllWords.txt", allWords.join("\n"));