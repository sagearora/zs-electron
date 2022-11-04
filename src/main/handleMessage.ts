import { BrowserWindow } from "electron"
import { ZsMessageChannel } from "../shared/ZsMessageChannel"
import createLabelDb from "./label_maker/createLabelDb"
import printGodex from "./label_maker/printGodex"

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
            }
        }
    } catch (e) {
        console.error(e);
        return e.message
    }
} 