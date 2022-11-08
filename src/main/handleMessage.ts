import { BrowserWindow } from "electron"
import { ZsMessageChannel } from "../shared/ZsMessageChannel"
import createLabelDb from "./label-maker/create-label-db"
import printGodex from "./label-maker/print-godex"
import { readAllFiles } from "./read-all-files/read-all-files"

export const handleMessage = async (
    event: Electron.IpcMainInvokeEvent,
    channel: ZsMessageChannel,
    args: unknown[]) => {
    try {
        switch (channel) {
            case ZsMessageChannel.PrintLabel: {
                const [filename, filepath] = await createLabelDb(args)
                if (!filepath) {
                    return false
                }
                const result = await printGodex(filename, filepath);
                return result
            }
            case ZsMessageChannel.ToggleFullscreen: {
                const window = BrowserWindow.getFocusedWindow();
                window.setFullScreen(!window.fullScreen)
                break;
            }
            case ZsMessageChannel.ReadAllFiles: {
                const result = await readAllFiles(args as string[])
                return result
            }
        }
    } catch (e) {
        console.error(e);
        return e.message
    }
} 