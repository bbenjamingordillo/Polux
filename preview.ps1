# Vista previa local sin depender de Node/Python.
# Uso:  powershell -ExecutionPolicy Bypass -File preview.ps1
# Despues abri http://localhost:5500 en el navegador.

$root = $PSScriptRoot
$port = 5500

$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css"; ".js"="application/javascript";
  ".json"="application/json"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".png"="image/png";
  ".svg"="image/svg+xml"; ".ico"="image/x-icon"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Output "Sirviendo $root en http://localhost:$port/"

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  try {
    $localPath = $req.Url.LocalPath
    if ($localPath -eq "/") { $localPath = "/index.html" }
    $filePath = Join-Path $root ($localPath.TrimStart("/"))
    $filePath = [System.IO.Path]::GetFullPath($filePath)

    if (-not $filePath.StartsWith([System.IO.Path]::GetFullPath($root))) {
      $res.StatusCode = 403
      $res.Close()
      continue
    }

    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $ct = $mime[$ext]
      if (-not $ct) { $ct = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $res.ContentType = $ct
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $localPath")
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }
  } catch {
    $res.StatusCode = 500
  } finally {
    $res.Close()
  }
}
