export const Months = [
  { id: 1, name: "ENERO" },
  { id: 2, name: "FEBRERO" },
  { id: 3, name: "MARZO" },
  { id: 4, name: "ABRIL" },
  { id: 5, name: "MAYO" },
  { id: 6, name: "JUNIO" },
  { id: 7, name: "JULIO" },
  { id: 8, name: "AGOSTO" },
  { id: 9, name: "SEPTIEMBRE" },
  { id: 10, name: "OCTUBRE" },
  { id: 11, name: "NOVIEMBRE" },
  { id: 12, name: "DICIEMBRE" },
];

export const getMonthName= (date)=> {
  return Months(date.getMonth}

export const DateFormatter = (date) =>
  new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

export const CurrencyFormatter = (value) =>
  value.toLocaleString("es-ES", {
    style: "currency",
    currency: "PYG",
  });
