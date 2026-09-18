# Configure Stripe test webhook

1. Use the published webhook URL: `https://pickymaax-kitchen-magic.lovable.app/api/public/stripe/webhook`.
2. In Stripe test mode, subscribe it to:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `checkout.session.expired`
   - `charge.refunded`
3. Open Lovable’s secure secret form and save Stripe’s test signing secret as `STRIPE_WEBHOOK_SECRET` without exposing it in chat or frontend code.
4. Confirm the secret is configured and leave live-mode configuration unchanged.
