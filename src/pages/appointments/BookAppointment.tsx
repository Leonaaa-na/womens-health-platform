import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: number;
  professional: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: "Upcoming" | "Completed" | "Cancelled" | "Missed";
}

const professionals = [
  {
    id: 1,
    name: "Dr. Ama Mensah",
    specialty: "Obstetrician & Gynaecologist",
  },
  {
    id: 2,
    name: "Dr. Efua Owusu",
    specialty: "Women's Health Specialist",
  },
  {
    id: 3,
    name: "Dr. Abena Boateng",
    specialty: "Fertility Specialist",
  },
  {
    id: 4,
    name: "Dr. Akosua Asante",
    specialty: "Midwife",
  },
];

const consultationTypes = [
  "Consultation Chat",
  "General Consultation",
  "Follow-up Consultation",
];

const availableTimes = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

function BookAppointment() {
  const navigate = useNavigate();

  const [professionalId, setProfessionalId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [consultationType, setConsultationType] = useState("");
  const [message, setMessage] = useState("");

  const selectedProfessional = professionals.find(
    (professional) => professional.id === Number(professionalId)
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !professionalId ||
      !date ||
      !time ||
      !consultationType ||
      !selectedProfessional
    ) {
      setMessage("Please complete all appointment details.");
      return;
    }

    const existingAppointments: Appointment[] = JSON.parse(
      localStorage.getItem("herbloomAppointments") || "[]"
    );

    const newAppointment: Appointment = {
      id: Date.now(),
      professional: selectedProfessional.name,
      specialty: selectedProfessional.specialty,
      date,
      time,
      type: consultationType,
      status: "Upcoming",
    };

    localStorage.setItem(
      "herbloomAppointments",
      JSON.stringify([newAppointment, ...existingAppointments])
    );

    setMessage("Appointment booked successfully!");

    setTimeout(() => {
      navigate("/appointments");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/appointments")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            ← Back
          </button>

          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-800">
              Book Appointment
            </h1>
            <p className="text-sm text-gray-500">
              Her health. Her journey. Her bloom.
            </p>
          </div>
        </div>

        {/* Intro */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white shadow-lg">
          <h2 className="text-xl font-bold">
            Schedule your consultation 🌸
          </h2>

          <p className="mt-2 text-sm text-pink-50">
            Choose a healthcare professional, select a suitable date and
            time, and choose how you would like to consult.
          </p>
        </div>

        {/* Booking Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-md"
        >

          {/* Professional */}
          <div className="mb-5">
            <label
              htmlFor="professional"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              👩🏾‍⚕️ Choose Professional
            </label>

            <select
              id="professional"
              value={professionalId}
              onChange={(event) => setProfessionalId(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            >
              <option value="">Select a professional</option>

              {professionals.map((professional) => (
                <option
                  key={professional.id}
                  value={professional.id}
                >
                  {professional.name} — {professional.specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Professional */}
          {selectedProfessional && (
            <div className="mb-5 rounded-xl bg-pink-50 p-4">
              <p className="text-sm font-semibold text-pink-700">
                Selected Professional
              </p>

              <p className="mt-1 font-bold text-gray-800">
                {selectedProfessional.name}
              </p>

              <p className="text-sm text-gray-600">
                {selectedProfessional.specialty}
              </p>
            </div>
          )}

          {/* Date */}
          <div className="mb-5">
            <label
              htmlFor="appointment-date"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              📅 Choose Date
            </label>

            <input
              id="appointment-date"
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          {/* Time */}
          <div className="mb-5">
            <label
              htmlFor="appointment-time"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              🕐 Choose Time
            </label>

            <select
              id="appointment-time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            >
              <option value="">Select a time</option>

              {availableTimes.map((availableTime) => (
                <option
                  key={availableTime}
                  value={availableTime}
                >
                  {availableTime}
                </option>
              ))}
            </select>
          </div>

          {/* Consultation Type */}
          <div className="mb-5">
            <label
              htmlFor="consultation-type"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              💬 Consultation Type
            </label>

            <select
              id="consultation-type"
              value={consultationType}
              onChange={(event) =>
                setConsultationType(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            >
              <option value="">Select consultation type</option>

              {consultationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-5 rounded-xl bg-pink-50 p-4 text-center text-sm font-medium text-pink-700">
              {message}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/appointments")}
              className="w-full rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 font-semibold text-white shadow-md transition hover:opacity-90"
            >
              📅 Book Appointment
            </button>
          </div>
        </form>

        {/* Notice */}
        <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50 p-4 text-center text-xs text-gray-600">
          Appointment booking is currently using demonstration data.
          Real professional availability and backend booking will be
          connected later.
        </div>

      </div>
    </div>
  );
}

export default BookAppointment;