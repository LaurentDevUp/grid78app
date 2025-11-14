'use client'

import * as React from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { format, startOfToday } from 'date-fns'
import { fr } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'

interface CalendarSelectorProps {
  selectedDates: Date[]
  onRangeSelect: (start: Date, end: Date) => void
  disabledDates?: Date[]
}

export function CalendarSelector({
  selectedDates,
  onRangeSelect,
  disabledDates = [],
}: CalendarSelectorProps) {
  const [range, setRange] = React.useState<DateRange | undefined>()
  const today = startOfToday()

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange)

    // If both from and to are selected, call onRangeSelect
    if (selectedRange?.from && selectedRange?.to) {
      onRangeSelect(selectedRange.from, selectedRange.to)
      // Reset selection after callback
      setTimeout(() => setRange(undefined), 500)
    }
  }

  // Custom modifiers for styling
  const modifiers = {
    selected: selectedDates,
    disabled: [
      { before: today }, // Disable past dates
      ...disabledDates.map((date) => ({ from: date, to: date })),
    ],
  }

  const modifiersClassNames = {
    selected: 'bg-grid-cyan-500 text-white hover:bg-grid-cyan-600',
    disabled: 'opacity-40 cursor-not-allowed',
  }

  return (
    <div className="calendar-selector">
      <style jsx global>{`
        .calendar-selector .rdp {
          --rdp-cell-size: 45px;
          --rdp-accent-color: #06b6d4;
          --rdp-background-color: #ecfeff;
          font-family: inherit;
        }

        .calendar-selector .rdp-day_selected {
          background-color: #06b6d4;
          color: white;
          font-weight: 600;
        }

        .calendar-selector .rdp-day_selected:hover {
          background-color: #0891b2;
        }

        .calendar-selector .rdp-day_range_middle {
          background-color: #cffafe;
          color: #0e7490;
        }

        .calendar-selector .rdp-day_range_start,
        .calendar-selector .rdp-day_range_end {
          background-color: #06b6d4;
          color: white;
          font-weight: 700;
        }

        .calendar-selector .rdp-day:hover:not(.rdp-day_disabled) {
          background-color: #e0f2fe;
        }

        .calendar-selector .rdp-day_disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .calendar-selector .rdp-caption {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }

        .calendar-selector .rdp-nav_button {
          width: 32px;
          height: 32px;
          border-radius: 4px;
        }

        .calendar-selector .rdp-nav_button:hover {
          background-color: #e0f2fe;
        }

        .calendar-selector .rdp-head_cell {
          color: #64748b;
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
        }

        .calendar-selector .rdp-cell {
          padding: 2px;
        }

        .calendar-selector .rdp-day {
          border-radius: 6px;
          transition: all 0.2s;
        }
      `}</style>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">
            Sélectionner une période
          </h3>
          <p className="text-sm text-gray-600">
            Cliquez sur une date de début, puis sur une date de fin
          </p>
        </div>

        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          locale={fr}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          disabled={[
            { before: today },
            ...disabledDates,
          ]}
          numberOfMonths={1}
          showOutsideDays={false}
        />

        {range?.from && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Période sélectionnée :</strong>
              <br />
              Du {format(range.from, 'dd MMMM yyyy', { locale: fr })}
              {range.to && ` au ${format(range.to, 'dd MMMM yyyy', { locale: fr })}`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
