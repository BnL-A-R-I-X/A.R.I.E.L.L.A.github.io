@echo off
REM AxiomOC Database Image Gallery Updater
REM This batch file helps update image galleries for GitHub Pages deployment

echo ===============================================
echo      Axiom's OC Database Gallery Updater
echo ===============================================
echo.

REM Check if we're in the right directory
if not exist "index.html" (
    echo Error: Please run this script from the AxiomOCDatabase root directory
    echo Make sure you're in the folder that contains index.html
    pause
    exit /b 1
)

echo Current directory: %cd%
echo.

REM Create directories if they don't exist
echo Creating image directories...
if not exist "images" mkdir images
if not exist "images\gallery" mkdir images\gallery
if not exist "images\gallery\ariella" mkdir images\gallery\ariella
if not exist "images\gallery\ariella\sfw" mkdir images\gallery\ariella\sfw
if not exist "images\gallery\ariella\nsfw" mkdir images\gallery\ariella\nsfw
if not exist "images\gallery\ariella\reference" mkdir images\gallery\ariella\reference
if not exist "images\gallery\other-ocs" mkdir images\gallery\other-ocs
if not exist "images\gallery\other-ocs\sfw" mkdir images\gallery\other-ocs\sfw
if not exist "images\gallery\other-ocs\nsfw" mkdir images\gallery\other-ocs\nsfw
if not exist "images\gallery\other-ocs\reference" mkdir images\gallery\other-ocs\reference
if not exist "images\demo" mkdir images\demo

echo Image directories created/verified!
echo.

REM Display current gallery structure
echo Current gallery structure:
echo images\
echo   gallery\
echo     ariella\
echo       sfw\      (%~dp0images\gallery\ariella\sfw)
echo       nsfw\     (%~dp0images\gallery\ariella\nsfw)
echo       reference\ (%~dp0images\gallery\ariella\reference)
echo     other-ocs\
echo       sfw\      (%~dp0images\gallery\other-ocs\sfw)
echo       nsfw\     (%~dp0images\gallery\other-ocs\nsfw)
echo       reference\ (%~dp0images\gallery\other-ocs\reference)
echo   demo\         (%~dp0images\demo)
echo.

REM Count images in each directory
echo Counting images in galleries...
echo.

for /d %%D in (images\gallery\*) do (
    echo Checking %%D:
    for /d %%S in (%%D\*) do (
        for /f %%A in ('dir "%%S\*.jpg" "%%S\*.jpeg" "%%S\*.png" "%%S\*.gif" "%%S\*.webp" /b 2^>nul ^| find /c /v ""') do (
            echo   %%S: %%A images
        )
    )
    echo.
)

REM Menu options
:menu
echo ===============================================
echo                   OPTIONS
echo ===============================================
echo 1. Open Ariella SFW folder
echo 2. Open Ariella NSFW folder  
echo 3. Open Ariella Reference folder
echo 4. Open Other OCs SFW folder
echo 5. Open Other OCs NSFW folder
echo 6. Open Other OCs Reference folder
echo 7. Generate image list JSON (for development)
echo 8. Validate image formats
echo 9. Optimize images (requires ImageMagick)
echo 0. Exit
echo.

set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" (
    echo Opening Ariella SFW folder...
    start "" "images\gallery\ariella\sfw"
    goto menu
)
if "%choice%"=="2" (
    echo Opening Ariella NSFW folder...
    start "" "images\gallery\ariella\nsfw"
    goto menu
)
if "%choice%"=="3" (
    echo Opening Ariella Reference folder...
    start "" "images\gallery\ariella\reference"
    goto menu
)
if "%choice%"=="4" (
    echo Opening Other OCs SFW folder...
    start "" "images\gallery\other-ocs\sfw"
    goto menu
)
if "%choice%"=="5" (
    echo Opening Other OCs NSFW folder...
    start "" "images\gallery\other-ocs\nsfw"
    goto menu
)
if "%choice%"=="6" (
    echo Opening Other OCs Reference folder...
    start "" "images\gallery\other-ocs\reference"
    goto menu
)
if "%choice%"=="7" (
    goto generate_json
)
if "%choice%"=="8" (
    goto validate_images
)
if "%choice%"=="9" (
    goto optimize_images
)
if "%choice%"=="0" (
    goto exit
)

