import QRCode from 'qrcode'

/**
 * Sample certificates for the QORVIAN page: the horizontal (student) and
 * vertical (organisation) versions of the certificate the PDF pipeline issues.
 * The QR code is a real, scannable code pointing at the sample verify URL.
 */
const B_PATH =
  'M138.7 427.8C154.1 408.1 178.9 377.0 188.3 365.6L200.5 350.8L200.8 364.0L201.1 377.1L247.3 376.8C298.1 376.3 297.2 376.4 310.5 369.8C318.2 365.9 330.5 353.6 334.7 345.5C346.6 322.7 342.8 297.7 324.5 278.2C316.9 270.1 304.8 261.0 301.6 261.0C296.7 261.0 257.2 282.5 237.0 296.1C198.0 322.5 155.7 368.4 136.5 405.2C134.8 408.4 133.2 411.0 132.9 411.0C130.8 411.0 132.6 369.2 135.4 353.0C145.6 295.1 194.3 246.4 273.9 214.6C295.4 206.0 304.6 198.7 311.5 184.6C322.1 163.2 311.7 141.0 287.1 132.8C280.8 130.7 278.6 130.6 239.8 130.2L199.0 129.9L199.0 179.2L199.0 228.5L193.2 231.9C173.2 243.8 155.5 263.2 143.6 286.5L140.1 293.5L139.8 204.5L139.5 115.5L135.6 108.2C131.2 100.0 123.1 91.1 115.0 85.7L109.5 82.0L199.5 82.0C302.5 82.0 304.7 82.2 325.2 90.5C368.5 108.1 388.2 156.5 368.6 197.5C362.7 209.9 350.4 223.6 340.9 228.6C337.9 230.1 337.0 232.0 339.3 232.0C341.4 232.0 354.6 238.7 360.7 242.8C394.6 265.8 408.6 309.8 395.8 353.5C384.6 391.9 350.2 420.4 306.7 427.5C294.2 429.5 137.2 429.8 138.7 427.8Z'

const svgStyle = {
  width: '100%',
  height: 'auto',
  display: 'block',
  borderRadius: 10,
  border: '1px solid #E5E7EB',
  boxShadow: '0 20px 40px -20px rgba(10,26,82,0.25)',
} as const

type QrData = { d: string; n: number }

async function qrData(url: string): Promise<QrData> {
  const svg = await (QRCode as unknown as { toString(text: string, opts: object): Promise<string> }).toString(url, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
  })
  const n = Number(/viewBox="0 0 (\d+) /.exec(svg)?.[1])
  const paths: string[] = []
  const re = /<path[^>]*\sd="([^"]+)"/g
  let m: RegExpExecArray | null
  while ((m = re.exec(svg))) paths.push(m[1])
  // The last path holds the dark modules (the first is the light background).
  return { d: paths[paths.length - 1], n }
}

function Qr({ qr, x, y, size }: { qr: QrData; x: number; y: number; size: number }) {
  const quiet = 2
  const unit = size / (qr.n + quiet * 2)
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} fill="#FFFFFF" />
      <path d={qr.d} stroke="#0A1A52" strokeWidth={1} fill="none" shapeRendering="crispEdges" transform={`translate(${x + quiet * unit} ${y + quiet * unit}) scale(${unit})`} />
    </g>
  )
}

