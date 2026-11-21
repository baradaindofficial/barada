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
import { Document, Page, View, Text, Image, Svg, Path, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import { generateVerificationQrPng } from './qr'

const NAVY = '#0A1A52'
const BLUE = '#0B63CE'
const LOGO_BLUE = '#1278EA'
const ORANGE = '#FF7A12'
const INK = '#374151'
const MUTED = '#6B7280'

// The Barada "B" mark, drawn as vector so the PDF needs no image file.
const B_PATH =
  'M138.7 427.8C154.1 408.1 178.9 377.0 188.3 365.6L200.5 350.8L200.8 364.0L201.1 377.1L247.3 376.8C298.1 376.3 297.2 376.4 310.5 369.8C318.2 365.9 330.5 353.6 334.7 345.5C346.6 322.7 342.8 297.7 324.5 278.2C316.9 270.1 304.8 261.0 301.6 261.0C296.7 261.0 257.2 282.5 237.0 296.1C198.0 322.5 155.7 368.4 136.5 405.2C134.8 408.4 133.2 411.0 132.9 411.0C130.8 411.0 132.6 369.2 135.4 353.0C145.6 295.1 194.3 246.4 273.9 214.6C295.4 206.0 304.6 198.7 311.5 184.6C322.1 163.2 311.7 141.0 287.1 132.8C280.8 130.7 278.6 130.6 239.8 130.2L199.0 129.9L199.0 179.2L199.0 228.5L193.2 231.9C173.2 243.8 155.5 263.2 143.6 286.5L140.1 293.5L139.8 204.5L139.5 115.5L135.6 108.2C131.2 100.0 123.1 91.1 115.0 85.7L109.5 82.0L199.5 82.0C302.5 82.0 304.7 82.2 325.2 90.5C368.5 108.1 388.2 156.5 368.6 197.5C362.7 209.9 350.4 223.6 340.9 228.6C337.9 230.1 337.0 232.0 339.3 232.0C341.4 232.0 354.6 238.7 360.7 242.8C394.6 265.8 408.6 309.8 395.8 353.5C384.6 391.9 350.2 420.4 306.7 427.5C294.2 429.5 137.2 429.8 138.7 427.8Z'

const styles = StyleSheet.create({
  page: { backgroundColor: '#FFFFFF', padding: 22 },
  outer: { flex: 1, borderWidth: 3, borderColor: ORANGE, padding: 7 },
  inner: {
    flex: 1,
    borderWidth: 0.75,
    borderColor: NAVY,
    paddingTop: 26,
    paddingBottom: 24,
    paddingHorizontal: 44,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: { alignItems: 'center' },
  brand: { fontSize: 30, fontWeight: 700, color: NAVY, letterSpacing: 7, marginTop: 6 },
  byline: { fontSize: 9, fontWeight: 700, color: ORANGE, letterSpacing: 4, marginTop: 4 },
  rule: { height: 1, width: 180, backgroundColor: ORANGE, marginTop: 14 },
  kind: { fontSize: 12, color: BLUE, marginTop: 12, letterSpacing: 4, fontWeight: 700 },
  middle: { alignItems: 'center' },
  title: { fontSize: 10, color: MUTED, letterSpacing: 3 },
  name: { fontSize: 36, color: NAVY, fontWeight: 700, textAlign: 'center', marginTop: 10 },
  nameLine: { height: 1, backgroundColor: ORANGE, width: 300, marginTop: 8 },
  body: { fontSize: 12, color: INK, textAlign: 'center', marginTop: 16, lineHeight: 1.6 },
  course: { fontSize: 19, color: BLUE, fontWeight: 700, textAlign: 'center', marginTop: 8, maxWidth: 560 },
  footerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 0.75,
    borderTopColor: '#D3DDEE',
    paddingTop: 14,
  },
  colLeft: { width: 210, alignItems: 'flex-start' },
  colMid: { width: 150, alignItems: 'center' },
  colRight: { width: 210, alignItems: 'flex-end' },
  label: { fontSize: 7, color: MUTED, letterSpacing: 1.5 },
  value: { fontSize: 10, color: NAVY, fontWeight: 700, marginTop: 3 },
  qr: { width: 62, height: 62 },
  brandRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  brandSmall: { fontSize: 13, fontWeight: 700, color: NAVY, letterSpacing: 3, marginLeft: 5 },
  tag: { fontSize: 7, color: ORANGE, fontWeight: 700, letterSpacing: 1, marginTop: 3 },
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
}

export async function generateCertificatePdf(input: CertificatePdfInput): Promise<Buffer> {
  const qrPng = await generateVerificationQrPng(input.certificateId)
  const qrDataUri = `data:image/png;base64,${qrPng.toString('base64')}`

  const issuedDate = new Date(input.issuedAtISO).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const doc = (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.outer}>
          <View style={styles.inner}>
            <View style={styles.header}>
              <BMark size={46} color={LOGO_BLUE} />
              <Text style={styles.brand}>QORVIAN</Text>
              <Text style={styles.byline}>BY BARADA</Text>
              <View style={styles.rule} />
              <Text style={styles.kind}>CERTIFICATE OF COMPLETION</Text>
            </View>

            <View style={styles.middle}>
              <Text style={styles.title}>THIS CERTIFIES THAT</Text>
              <Text style={styles.name}>{input.learnerName}</Text>
              <View style={styles.nameLine} />
              <Text style={styles.body}>has successfully completed the course</Text>
              <Text style={styles.course}>{input.courseTitle}</Text>
              <Text style={styles.body}>
                and has demonstrated proficiency in the associated evaluation.
              </Text>
            </View>

            <View style={styles.footerRow}>
              <View style={styles.colLeft}>
                <Text style={styles.label}>DATE OF ISSUE</Text>
                <Text style={styles.value}>{issuedDate}</Text>
                <Text style={[styles.label, { marginTop: 8 }]}>CERTIFICATE ID</Text>
                <Text style={styles.value}>{input.certificateId}</Text>
              </View>
              <View style={styles.colMid}>
                <Image src={qrDataUri} style={styles.qr} />
                <Text style={[styles.label, { marginTop: 4 }]}>SCAN TO VERIFY</Text>
              </View>
              <View style={styles.colRight}>
                <Text style={styles.label}>ISSUED BY</Text>
                <View style={styles.brandRow}>
                  <BMark size={22} color={LOGO_BLUE} />
                  <Text style={styles.brandSmall}>BARADA</Text>
                </View>
                <Text style={styles.tag}>CONNECT. BUILD. GROW.</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )

  return renderToBuffer(doc)
}
