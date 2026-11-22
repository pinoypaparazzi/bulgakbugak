import PageHeader from '../components/PageHeader.jsx';
import BookingForm from '../components/BookingForm.jsx';

export default function BookPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Book a service', href: '/book/' }]}
        eyebrow="Book a service"
        title="Tell us what you need"
        lead="Fill in the details below. We’ll review your request and reply to confirm availability, scope and pricing. Nothing is booked until you approve."
      />
      <section className="section section-tight booking">
        <div className="container">
          <BookingForm />
        </div>
      </section>
    </>
  );
}
