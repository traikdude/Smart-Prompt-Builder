# toggle-k8s.ps1 - Expert Kubernetes Context Switcher
# Switch between your Local (Minikube) and Cloud (GKE) environments with a single command.

$currentContext = kubectl config current-context
$cloudProject = "smart-prompt-builder-825046261103"
$cloudRegion = "us-central1"
$cloudCluster = "smart-prompt-builder" 
$gkeContext = "gke_$($cloudProject)_$($cloudRegion)_$($cloudCluster)"

if ($currentContext -eq "minikube") {
    Write-Host "🚀 Switching to CLOUD (GKE)..." -ForegroundColor Cyan
    $contexts = kubectl config get-contexts -o name
    if ($contexts -notcontains $gkeContext) {
        Write-Host "🔍 Cloud context not found locally. Attempting to fetch credentials from Google Cloud..." -ForegroundColor Yellow
        gcloud container clusters get-credentials $cloudCluster --region $cloudRegion --project $cloudProject
    }
    
    # Final check before switching
    $contexts = kubectl config get-contexts -o name
    if ($contexts -contains $gkeContext) {
        kubectl config use-context $gkeContext
        Write-Host "✅ Successfully switched to Cloud Context." -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to switch to Cloud Context. Please check your GKE permissions." -ForegroundColor Red
    }
} else {
    Write-Host "🏠 Switching to LOCAL (Minikube)..." -ForegroundColor Green
    kubectl config use-context minikube
    Write-Host "✅ Successfully switched to Local Context." -ForegroundColor Green
}

Write-Host "`n📊 Active Context: " -NoNewline
Write-Host "$(kubectl config current-context)" -ForegroundColor White -BackgroundColor Blue
