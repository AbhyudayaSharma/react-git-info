import GitVersion from 'react-git-info/macro';
const { execSync } = require('child_process');

const shortCommitHash = execSync('git rev-parse --short HEAD').toString().trim();

const gitVersion = GitVersion();

describe('Git version one commit ahead from tag', () => {
  test('gets correct tag', () => {
    expect(gitVersion.tag).toEqual('hello-version');
  });
  test('gets correct distance', () => {
    expect(gitVersion.distance).toEqual(1);
  });
  test('gets correct shortHash', () => {
    expect(gitVersion.shortHash).toEqual("g" + shortCommitHash);
  });
  test('gets correct dirty state', () => {
    expect(gitVersion.isDirty).toEqual(false);
  });
});
