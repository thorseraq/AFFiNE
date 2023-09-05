import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { loadYDoc } from "./util";

const path = resolve(dirname(fileURLToPath(import.meta.url)), 'blog-fixed.ydoc');
const doc = loadYDoc(path);
console.log(doc.getMap('space:meta').toJSON());