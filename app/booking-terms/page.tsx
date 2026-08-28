import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'
import { SITE } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Booking Terms — Fine Lanka Tours',
  description: 'Terms and conditions that apply when you book a trip with Fine Lanka Tours.',
}

export default function Page() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Booking Terms"
      intro="The terms that apply when you book a trip with us. Please read these alongside your itinerary and quote."
    >
      <p className="legal-updated">Last updated: 28 August 2026</p>

      <h2>1. Enquiries &amp; quotes</h2>
      <p>
        Submitting a booking or enquiry form is the start of a conversation, not a confirmed
        booking. We&apos;ll follow up with a proposed itinerary and price, which remains valid
        for a limited time and is subject to availability at the point of confirmation.
      </p>

      <h2>2. Confirming a booking</h2>
      <p>
        A booking is confirmed once we&apos;ve received your written agreement to the itinerary
        and a deposit. Unless otherwise agreed in writing, a deposit of 25% of the total trip
        cost is required to confirm, with the balance due no later than 30 days before your
        travel start date. For bookings made within 30 days of travel, full payment is required
        at the time of confirmation.
      </p>

      <h2>3. Changes by you</h2>
      <p>
        We&apos;ll do our best to accommodate changes to a confirmed itinerary, but changes are
        subject to availability and may involve a revised price. Some suppliers (hotels,
        internal flights) may apply their own change fees, which we&apos;ll pass on at cost.
      </p>

      <h2>4. Cancellations &amp; refunds</h2>
      <p>Cancellations must be made in writing. Unless a specific supplier&apos;s policy states otherwise, the following applies to the trip cost:</p>
      <ul>
        <li>More than 45 days before travel: deposit is non-refundable, no further charge</li>
        <li>30–45 days before travel: 50% of the total trip cost</li>
        <li>Less than 30 days before travel, or no-show: 100% of the total trip cost</li>
      </ul>
      <p>
        Some bookings (e.g. peak-season hotels, internal flights, or special event tickets) may
        carry stricter, non-refundable terms set by the supplier — we&apos;ll flag these clearly
        in your itinerary before you confirm.
      </p>

      <h2>5. Changes by us</h2>
      <p>
        Occasionally a supplier may change or become unavailable after booking. Where this
        happens, we&apos;ll offer a comparable alternative at no extra cost where possible, or
        discuss options with you directly.
      </p>

      <h2>6. Travel documents &amp; entry requirements</h2>
      <p>
        It&apos;s your responsibility to hold a valid passport and any visa or travel
        authorisation required to enter Sri Lanka (most nationalities need an ETA, applied for
        before departure), and to meet any other entry requirements in place at the time of
        travel. We&apos;re happy to point you toward the relevant official process, but we
        can&apos;t guarantee entry and aren&apos;t responsible for a refused visa or entry
        denial.
      </p>

      <h2>7. Travel insurance</h2>
      <p>
        We strongly recommend taking out travel insurance that covers trip cancellation,
        medical emergencies, and personal belongings, effective from the date you book.
      </p>

      <h2>8. Our role &amp; liability</h2>
      <p>
        We design and coordinate your itinerary and act as an intermediary between you and the
        local suppliers involved — hotels, driver-guides, and activity operators — each of whom
        operates under their own terms and conditions. We take care in choosing who we work
        with, but we&apos;re not liable for the direct acts or omissions of an independent
        supplier, or for events beyond our reasonable control (see below).
      </p>

      <h2>9. Force majeure</h2>
      <p>
        Neither party is liable for a failure to perform caused by events beyond reasonable
        control, including natural disasters, extreme weather, civil unrest, government action,
        or public health emergencies. Where this affects your trip, we&apos;ll work with you in
        good faith on rescheduling or an appropriate resolution.
      </p>

      <h2>10. Complaints</h2>
      <p>
        If something isn&apos;t right during your trip, please tell your driver-guide or
        contact us directly as soon as possible so we can try to resolve it while you&apos;re
        still travelling. After your trip, written complaints should be sent within 28 days of
        your return.
      </p>

      <h2>11. Governing law</h2>
      <p>These terms are governed by the laws of Sri Lanka.</p>

      <h2>Contact us</h2>
      <p>
        Questions about these terms or an existing booking can be sent to{' '}
        {SITE.emails.map((email, i) => (
          <span key={email}>
            <a href={`mailto:${email}`}>{email}</a>
            {i < SITE.emails.length - 1 ? ' or ' : ''}
          </span>
        ))}
        , or by phone at {SITE.phones.join(' / ')}.
      </p>
    </LegalPage>
  )
}
