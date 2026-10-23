$docPath = (Resolve-Path "Naskah_LKTIN_SI-MUKTI_UNIMED2026_DENGAN_PROTOTIPE.docx").Path
$pdfPath = [System.IO.Path]::ChangeExtension($docPath, ".pdf")
if (Test-Path $pdfPath) { Remove-Item $pdfPath -Force }

$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open($docPath)
    # 17 = wdExportFormatPDF
    $doc.ExportAsFixedFormat($pdfPath, 17)
    Write-Output "Successfully exported to PDF: $pdfPath"
    $pages = $doc.ComputeStatistics(2)
    Write-Output "Total Word Document Pages: $pages"
    $doc.Close(0)
} finally {
    $word.Quit()
}
