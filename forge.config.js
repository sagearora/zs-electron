const fs = require('fs');
const path = require('path');

const root = process.cwd();

if (process.env['WINDOWS_CODESIGN_FILE']) {
    const certPath = path.join(__dirname, 'cert.pfx');
    const certExists = fs.existsSync(certPath);

    if (certExists) {
        process.env['WINDOWS_CODESIGN_FILE'] = certPath;
    }
}

module.exports = {
    packagerConfig: {},
    electronRebuildConfig: {
        forceABI: 89
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            platforms: ['win32'],
            config: (arch) => ({
                name: "zs-electron",
                certificateFile: process.env['WINDOWS_CODESIGN_FILE'],
                certificatePassword: process.env['CERTIFICATE_PASSWORD'],
            }),
        },
        {
            "name": "@electron-forge/maker-zip",
            "platforms": [
                "darwin"
            ]
        },
        {
            "name": "@electron-forge/maker-deb",
            "config": {}
        },
        {
            "name": "@electron-forge/maker-rpm",
            "config": {}
        }
    ],
    plugins: [
        {
            "name": "@electron-forge/plugin-webpack",
            "config": {
                mainConfig: path.join(root, 'webpack.main.config.js'),
                renderer: {
                    config: path.join(root, "./webpack.renderer.config.js"),
                    entryPoints: [
                        {
                            html: path.join(root, "./src/renderer/index.html"),
                            js: path.join(root, "./src/renderer/renderer.tsx"),
                            name: "main_window",
                            preload: {
                                js: path.join(root, "./src/main/preload.ts"),
                            }
                        }
                    ]
                }
            }
        }
    ],
    publishers: [
        {
            name: "@electron-forge/publisher-github",
            config: {
                repository: {
                    "owner": "sagearora",
                    "name": "zs-electron"
                },
                prerelease: false,
                draft: true
            }
        }
    ]
}