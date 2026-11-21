/**
 * lib/certificates/generate-pdf.tsx
 * Renders the official Barada Academy certificate as a PDF buffer.
 * Server-side only (@react-pdf/renderer's renderToBuffer runs in Node,
 * not the browser).
 *
 * Font note: uses @react-pdf/renderer's built-in standard font (Helvetica)
 * rather than the site's Poppins/Inter brand fonts. Embedding Poppins/Inter
 * requires their TTF files to be added to the repo (e.g. public/fonts/) and
 * registered via Font.register -- deliberately deferred rather than fetching
 * font files over the network from inside a payment-critical serverless
 * route, which would add an external failure point. Swap in once the font
 * files are added.
 */
import { Document, Page, View, Text, Image, Svg, Path, StyleSheet, renderToBuffer, Font } from '@react-pdf/renderer'
import fs from 'fs'
import path from 'path'
import { generateVerificationQrPng } from './qr'

// The QORVIAN by Barada logo is read from public/ at render time. If the file
// cannot be read (for example it is missing from a serverless bundle) the
// header falls back to a vector B mark and text, so issuing never fails.
function loadQorvianLogo(): Buffer | null {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'public', 'qorvian-logo', 'image.png'))
  } catch {
    return null
  }
}

// Never split words with hyphens: long names and course titles wrap whole words.
Font.registerHyphenationCallback((word) => [word])

const NAVY = '#0A1A52'
const BLUE = '#0B63CE'
const LOGO_BLUE = '#1278EA'
const ORANGE = '#FF7A12'
const INK = '#374151'
const MUTED = '#6B7280'

// The Barada "B" mark, drawn as vector so the PDF needs no image file.
const B_PATH =
  'M138.7 427.8C154.1 408.1 178.9 377.0 188.3 365.6L200.5 350.8L200.8 364.0L201.1 377.1L247.3 376.8C298.1 376.3 297.2 376.4 310.5 369.8C318.2 365.9 330.5 353.6 334.7 345.5C346.6 322.7 342.8 297.7 324.5 278.2C316.9 270.1 304.8 261.0 301.6 261.0C296.7 261.0 257.2 282.5 237.0 296.1C198.0 322.5 155.7 368.4 136.5 405.2C134.8 408.4 133.2 411.0 132.9 411.0C130.8 411.0 132.6 369.2 135.4 353.0C145.6 295.1 194.3 246.4 273.9 214.6C295.4 206.0 304.6 198.7 311.5 184.6C322.1 163.2 311.7 141.0 287.1 132.8C280.8 130.7 278.6 130.6 239.8 130.2L199.0 129.9L199.0 179.2L199.0 228.5L193.2 231.9C173.2 243.8 155.5 263.2 143.6 286.5L140.1 293.5L139.8 204.5L139.5 115.5L135.6 108.2C131.2 100.0 123.1 91.1 115.0 85.7L109.5 82.0L199.5 82.0C302.5 82.0 304.7 82.2 325.2 90.5C368.5 108.1 388.2 156.5 368.6 197.5C362.7 209.9 350.4 223.6 340.9 228.6C337.9 230.1 337.0 232.0 339.3 232.0C341.4 232.0 354.6 238.7 360.7 242.8C394.6 265.8 408.6 309.8 395.8 353.5C384.6 391.9 350.2 420.4 306.7 427.5C294.2 429.5 137.2 429.8 138.7 427.8Z'

// Layout note: the three zones (header, body, footer) are absolutely positioned
// inside the frame, so a long name or course title can never push the QR code
// or the footer text around. Body text is centred in its own fixed zone.
const styles = StyleSheet.create({
  page: { backgroundColor: '#FFFFFF', padding: 0 },
  frameOuter: { position: 'absolute', top: 20, left: 20, right: 20, bottom: 20, borderWidth: 3, borderColor: ORANGE },
  frameInner: { position: 'absolute', top: 30, left: 30, right: 30, bottom: 30, borderWidth: 0.75, borderColor: NAVY },
  header: { position: 'absolute', top: 44, left: 60, right: 60, alignItems: 'center' },
  logo: { width: 195, height: 65 },
  brand: { fontSize: 30, fontWeight: 700, color: NAVY, letterSpacing: 7, marginTop: 6 },
  byline: { fontSize: 9, fontWeight: 700, color: ORANGE, letterSpacing: 4, marginTop: 4 },
  kind: { fontSize: 12, color: BLUE, marginTop: 10, letterSpacing: 5, fontWeight: 700 },
  rule: { height: 1, width: 150, backgroundColor: ORANGE, marginTop: 12 },
  body: { position: 'absolute', top: 178, left: 70, right: 70, height: 220, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 9, color: MUTED, letterSpacing: 3 },
  name: { fontSize: 34, color: NAVY, fontFamily: 'Times-Bold', textAlign: 'center', marginTop: 10 },
  nameLine: { height: 1, backgroundColor: ORANGE, width: 320, marginTop: 8 },
  org: { fontSize: 12, color: INK, marginTop: 8, textAlign: 'center' },
  text: { fontSize: 11, color: INK, textAlign: 'center', marginTop: 14 },
  course: { fontSize: 19, color: BLUE, fontFamily: 'Times-Bold', textAlign: 'center', marginTop: 8, maxWidth: 540 },
  footer: { position: 'absolute', left: 70, right: 70, bottom: 52, height: 78, borderTopWidth: 0.75, borderTopColor: '#D3DDEE' },
  colLeft: { position: 'absolute', left: 0, top: 12, width: 220 },
  colMid: { position: 'absolute', left: 0, right: 0, top: 6, alignItems: 'center' },
  colRight: { position: 'absolute', right: 0, top: 12, width: 220, alignItems: 'flex-end' },
  label: { fontSize: 7, color: MUTED, letterSpacing: 1.5 },
  value: { fontSize: 10, color: NAVY, fontWeight: 700, marginTop: 3 },
  qr: { width: 54, height: 54 },
  brandRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  brandSmall: { fontSize: 13, fontWeight: 700, color: NAVY, letterSpacing: 3, marginLeft: 5 },
  tag: { fontSize: 7, color: ORANGE, fontWeight: 700, letterSpacing: 1, marginTop: 4 },
})

