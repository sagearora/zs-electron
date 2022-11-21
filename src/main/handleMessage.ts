import electron, { BrowserWindow } from "electron"
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
            case ZsMessageChannel.SetFullscreen: {
                const window = BrowserWindow.getFocusedWindow();
                window.setFullScreen(args[0] as boolean);
                break;
            }
            case ZsMessageChannel.SetSize: {
                const window = BrowserWindow.getFocusedWindow();
                window.setSize(args[0] as number, args[1] as number)
                break;
            }
            case ZsMessageChannel.SetPosition: {
                const display = electron.screen.getPrimaryDisplay();
                const window = BrowserWindow.getFocusedWindow();
                switch (args[0] as string) {
                    case 'top-left':
                        window.setPosition(0, 0)
                        break;
                    case 'top-right':
                        window.setPosition(display.bounds.width - window.getBounds().width, 0)
                        break;
                    case 'bottom-left':
                        window.setPosition(0, display.bounds.height - window.getBounds().height)
                        break;
                    case 'bottom-right':
                        window.setPosition(display.bounds.width - window.getBounds().width, display.bounds.height - window.getBounds().height)
                        break;
                    case 'center-right':
                        window.setPosition(display.bounds.width - window.getBounds().width, (display.bounds.height - window.getBounds().height) / 2)
                        break;
                    default:
                        window.setPosition((display.bounds.width - window.getBounds().width) / 2, (display.bounds.height - window.getBounds().height) / 2)
                        break;

                }
                break;
            }
            case ZsMessageChannel.SetAlwaysOnTop: {
                const window = BrowserWindow.getFocusedWindow();
                window.setAlwaysOnTop(args[0] as boolean, 'floating')
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