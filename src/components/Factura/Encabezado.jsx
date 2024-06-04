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
            <p className="font-bold text-xl uppercase">
              Nro. {formatNumber(timbrado.establecimiento, 3)}-
              {formatNumber(timbrado.punto_expedicion, 3)}-
              {formatNumber(timbrado.ultimo_numero + 1, 7)}
            </p>
            <p>Timbrado: {timbrado.nro_timbrado} </p>
            <p>Validez {timbrado.fecha_hasta}</p>
            <p className="font-sans">
              Fecha: {DateFormatter(new Date()).toUpperCase()}
            </p>
            <p>Tipo: Contado</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Encabezado;
