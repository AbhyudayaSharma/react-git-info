const { execSync } = require('child_process');
const { createMacro } = require('babel-plugin-macros');

// calling git from the command line should be done just once
const gitInfo = (() => {
  const ret = {};
  try {
    // TODO try to extract all information from a single `execSync` call
    ret.branch = execSync('git branch --show-current').toString().trim();
    ret.commit = {
      date: execSync('git log --format="%cI" -n 1 HEAD').toString().trim(),
      message: execSync('git log --format="%B" -n 1 HEAD').toString().trim(),
      hash: execSync('git rev-parse HEAD').toString().trim(),
      // we could've just taken a substring from the full commit hash but that would ignore
      // the short commit hash length defined as `core.abbrev` in gitconfig
      shortHash: execSync('git rev-parse --short HEAD').toString().trim(),
    };
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
