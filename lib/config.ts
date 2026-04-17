export const config = {
  s3BucketName: process.env.S3_BUCKET_NAME ?? '',
  awsRegion: process.env.AWS_REGION ?? 'us-east-1',
  stripeStarterPriceId: process.env.STRIPE_STARTER_PRICE_ID ?? '',
  stripeProPriceId: process.env.STRIPE_PRO_PRICE_ID ?? '',
}