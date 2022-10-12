const { createMacro } = require('babel-plugin-macros');
const { execSync } = require('child_process');

const parsedGitDescribe = (() => {

  const gitCommand = 'git describe --tags --long --dirty';

  const logResult = execSync(gitCommand)
    .toString()
    .trim()
    .split("-");
  const lastElement = logResult.pop();
  let shortHash;
  if (lastElement === "dirty") {
    isDirty = true;
    shortHash = logResult.pop();
  } else {
    isDirty = false;
    shortHash = lastElement;
  }
  const distance = Number(logResult.pop());
  const tag = logResult.join("-");
  return {tag, distance, shortHash, isDirty};
})();

const gitVersion = (() => {
  try {
    return parsedGitDescribe;
  } catch (e) {
    throw Error(`Unable to parse the git version, is it tagged?: ${e}`);
  }
})();

const getGitVersion = ({ references }) => {
  const sourceString = `(function() { return ${JSON.stringify(gitVersion)}; })`;
  references.default.forEach(referencePath => {
    referencePath.replaceWithSourceString(sourceString);
  });
};

module.exports = createMacro(getGitVersion);