export default async function SampleCertificates() {
  const qr = await qrData('https://www.barada.in/verify/BA-2026-SAMPLE01')
  const cap = { fontSize: '0.75rem', color: '#6B7280', textAlign: 'center', margin: '0.6rem 0 0' } as const
  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <figure style={{ flex: '1 1 380px', margin: 0 }}>
            <svg viewBox="0 0 1414 1000" role="img" aria-label="Sample QORVIAN certificate, horizontal student version, with verification QR code and certificate ID" style={svgStyle}>
              <rect width="1414" height="1000" fill="#FFFFFF" />
              <rect x="40" y="40" width="1334" height="920" fill="none" stroke="#FF7A12" strokeWidth="8" />
              <rect x="62" y="62" width="1290" height="876" fill="none" stroke="#0A1A52" strokeWidth="1.5" />
              <image href="/qorvian-logo/image.png" x="482" y="74" width="450" height="150" />
              <line x1="607" y1="292" x2="807" y2="292" stroke="#FF7A12" strokeWidth="2" />
              <text x="707" y="268" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" fill="#0B63CE" fontWeight="700" letterSpacing="8">CERTIFICATE OF COMPLETION</text>
              <text x="707" y="400" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="20" fill="#6B7280" letterSpacing="6">THIS CERTIFIES THAT</text>
              <text x="707" y="485" textAnchor="middle" fontFamily="Times New Roman, Times, serif" fontSize="72" fill="#0A1A52" fontWeight="700">Aditi Sharma</text>
              <line x1="507" y1="512" x2="907" y2="512" stroke="#FF7A12" strokeWidth="2" />
              <text x="707" y="566" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="26" fill="#374151">has successfully completed the course</text>
              <text x="707" y="624" textAnchor="middle" fontFamily="Times New Roman, Times, serif" fontSize="42" fill="#0B63CE" fontWeight="700">ChatGPT: Beginner to Workplace Power User</text>
              <text x="707" y="676" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" fill="#374151">and has demonstrated proficiency in the associated evaluation.</text>
              <line x1="130" y1="772" x2="1284" y2="772" stroke="#D3DDEE" strokeWidth="2" />
              <text x="130" y="816" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="15" fill="#6B7280" letterSpacing="4">DATE OF ISSUE</text>
              <text x="130" y="844" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="22" fill="#0A1A52" fontWeight="700">4 October 2026</text>
              <text x="130" y="886" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="15" fill="#6B7280" letterSpacing="4">CERTIFICATE ID</text>
              <text x="130" y="914" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="22" fill="#0A1A52" fontWeight="700">BA-2026-SAMPLE01</text>
              <Qr qr={qr} x={657} y={786} size={100} />
              <text x="707" y="914" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="14" fill="#6B7280" letterSpacing="4">SCAN TO VERIFY</text>
              <text x="1284" y="816" textAnchor="end" fontFamily="Helvetica, Arial, sans-serif" fontSize="15" fill="#6B7280" letterSpacing="4">ISSUED BY</text>
              <svg x="1056" y="832" width="44" height="44" viewBox="0 0 512 512"><path d={B_PATH} fill="#1278EA" fillRule="evenodd" /></svg>
              <text x="1284" y="868" textAnchor="end" fontFamily="Helvetica, Arial, sans-serif" fontSize="30" fill="#0A1A52" fontWeight="700" letterSpacing="6">BARADA</text>
              <text x="1284" y="898" textAnchor="end" fontFamily="Helvetica, Arial, sans-serif" fontSize="14" fill="#FF7A12" fontWeight="700" letterSpacing="3">CONNECT. BUILD. GROW.</text>
            </svg>
        <figcaption style={cap}>Horizontal &mdash; individual learners</figcaption>
      </figure>
      <figure style={{ flex: '0 1 250px', margin: 0, minWidth: 'min(220px, 100%)' }}>
    <svg viewBox="0 0 1000 1414" role="img" aria-label="Sample QORVIAN certificate, vertical organisation version, with verification QR code and certificate ID" style={svgStyle}>
      <rect width="1000" height="1414" fill="#FFFFFF" />
      <rect x="36" y="36" width="928" height="1342" fill="none" stroke="#FF7A12" strokeWidth="6" />
      <rect x="52" y="52" width="896" height="1310" fill="none" stroke="#0A1A52" strokeWidth="1.2" />
      <image href="/qorvian-logo/image.png" x="273" y="108" width="454" height="151" />
      <text x="500" y="306" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="21" fill="#0B63CE" fontWeight="700" letterSpacing="7">CERTIFICATE OF COMPLETION</text>
      <line x1="425" y1="334" x2="575" y2="334" stroke="#FF7A12" strokeWidth="2" />
      <text x="500" y="570" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fill="#6B7280" letterSpacing="5">THIS CERTIFIES THAT</text>
      <text x="500" y="648" textAnchor="middle" fontFamily="Times New Roman, Times, serif" fontSize="62" fill="#0A1A52" fontWeight="700">Aditi Sharma</text>
      <line x1="250" y1="676" x2="750" y2="676" stroke="#FF7A12" strokeWidth="2" />
      <text x="500" y="720" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="20" fill="#374151">of Acme Technologies Pvt Ltd</text>
      <text x="500" y="778" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="22" fill="#374151">has successfully completed the course</text>
      <text x="500" y="832" textAnchor="middle" fontFamily="Times New Roman, Times, serif" fontSize="36" fill="#0B63CE" fontWeight="700">ChatGPT: Beginner to Workplace Power User</text>
      <text x="500" y="886" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="21" fill="#374151">and has demonstrated proficiency in the associated evaluation.</text>
      <line x1="101" y1="1034" x2="899" y2="1034" stroke="#D3DDEE" strokeWidth="1.5" />
      <Qr qr={qr} x={454} y={1056} size={92} />
      <text x="500" y="1166" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#6B7280" letterSpacing="3">SCAN TO VERIFY</text>
      <text x="101" y="1226" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#6B7280" letterSpacing="3">DATE OF ISSUE</text>
      <text x="101" y="1252" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="19" fill="#0A1A52" fontWeight="700">4 October 2026</text>
      <text x="101" y="1290" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#6B7280" letterSpacing="3">CERTIFICATE ID</text>
      <text x="101" y="1316" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="19" fill="#0A1A52" fontWeight="700">BA-2026-SAMPLE01</text>
      <text x="899" y="1226" textAnchor="end" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#6B7280" letterSpacing="3">ISSUED BY</text>
      <svg x="664" y="1246" width="38" height="38" viewBox="0 0 512 512"><path d={B_PATH} fill="#1278EA" fillRule="evenodd" /></svg>
      <text x="899" y="1275" textAnchor="end" fontFamily="Helvetica, Arial, sans-serif" fontSize="27" fill="#0A1A52" fontWeight="700" letterSpacing="5">BARADA</text>
      <text x="899" y="1304" textAnchor="end" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#FF7A12" fontWeight="700" letterSpacing="2.5">CONNECT. BUILD. GROW.</text>
    </svg>
        <figcaption style={cap}>Vertical &mdash; organisation and team certificates</figcaption>
      </figure>
    </div>
  )
}
