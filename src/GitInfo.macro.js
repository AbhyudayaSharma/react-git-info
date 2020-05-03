const { createMacro } = require('babel-plugin-macros');
const { execSync } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const gitLogToJSON = (() => {
  const X = uuidv4(); // use unique identifier as separator to avoid collisions with git content
  const commitFormat = `{${X}date${X}: ${X}%cI${X}, ${X}message${X}: ${X}%B${X}, ${X}hash${X}: ${X}%H${X}, ${X}shortHash${X}: ${X}%h${X}}`;
  const format = `{${X}refs${X}: ${X}%D${X}, ${X}commit${X}: ${commitFormat}}`;
  const logResult = execSync(`git log --format="${format}" -n 1 HEAD`)
    .toString()
    .trim()
    .replace(/"/g, '\\"') // correctly escape " used in data
    .replace(/\n/g, "\\n") // at least commit messages may contain newline characters
    .replace(new RegExp(X, "g"), '"'); // replace custom delimiter by "
  return JSON.parse(logResult);
})();

const parseRefs = (refs) => {
  let branch;
  const tags = [];
  refs.split(",").map((item) => {
    const isBranch = item.match(/HEAD -> (.*)/);
    const isTag = item.match(/tag: (.*)/);

    if (isTag && isTag.length > 1) {
      tags.push(isTag[1]);
    } else {
      branch = isBranch ? isBranch[1] : branch;
    }
  });
  return [branch, tags];
};

const gitInfo = (() => {
  const ret = {};
  try {
    const logResult = gitLogToJSON;
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
