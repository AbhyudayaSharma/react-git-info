import GitInfo from 'react-git-info/macro';

const gitInfo = GitInfo();

describe('Git information', () => {
  test('gets correct branch', () => {
    expect(gitInfo.branch).toBe('main');
  });

  test('gets correct tags', () => {
    expect(gitInfo.tags).toHaveLength(0);
  });

  test('gets correct message', () => {
    expect(gitInfo.commit.message).toBe('Git commit message');
  })
});
