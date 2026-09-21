import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getMedicalInfo,
  updateMedicalInfo,
  getContacts,
  toList,
  apiErrorMessage,
  type EmergencyInfo,
  type EmergencyContact,
} from "../../api/emergencyApi";

interface EmergencyGuide {
  title: string;
  icon: string;
  description: string;
  guidance: string[];
}

const emergencyGuides: EmergencyGuide[] = [
  { title: "Severe Bleeding", icon: "🩸", description: "Heavy or uncontrolled bleeding can require immediate medical attention.", guidance: ["Seek emergency medical help immediately.", "Keep the person as calm and still as possible.", "Apply gentle pressure to the affected area if appropriate.", "Do not delay seeking professional medical care."] },
  { title: "Severe Abdominal/Pelvic Pain", icon: "⚠️", description: "Sudden or severe abdominal or pelvic pain may require urgent assessment.", guidance: ["Seek urgent medical attention if the pain is severe, sudden, or worsening.", "Pay attention to other symptoms such as fainting, fever, vomiting, or unusual bleeding.", "Avoid delaying care if the symptoms feel serious or unusual for you.", "Contact an emergency service or healthcare facility when necessary."] },
  { title: "Pregnancy Emergency", icon: "🤰", description: "Certain symptoms during pregnancy require prompt medical attention.", guidance: ["Seek urgent medical care for concerning or severe symptoms during pregnancy.", "Contact your healthcare professional or emergency service.", "Keep important pregnancy and medical information available.", "Do not delay professional assessment when symptoms are severe or worsening."] },
  { title: "Difficulty Breathing", icon: "🫁", description: "Serious difficulty breathing can be an emergency.", guidance: ["Seek emergency medical assistance immediately.", "Keep the person calm and in a comfortable position.", "Do not leave someone experiencing severe breathing difficulty alone.", "Contact an emergency service if the breathing problem is severe."] },
  { title: "Fainting/Loss of Consciousness", icon: "🚨", description: "Loss of consciousness or repeated fainting should be taken seriously.", guidance: ["Seek medical assistance, especially if the person does not quickly recover.", "Keep the person safe from further injury.", "Do not give food or drink to someone who is unconscious.", "Contact emergency services when necessary."] },
  { title: "Personal Safety Emergency", icon: "🛡️", description: "If you are in immediate danger, seek help from emergency services or a trusted person.", guidance: ["Move to a safe location if you can do so safely.", "Contact an appropriate emergency service.", "Reach out to a trusted person for support.", "Avoid putting yourself at additional risk while trying to get help."] },
];

