import { ImageResponse } from 'next/og'

// Link-preview image (1200x630). Generated at request time so it always matches
// the site theme: forest green, gold "B" mark, white wordmark.
export const runtime = 'edge'

const B_PATH =
  'M138.7 427.8C154.1 408.1 178.9 377.0 188.3 365.6L200.5 350.8L200.8 364.0L201.1 377.1L247.3 376.8C298.1 376.3 297.2 376.4 310.5 369.8C318.2 365.9 330.5 353.6 334.7 345.5C346.6 322.7 342.8 297.7 324.5 278.2C316.9 270.1 304.8 261.0 301.6 261.0C296.7 261.0 257.2 282.5 237.0 296.1C198.0 322.5 155.7 368.4 136.5 405.2C134.8 408.4 133.2 411.0 132.9 411.0C130.8 411.0 132.6 369.2 135.4 353.0C145.6 295.1 194.3 246.4 273.9 214.6C295.4 206.0 304.6 198.7 311.5 184.6C322.1 163.2 311.7 141.0 287.1 132.8C280.8 130.7 278.6 130.6 239.8 130.2L199.0 129.9L199.0 179.2L199.0 228.5L193.2 231.9C173.2 243.8 155.5 263.2 143.6 286.5L140.1 293.5L139.8 204.5L139.5 115.5L135.6 108.2C131.2 100.0 123.1 91.1 115.0 85.7L109.5 82.0L199.5 82.0C302.5 82.0 304.7 82.2 325.2 90.5C368.5 108.1 388.2 156.5 368.6 197.5C362.7 209.9 350.4 223.6 340.9 228.6C337.9 230.1 337.0 232.0 339.3 232.0C341.4 232.0 354.6 238.7 360.7 242.8C394.6 265.8 408.6 309.8 395.8 353.5C384.6 391.9 350.2 420.4 306.7 427.5C294.2 429.5 137.2 429.8 138.7 427.8Z'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 90px',
          background: 'linear-gradient(135deg, #0D4638 0%, #165A48 100%)',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg width="150" height="150" viewBox="0 0 512 512">
            <path fill="#D4AF37" fillRule="evenodd" d={B_PATH} />
          </svg>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 900, letterSpacing: 6, marginLeft: 28 }}>BARADA</div>
        </div>
        <div style={{ display: 'flex', fontSize: 52, fontWeight: 800, marginTop: 44, lineHeight: 1.15 }}>
          AI, technology and business execution
        </div>
        <div style={{ display: 'flex', fontSize: 52, fontWeight: 800, color: '#D4AF37', lineHeight: 1.15 }}>
          built on real experience.
        </div>
        <div style={{ display: 'flex', fontSize: 28, marginTop: 36, color: 'rgba(255,255,255,0.75)' }}>
          Barada Academy  ·  Services  ·  Bengaluru, India  ·  barada.in
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
