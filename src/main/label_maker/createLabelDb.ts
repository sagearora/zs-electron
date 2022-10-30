import dayjs from "dayjs";
import { app } from "electron";
import fs from 'fs';
import { parse } from 'json2csv';
import { v4 } from 'node-uuid';
import { join } from "path";

const MaxContentSize = 14;

const createLabelDb = async (arr: any[]): Promise<[string|null, string|null]> => {
    if (!Array.isArray(arr)) {
        return [null, null]
    }

    const items = arr.map(item => ({
        qr: item.qr,
        date: dayjs(item.date).format('YYYY-MM-DD HH:mm'),
        expiry: dayjs(item.expiry).format('YYYY-DD-MM HH:mm'),
        content_line_1: item.contents.slice(0, MaxContentSize),
        content_line_2: item.contents.length < MaxContentSize ? '' : item.contents.slice(MaxContentSize, MaxContentSize * 2),
        user: item.user,
        category: item.category,
        id: item.id,
    }))
    
    console.log('print', JSON.stringify(items, null, 2))
    const filename = v4()
    const filepath = join(app.getPath("temp"), `${filename}.csv`);
    return new Promise((r) => fs.writeFile(filepath,
        parse(items, {
            fields: ['qr', 'date', 'expiry', 'user', 'contents', 'category', 'id']
        }), function (err) {
            if (err) {
                r([null, null])
                return
            }
            r([filename, filepath])
        }))
}

export default createLabelDb