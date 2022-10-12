import  GitInfo from 'react-git-info/macro';

const gitInfo = GitInfo();

describe('Git information', () => {
  test('gets correct branch', () => {
    expect(gitInfo.branch).toBe('main');
  });

  test('gets correct tags', () => {
    expect(gitInfo.tags).toHaveLength(2);
    expect(new Set(gitInfo.tags)).toEqual(new Set(['hello-world', 'hello-world-again']));
  });
});
