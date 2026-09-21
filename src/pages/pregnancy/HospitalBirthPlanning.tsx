import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

interface ChecklistItem {
  id: number;
  name: string;
  completed: boolean;
}

interface Contact {
  id: number;
  name: string;
  relationship: string;
  phone: string;
}

const defaultChecklist: ChecklistItem[] = [
  { id: 1, name: "Baby clothes", completed: false },
  { id: 2, name: "Diapers", completed: false },
  { id: 3, name: "Baby blanket", completed: false },
  { id: 4, name: "Mother's comfortable clothes", completed: false },
  { id: 5, name: "Toiletries", completed: false },
  { id: 6, name: "Maternity pads", completed: false },
  { id: 7, name: "Important documents", completed: false },
  { id: 8, name: "Phone and charger", completed: false },
];

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

function HospitalBirthPlanning() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [hospitalName, setHospitalName] = useState("");
  const [healthcareProvider, setHealthcareProvider] = useState("");
  const [transportPlan, setTransportPlan] = useState("");
  const [hasHospitalChecklist, setHasHospitalChecklist] = useState<boolean | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [birthPreferences, setBirthPreferences] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactName, setContactName] = useState("");
  const [contactRelationship, setContactRelationship] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  // Load the saved plan (created empty the first time)
  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get("/pregnancy/birth-plan");
        const plan = response.data.data;

        setHospitalName(plan.hospitalName || "");
        setHealthcareProvider(plan.doctorName || "");
        setTransportPlan(plan.transportPlan || "");
        setHasHospitalChecklist(plan.hasHospitalChecklist ?? null);
        setBirthPreferences(plan.birthPreferences || "");
        setContacts(plan.contacts || []);
        setNotes(plan.notes || "");

        const savedList: ChecklistItem[] = plan.hospitalBagChecklist || [];
        if (savedList.length > 0) setChecklist(savedList);
        else if (plan.hasHospitalChecklist === true) setChecklist([]);
        else setChecklist(defaultChecklist);
      } catch (error) {
        setSavedMessage(errorMessage(error, "Could not load your plan."));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChecklistChoice = (choice: boolean) => {
    setHasHospitalChecklist(choice);
    setChecklist(choice ? [] : defaultChecklist);
  };

  const addChecklistItem = () => {
    const trimmed = newChecklistItem.trim();
    if (!trimmed) return;
    setChecklist((prev) => [...prev, { id: Date.now(), name: trimmed, completed: false }]);
    setNewChecklistItem("");
  };

  const toggleChecklistItem = (id: number) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  const deleteChecklistItem = (id: number) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const addContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) return;
    setContacts((prev) => [
      ...prev,
      { id: Date.now(), name: contactName.trim(), relationship: contactRelationship.trim(), phone: contactPhone.trim() },
    ]);
    setContactName("");
    setContactRelationship("");
    setContactPhone("");
  };

  const deleteContact = (id: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const savePlanning = async () => {
    setSaving(true);
    setSavedMessage("");

    try {
      await apiClient.put("/pregnancy/birth-plan", {
        hospitalName: hospitalName.trim() || null,
        doctorName: healthcareProvider.trim() || null,
        transportPlan: transportPlan.trim() || null,
        hasHospitalChecklist,
        hospitalBagChecklist: hasHospitalChecklist === null ? [] : checklist,
        birthPreferences: birthPreferences.trim() || null,
        contacts,
        notes: notes.trim() || null,
      });
      setSavedMessage("Your hospital and birth plan has been saved.");
    } catch (error) {
      setSavedMessage(errorMessage(error, "Could not save your plan."));
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMessage(""), 3000);
    }
  };

  const completedItems = checklist.filter((item) => item.completed).length;
  const checklistProgress = checklist.length > 0 ? Math.round((completedItems / checklist.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <p className="text-gray-600">Loading your plan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 pb-10">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-lg"
            aria-label="Go back"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold text-pink-700">Hospital & Birth Planning 🏥</h1>
            <p className="text-xs text-gray-500">Prepare for your delivery journey</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">🏥</div>
            <div>
              <h2 className="text-xl font-bold">Let's get you prepared</h2>
              <p className="mt-1 text-sm leading-5 opacity-90">
                Organize your hospital information, checklist, contacts and birth preferences in one place.
              </p>
            </div>
          </div>
        </section>

        {/* Hospital Information */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Hospital information</h2>
          <p className="mt-1 text-sm text-gray-500">Keep your delivery information handy.</p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Hospital / clinic name</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="Enter hospital name"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Healthcare provider</label>
              <input
                type="text"
                value={healthcareProvider}
                onChange={(e) => setHealthcareProvider(e.target.value)}
                placeholder="Doctor, midwife or provider"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Transportation plan</label>
              <textarea
                value={transportPlan}
                onChange={(e) => setTransportPlan(e.target.value)}
                placeholder="How will you get to the hospital?"
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500"
              />
            </div>
          </div>
        </section>

        {/* Hospital Checklist Question */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Hospital checklist 📋</h2>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            Did your hospital give you a checklist of things to bring or prepare?
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleChecklistChoice(true)}
              className={`rounded-2xl border p-4 text-left transition ${
                hasHospitalChecklist === true ? "border-pink-600 bg-pink-50" : "border-gray-200 bg-white"
              }`}
            >
              <span className="text-2xl">📄</span>
              <p className="mt-2 font-semibold text-gray-900">Yes, I have one</p>
              <p className="mt-1 text-xs text-gray-500">Add my hospital's checklist</p>
            </button>
            <button
              onClick={() => handleChecklistChoice(false)}
              className={`rounded-2xl border p-4 text-left transition ${
                hasHospitalChecklist === false ? "border-pink-600 bg-pink-50" : "border-gray-200 bg-white"
              }`}
            >
              <span className="text-2xl">💗</span>
              <p className="mt-2 font-semibold text-gray-900">No, I don't</p>
              <p className="mt-1 text-xs text-gray-500">Use HerBloom's general checklist</p>
            </button>
          </div>
        </section>

        {/* Checklist */}
        {hasHospitalChecklist !== null && (
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {hasHospitalChecklist ? "My hospital checklist" : "General hospital checklist"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {completedItems} of {checklist.length} completed
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-700">
                {checklistProgress}%
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-pink-600 transition-all" style={{ width: `${checklistProgress}%` }} />
            </div>

            <div className="mt-5 space-y-2">
              {checklist.length === 0 ? (
                <div className="rounded-2xl bg-pink-50 p-4 text-center">
                  <p className="text-sm text-gray-600">
                    Your hospital checklist is empty. Add your first item below.
                  </p>
                </div>
              ) : (
                checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3">
                    <button
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                        item.completed ? "border-pink-600 bg-pink-600 text-white" : "border-gray-300 bg-white"
                      }`}
                    >
                      {item.completed ? "✓" : ""}
                    </button>
                    <span className={`flex-1 text-sm ${item.completed ? "text-gray-400 line-through" : "text-gray-700"}`}>
                      {item.name}
                    </span>
                    {hasHospitalChecklist && (
                      <button onClick={() => deleteChecklistItem(item.id)} className="text-sm text-gray-400">
                        ✕
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {hasHospitalChecklist && (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addChecklistItem();
                  }}
                  placeholder="Add checklist item"
                  className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-500"
                />
                <button onClick={addChecklistItem} className="rounded-xl bg-pink-600 px-4 py-3 font-semibold text-white">
                  Add
                </button>
              </div>
            )}
          </section>
        )}

        {/* Birth Preferences */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Birth preferences 👶🏽</h2>
          <p className="mt-1 text-sm text-gray-500">
            Record questions, preferences or things you would like to discuss with your healthcare team.
          </p>
          <textarea
            value={birthPreferences}
            onChange={(e) => setBirthPreferences(e.target.value)}
            placeholder="Write your birth preferences..."
            rows={5}
            className="mt-4 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500"
          />
        </section>

        {/* Important Contacts */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-xl">📞</div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Important contacts</h2>
              <p className="text-sm text-gray-500">Keep important numbers available.</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Contact name"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500"
            />
            <input
              type="text"
              value={contactRelationship}
              onChange={(e) => setContactRelationship(e.target.value)}
              placeholder="Relationship / role"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500"
            />
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500"
            />
            <button onClick={addContact} className="w-full rounded-xl bg-pink-100 py-3 font-semibold text-pink-700">
              + Add Contact
            </button>
          </div>

          {contacts.length > 0 && (
            <div className="mt-5 space-y-2">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100">📞</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.relationship || "Important contact"}</p>
                    <p className="mt-1 text-sm font-medium text-pink-600">{contact.phone}</p>
                  </div>
                  <button onClick={() => deleteContact(contact.id)} className="text-sm text-gray-400">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Planning Notes */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Additional notes 📝</h2>
          <p className="mt-1 text-sm text-gray-500">Anything else you want to remember.</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your notes here..."
            rows={5}
            className="mt-4 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500"
          />
        </section>

        {/* Save */}
        <section>
          {savedMessage && (
            <div className="mb-3 rounded-2xl bg-green-50 p-4 text-center text-sm font-semibold text-green-700">
              ✓ {savedMessage}
            </div>
          )}
          <button
            onClick={savePlanning}
            disabled={saving}
            className="w-full rounded-2xl bg-pink-600 py-4 font-bold text-white shadow-lg transition hover:bg-pink-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Hospital & Birth Plan"}
          </button>
        </section>

        <button
          onClick={() => navigate("/pregnancy-tracker")}
          className="w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
        >
          Back to Pregnancy Tracker
        </button>
      </main>
    </div>
  );
}

export default HospitalBirthPlanning;