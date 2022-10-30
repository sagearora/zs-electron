import createLabelDb from "./label_maker/createLabelDb"
import printGodex from "./label_maker/printGodex"
import { ZsMessageChannel } from "../shared/ZsMessageChannel"

export const handleMessage = async (
    event: Electron.IpcMainInvokeEvent,
    channel: ZsMessageChannel,
    args: unknown[]) => {
    try {
        switch (channel) {
            case ZsMessageChannel.PrintLabel:
                const filepath = await createLabelDb(args)
                if (!filepath) {
                    return false
                }
                await printGodex(filepath)
                // fs.unlinkSync(filepath)
                return true;
        }
    } catch (e) {
        console.error(e);
        return e.message
    }
} 