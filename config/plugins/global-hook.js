import { join, relative } from 'path';
import { existsSync } from 'fs';

export default function(api) {
  const { paths } = api.service;

  const globalFiles = [join(paths.absSrcPath, 'index.js')];

  api.addEntryCode(() => {
    return globalFiles
      .filter(f => existsSync(f))
      .slice(0, 1)
      .map(f => ({
        source: relative(paths.absTmpDirPath, f),
      }))
      .map(f => `require('${f.source.split('\\').join('/')}')`)[0];
  });

  api.addPageWatcher(globalFiles);
}
