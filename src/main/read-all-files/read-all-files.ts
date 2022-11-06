import { BrowserWindow, dialog } from "electron";
import glob from 'glob'
import fs from 'fs'

const globSync = async (pattern: string) => {
    return new Promise(r => {
        glob(pattern, {}, (er, files) => {
            r(files)
        })
    });
}


export const readAllFiles = async (args: string[]) => {
    const [filetype] = args;
    const window = BrowserWindow.getFocusedWindow()
    const paths = dialog.showOpenDialogSync(window, {
        properties: ['openDirectory']
    })

    const files = await Promise.all(
        paths.map(async path => await globSync(`${path}/**/*.${filetype}`)))
        
    const data = files.flat().map((file: string) => ({
        file,
        data: fs.readFileSync(file, 'utf-8')
    }))
    return data
}