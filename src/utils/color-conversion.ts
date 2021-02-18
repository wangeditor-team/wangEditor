/**
 * @author 翠林
 * @deprecated 颜色转换
 */

/**
 * RGBA 转 HEX
 * @param r RGBA 的 R
 * @param g RGBA 的 G
 * @param b RGBA 的 B
 * @param a RGBA 的 A
 */
export function RGBAToHEX(r: number, g: number, b: number, a: number = 1) {
    const hex = `#${((1 << 24) + r * (1 << 16) + g * (1 << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase()}`
    return a == 1 ? hex : `${hex}${a.toString(16).toUpperCase().slice(2, 4) || '00'}`
}

/**
 * HEX 转 RGBA
 * https://www.rapidtables.com/convert/color/hex-to-rgb.html
 * @param hex HEX
 */
export function HEXToRGBA(hex: string) {
    const rgba = { r: 0, g: 0, b: 0, a: 1 }
    if (hex.charAt(0) === '#') {
        hex = hex.substring(1, hex.length)
    }
    if ([3, 6, 8].indexOf(hex.length) === -1) {
        throw new Error('无效的 HEX 值')
    }
    if (hex.length === 3) {
        rgba.r = parseInt(hex.substring(0, 1).repeat(2), 16)
        rgba.g = parseInt(hex.substring(1, 2).repeat(2), 16)
        rgba.b = parseInt(hex.substring(2, 3).repeat(2), 16)
    } else {
        rgba.r = parseInt(hex.substring(0, 2), 16)
        rgba.g = parseInt(hex.substring(2, 4), 16)
        rgba.b = parseInt(hex.substring(4, 6), 16)
    }
    if (hex.length === 8) {
        rgba.a = parseFloat((parseInt(hex.substring(6, 8), 16) / 255).toFixed(2))
    }
    return rgba
}

/**
 * RGB 转 HSV（拷贝自 layui 颜色选择器的 RGBToHSB）
 * https://www.rapidtables.com/convert/color/rgb-to-hsV.html
 * @param r RGB 的 R
 * @param g RGB 的 G
 * @param b RGB 的 B
 */
export function RGBToHSV(r: number, g: number, b: number) {
    const hsv = { h: 0, s: 0, v: 0 }
    const min = Math.min(r, g, b)
    const max = Math.max(r, g, b)
    const delta = max - min
    hsv.v = max
    hsv.s = max != 0 ? (255 * delta) / max : 0
    if (hsv.s != 0) {
        if (r == max) {
            hsv.h = (g - b) / delta
        } else if (g == max) {
            hsv.h = 2 + (b - r) / delta
        } else {
            hsv.h = 4 + (r - g) / delta
        }
    } else {
        hsv.h = -1
    }
    if (max == min) {
        hsv.h = 0
    }
    hsv.h *= 60
    if (hsv.h < 0) {
        hsv.h += 360
    }
    hsv.s *= 100 / 255
    hsv.v *= 100 / 255
    return hsv
}

/**
 * HSV 转 RGB（拷贝自 layui 颜色选择器的 HSBToRGB）
 * @param h HSV 的 H
 * @param s HSV 的 S
 * @param v HSV 的 V
 */
export function HSVToRGB(h: number, s: number, v: number) {
    const rgb = { r: 0, g: 0, b: 0 }
    s = (s * 255) / 100
    v = (v * 255) / 100
    if (s == 0) {
        rgb.r = rgb.g = rgb.b = v
    } else {
        const t1 = v
        const t2 = ((255 - s) * v) / 255
        const t3 = ((t1 - t2) * (h % 60)) / 60
        if (h == 360) h = 0
        if (h < 60) {
            rgb.r = t1
            rgb.b = t2
            rgb.g = t2 + t3
        } else if (h < 120) {
            rgb.g = t1
            rgb.b = t2
            rgb.r = t1 - t3
        } else if (h < 180) {
            rgb.g = t1
            rgb.r = t2
            rgb.b = t2 + t3
        } else if (h < 240) {
            rgb.b = t1
            rgb.r = t2
            rgb.g = t1 - t3
        } else if (h < 300) {
            rgb.b = t1
            rgb.g = t2
            rgb.r = t2 + t3
        } else if (h < 360) {
            rgb.r = t1
            rgb.g = t2
            rgb.b = t1 - t3
        } else {
            rgb.r = 0
            rgb.g = 0
            rgb.b = 0
        }
    }
    return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) }
}
