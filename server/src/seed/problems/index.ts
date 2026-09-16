import easyProblems from './easy.json';
import mediumProblems from './medium.json';
import hardProblems from './hard.json';

export const allCatalogProblems = [
  ...(easyProblems as any[]),
  ...(mediumProblems as any[]),
  ...(hardProblems as any[])
].sort((a, b) => a.number - b.number);

export { easyProblems, mediumProblems, hardProblems };
