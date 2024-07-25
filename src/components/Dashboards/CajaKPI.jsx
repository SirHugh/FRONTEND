import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import BoxGridKpi from "./BoxGridKpi";
import { TbFileInvoice } from "react-icons/tb";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { getCajaKpi } from "../../services/ReportsService";

function CajaKPI() {
  const allowedGroup = ["ADMIN", "CAJA"];
  const { user } = useAuth();
  const [kpiValues, setKpiValue] = useState();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const bg_color = "bg-orange-500";
  const color = "#F6F4EB";
  const size = 50;

  useEffect(() => {
    if (user?.groups?.find((group) => allowedGroup?.includes(group))) {
      setAllowed(true);
      getCajaKpi()
        .then((response) => {
          setKpiValue(response.data);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  return (
    <>
      {allowed && (
        <div className="flex flex-row gap-10">
          {!loading && (
            <>
              <BoxGridKpi
                title="Facturas"
                icon={
                  <TbFileInvoice
                    className={`${bg_color} p-1 text-white rounded-md`}
                    size={size}
                    color={color}
                  />
                }
                value={kpiValues?.total_comprobantes}
              />
              <BoxGridKpi
                title="Efectivo"
                icon={
                  <LiaFileInvoiceDollarSolid
                    className={`${bg_color} p-1 text-white rounded-md`}
                    size={size}
                    color={color}
                  />
                }
                value={kpiValues?.cantidad_Efectivo}
              />
              <BoxGridKpi
                title="Otros"
                icon={
                  <FaMoneyBillTransfer
                    className={`${bg_color} p-1 text-white rounded-md`}
                    size={size}
                    color={color}
                  />
                }
                value={
                  kpiValues?.cantidad_POS +
                  kpiValues?.cantidad_Cheque +
                  kpiValues?.cantidad_Targeta +
                  kpiValues?.cantidad_Transferencia
                }
              />
              <BoxGridKpi
                title="Efectivo"
                icon={
                  <LiaFileInvoiceDollarSolid
                    className={`${bg_color} p-1 text-white rounded-md`}
                    size={size}
                    color={color}
                  />
                }
                value={kpiValues?.cantidad_Efectivo}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default CajaKPI;
