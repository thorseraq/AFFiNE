import fs from 'fs-extra';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Array as YArray, Map as YMap } from 'yjs';
import { encodeStateAsUpdate } from 'yjs';

import { loadYDoc } from "./util";

const path = resolve(dirname(fileURLToPath(import.meta.url)), 'blog.ydoc');
const doc = loadYDoc(path);
const pageLen = [...doc.getMap('space:meta').get('pages') as YArray<unknown>].length;
const meta = doc.getMap('space:meta').get('pages') as YArray<unknown>;
(meta.get(162) as YMap<unknown>).set('title', 'AFFINE v0.8.0 Release Week Day 5')
for (let i = 0; i < pageLen; i++) {
    const page = meta.get(i);
    const obj = doc.getMap('space:' + (page as YMap<unknown>).get('id') as string).toJSON();
    if (Object.keys(obj).length === 0) {
        console.log(i);
        meta.delete(i);
    }
}

const contentBlocks: Array<YMap<unknown>> = [];
let frameBlock: YMap<unknown> = new YMap<unknown>();
const problemPage = doc.getMap('space:HWT59belgY');
problemPage.clear();
for (const key of problemPage.keys()) {
    const yMap = problemPage.get(key) as YMap<unknown>;
    if (yMap.get('sys:flavour') === 'affine:frame') {
        frameBlock = yMap;
    } else if (!['affine:surface', 'affine:page'].includes(yMap.get('sys:flavour') as string)) {
        contentBlocks.push(yMap);
    }
}

const frameChildren = new YArray<YMap<unknown>>();
frameBlock.set('sys:children', frameChildren);
for (const contentBlock of contentBlocks) {
    frameChildren.push([contentBlock.clone()]);
}

const outputPath = resolve(dirname(fileURLToPath(import.meta.url)), 'blog-fixed.ydoc');
fs.writeFileSync(outputPath, Buffer.from(encodeStateAsUpdate(doc)), { encoding: 'binary' });