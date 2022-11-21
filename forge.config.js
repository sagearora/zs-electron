module.exports = {
    "name": "zs_electron",
    "version": "1.1.0",
    "config": {
        "forge": {
            "electronRebuildConfig": {
                "forceABI": 89
            },
            "packagerConfig": {},
            "makers": [
                {
                    "name": "@electron-forge/maker-squirrel",
                    "config": {
                        "name": "zs_electron",
                        "certificateFile": "./cert.pfx",
                        "certificatePassword": process.env.CERTIFICATE_PASSWORD
                    }
                }, {
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
                [
                    "@electron-forge/plugin-webpack",
                    {
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
                ]
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
        },
    }
}