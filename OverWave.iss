[Setup]
AppId={{D6390965-F631-511A-A6C0-A9DC5D866626}}
AppName=OverWave
AppVersion=1.0.0
AppPublisher=OverWave Team
AppPublisherURL=
AppSupportURL=
AppUpdatesURL=
DefaultDirName={localappdata}\Programs\OverWave
DefaultGroupName=OverWave
DisableProgramGroupPage=yes
OutputDir=dist
OutputBaseFilename=Overwave-Setup
SetupIconFile=Icons\overwaveicon.ico
UninstallDisplayIcon={app}\OverWave.exe
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "dist\win-unpacked\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs ignoreversion

[Icons]
Name: "{autoprograms}\OverWave"; Filename: "{app}\OverWave.exe"
Name: "{autodesktop}\OverWave"; Filename: "{app}\OverWave.exe"

[Run]
Filename: "{app}\OverWave.exe"; Description: "Launch OverWave"; Flags: nowait postinstall skipifsilent