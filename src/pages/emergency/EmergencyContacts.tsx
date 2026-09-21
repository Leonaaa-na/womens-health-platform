import { useEffect, useState } from "react";
import {
  getHotlines,
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  callNumber,
  apiErrorMessage,
  type Facility,
  type EmergencyContact,
} from "../../api/emergencyApi";

const RELATIONSHIPS = ["Trusted Family Member", "Partner / Guardian", "Doctor / Healthcare Professional", "Other Contact"];

const hotlineIcon = (h: Facility) =>
  h.type === "ambulance" ? "🚑" : h.type === "police" ? "🛡️" : h.phone === "192" ? "🔥" : "🚨";

function HotlineCard({ hotline }: { hotline: Facility }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-2xl">{hotlineIcon(hotline)}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{hotline.name}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">{hotline.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">{hotline.phone}</span>
            <button
              type="button"
              onClick={() => callNumber(hotline.phone)}
              className="rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
            >
              📞 Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmergencyContacts() {
  const [hotlines, setHotlines] = useState<Facility[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState(RELATIONSHIPS[0]);
  const [isPrimary, setIsPrimary] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [h, c] = await Promise.all([getHotlines(), getContacts()]);
        setHotlines(h);
        setContacts(c);
      } catch {
        setMessage("Could not load contacts.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const medical = hotlines.filter((h) => h.category === "medical");
  const safety = hotlines.filter((h) => h.category !== "medical");

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setMessage("Please enter a name and phone number.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await createContact({ name: name.trim(), phone: phone.trim(), relationship, isPrimary });
      // Reload so only one contact stays marked primary
      setContacts(await getContacts());
      setName("");
      setPhone("");
      setRelationship(RELATIONSHIPS[0]);
      setIsPrimary(false);
      setShowForm(false);
      setMessage("Contact added 💜");
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not add contact."));
    } finally {
      setSaving(false);
    }
  };

  const makePrimary = async (contact: EmergencyContact) => {
    try {
      await updateContact(contact.id, { isPrimary: true });
      setContacts(await getContacts());
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not update contact."));
    }
  };

  const handleDelete = async (contact: EmergencyContact) => {
    if (!window.confirm(`Remove ${contact.name} from your emergency contacts?`)) return;
    const previous = contacts;
    setContacts((prev) => prev.filter((c) => c.id !== contact.id));
    try {
      await deleteContact(contact.id);
    } catch (error) {
      setContacts(previous);
      setMessage(apiErrorMessage(error, "Could not remove contact."));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl">📞</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emergency Contacts</h1>
              <p className="text-sm text-gray-600">Important services to contact during an emergency.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
            <strong>Emergency?</strong> If you are experiencing a serious emergency, contact the appropriate emergency service.
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
          </div>
        ) : (
          <>
            {/* Medical */}
            <section className="mb-8">
              <h2 className="mb-1 text-xl font-bold text-gray-900">🚑 Medical & Health Emergencies</h2>
              <p className="mb-4 text-sm text-gray-600">Services for urgent medical situations and emergency response.</p>
              <div className="grid gap-4 md:grid-cols-2">
                {medical.map((h) => (
                  <HotlineCard key={h.id} hotline={h} />
                ))}
              </div>
            </section>

            {/* Safety */}
            <section className="mb-8">
              <h2 className="mb-1 text-xl font-bold text-gray-900">🛡️ Safety & Rescue Emergencies</h2>
              <p className="mb-4 text-sm text-gray-600">Services that may be needed when an emergency also involves personal safety or rescue.</p>
              <div className="grid gap-4 md:grid-cols-2">
                {safety.map((h) => (
                  <HotlineCard key={h.id} hotline={h} />
                ))}
              </div>
            </section>

            {/* Personal Emergency Contacts */}
            <section>
              <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-2xl">👥</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">👥 Personal Emergency Contacts</h2>
                    <p className="mt-1 text-sm text-gray-600">
                      People you trust who can be contacted when you need personal support. Your ⭐ primary contact is shown
                      first when you press SOS.
                    </p>

                    {message ? <p className="mt-4 rounded-xl bg-white p-3 text-sm font-medium text-purple-700">{message}</p> : null}

                    {contacts.length === 0 ? (
                      <p className="mt-5 rounded-xl bg-white p-4 text-sm text-gray-500">You haven't added anyone yet.</p>
                    ) : (
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {contacts.map((c) => (
                          <div key={c.id} className="rounded-xl bg-white p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {c.name} {c.isPrimary ? <span title="Primary contact">⭐</span> : null}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">{c.relationship || "Contact"}</p>
                                <p className="mt-1 text-sm font-medium text-purple-700">{c.phone}</p>
                              </div>
                              <button type="button" onClick={() => handleDelete(c)} className="text-sm text-gray-400 hover:text-red-500">
                                ✕
                              </button>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <button
                                type="button"
                                onClick={() => callNumber(c.phone)}
                                className="flex-1 rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700"
                              >
                                📞 Call
                              </button>
                              {!c.isPrimary ? (
                                <button
                                  type="button"
                                  onClick={() => makePrimary(c)}
                                  className="rounded-lg border border-purple-200 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                                >
                                  Make primary
                                </button>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {showForm ? (
                      <form onSubmit={handleAdd} className="mt-5 space-y-3 rounded-xl bg-white p-4">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Name"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-400"
                        />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone number"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-400"
                        />
                        <select
                          value={relationship}
                          onChange={(e) => setRelationship(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-400"
                        >
                          {RELATIONSHIPS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} className="h-4 w-4 accent-purple-600" />
                          Make this my primary contact
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
                          >
                            {saving ? "Saving..." : "Save Contact"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(true);
                          setMessage("");
                        }}
                        className="mt-5 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                      >
                        + Add Personal Contact
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        <div className="mt-8 rounded-xl bg-white p-4 text-center text-xs text-gray-500 shadow-sm">
          Emergency contact numbers are provided for quick access. Always use the appropriate service for your situation.
        </div>
      </div>
    </div>
  );
}