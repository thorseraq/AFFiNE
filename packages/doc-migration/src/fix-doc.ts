import fs from 'fs-extra';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Array as YArray, Map as YMap } from 'yjs';
import { encodeStateAsUpdate } from 'yjs';

import { loadYDoc } from "./util";

const path = resolve(dirname(fileURLToPath(import.meta.url)), 'blog-broken.ydoc');
const doc = loadYDoc(path);
const meta = doc.getMap('space:meta').get('pages') as YArray<unknown>;

const path2 = resolve(dirname(fileURLToPath(import.meta.url)), 'blog.ydoc');
const doc2 = loadYDoc(path2);
const meta2 = doc2.getMap('space:meta').get('pages') as YArray<unknown>;
// console.log(meta2.toJSON());

meta.delete(0, meta.length);
// meta2.forEach(map => {
//     meta.push([(map as YMap<unknown>).clone()]);
// });

// const pageIdsInMeta = Object.values(meta.toJSON()).map(item => item.id);
// const pageIds = Object.keys(doc.toJSON()).map(key => key.slice(key.indexOf(':') + 1));

// const unRecordedPageIds = pageIds.filter(pageId => pageIdsInMeta.every(id => id !== pageId));
// console.log(unRecordedPageIds);

const availablePages = [];
for (const pageId of Object.keys(doc.toJSON()).filter(item => item !== 'space:meta')) {
    const page = doc.getMap(pageId) as YMap<YMap<unknown>>;
    for (const block of page.values()) {
        if ((block as YMap<unknown>).get('sys:flavour') === 'affine:page') {
            const title = block.get('prop:title').toString();
            if (title === '' || title.includes('titletws') || title.includes('Pinboard') || title === 'test' || title === 'Welcome to AFFiNE') {
                continue;
            }
            availablePages.push({
                id: pageId.slice(pageId.indexOf(':') + 1),
                title,
                createDate: new Date().getTime(),
                trash: false,
                trashDate: undefined,
                trashRelate: undefined,
                subpageIds: []
            });
        }
    }
}

availablePages.forEach(page => {
    const pageMeta = new YMap();
    pageMeta.set('id', page.id);
    pageMeta.set('title', page.title);
    pageMeta.set('createDate', page.createDate);
    pageMeta.set('trash', page.trash);
    pageMeta.set('trashDate', page.trashDate);
    pageMeta.set('subpageIds', page.subpageIds);
    meta.push([pageMeta]);
})


console.log((doc.getMap('space:meta').get('pages') as YArray<unknown>).toJSON());


const outputPath = resolve(dirname(fileURLToPath(import.meta.url)), 'blog-fixed.ydoc');
fs.writeFileSync(outputPath, Buffer.from(encodeStateAsUpdate(doc)), { encoding: 'binary' });