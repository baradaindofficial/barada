// Temporary local ambient declaration for the `qrcode` package.
// @types/qrcode failed to install in this environment due to a
// filesystem race during `npm install` (see commit notes on
// Sprint 5 payment routes). Remove this file once `npm install`
// has been run successfully and @types/qrcode is present for real.
declare module 'qrcode' {
  export interface QRCodeToBufferOptions {
    type?: 'png'
    errorCorrectionLevel?: 'low' | 'medium' | 'quartile' | 'high' | 'L' | 'M' | 'Q' | 'H'
    margin?: number
    scale?: number
    width?: number
    color?: { dark?: string; light?: string }
  }
  export function toBuffer(
    text: string,
    options?: QRCodeToBufferOptions
  ): Promise<Buffer>
  export function toDataURL(text: string, options?: QRCodeToBufferOptions): Promise<string>
}
