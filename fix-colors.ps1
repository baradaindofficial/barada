$files = @(
  'C:\Users\dell\barada-nextjs\app\learn\[course]\evaluation\page.tsx',
  'C:\Users\dell\barada-nextjs\app\learn\[course]\evaluation\result\[attemptId]\page.tsx',
  'C:\Users\dell\barada-nextjs\app\learn\[course]\[module]\[lesson]\page.tsx'
)
foreach ($f in $files) {
  $content = Get-Content -LiteralPath $f -Raw
  $content = $content -replace 'E31E24','D11A1A'
  Set-Content -LiteralPath $f -Value $content -NoNewline
  Write-Host "Fixed: $f"
}