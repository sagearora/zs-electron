import { app, dialog } from "electron";
import { existsSync } from "fs";
import { join } from "path";
import execFileAsync from "../exec-file-async";
import fs from 'fs'

async function findGoLabelExe() {
    const golabel_path = join(process.env.HOMEDRIVE || 'C:', 'Program Files (x86)', 'GoDEX', 'GoLabel', 'GoLabel.exe')
    return existsSync(golabel_path) ? golabel_path : null
}

async function findLabelFile() {
    const label_path = join(app.getAppPath(), '.webpack', 'main', 'assets', 'label.ezpx')
    return existsSync(label_path) ? label_path : null
}

async function printGodex(filepath: string): Promise<boolean> {
    const label_path = await findLabelFile()
    const golabelexe_path = await findGoLabelExe()
    if (label_path === null) {
        throw new Error('Error: Label file not found.')
    }
    if (golabelexe_path === null) {
        throw new Error('Sorry GoLabel must be installed to print labels')
    }
    try {
        console.log(`Print Params ---\nExe: ${golabelexe_path}\nLabel Path: ${label_path}\n db: ${filepath}`)
        const { stdout } = await execFileAsync(
            golabelexe_path,
            [
                '-f', `${label_path}`,
                '-db', `${(filepath)}`
            ])
        console.log(stdout)
        return true
    } catch (error) {
        throw error
    }
}

export default printGodex