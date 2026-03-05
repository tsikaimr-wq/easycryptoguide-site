param(
    [int]$Port = 8000
)

$ErrorActionPreference = "Stop"

$listener = [System.Net.HttpListener]::new()
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host ""
    Write-Host "Failed to start local server." -ForegroundColor Red
    Write-Host "Reason: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Try: server.bat 8080" -ForegroundColor Yellow
    exit 1
}

$contentTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css" = "text/css; charset=utf-8"
    ".js" = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png" = "image/png"
    ".jpg" = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif" = "image/gif"
    ".webp" = "image/webp"
    ".svg" = "image/svg+xml"
    ".ico" = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2" = "font/woff2"
}

function Resolve-SafePath {
    param(
        [string]$Root,
        [string]$RequestPath
    )

    $relative = $RequestPath.TrimStart("/")
    if ([string]::IsNullOrWhiteSpace($relative)) {
        $relative = "index.html"
    }

    $candidate = Join-Path $Root $relative
    $fullRoot = [System.IO.Path]::GetFullPath($Root)
    $fullPath = [System.IO.Path]::GetFullPath($candidate)

    if (-not $fullPath.StartsWith($fullRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $null
    }

    return $fullPath
}

Write-Host "Serving $($PWD.Path)"
Write-Host "Home: ${prefix}index.html"
Write-Host "Press Ctrl+C to stop."

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $response = $context.Response

        try {
            $filePath = Resolve-SafePath -Root $PWD.Path -RequestPath $context.Request.Url.LocalPath

            if (-not $filePath) {
                $response.StatusCode = 403
                continue
            }

            if (-not (Test-Path $filePath -PathType Leaf)) {
                $response.StatusCode = 404
                continue
            }

            $ext = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
            if ($contentTypes.ContainsKey($ext)) {
                $response.ContentType = $contentTypes[$ext]
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.LongLength
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } catch {
            $response.StatusCode = 500
        } finally {
            $response.Close()
        }
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
