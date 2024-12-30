import { Point } from '@f1-challenger/geography'

const hexToBytes = (hex: string): Uint8Array => {
  const bytes: number[] = []
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(Number.parseInt(hex.slice(c, c + 2), 16))
  }
  return new Uint8Array(bytes)
}

const bytesToFloat64 = (bytes: Uint8Array, offset: number): number => {
  const buffer = new ArrayBuffer(8)
  const view = new DataView(buffer)
  for (let i = 0; i < 8; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    view.setUint8(i, bytes[offset + i]!)
  }
  return view.getFloat64(0, true)
}

/**
 * Converts a binary representation of a geometry, like '0101000020E61000003D0AD7A3703D1240AE47E17A14AEF33F', into a
 * Point.
 *
 * This is mostly taken from: https://github.com/drizzle-team/drizzle-orm/blob/5cac6d88155b5224a8f74886be21e27dfc7b60a2/drizzle-orm/src/pg-core/columns/postgis_extension/utils.ts
 */
export const geomBinaryToPoint = (hex: string): Point => {
  const bytes = hexToBytes(hex)
  const view = new DataView(bytes.buffer)
  let offset = 0

  const isLittleEndian = bytes[offset] === 1
  offset += 1

  const geomType = view.getUint32(offset, isLittleEndian)
  offset += 4

  if (geomType & 0x20000000) {
    offset += 4
  }

  if ((geomType & 0xffff) === 1) {
    const longitude = bytesToFloat64(bytes, offset)
    offset += 8
    const latitude = bytesToFloat64(bytes, offset)
    offset += 8

    return { longitude, latitude }
  }

  throw new Error('Unsupported geometry type')
}
