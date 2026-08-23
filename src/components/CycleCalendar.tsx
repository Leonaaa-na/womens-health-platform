import { useMemo, useState } from "react";

type CycleCalendarProps = {
  startDate: string;
  cycleLength: number;
  periodLength: number;
};

type DayStatus =
  | "period"
  | "approaching"
  | "ovulation"
  | "fertile"
  | "";

function CycleCalendar({
  startDate,
  cycleLength,
  periodLength,
}: CycleCalendarProps) {
  const initialDate = startDate
    ? new Date(startDate)
    : new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(
      initialDate.getFullYear(),
      initialDate.getMonth(),
      1
    )
  );

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);

    const startingDay =
      firstDay.getDay() === 0
        ? 6
        : firstDay.getDay() - 1;

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const days: (number | null)[] = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [currentMonth]);

  const getDayStatus = (
    day: number | null
  ): DayStatus => {
    if (!day || !startDate) {
      return "";
    }

    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    const cycleStart = new Date(startDate);

    date.setHours(0, 0, 0, 0);
    cycleStart.setHours(0, 0, 0, 0);

    const difference = Math.floor(
      (date.getTime() - cycleStart.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (difference < 0) {
      return "";
    }

    const cycleDay =
      (difference % cycleLength) + 1;

    /*
      These are estimates based on the user's
      average cycle length.

      Estimated ovulation:
      approximately 14 days before the next period.
    */
    const ovulationDay = Math.max(
      1,
      cycleLength - 14
    );

    const approachingStart =
      Math.max(1, ovulationDay - 3);

    const fertileStart =
      Math.max(1, ovulationDay - 5);

    const fertileEnd =
      Math.min(cycleLength, ovulationDay + 1);

    // Period
    if (cycleDay <= periodLength) {
      return "period";
    }

    // Estimated ovulation day
    if (cycleDay === ovulationDay) {
      return "ovulation";
    }

    // Days approaching estimated ovulation
    if (
      cycleDay >= approachingStart &&
      cycleDay < ovulationDay
    ) {
      return "approaching";
    }

    // Estimated fertile window
    if (
      cycleDay >= fertileStart &&
      cycleDay <= fertileEnd
    ) {
      return "fertile";
    }

    return "";
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  };

  const monthName = currentMonth.toLocaleString(
    "default",
    {
      month: "long",
      year: "numeric",
    }
  );

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">

      {/* Calendar Header */}
      <div className="mb-5 flex items-center justify-between">

        <button
          onClick={previousMonth}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 text-pink-600"
          aria-label="Previous month"
        >
          ←
        </button>

        <h2 className="font-bold text-gray-900">
          {monthName}
        </h2>

        <button
          onClick={nextMonth}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 text-pink-600"
          aria-label="Next month"
        >
          →
        </button>

      </div>

      {/* Estimated Information */}
      <div className="mb-5 rounded-2xl bg-pink-50 p-4">
        <p className="text-xs leading-5 text-gray-500">
          Cycle predictions are estimates based on the
          information you provide. Your actual ovulation
          and fertile days may vary.
        </p>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {[
          "M",
          "T",
          "W",
          "T",
          "F",
          "S",
          "S",
        ].map((day, index) => (
          <span
            key={index}
            className="py-2 text-xs font-semibold text-gray-400"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 text-center">

        {calendarDays.map((day, index) => {
          const status = getDayStatus(day);

          let statusStyle =
            "text-gray-700";

          if (status === "period") {
            statusStyle =
              "bg-pink-500 font-semibold text-white";
          }

          if (status === "approaching") {
            statusStyle =
              "bg-orange-100 font-semibold text-orange-700";
          }

          if (status === "ovulation") {
            statusStyle =
              "bg-purple-600 font-bold text-white";
          }

          if (status === "fertile") {
            statusStyle =
              "bg-purple-100 font-semibold text-purple-700";
          }

          return (
            <div
              key={index}
              className="flex h-10 items-center justify-center"
            >
              {day && (
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${statusStyle}`}
                >
                  {day}
                </span>
              )}
            </div>
          );
        })}

      </div>

      {/* Legend */}
      <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="h-3 w-3 rounded-full bg-pink-500" />
          Period
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="h-3 w-3 rounded-full bg-orange-100" />
          Approaching ovulation
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="h-3 w-3 rounded-full bg-purple-600" />
          Estimated ovulation
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="h-3 w-3 rounded-full bg-purple-100" />
          Estimated fertile window
        </div>

      </div>

    </section>
  );
}

export default CycleCalendar;