export interface HerBloomReminder {
  id: number;
  title: string;
  type: "Period" | "Pregnancy" | "Medication" | "Appointment" | "Wellness";
  date: string;
  time: string;
  notes: string;
  completed: boolean;
  automatic?: boolean;
}

const REMINDERS_KEY = "herbloomReminders";

const getReminders = (): HerBloomReminder[] => {
  try {
    const saved = localStorage.getItem(REMINDERS_KEY);

    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveReminders = (reminders: HerBloomReminder[]) => {
  localStorage.setItem(
    REMINDERS_KEY,
    JSON.stringify(reminders)
  );
};

const createReminder = (
  title: string,
  type: HerBloomReminder["type"],
  date: string,
  time: string,
  notes: string
) => {
  const reminders = getReminders();

  const alreadyExists = reminders.some(
    (reminder) =>
      reminder.automatic === true &&
      reminder.title === title &&
      reminder.type === type &&
      reminder.date === date
  );

  if (alreadyExists) {
    return;
  }

  const newReminder: HerBloomReminder = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    title,
    type,
    date,
    time,
    notes,
    completed: false,
    automatic: true,
  };

  saveReminders([...reminders, newReminder]);
};

export const generateAutomaticReminders = () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  // ==============================
  // APPOINTMENT REMINDERS
  // ==============================

  try {
    const appointments = JSON.parse(
      localStorage.getItem("herbloomAppointments") || "[]"
    );

    appointments
      .filter(
        (appointment: {
          status?: string;
          date?: string;
        }) =>
          appointment.status === "Upcoming" &&
          appointment.date
      )
      .forEach(
        (appointment: {
          professional: string;
          date: string;
          time: string;
        }) => {
          const appointmentDate = new Date(
            appointment.date
          );

          appointmentDate.setHours(0, 0, 0, 0);

          const difference =
            (appointmentDate.getTime() -
              today.getTime()) /
            (1000 * 60 * 60 * 24);

          if (difference >= 0 && difference <= 7) {
            createReminder(
              `Appointment with ${appointment.professional}`,
              "Appointment",
              appointment.date,
              appointment.time,
              "You have an upcoming healthcare appointment."
            );
          }
        }
      );
  } catch {
    // Ignore invalid appointment data
  }

  // ==============================
  // PERIOD REMINDER
  // ==============================

  try {
    const cycleData = JSON.parse(
      localStorage.getItem("herbloomCycleData") || "null"
    );

    if (cycleData?.nextPeriodDate) {
      const periodDate = new Date(
        cycleData.nextPeriodDate
      );

      periodDate.setHours(0, 0, 0, 0);

      const difference =
        (periodDate.getTime() -
          today.getTime()) /
        (1000 * 60 * 60 * 24);

      if (difference >= 0 && difference <= 7) {
        createReminder(
          "Your period is approaching",
          "Period",
          cycleData.nextPeriodDate,
          "9:00 AM",
          "Your expected period date is approaching."
        );
      }
    }
  } catch {
    // Ignore invalid cycle data
  }

  // ==============================
  // PREGNANCY REMINDER
  // ==============================

  try {
    const pregnancyData = JSON.parse(
      localStorage.getItem(
        "herbloomPregnancyData"
      ) || "null"
    );

    if (pregnancyData?.nextCheckupDate) {
      createReminder(
        "Upcoming pregnancy checkup",
        "Pregnancy",
        pregnancyData.nextCheckupDate,
        pregnancyData.nextCheckupTime ||
          "9:00 AM",
        "You have an upcoming pregnancy checkup."
      );
    }
  } catch {
    // Ignore invalid pregnancy data
  }

  // ==============================
  // MEDICATION REMINDERS
  // ==============================

  try {
    const medications = JSON.parse(
      localStorage.getItem(
        "herbloomMedications"
      ) || "[]"
    );

    if (Array.isArray(medications)) {
      medications.forEach(
        (medication: {
          name?: string;
          reminderTime?: string;
          date?: string;
        }) => {
          if (medication.name) {
            createReminder(
              `Medication: ${medication.name}`,
              "Medication",
              medication.date ||
                today
                  .toISOString()
                  .split("T")[0],
              medication.reminderTime ||
                "9:00 AM",
              "Medication reminder from your HerBloom health tracker."
            );
          }
        }
      );
    }
  } catch {
    // Ignore invalid medication data
  }

  // ==============================
  // WELLNESS REMINDER
  // ==============================

  try {
    const wellnessData = JSON.parse(
      localStorage.getItem(
        "herbloomWellnessData"
      ) || "null"
    );

    if (wellnessData?.nextActivityDate) {
      createReminder(
        "Wellness activity",
        "Wellness",
        wellnessData.nextActivityDate,
        wellnessData.nextActivityTime ||
          "6:00 PM",
        "Time for your planned wellness activity."
      );
    }
  } catch {
    // Ignore invalid wellness data
  }
};