function BMark({ size, color }: { size: number; color: string }) {
  return (
    <Svg viewBox="0 0 512 512" width={size} height={size}>
      <Path d={B_PATH} fill={color} fillRule="evenodd" />
    </Svg>
  )
}

export interface CertificatePdfInput {
  certificateId: string
  learnerName: string
  courseTitle: string
  issuedAtISO: string
  /** Optional: organisation name, shown for team and institute programs. */
  organisation?: string
  /** Defaults to 'portrait' when an organisation is set, otherwise 'landscape'. */
  orientation?: 'landscape' | 'portrait'
}

export async function generateCertificatePdf(input: CertificatePdfInput): Promise<Buffer> {
  const qrPng = await generateVerificationQrPng(input.certificateId)
  const qrDataUri = `data:image/png;base64,${qrPng.toString('base64')}`

  const issuedDate = new Date(input.issuedAtISO).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const logo = loadQorvianLogo()
  // Students get the horizontal certificate; organisation / team certificates
  // are vertical. An explicit `orientation` overrides this.
  const portrait = (input.orientation ?? (input.organisation ? 'portrait' : 'landscape')) === 'portrait'
  // Portrait overrides: same zones, re-proportioned for a tall page. The footer
  // stacks the QR above the date / issuer row so nothing shares a line with it.
  const portraitStyles = StyleSheet.create({
        header: { top: 64 },
        logo: { width: 270, height: 90 },
        body: { top: 250, height: 330, left: 60, right: 60 },
        name: { fontSize: 36 },
        nameLine: { width: 300 },
        course: { fontSize: 21, maxWidth: 440 },
        footer: { bottom: 56, height: 170, left: 60, right: 60 },
        colMid: { top: 14 },
        colLeft: { top: 104, width: 200 },
        colRight: { top: 104, width: 200 },
  })
  const P: Partial<typeof portraitStyles> = portrait ? portraitStyles : {}

  const doc = (
    <Document>
      <Page size="A4" orientation={portrait ? 'portrait' : 'landscape'} style={styles.page}>
        <View style={styles.frameOuter} fixed />
        <View style={styles.frameInner} fixed />

        <View style={[styles.header, P.header]}>
          {logo ? (
            <Image src={{ data: logo, format: 'png' }} style={[styles.logo, P.logo]} />
          ) : (
            <>
              <BMark size={46} color={LOGO_BLUE} />
              <Text style={styles.brand}>QORVIAN</Text>
              <Text style={styles.byline}>BY BARADA</Text>
            </>
          )}
          <Text style={styles.kind}>CERTIFICATE OF COMPLETION</Text>
          <View style={styles.rule} />
        </View>

        <View style={[styles.body, P.body]}>
          <Text style={styles.title}>THIS CERTIFIES THAT</Text>
          <Text style={[styles.name, P.name]}>{input.learnerName}</Text>
          <View style={[styles.nameLine, P.nameLine]} />
          {input.organisation ? <Text style={styles.org}>of {input.organisation}</Text> : null}
          <Text style={styles.text}>has successfully completed the course</Text>
          <Text style={[styles.course, P.course]}>{input.courseTitle}</Text>
          <Text style={styles.text}>and has demonstrated proficiency in the associated evaluation.</Text>
        </View>

        <View style={[styles.footer, P.footer]}>
          <View style={[styles.colLeft, P.colLeft]}>
            <Text style={styles.label}>DATE OF ISSUE</Text>
            <Text style={styles.value}>{issuedDate}</Text>
            <Text style={[styles.label, { marginTop: 8 }]}>CERTIFICATE ID</Text>
            <Text style={styles.value}>{input.certificateId}</Text>
          </View>
          <View style={[styles.colMid, P.colMid]}>
            <Image src={qrDataUri} style={styles.qr} />
            <Text style={[styles.label, { marginTop: 4 }]}>SCAN TO VERIFY</Text>
          </View>
          <View style={[styles.colRight, P.colRight]}>
            <Text style={styles.label}>ISSUED BY</Text>
            <View style={styles.brandRow}>
              <BMark size={22} color={LOGO_BLUE} />
              <Text style={styles.brandSmall}>BARADA</Text>
            </View>
            <Text style={styles.tag}>CONNECT. BUILD. GROW.</Text>
          </View>
        </View>
      </Page>
    </Document>
  )

  return renderToBuffer(doc)
}
