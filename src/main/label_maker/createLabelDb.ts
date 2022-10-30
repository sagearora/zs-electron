import dayjs from "dayjs";
import { app } from "electron";
import fs from 'fs';
import { parse } from 'json2csv';
import { v4 } from 'node-uuid';
import { join } from "path";
const DefaultExpiryMonths = 3

const createLabelDb = async (arr: any[]): Promise<[string|null, string|null]> => {
    if (!Array.isArray(arr)) {
        return [null, null]
    }

    const items = arr.map(item => ({
        qr: item.qr,
        date: dayjs(item.date).format('YYYY-MM-DD HH:mm'),
        expiry: dayjs(item.date).add(DefaultExpiryMonths, 'month')
            .format('YYYY-DD-MM HH:mm'),
        contents: item.contents,
        user: item.user,
    }))
    
    console.log('print', JSON.stringify(items, null, 2))
    const filename = v4()
    const filepath = join(app.getPath("temp"), `${filename}.csv`);
    return new Promise((r) => fs.writeFile(filepath,
        parse(items, {
            fields: ['qr', 'date', 'expiry', 'user', 'contents']
        }), function (err) {
            if (err) {
                r([null, null])
                return
            }
            r([filename, filepath])
        }))
}

export default createLabelDb