const { createMacro } = require('babel-plugin-macros');
const { execSync } = require('child_process');

const parsedGitLog = (() => {
  let message;
  let refs;
  const commit = {};
  // only the commit message can have multiple lines. Make sure to always add at the end:
  // The format is specified in https://git-scm.com/docs/git-log#_pretty_formats
  const logResult = execSync('git log --format="%D%n%h%n%H%n%cI%n%B" -n 1 HEAD')
    .toString()
    .trim()
    .split(/\r?\n/);
  [refs, commit.shortHash, commit.hash, commit.date, ...message] = logResult;
  commit.message = message.join('\n');
  return {refs, commit};
})();

const parseRefs = (refs) => {
  let branch = undefined;
  const tags = [];
  refs.split(', ').map((item) => {
    const isBranch = item.match(/HEAD -> (.*)/);
    const isTag = item.match(/tag: (.*)/);

    if (isTag && isTag.length > 1) {
      tags.push(isTag[1]);
    } else {
      branch = isBranch ? isBranch[1] : branch;
    }
  });

  if (!branch) {
    throw Error('Unable to get parse branch from the log result.');
  }

  return [branch, tags];
};

const gitInfo = (() => {
  const ret = {};
  try {
    const logResult = parsedGitLog;
    [ret.branch, ret.tags] = parseRefs(logResult.refs);
    ret.commit = logResult.commit;
  } catch (e) {
    throw Error(`Unable to parse the git information: ${e}`);
  }
  return ret;
})();

const getGitInformation = ({ references }) => {
  const sourceString = `(function() { return ${JSON.stringify(gitInfo)}; })`;
  references.default.forEach(referencePath => {
    referencePath.replaceWithSourceString(sourceString);
  });
};

module.exports = createMacro(getGitInformation);
