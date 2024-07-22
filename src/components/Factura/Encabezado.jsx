import { DateFormatter, formatNumber } from "../Constants";

function Encabezado({ timbrado, info }) {
  return (
    <>
      {timbrado && info && (
        <div className="flex flex-row justify-between italic">
          {/* left side */}
          <div>
            <p className="font-bold text-xl uppercase">{info.nombre}</p>
            <p>ruc {info.ruc}</p>
            <p>{info.direccion} </p>
            <p>{info.email}</p>
            <p>Tel. {info.telefono}</p>
          </div>
          {/* right side */}
          <div className="flex flex-col items-end">
            <p>Timbrado: {timbrado.nro_timbrado} </p>
            <p>Valido hasta {timbrado.fecha_hasta}</p>
            <p>FACTURA</p>
            <p className="font-bold text-xl uppercase">
              N° {formatNumber(timbrado.establecimiento, 3)}-
              {formatNumber(timbrado.punto_expedicion, 3)}-
              {formatNumber(timbrado.ultimo_numero + 1, 7)}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Encabezado;
