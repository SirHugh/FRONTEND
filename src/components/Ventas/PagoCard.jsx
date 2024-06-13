import { Card } from "flowbite-react";
import { CurrencyFormatter, DateFormatter, Months } from "../Constants";

function PagoCard({ key, pago }) {
  return (
    <Card key={key}>
      <div>
        <p>
          <b>Mes:</b>{" "}
          {Months[new Date(pago?.fecha_vencimiento).getMonth()]?.name}
        </p>
        <p>
          <b>Monto:</b> {CurrencyFormatter(pago?.monto)}
        </p>
        <p>
          <b>Fecha:</b> {pago?.fecha_vencimiento}
        </p>
      </div>
    </Card>
  );
}

export default PagoCard;
