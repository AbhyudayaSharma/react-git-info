# react-git-info

[![npm version](https://badge.fury.io/js/react-git-info.svg)](https://badge.fury.io/js/react-git-info)
![Node.js CI](https://github.com/AbhyudayaSharma/react-git-info/workflows/Node.js%20CI/badge.svg)

Get git commit information in your React Application as a JavaScript object.
No configuration necessary if you use create-react-app.

## Usage

You need to install this repository as an NPM `devDependency`:

```bash
npm install --save-dev react-git-info
```

After that you can import the information to your static React files.

```jsx
import GitInfo from 'react-git-info/macro';

const gitInfo = GitInfo();
console.log(gitInfo.branch);
console.log(gitInfo.tags);
console.log(gitInfo.commit.date);
console.log(gitInfo.commit.hash);
console.log(gitInfo.commit.message);
console.log(gitInfo.commit.shortHash);

// or from JSX
<p>{gitInfo.commit.message}</p>
```

### TypeScript Support

There is built-in TypeScript support, you won't have to install external types.

## How it works

This package uses a `babel-plugin-macros` macro that is preconfigured when
you're using a recent version of `create-react-app`.
