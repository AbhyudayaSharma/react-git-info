$ErrorActionPreference = 'Stop'
Push-Location

# This script requires following to be on the PATH.
$dependencies = 'git', 'npm', 'npx', 'yarn'
foreach ($dependency in $dependencies) {
  if ($null -eq (Get-Command $dependency -ErrorAction SilentlyContinue)) {
    throw "Unable to find $dependency in PATH"
  }
}

$oldEnvCI = $env:CI
$env:CI = 'true' # needed for non-interactive `yarn test`
$scriptsPath = Split-Path $PSCommandPath -Parent
$repoPath = Split-Path $scriptsPath -Parent

# Create a temporary directory for testing
$tempPath = [System.IO.Path]::GetTempPath()
[string] $name = [System.Guid]::NewGuid()
$testRepoPath = Join-Path $tempPath $name
New-Item -ItemType Directory -Path $testRepoPath | Out-Null

try {
  # Create a react app using create-react-app
  Set-Location $testRepoPath
  npx create-react-app .
  if (-not $?) {
    throw 'Unable to create react app'
  }

  # Install the package
  Write-Output "Installing local package from $repoPath..."
  yarn add $repoPath
  if (-not $?) {
    throw 'Local package installation failed.'
  }

<# 
  Write-Output '------------------- Test 1 -------------------'

  $testFile = '01.test.js'
  $testScript = Join-Path $testRepoPath "src/$testFile"
  Copy-Item (Join-Path $scriptsPath $testFile) $testScript

  $commandError = $false

  git tag 'hello-world'
  $commandError = $commandError -or -not $?
  git tag 'hello-world-again'
  $commandError = $commandError -or -not $?

  if ($commandError) {
    throw 'Unable to run git commands.'
  }

  yarn test
  if (-not $?) {
    throw "One or more tests failed. Exit code = $LASTEXITCODE"
  }

  Remove-Item -Force $testScript


  Write-Output '------------------- Test 2 -------------------'

  $testFile = '02.test.js'
  $testScript = Join-Path $testRepoPath "src/$testFile"
  Copy-Item (Join-Path $scriptsPath $testFile) $testScript

  git commit --allow-empty -m 'Git commit message'
  $commandError = $commandError -or -not $?

  if ($commandError) {
    throw 'Unable to run git commands.'
  }

  yarn test
  if (-not $?) {
    throw "One or more tests failed. Exit code = $LASTEXITCODE"
  }

  Remove-Item -Force $testScript


  Write-Output '------------------- Test 3 -------------------'

  # tests for detached HEAD

  $testFile = '03.test.js'
  $testScript = Join-Path $testRepoPath "src/$testFile"
  Copy-Item (Join-Path $scriptsPath $testFile) $testScript

  $firstCommit = (git rev-list --max-parents=0 HEAD | Out-String).Trim()
  $commandError = $commandError -or -not $?
  git checkout $firstCommit
  $commandError = $commandError -or -not $?

  if ($commandError) {
    throw 'Unable to run git commands.'
  }

  yarn test
  if (-not $?) {
    throw "One or more tests failed. Exit code = $LASTEXITCODE"
  }

  Remove-Item -Force $testScript #>

  Write-Output '------------------- Test 4 -------------------'

  $testFile = '04.test.js'
  $testScript = Join-Path $testRepoPath "src/$testFile"
  Copy-Item (Join-Path $scriptsPath $testFile) $testScript

  $commandError = $false
  git tag 'hello-version'
  $commandError = $commandError -or -not $?

  if ($commandError) {
    throw 'Unable to run git commands.'
  }

  yarn test
  if (-not $?) {
    throw "One or more tests failed. Exit code = $LASTEXITCODE"
  }

  Remove-Item -Force $testScript

  Write-Output '------------------- Test 5 -------------------'

  $testFile = '05.test.js'
  $testScript = Join-Path $testRepoPath "src/$testFile"
  Copy-Item (Join-Path $scriptsPath $testFile) $testScript

  $commandError = $false
  git add .
  git commit --allow-empty -m 'Git commit message'
  $commandError = $commandError -or -not $?

  if ($commandError) {
    throw 'Unable to run git commands.'
  }

  yarn test
  if (-not $?) {
    throw "One or more tests failed. Exit code = $LASTEXITCODE"
  }

  Remove-Item -Force $testScript

  Write-Output '------------------- Test 6 -------------------'

  $testFile = '06.test.js'
  $testScript = Join-Path $testRepoPath "src/$testFile"
  Copy-Item (Join-Path $scriptsPath $testFile) $testScript

  $commandError = $false
  git commit --allow-empty -m 'Another Git commit message'
  touch randomfile.txt
  $commandError = $commandError -or -not $?

  if ($commandError) {
    throw 'Unable to run git commands.'
  }

  yarn test
  if (-not $?) {
    throw "One or more tests failed. Exit code = $LASTEXITCODE"
  }

  Remove-Item -Force $testScript
} finally {
  Write-Output 'Cleaning up...'
  Pop-Location
  $env:CI = $oldEnvCI
  Remove-Item -Recurse -Force $testRepoPath
}
