const { execSync } = require('child_process');
const { createMacro } = require('babel-plugin-macros');

// calling git from the command line should be done just once
const gitInfo = (() => {
  const ret = {};
  try {
    // TODO try to extract all information from a single `execSync` call
    ret.branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    ret.commit = {
      date: execSync('git log --format="%cI" -n 1 HEAD').toString().trim(),
      message: execSync('git log --format="%B" -n 1 HEAD').toString().trim(),
      hash: execSync('git rev-parse HEAD').toString().trim(),
      // we could've just taken a substring from the full commit hash but that would ignore
      // the short commit hash length defined as `core.abbrev` in gitconfig
      shortHash: execSync('git rev-parse --short HEAD').toString().trim(),
    };
    // get any tags that ref this commit, filtering out falsy strings (i.e. if the cmd output is empty)
    ret.tags = execSync(`git tag --list --points-at ${ret.commit.hash}`)
                .toString().trim().split(/\r?\n/).filter(Boolean);
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
