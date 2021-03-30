export type PublicUserObject = {
  email: string

  username: string
  emailVerified: boolean
  isPremium: boolean
  plan: "standard" | "premium"
  billingSchedule?: "yearly" | "monthly" | "lifetime"
  stripeCustomerId?: string

}

export const publicUserObject = (user) => {
  return {
    email: user.email,
    username: user.username,
    emailVerified: user.email_verified,
    isPremium: user.plan == "premium",
    billingSchedule: user.billing_schedule,
    stripeCustomerId: user.stripe_customer_id,
  }
}