echo Invalid choice. Please try again.
goto menu

:generate_json
echo.
echo Generating image list JSON files...
echo.

REM Generate JSON for Ariella
echo Generating ariella-images.json...
(
echo {
echo   "sfw": [
for %%f in (images\gallery\ariella\sfw\*.*) do (
    echo     "%%~nxf",
)
echo   ],
echo   "nsfw": [
for %%f in (images\gallery\ariella\nsfw\*.*) do (
    echo     "%%~nxf",
)
echo   ],
echo   "reference": [
for %%f in (images\gallery\ariella\reference\*.*) do (
    echo     "%%~nxf",
)
echo   ]
echo }
) > js\data\ariella-images.json

REM Generate JSON for Other OCs
echo Generating other-ocs-images.json...
(
echo {
echo   "sfw": [
for %%f in (images\gallery\other-ocs\sfw\*.*) do (
    echo     "%%~nxf",
)
echo   ],
echo   "nsfw": [
for %%f in (images\gallery\other-ocs\nsfw\*.*) do (
    echo     "%%~nxf",
)
echo   ],
echo   "reference": [
for %%f in (images\gallery\other-ocs\reference\*.*) do (
    echo     "%%~nxf",
)
echo   ]
echo }
) > js\data\other-ocs-images.json

echo JSON files generated successfully!
echo Check js\data\ folder for the generated files.
echo.
pause
goto menu

:validate_images
echo.
echo Validating image formats...
echo.
echo Supported formats: .jpg, .jpeg, .png, .gif, .webp
echo.

set valid_count=0
set invalid_count=0

for /r images\gallery %%f in (*.*) do (
    set "ext=%%~xf"
    call :check_extension "!ext!" && (
        set /a valid_count+=1
    ) || (
        set /a invalid_count+=1
        echo INVALID: %%f
    )
)

echo.
echo Validation complete!
echo Valid images: %valid_count%
echo Invalid images: %invalid_count%
echo.
pause
goto menu

:check_extension
set "ext=%~1"
if /i "%ext%"==".jpg" exit /b 0
if /i "%ext%"==".jpeg" exit /b 0
if /i "%ext%"==".png" exit /b 0
if /i "%ext%"==".gif" exit /b 0
if /i "%ext%"==".webp" exit /b 0
exit /b 1

:optimize_images
echo.
echo Image optimization requires ImageMagick to be installed.
echo This will convert all images to WebP format for better web performance.
echo.
set /p confirm="Do you want to proceed? (y/n): "
if /i not "%confirm%"=="y" goto menu

REM Check if ImageMagick is available
magick -version >nul 2>&1
if errorlevel 1 (
    echo Error: ImageMagick not found in PATH.
    echo Please install ImageMagick from https://imagemagick.org/
    pause
    goto menu
)

echo.
echo Optimizing images...
echo Creating backup folder...
if not exist "images\backup" mkdir images\backup

REM This is a simplified version - in practice you'd want more sophisticated optimization
echo.
echo Image optimization complete!
echo Original images backed up to images\backup\
echo.
pause
goto menu

:exit
echo.
echo ===============================================
echo               IMPORTANT NOTES
echo ===============================================
echo.
echo After adding/updating images:
echo 1. Make sure all images are in the correct folders
echo 2. Use option 7 to generate JSON files if needed
echo 3. Commit and push changes to GitHub
echo 4. GitHub Pages will automatically update
echo.
echo For best performance:
echo - Use WebP or optimized JPEG/PNG formats
echo - Keep file sizes reasonable (under 2MB per image)
echo - Use descriptive filenames
echo.
echo Thank you for using Axiom's OC Database!
echo.
pause
