import dayjs from "dayjs";
import { app } from "electron";
import fs from 'fs';
import { parse } from 'json2csv';
import { v4 } from 'node-uuid';
import { join } from "path";
const DefaultExpiryMonths = 3

const createLabelDb = async (arr: any[]): Promise<string|null> => {
    if (!Array.isArray(arr)) {
        return null
    }

    const items = arr.map(item => ({
        qr: item.qr,
        date: dayjs().format('YYYY-MM-DD HH:mm'),
        expiry: dayjs().add(DefaultExpiryMonths, 'month')
            .format('YYYY-DD-MM HH:mm'),
        contents: item.contents,
        user: item.user,
    }))
    
    const filepath = join(app.getPath("temp"), `${v4()}.csv`);
    return new Promise((r) => fs.writeFile(filepath,
        parse(items, {
            fields: ['qr', 'date', 'expiry', 'user', 'contents']
        }), function (err) {
            if (err) {
                r(null)
                return
            }
            r(filepath)
        }))
}

export default createLabelDb