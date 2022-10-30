import { app, dialog } from "electron";
import { existsSync } from "fs";
import { join } from "path";
import execFileAsync from "../exec-file-async";
import fs from 'fs'

async function findGoLabelExe() {
    const golabel_path = join(process.env.HOMEDRIVE || 'C:', 'Program Files (x86)', 'GoDEX', 'GoLabel', 'GoLabel.exe')
    return existsSync(golabel_path) ? golabel_path : null
}

async function findLabelFile(filename: string, dbpath: string) {
    const label_path = join(app.getAppPath(), '.webpack', 'main', 'assets', 'label.ezpx')
    if (!existsSync(label_path)) {
        return null;
    }
    const data = fs.readFileSync(label_path, 'utf-8')
    const new_label_path = join(app.getPath('temp'), `${filename}.ezpx`)
    fs.writeFileSync(new_label_path, data.replace('{{databasePath}}', dbpath).replace('{{filename}}', filename))
    return new_label_path
}

async function printGodex(filename: string, dbpath: string): Promise<boolean> {
    const label_path = await findLabelFile(filename, dbpath)
    const golabelexe_path = await findGoLabelExe()
    console.log(`Print Params ---\nExe: ${golabelexe_path}\nLabel Path: ${label_path}\n db: ${dbpath}`)
    if (label_path === null) {
        throw new Error('Error: Label file not found.')
    }
    if (golabelexe_path === null) {
        throw new Error('Sorry GoLabel must be installed to print labels')
    }
    const { stdout } = await execFileAsync(
        golabelexe_path,
        [
            '-f', `${label_path}`,
            '-db', `${(dbpath)}`
        ])
    console.log(stdout)
    return true
}

export default printGodex