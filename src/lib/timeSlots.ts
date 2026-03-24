export function generateTimeSlots(stepMinutes = 15) {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += stepMinutes) {
      const hh = String(hour).padStart(2, '0');
      const mm = String(minute).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}

export function generateDurationOptions(min = 10, max = 240, step = 10) {
  const options: number[] = [];
  for (let value = min; value <= max; value += step) {
    options.push(value);
  }
  return options;
}

export function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

export function isEndAfterStart(start: string, end: string) {
  return timeToMinutes(end) > timeToMinutes(start);
}
