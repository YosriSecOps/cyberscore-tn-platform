@echo off
chcp 65001 >nul
title CyberScore TN — Lanceur Démo Soutenance PFA
color 0B

echo.
echo  =============================================================================
echo    ██████╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗ ██████╗ ██████╗ ███████╗
echo   ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝██╔═══██╗██╔════╝
echo   ██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝███████╗██║     ██║   ██║███████╗
echo   ██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗╚════██║██║     ██║   ██║╚════██║
echo   ╚██████╗   ██║   ██████╔╝███████╗██║  ██║███████║╚██████╗╚██████╔╝███████║
echo    ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝
echo             RÉPUBLIQUE TUNISIENNE — AUDIT DE CYBERSÉCURITÉ SOUVERAIN
echo  =============================================================================
echo.

:: 1. Verification d'Ollama
echo [*] [1/3] Vérification du moteur IA souverain (Ollama)...
set OLLAMA_FOUND=0
set OLLAMA_PORT=none

curl -s -m 2 http://127.0.0.1:25000/api/tags >nul 2>&1
if %errorlevel% equ 0 (
    set OLLAMA_FOUND=1
    set OLLAMA_PORT=25000
    echo     [+] Ollama détecté et opérationnel sur le port 25000 (Proxy Souverain)!
) else (
    curl -s -m 2 http://127.0.0.1:11434/api/tags >nul 2>&1
    if %errorlevel% equ 0 (
        set OLLAMA_FOUND=1
        set OLLAMA_PORT=11434
        echo     [+] Ollama détecté et opérationnel sur le port 11434 (Standard)!
    ) else (
        echo     [!] Avertissement : Ollama n'est pas actif en local (25000 / 11434).
        echo         Mode de secours déterministe (Fallback Expert) actif par défaut.
    )
)

:: 2. Verification du serveur Next.js
echo.
echo [*] [2/3] Vérification du serveur d'application Next.js (port 3000)...
netstat -ano | findstr :3000 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo     [+] Le serveur Next.js est déjà actif et en écoute sur http://localhost:3000
) else (
    echo     [*] Démarrage du serveur Next.js dans un terminal dédié...
    cd /d "%~dp0frontend"
    start "CyberScore TN — Frontend Server" cmd /k "npm run dev"
    cd /d "%~dp0"
    echo     [*] Attente de l'initialisation du serveur (5 secondes)...
    timeout /t 5 /nobreak >nul
)

:: 3. Ouverture automatique du navigateur
echo.
echo [*] [3/3] Lancement de la démonstration CyberScore TN dans le navigateur...
start http://localhost:3000/fr/scan

echo.
echo  =============================================================================
echo    MENU D'ACCÈS RAPIDE POUR LA SOUTENANCE :
echo  =============================================================================
echo    [1] Scanner Multi-Agents Autonome      : http://localhost:3000/fr/scan
echo    [2] Assistante IA Souveraine Amina     : http://localhost:3000/fr/assistant
echo    [3] Hub des Rapports d'Audit Officiels : http://localhost:3000/fr/reports
echo    [4] Tableau de Bord National           : http://localhost:3000/fr/dashboard
echo    [5] Benchmark & Classement Sectoriel   : http://localhost:3000/fr/benchmark
echo    [6] Dossier d'Architecture Technique   : file:///%~dp0docs/seance1_dossier_architecture.html
echo    [Q] Quitter ce menu
echo  =============================================================================
echo.

:menu_loop
set /p CHOICE="Sélectionnez une option (1-6 ou Q) : "
if /i "%CHOICE%"=="1" start http://localhost:3000/fr/scan & goto menu_loop
if /i "%CHOICE%"=="2" start http://localhost:3000/fr/assistant & goto menu_loop
if /i "%CHOICE%"=="3" start http://localhost:3000/fr/reports & goto menu_loop
if /i "%CHOICE%"=="4" start http://localhost:3000/fr/dashboard & goto menu_loop
if /i "%CHOICE%"=="5" start http://localhost:3000/fr/benchmark & goto menu_loop
if /i "%CHOICE%"=="6" start "" "%~dp0docs\seance1_dossier_architecture.html" & goto menu_loop
if /i "%CHOICE%"=="Q" exit /b 0
if /i "%CHOICE%"=="q" exit /b 0
echo Choix non reconnu.
goto menu_loop
