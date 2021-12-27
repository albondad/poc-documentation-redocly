const { spawnSync } = require('child_process');
const axios = require('axios');
const fs = require('fs');

const bundleIntoRedocStaticHTMLFile = async () => {
  await axios.get(process.env.OPENAPI_FILE_URL);
  spawnSync('redoc-cli', ['bundle', process.env.OPENAPI_FILE_URL], {
    stdio: 'inherit',
  });
};

const renameRedocStaticHTMLFileToIndexHTMLFile = () => {
  const callback = (error) => {
    if (error) {
      console.log('[debug] There was an error when renaming the file.');
    } else {
      console.log('[debug] Renaming the file was successful.');
    }
  };
  fs.renameSync('redoc-static.html', 'index.html', callback);
};

const moveIndexHTMLFile = () => {
  const isPublicDirectoryExisting = fs.existsSync('./public');
  if (isPublicDirectoryExisting) {
    fs.rmdirSync('./public', {
      recursive: true,
      force: true,
    });
  }
  fs.mkdirSync('./public');
  const renameSyncCallback = (error) => {
    if (error) {
      console.log('[debug] There was an error when moving the file.');
    } else {
      console.log('[debug] Moving the file was successful.');
    }
  };
  fs.renameSync('index.html', 'public/index.html', renameSyncCallback);
};

const startNest = async () => {
  spawnSync('nest', ['start'], {
    stdio: 'inherit',
  });
};

const main = async () => {
  try {
    await bundleIntoRedocStaticHTMLFile();
    renameRedocStaticHTMLFileToIndexHTMLFile();
    moveIndexHTMLFile();
    startNest();
  } catch (error) {
    console.log(
      '[debug] There was an error making a request. A request will be made again in 10 seconds.',
    );
    console.log('[debug] error', error);
    setTimeout(main, 10000);
  }
};

main();
