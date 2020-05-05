import GitInfo from 'react-git-info/macro';
const { execSync } = require('child_process')

const commitHash = execSync('git rev-parse HEAD').toString().trim();
const commitDate = execSync('git log --format=%cI -n 1 HEAD').toString().trim();
const shortCommitHash = execSync('git rev-parse --short HEAD').toString().trim();

const gitInfo = GitInfo();

describe('Git information', () => {
  test('gets correct branch', () => {
    expect(gitInfo.branch).toBeUndefined();
  });

  test('gets correct hash', () => {
    expect(gitInfo.commit.hash).toBe(commitHash);
  });

  test('get correct short hash', () => {
    expect(gitInfo.commit.shortHash).toBe(shortCommitHash);
  })

  test('gets correct commit date', () => {
    expect(gitInfo.commit.date).toBe(commitDate);
  });
});
