import fs from 'fs-extra';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import type { Array as YArray, Map as YMap } from 'yjs';
import { encodeStateAsUpdate } from 'yjs';

import { loadYDoc } from "./util";

const path = resolve(dirname(fileURLToPath(import.meta.url)), 'blog.ydoc');
const doc = loadYDoc(path);
const meta = doc.getMap('space:meta').get('pages') as YArray<unknown>;
meta.delete(162);
const pageLen = [...doc.getMap('space:meta').get('pages') as YArray<unknown>].length;
for (let i = 0; i < pageLen; i++) {
    const page = meta.get(i);
    const obj = doc.getMap('space:' + (page as YMap<unknown>).get('id') as string).toJSON();
    if (Object.keys(obj).length === 0) {
        console.log(i);
        meta.delete(i);
    }
}

const problemPage = doc.getMap('space:HWT59belgY');
problemPage.clear();

const outputPath = resolve(dirname(fileURLToPath(import.meta.url)), 'blog-fixed.ydoc');
fs.writeFileSync(outputPath, Buffer.from(encodeStateAsUpdate(doc)), { encoding: 'binary' });