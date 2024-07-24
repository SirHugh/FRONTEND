import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logo from '../assets/fundationLogo.png'; // Ajusta la ruta según tu estructura de carpetas
import { getComprobante } from "../services/CajaService";

const PrintFacturaPage = () => {
  const { id } = useParams();
  const [facturaData, setFacturaData] = useState(null);

  useEffect(() => {
    const fetchComprobante = async () => {
      try {
        const res = await getComprobante(id);
        setFacturaData(res.data);
      } catch (error) {
        console.error("Error fetching comprobante", error);
      }
    };

    fetchComprobante();
  }, [id]);

  if (!facturaData) {
    return <div>Loading...</div>; // Puedes reemplazar esto con un spinner o algún indicador de carga
  }

  const { timbrado, inicio_timbrado, validez_timbrado, fecha, nro_factura, monto, cliente, aranceles, ventas, actividades } = facturaData;
  // Calcular totales
  const calcularIVA = (monto, tipo) => {
    if (tipo === 'ventas') {
      return (parseFloat(monto) / 11).toFixed(2);
    }
    return 0;
  };

  const arancelesDetalles = aranceles.map(arancel => ({
    cantidad: 1,
    descripcion: arancel.nombre,
    precio_unitario: arancel.monto,
    exentas: arancel.monto,
    iva5: 0,
    iva10: 0,
    descuento: 0,
  }));

  const ventasDetalles = ventas.flatMap(venta => 
    venta.descripcion.map(item => ({
      cantidad: item.cantidad,
      descripcion: item.producto,
      precio_unitario: item.precio,
      exentas: 0,
      iva5: 0,
      iva10: item.precio,
      descuento: 0,
    }))
  );

  const actividadesDetalles = actividades.map(actividad => ({
    cantidad: 1,
    descripcion: actividad.actividad,
    precio_unitario: actividad.monto,
    exentas: actividad.monto,
    iva5: 0,
    iva10: 0,
    descuento: 0,
  }));

  const detalles = [...arancelesDetalles, ...ventasDetalles, ...actividadesDetalles];

  const totalExentas = detalles.reduce((sum, item) => sum + parseFloat(item.exentas), 0) 
                      - detalles.reduce((sum, item)=> sum + parseFloat(item.descuento), 0);
  const totalIVA5 = detalles.reduce((sum, item) => sum + parseFloat(item.iva5), 0);
  const totalIVA10 = detalles.reduce((sum, item) => sum + parseFloat(item.iva10), 0);
  const totalIVA5Amount = totalIVA5 / 21;
  const totalIVA10Amount = totalIVA10 / 11;
  const totalGeneral = totalExentas + totalIVA5 + totalIVA10;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-10 bg-white">
      {/* Botón de impresión, oculto en la impresión */}
      <div className="no-print mb-4">
        <button onClick={handlePrint} className="px-4 py-2 bg-blue-500 text-white rounded">Imprimir Factura</button>
      </div>

      {/* Factura */}
      <div id="factura">
        {/* Encabezado */}
        <div className="border border-black p-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-16 w-16 mr-4" />
            <div>
              <p className="text-sm font-bold">Fundación Unidos por Cristo</p>
              <p className="text-xs">Dirección: {cliente.direccion}</p>
              <p className="text-xs">Tel.: {cliente.telefono}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs">RUC: {cliente.ruc}</p>
            <p className="text-xs">Nº de Timbrado: {timbrado}</p>
            <p className="text-xs">Periodo de vigencia: {inicio_timbrado} {validez_timbrado}</p>
            <p className="text-xs">FACTURA ELECTRONICA Nº {nro_factura}</p>
          </div>
        </div>

        {/* Datos de la Venta y Cliente */}
        <div className="border border-black mt-4 p-4 flex justify-between">
          <div>
            <p className="text-xs">Nombre o Razón Social: {cliente?.nombre} {cliente?.apellido || ""}</p>
            <p className="text-xs">Dirección: {cliente?.direccion || ""}</p>
            <p className="text-xs">Teléfono: {cliente?.telefono || ""}</p>
            <p className="text-xs">Correo Electrónico: {cliente?.email || ""}</p>
          </div>
          <div className="text-right">
            <p className="text-xs">Fecha de Emisión: {fecha}</p>
            <p className="text-xs">Condición de Venta: CONTADO</p>
          </div>
        </div>

        {/* Detalles de lo Facturado */}
        <div className="mt-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-t border-l border-black">
                <th className="py-1 border-r border-black">Cantidad</th>
                <th className="py-1 border-r border-black">Descripción</th>
                <th className="py-1 border-r border-black">Precio Unitario</th>
                <th className="py-1 border-r border-black">Descuento</th>
                <th className="py-1 border-r border-black" colSpan="3">Valor de venta</th>
              </tr>
              <tr className="border-l border-black">
                <th className="py-1 border-r border-black"></th>
                <th className="py-1 border-r border-black"></th>
                <th className="py-1 border-r border-black"></th>
                <th className="py-1 border-r border-black"></th>
                <th className="py-1 border-r border-t border-black">Exentas</th>
                <th className="py-1 border-r border-t border-black">IVA 5%</th>
                <th className="py-1 border-r border-t border-black">IVA 10%</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle, index) => (
                <tr key={index} className="border border-black">
                  <td className="py-1 text-center border-r border-black">{detalle.cantidad}</td>
                  <td className="py-1 border-r border-black">{detalle.descripcion}</td>
                  <td className="py-1 text-right border-r border-black">{detalle.precio_unitario}</td>
                  <td className="py-1 text-right border-r border-black">{detalle.descuento ? -detalle.descuento : 0}</td>
                  <td className="py-1 text-right border-r border-black">{detalle.descuento ? detalle.exentas - detalle.descuento : detalle.exentas}</td>
                  <td className="py-1 text-right border-r border-black">{detalle.iva5}</td>
                  <td className="py-1 text-right">{detalle.iva10}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Subtotales y Totales */}
        <div className="">
          <div className="border-l border-r border-b border-black flex justify-between py-1 text-xs">
            <p className="font-bold text-center">Subtotales:</p>
            <p>(Exentas): {totalExentas.toFixed(2)}</p>
            <p>(5%): {totalIVA5.toFixed(2)}</p>
            <p>(10%): {totalIVA10.toFixed(2)}</p>
          </div>
          
          <div className="flex justify-between border-b border-l border-r border-black py-1 font-bold text-xs">
            <p>Total de la Operación:</p>
            <p>{monto}</p>
          </div>
          <div className="flex justify-between border-b border-l border-r border-black py-1 font-bold text-xs">
            <p>Total a Pagar:</p>
            <p>{monto}</p>
          </div>

          <div className="flex justify-between text-xs border-l border-r border-b border-black py-1">
            <p className="font-bold text-center">Liquidación del IVA:</p>
            <p>(5%): {totalIVA5Amount.toFixed(2)}</p>
            <p>(10%): {totalIVA10Amount.toFixed(2)}</p>
            <p>Total IVA: {(totalIVA5Amount + totalIVA10Amount).toFixed(2)}</p>
          </div>
        </div>

        <div className="border border-black p-2 flex justify-between items-center mt-2">
          <p className="text-xs">Original: Cliente</p>
          <p className="text-xs">Duplicado: Archivador</p>
        </div>
      </div>
    </div>
  );
};

export default PrintFacturaPage;
