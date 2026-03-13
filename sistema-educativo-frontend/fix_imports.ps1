$basePaths = "src/app/features/admin", "src/app/features/public", "src/app/features/student"
foreach ($dir in $basePaths) {
    if (Test-Path $dir) {
        Write-Host "Processing directory: $dir"
        Get-ChildItem -Path $dir -Filter *.ts -Recurse | ForEach-Object {
            $file = $_.FullName
            $content = [System.IO.File]::ReadAllText($file)
            
            # Match imports to core, shared, environments and insert one extra ../ level
            $newContent = $content -replace "(from\s+['\"])(\.\./)+(core|shared|environments)", '$1../$2$3'

            if ($content -ne $newContent) {
                [System.IO.File]::WriteAllText($file, $newContent)
                Write-Host "Fixed: $file"
            }
        }
    }
}