const BLOOD_GROUPS = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function EmergencyInformation() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [openCard, setOpenCard] = useState<number | null>(null);
  const [medicalCardOpen, setMedicalCardOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const [info, setInfo] = useState<EmergencyInfo | null>(null);
  const [primaryContact, setPrimaryContact] = useState<EmergencyContact | null>(null);

  // Form fields (lists edited as comma-separated text)
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [conditions, setConditions] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fillForm = (data: EmergencyInfo) => {
    setBloodGroup(data.bloodGroup || "");
    setAllergies(data.allergies.join(", "));
    setMedications(data.currentMedications.join(", "));
    setConditions(data.medicalConditions.join(", "));
    setNotes(data.notes || "");
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [data, contacts] = await Promise.all([getMedicalInfo(), getContacts()]);
        setInfo(data);
        fillForm(data);
        setPrimaryContact(contacts.find((c) => c.isPrimary) || contacts[0] || null);
      } catch {
        // card stays empty
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const saved = await updateMedicalInfo({
        bloodGroup: bloodGroup || null,
        allergies: toList(allergies),
        currentMedications: toList(medications),
        medicalConditions: toList(conditions),
        notes: notes.trim() || null,
      });
      setInfo(saved);
      setEditing(false);
      setMessage("Medical card saved 🪪");
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not save your medical card."));
    } finally {
      setSaving(false);
    }
  };

  const cardFields = [
    { label: "Full Name", value: user ? `${user.firstName} ${user.lastName}`.trim() : "" },
    { label: "Blood Group", value: info?.bloodGroup || "" },
    { label: "Allergies", value: info?.allergies.join(", ") || "" },
    { label: "Current Medications", value: info?.currentMedications.join(", ") || "" },
    { label: "Medical Conditions", value: info?.medicalConditions.join(", ") || "" },
    { label: "Emergency Contact", value: primaryContact ? `${primaryContact.name} · ${primaryContact.phone}` : "" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate("/emergency")} className="mb-5 text-sm font-semibold text-red-600 hover:text-red-700">
            ← Back to Emergency Assistance
          </button>
          <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-3xl">📚</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Emergency Information</h1>
                <p className="mt-2 text-gray-600">
                  General guidance for situations that may require urgent medical or personal safety assistance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Guidance cards */}
          {emergencyGuides.map((guide, index) => (
            <div key={guide.title} className="overflow-hidden rounded-2xl bg-white shadow-md">
              <button
                onClick={() => setOpenCard(openCard === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-red-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-2xl">{guide.icon}</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{guide.title}</h2>
                    <p className="mt-1 text-sm text-gray-600">{guide.description}</p>
                  </div>
                </div>
                <span className="text-xl text-gray-500">{openCard === index ? "▲" : "▼"}</span>
              </button>

              {openCard === index ? (
                <div className="border-t border-red-100 bg-red-50/50 px-5 pb-5 pt-4">
                  <h3 className="mb-3 font-semibold text-gray-900">What to do</h3>
                  <ul className="space-y-3">
                    {guide.guidance.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6 text-gray-700">
                        <span className="mt-1 text-red-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate("/emergency/services")}
                    className="mt-5 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                  >
                    View Emergency Services
                  </button>
                </div>
              ) : null}
            </div>
          ))}

          {/* Personal Medical Card */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-md">
            <button
              onClick={() => setMedicalCardOpen(!medicalCardOpen)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-purple-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-2xl">🪪</div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Personal Medical Card</h2>
                  <p className="mt-1 text-sm text-gray-600">Keep important personal medical information available during an emergency.</p>
                </div>
              </div>
              <span className="text-xl text-gray-500">{medicalCardOpen ? "▲" : "▼"}</span>
            </button>

            {medicalCardOpen ? (
              <div className="border-t border-purple-100 bg-purple-50/50 p-5">
                <div className="mb-5 rounded-xl bg-white p-4">
                  <p className="text-sm leading-6 text-gray-600">
                    Your Personal Medical Card is private to you. It appears on your SOS screen so you can show it to
                    healthcare professionals or trusted people during an emergency.
                  </p>
                </div>

                {message ? <p className="mb-4 rounded-xl bg-white p-3 text-sm font-medium text-purple-700">{message}</p> : null}

                {editing ? (
                  <div className="space-y-4 rounded-xl bg-white p-4">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-purple-500">Blood Group</label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-400"
                      >
                        {BLOOD_GROUPS.map((g) => (
                          <option key={g} value={g}>{g || "Not sure"}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-purple-500">Allergies</label>
                      <input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Separate with commas, e.g. Penicillin, Peanuts" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-400" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-purple-500">Current Medications</label>
                      <input value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="Separate with commas" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-400" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-purple-500">Medical Conditions</label>
                      <input value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="Separate with commas" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-400" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-purple-500">Notes for first responders</label>
                      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-400" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
                      >
                        {saving ? "Saving..." : "Save Medical Card"}
                      </button>
                      <button
                        onClick={() => {
                          if (info) fillForm(info);
                          setEditing(false);
                        }}
                        className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {cardFields.map((f) => (
                        <div key={f.label} className="rounded-xl border border-purple-100 bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-purple-500">{f.label}</p>
                          <p className={`mt-1 text-sm ${f.value ? "text-gray-800" : "text-gray-400"}`}>{f.value || "Not added yet"}</p>
                        </div>
                      ))}
                    </div>
                    {info?.notes ? (
                      <div className="mt-4 rounded-xl border border-purple-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-purple-500">Notes</p>
                        <p className="mt-1 text-sm text-gray-800">{info.notes}</p>
                      </div>
                    ) : null}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => {
                          setEditing(true);
                          setMessage("");
                        }}
                        className="rounded-xl bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
                      >
                        ✏️ Edit Medical Card
                      </button>
                      <button
                        onClick={() => navigate("/emergency/contacts")}
                        className="rounded-xl border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-50"
                      >
                        Manage Emergency Contacts
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Emergency Services */}
        <div className="mt-8 rounded-2xl bg-red-600 p-6 text-white shadow-lg">
          <h2 className="text-xl font-bold">Need Immediate Help?</h2>
          <p className="mt-2 text-sm leading-6 text-red-100">
            If you believe you are experiencing an emergency, contact an appropriate emergency service or seek immediate medical care.
          </p>
          <button
            onClick={() => navigate("/emergency/services")}
            className="mt-5 rounded-xl bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
          >
            Emergency Services
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
          <p className="text-sm leading-6 text-yellow-800">
            <strong>Important:</strong> This information is for general guidance only and does not replace professional
            medical advice, diagnosis, or emergency care. If you are experiencing a serious emergency, seek immediate professional help.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmergencyInformation;