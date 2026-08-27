import { loadSVGFromURL } from 'fabric';

import generatePath from './shape';

async function parseSVG(url: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const { objects, options: summary } = await loadSVGFromURL(url);
      const frame = {
        width: summary.width,
        height: summary.height,
      };

      let layers: any[] = [];

      for (const object of objects) {
        if (object && (object as any).type === 'path') {
          const path = generatePath(object);
          layers = layers.concat(path);
        }
      }

      const design = {
        frame,
        layers,
        name: 'Hello world',
      };
      resolve(design);
    } catch (err) {
      reject(err);
    }
  });
}

export default parseSVG;
