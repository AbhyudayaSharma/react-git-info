# react-git-info

Get git commit information in your React Application as a JavaScript object.
No configuration necessary if you use create-react-app.

## Usage

You need to install this repository as an NPM `devDependency`:

```bash
npm install --save-dev react-git-info
```

After that you can import the information to your static React files.

```js
import GitInfo from 'react-git-info/macro';

const gitInfo = GitInfo();
console.log(gitInfo.branch);
console.log(gitInfo.commit.date);
console.log(gitInfo.commit.hash);
console.log(gitInfo.commit.message);
console.log(gitInfo.commit.shortHash);
```

## How it works

This package uses a `babel-plugin-macros` macro that is preconfigured when
you're using a recent version of `create-react-app`.