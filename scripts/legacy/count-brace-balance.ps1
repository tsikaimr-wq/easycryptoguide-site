$content = Get-Content 'mobile.html' -Raw
$open = [regex]::Matches($content, '\{').Count
$close = [regex]::Matches($content, '\}').Count
Write-Host "Open count: $open"
Write-Host "Close count: $close"
