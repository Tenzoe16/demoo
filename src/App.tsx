import { FormEvent, useState } from 'react'

const initialForm = {
  customerName: '',
  customerPhone: '',
  checkIn: '',
  checkOut: '',
  roomType: 'Deluxe room',
  guests: '1',
}

export default function App() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit your booking.')
      }

      setStatus('Thanks — your booking request has been received.')
      setForm(initialForm)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to submit your booking.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-stone-950 px-6 py-12 text-stone-100">
      <section className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-amber-300">McLeodganj</p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">Barako Café</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-stone-300">
            Mountain mornings, warm coffee, and a quiet place to stay. Send us your
            details and we will confirm your room request.
          </p>
        </div>

        <form onSubmit={submitBooking} className="rounded-2xl bg-stone-900 p-6 shadow-2xl ring-1 ring-white/10 sm:p-8">
          <h2 className="text-2xl font-medium">Book your stay</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">Name<input required value={form.customerName} onChange={(e) => updateField('customerName', e.target.value)} /></label>
            <label>Phone<input required type="tel" value={form.customerPhone} onChange={(e) => updateField('customerPhone', e.target.value)} /></label>
            <label>Guests<input required min="1" type="number" value={form.guests} onChange={(e) => updateField('guests', e.target.value)} /></label>
            <label>Check in<input required type="date" value={form.checkIn} onChange={(e) => updateField('checkIn', e.target.value)} /></label>
            <label>Check out<input required type="date" value={form.checkOut} onChange={(e) => updateField('checkOut', e.target.value)} /></label>
            <label className="sm:col-span-2">Room type<select value={form.roomType} onChange={(e) => updateField('roomType', e.target.value)}><option>Deluxe room</option><option>Suite</option><option>Family room</option></select></label>
          </div>
          <button disabled={isSubmitting} className="mt-6 w-full rounded-lg bg-amber-300 px-4 py-3 font-semibold text-stone-950 transition hover:bg-amber-200 disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? 'Sending…' : 'Request booking'}
          </button>
          {status && <p role="status" className="mt-4 text-sm text-stone-300">{status}</p>}
        </form>
      </section>
      <style>{`label { display: grid; gap: .4rem; color: #d6d3d1; font-size: .875rem; } input, select { width: 100%; border-radius: .5rem; border: 1px solid #57534e; background: #292524; padding: .7rem .8rem; color: #f5f5f4; outline: none; } input:focus, select:focus { border-color: #fcd34d; box-shadow: 0 0 0 2px #fcd34d33; }`}</style>
    </main>
  )
}
