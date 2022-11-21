module.exports = {
    packagerConfig: {},
    "electronRebuildConfig": {
        "forceABI": 89
    },
    makers: [
        {
            "name": "@electron-forge/maker-squirrel",
            "config": {
                "name": "zs_electron",
                "certificateFile": "./cert.pfx",
                "certificatePassword": process.env.CERTIFICATE_PASSWORD
            }
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
    "plugins": [
        {
            "name": "@electron-forge/plugin-webpack",
            "config": {
                "mainConfig": "./webpack.main.config.js",
                "renderer": {
                    "config": "./webpack.renderer.config.js",
                    "entryPoints": [
                        {
                            "html": "./src/renderer/index.html",
                            "js": "./src/renderer/renderer.tsx",
                            "name": "main_window",
                            "preload": {
                                "js": "./src/main/preload.ts"
                            }
                        }
                    ]
                }
            }
        }
    ],
    "publishers": [
        {
            "name": "@electron-forge/publisher-github",
            "config": {
                "repository": {
                    "owner": "sagearora",
                    "name": "zs-electron"
                },
                "prerelease": false,
                "draft": true
            }
        }
    ]
}