export default function TermsPage() {
  return (
    <main style={{ backgroundColor: '#0A0A0A', color: '#F5F5F5', padding: '48px 24px', maxWidth: 720, margin: '0 auto', fontFamily: 'var(--font-geist-sans), sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ color: '#888888', fontSize: 13, marginBottom: 48 }}>Last updated: April 2026</p>

      {[
        {
          title: '1. Acceptance of Terms',
          body: 'By creating an account and using FastListing, you agree to these Terms of Service. If you do not agree, do not use the service.'
        },
        {
          title: '2. Description of Service',
          body: 'FastListing is a SaaS platform that converts real estate photos into branded MP4 videos. The service generates 16:9 and 9:16 format videos using templates, brand presets, and audio tracks provided by FastListing.'
        },
        {
          title: '3. Account Responsibilities',
          body: 'You are responsible for maintaining the security of your account. You are responsible for all activity that occurs under your account. You must not share your account credentials. You must provide accurate information when signing up.'
        },
        {
          title: '4. Content Ownership and License',
          body: 'You retain ownership of all photos and content you upload. By uploading content, you grant FastListing a limited license to process and render your content as part of the service. FastListing does not claim ownership of your photos or videos.'
        },
        {
          title: '5. Acceptable Use',
          body: 'You may not upload content that infringes on third-party intellectual property rights, violates any applicable laws, contains illegal content, or is used for spam or deceptive practices. You may only use FastListing for lawful real estate media production purposes.'
        },
        {
          title: '6. Subscription and Billing',
          body: 'Subscriptions are billed monthly. Render limits reset at the start of each billing cycle. Unused renders do not roll over. Downgrades take effect at the next billing cycle. You may cancel at any time; access continues until the end of the current billing period. No refunds are issued for partial months.'
        },
        {
          title: '7. Service Availability',
          body: 'FastListing aims for high availability but does not guarantee uninterrupted service. Render jobs may occasionally fail due to infrastructure issues. In such cases, the render will not count against your monthly limit. We reserve the right to modify or discontinue the service with reasonable notice.'
        },
        {
          title: '8. Audio Licensing',
          body: 'Audio tracks included in FastListing are licensed for use within rendered videos delivered to end clients. They are not licensed for redistribution, resale, or use outside of FastListing-generated content.'
        },
        {
          title: '9. Limitation of Liability',
          body: 'FastListing is provided "as is." To the maximum extent permitted by law, FastListing shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.'
        },
        {
          title: '10. Changes to Terms',
          body: 'We may update these terms from time to time. We will notify users of material changes by email. Continued use of the service after changes constitutes acceptance of the new terms.'
        },
        {
          title: '11. Contact',
          body: 'Questions about these terms? Contact us at support@fastlisting.app.'
        },
      ].map((section) => (
        <section key={section.title} style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{section.title}</h2>
          <p style={{ fontSize: 14, color: '#888888', lineHeight: 1.7 }}>{section.body}</p>
        </section>
      ))}
    </main>
  )
}
