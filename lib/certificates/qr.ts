/**
 * lib/certificates/qr.ts
 * Generates the verification QR code embedded on issued certificate PDFs.
 */
import QRCode from 'qrcode'

export async function generateVerificationQrPng(certificateId: string): Promise<Buffer> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.barada.in').replace(/\/$/, '')
  const verifyUrl = `${baseUrl}/verify/${certificateId}`

  return QRCode.toBuffer(verifyUrl, {
    type: 'png',
    errorCorrectionLevel: 'M',
    margin: 1,
    scale: 6,
    color: { dark: '#0D183D', light: '#FFFFFF' },
  })
}
