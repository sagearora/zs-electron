import createLabelDb from "./label_maker/createLabelDb"
import printGodex from "./label_maker/printGodex"

export enum MessageChannel {
    PrintLabel='print-label'
}

export const handleMessage = async (
    event: Electron.IpcMainEvent,
    channel: MessageChannel,
    args: unknown[]) => {
    switch (channel) {
        case MessageChannel.PrintLabel:
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