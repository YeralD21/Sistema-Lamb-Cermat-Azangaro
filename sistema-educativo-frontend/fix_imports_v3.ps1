$root = "d:\CICLO 9\Practicas-pre\Sistema-Lamb-Cermat-Azangaro\sistema-educativo-frontend\src\app"
$featuresDir = "$root\features"

Write-Host "Starting smart import fix..."

Get-ChildItem -Path $featuresDir -Filter *.ts -Recurse | ForEach-Object {
    $file = $_.FullName
    
    # Calculate depth relative to src/app
    $rel = $file.Substring($root.Length + 1)
    $parts = $rel -split "\\"
    $depth = $parts.Length - 1 # Number of parent directories to get to src/app
    
    if ($depth -gt 0) {
        $prefix = "../" * $depth
        $content = [System.IO.File]::ReadAllText($file)
        
        # Replace imports to core, shared, or environments
        # We use a placeholder to avoid regex issues with backreferences $1$2
        $newContent = $content -replace "(from\s+['\"])(\.\./)+(core|shared|environments)", ("___IMPORT_FIX___" + $prefix + '$3')
        $newContent = $newContent.Replace("___IMPORT_FIX___", "from '") # Note: assuming ' for now or fixing below
        
        # Better: use a robust regex replacement
        # $newContent = [regex]::Replace($content, "(from\s+['\"])(\.\./)+(core|shared|environments)", { 
        #    params($m) $m.Groups[1].Value + $prefix + $m.Groups[3].Value 
        # })
        
        # Simplified approach: Just replace with the correct prefix for each category
        $newContent = $content -replace "from\s+['\"](\.\./)+core", ("from '" + $prefix + "core")
        $newContent = $newContent -replace "from\s+['\"](\.\./)+shared", ("from '" + $prefix + "shared")
        $newContent = $newContent -replace "from\s+['\"](\.\./)+environments", ("from '" + $prefix + "environments")

        if ($content -ne $newContent) {
            [System.IO.File]::WriteAllText($file, $newContent)
            Write-Host "Fixed ($depth levels): $rel"
        }
    }
}
