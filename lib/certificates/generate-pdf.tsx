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
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import { generateVerificationQrPng } from './qr'
import { BARADA_SYMBOL_MARK_PNG_DATA_URI } from './brand-mark'

const NAVY = '#0D183D'
const RED = '#E31E24'
const GOLD = '#D4AF37'
const INK = '#374151'
const MUTED = '#6B7280'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 48,
  },
  border: {
    flex: 1,
    borderWidth: 3,
    borderColor: GOLD,
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    textAlign: 'center',
  },
  mark: {
    width: 34,
    height: 34,
    alignSelf: 'center',
  },
  brand: {
    fontSize: 22,
    fontWeight: 700,
    color: NAVY,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 9,
    color: RED,
    marginTop: 4,
    letterSpacing: 1,
  },
  title: {
    fontSize: 13,
    color: INK,
    marginTop: 30,
    textAlign: 'center',
    letterSpacing: 3,
  },
  name: {
    fontSize: 30,
    color: NAVY,
    fontWeight: 700,
    textAlign: 'center',
    marginTop: 14,
  },
  line: {
    height: 1,
    backgroundColor: GOLD,
    width: 260,
    alignSelf: 'center',
    marginTop: 10,
  },
  body: {
    fontSize: 12,
    color: INK,
    textAlign: 'center',
    marginTop: 22,
    lineHeight: 1.6,
  },
  course: {
    fontSize: 17,
    color: RED,
    fontWeight: 700,
    textAlign: 'center',
    marginTop: 6,
  },
  footerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 34,
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 170,
  },
  footerLabel: {
    fontSize: 8,
    color: MUTED,
    marginTop: 4,
    letterSpacing: 1,
  },
  footerValue: {
    fontSize: 9,
    color: NAVY,
    fontWeight: 700,
  },
  qr: {
    width: 64,
    height: 64,
  },
  footerMark: {
    width: 26,
    height: 26,
  },
})

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
        <View style={styles.border}>
          <View style={styles.header}>
            <Image src={BARADA_SYMBOL_MARK_PNG_DATA_URI} style={styles.mark} />
            <Text style={styles.brand}>BARADA ACADEMY</Text>
            <Text style={styles.tagline}>CERTIFICATE OF COMPLETION</Text>
          </View>

          <View>
            <Text style={styles.title}>THIS CERTIFIES THAT</Text>
            <Text style={styles.name}>{input.learnerName}</Text>
            <View style={styles.line} />
            <Text style={styles.body}>has successfully completed the course</Text>
            <Text style={styles.course}>{input.courseTitle}</Text>
            <Text style={styles.body}>
              and has demonstrated proficiency in the associated evaluation,{'\n'}
              issued on {issuedDate}.
            </Text>
          </View>

          <View style={styles.footerRow}>
            <View style={styles.footerCol}>
              <Text style={styles.footerValue}>{input.certificateId}</Text>
              <Text style={styles.footerLabel}>CERTIFICATE ID</Text>
            </View>
            <View style={styles.footerCol}>
              <Image src={qrDataUri} style={styles.qr} />
              <Text style={styles.footerLabel}>SCAN TO VERIFY</Text>
            </View>
            <View style={styles.footerCol}>
              <Image src={BARADA_SYMBOL_MARK_PNG_DATA_URI} style={styles.footerMark} />
              <Text style={styles.footerLabel}>ISSUED BY BARADA</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )

  return renderToBuffer(doc)
}
