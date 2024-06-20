export const Months = [
  { id: 0, name: "ENERO" },
  { id: 1, name: "FEBRERO" },
  { id: 2, name: "MARZO" },
  { id: 3, name: "ABRIL" },
  { id: 4, name: "MAYO" },
  { id: 5, name: "JUNIO" },
  { id: 6, name: "JULIO" },
  { id: 7, name: "AGOSTO" },
  { id: 8, name: "SEPTIEMBRE" },
  { id: 9, name: "OCTUBRE" },
  { id: 10, name: "NOVIEMBRE" },
  { id: 11, name: "DICIEMBRE" },
];

// export const DateFormatter = (date) =>
//   new Date(date).toLocaleDateString("es-ES", {
//     weekday: "short",
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });

export const DateFormatter = (date) =>
  new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

export const TimeFormatter = (date) =>
  new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);

export const CurrencyFormatter = (value) =>
  value.toLocaleString("es-ES", {
    style: "currency",
    currency: "PYG",
  });

export const formatNumber = (num, digits) => {
  return num.toLocaleString("en-US", {
    minimumIntegerDigits: digits,
    useGrouping: false,
  });
};
