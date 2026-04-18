export default function PrivacyPage() {
  return (
    <main style={{ backgroundColor: '#0A0A0A', color: '#F5F5F5', padding: '48px 24px', maxWidth: 720, margin: '0 auto', fontFamily: 'var(--font-geist-sans), sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#888888', fontSize: 13, marginBottom: 48 }}>Last updated: April 2026</p>

      {[
        {
          title: '1. Information We Collect',
          body: 'We collect your email address and authentication details when you sign in with Google or email/password. We collect property photos you upload and listing information you enter (address, price, beds, baths). We collect usage data including the number of renders you perform per billing cycle.'
        },
        {
          title: '2. How We Use Your Information',
          body: 'We use your information to provide the FastListing service, process payments via Stripe, generate video renders on your behalf, and communicate with you about your account. We do not sell your data to third parties.'
        },
        {
          title: '3. Photo and Media Storage',
          body: 'Photos you upload are stored securely in AWS S3. Original high-resolution files and compressed proxy versions are stored under your project. You retain full ownership of all photos and media you upload, including generated videos. We do not use your photos for any purpose other than rendering your requested videos.'
        },
        {
          title: '4. Payment Information',
          body: 'Payments are processed by Stripe. We do not store your credit card information. Stripe\'s privacy policy applies to payment processing. You can review it at stripe.com/privacy.'
        },
        {
          title: '5. Data Retention',
          body: 'Your account data, projects, and uploaded photos are retained while your account is active. You may request deletion of your account and all associated data at any time by contacting support@fastlisting.app. Deleted data is permanently removed within 30 days.'
        },
        {
          title: '6. Cookies and Authentication',
          body: 'We use cookies solely to maintain your login session. Authentication supports Google OAuth and email/password credentials. No advertising or tracking cookies are used.'
        },
        {
          title: '7. Security',
          body: 'All data is transmitted over HTTPS. Photos are stored in private AWS S3 buckets. Database access is restricted to application servers only. We follow industry-standard security practices.'
        },
        {
          title: '8. Contact',
          body: 'If you have questions about this privacy policy or your data, contact us at support@fastlisting.app.'
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
