param (
    [string]$Command
)

$NodePath = "$PSScriptRoot\node_portable\node-v20.11.1-win-x64"
$env:PATH = "$NodePath;$env:PATH"

Invoke-Expression $Command
