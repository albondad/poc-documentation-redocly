const { spawnSync } = require('child_process');

spawnSync(
  'sudo',
  ['docker', 'build', '.', '-t', 'albondad/poc-documentation-stoplight'],
  {
    stdio: 'inherit',
  },
);

spawnSync(
  'sudo',
  ['docker', 'run', '-p', '3000:3000', 'albondad/poc-documentation-stoplight'],
  {
    stdio: 'inherit',
  },
);
