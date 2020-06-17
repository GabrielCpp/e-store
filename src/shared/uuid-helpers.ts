
let _byteToHex: string[] = [];
for (let i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

export function bufferToUuid(buf: Buffer) {
    let i = 0;
    let bth = _byteToHex;
    return bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]];
}

export function uuidToBuffer(id: string) {
    const hex = id.replace(/\-/g, '')
    return Buffer.from(hex, 'hex')
}