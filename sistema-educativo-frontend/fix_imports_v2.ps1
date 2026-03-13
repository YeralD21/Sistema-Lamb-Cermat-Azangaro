$basePaths = "src/app/features/admin", "src/app/features/public", "src/app/features/student"
foreach ($dir in $basePaths) {
    if (Test-Path $dir) {
        Write-Host "Processing directory: $dir"
        Get-ChildItem -Path $dir -Filter *.ts -Recurse | ForEach-Object {
            $file = $_.FullName
            $content = [System.IO.File]::ReadAllText($file)
            
            # Non-cascading replacement using placeholders
            $newContent = $content.Replace("'../../core", "___FIX_CORE_3___")
            $newContent = $newContent.Replace("'../core", "___FIX_CORE_2___")
            $newContent = $newContent.Replace("___FIX_CORE_3___", "'../../../core")
            $newContent = $newContent.Replace("___FIX_CORE_2___", "'../../core")

            $newContent = $newContent.Replace("'../../shared", "___FIX_SHARED_3___")
            $newContent = $newContent.Replace("'../shared", "___FIX_SHARED_2___")
            $newContent = $newContent.Replace("___FIX_SHARED_3___", "'../../../shared")
            $newContent = $newContent.Replace("___FIX_SHARED_2___", "'../../shared")

            $newContent = $newContent.Replace("'../../environments", "___FIX_ENV_3___")
            $newContent = $newContent.Replace("'../environments", "___FIX_ENV_2___")
            $newContent = $newContent.Replace("___FIX_ENV_3___", "'../../../environments")
            $newContent = $newContent.Replace("___FIX_ENV_2___", "'../../environments")

            # Double quotes version
            $newContent = $newContent.Replace("`"../../core", "___FIX_DCORE_3___")
            $newContent = $newContent.Replace("`"../core", "___FIX_DCORE_2___")
            $newContent = $newContent.Replace("___FIX_DCORE_3___", "`"../../../core")
            $newContent = $newContent.Replace("___FIX_DCORE_2___", "`"../../core")

            $newContent = $newContent.Replace("`"../../shared", "___FIX_DSHARED_3___")
            $newContent = $newContent.Replace("`"../shared", "___FIX_DSHARED_2___")
            $newContent = $newContent.Replace("___FIX_DSHARED_3___", "`"../../../shared")
            $newContent = $newContent.Replace("___FIX_DSHARED_2___", "`"../../shared")

            if ($content -ne $newContent) {
                [System.IO.File]::WriteAllText($file, $newContent)
                Write-Host "Fixed: $file"
            }
        }
    }
}
