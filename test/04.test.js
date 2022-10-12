import GitVersion from 'react-git-info/macro';
const { execSync } = require('child_process');

const shortCommitHash = execSync('git rev-parse --short HEAD').toString().trim();

const gitVersion = GitVersion();

describe('Git version tag on commit', () => {
  test('gets correct tag', () => {
    expect(gitVersion.tag).toEqual('hello-version');
  });
  test('gets correct distance', () => {
    expect(gitVersion.distance).toEqual(0);
  });
  test('gets correct shortHash', () => {
    expect(gitVersion.shortHash).toEqual("g" + shortCommitHash);
  });
  test('gets correct dirty state', () => {
    expect(gitVersion.isDirty).toEqual(true);
  });
});
