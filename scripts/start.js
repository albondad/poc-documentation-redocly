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
  fs.renameSync('redoc-static.html', 'index.html');
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
  fs.renameSync('index.html', 'public/index.html');
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
      '[debug] There was an error. The process will restart in 10 seconds.',
    );
    setTimeout(main, 10000);
  }
};

main();
