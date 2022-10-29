import createLabelDb from "./label_maker/createLabelDb"
import printGodex from "./label_maker/printGodex"
import { ZsMessageChannel } from "../shared/ZsMessageChannel"

export const handleMessage = async (
    event: Electron.IpcMainEvent,
    channel: ZsMessageChannel,
    args: unknown[]) => {
    switch (channel) {
        case ZsMessageChannel.PrintLabel:
            const filepath = await createLabelDb(args)
            if (!filepath) {
                event.reply('fail')
                return
            }
            await printGodex(filepath)
            // fs.unlinkSync(filepath)
            event.reply('success')
            break
    }
} 