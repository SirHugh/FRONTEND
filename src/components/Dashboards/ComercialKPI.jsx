import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { BsBoxArrowDown, BsBoxSeam } from "react-icons/bs";
import BoxGridKpi from "./BoxGridKpi";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { TbBoxOff } from "react-icons/tb";
import { getComercialKpi } from "../../services/ReportsService";

function ComercialKPI() {
  const allowedGroup = "ADMIN";
  const { user } = useAuth();
  const [kpiValues, setKpiValue] = useState();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const bg_color = "bg-cyan-600";
  const color = "#F6F4EB";
  const size = 50;

  useEffect(() => {
    if (user?.groups?.find((group) => allowedGroup?.includes(group))) {
      setAllowed(true);
      getComercialKpi()
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
                title="Productos"
                icon={
                  <BsBoxSeam
                    className={`${bg_color} p-1 text-white rounded-md`}
                    size={size}
                    color={color}
                  />
                }
                value={kpiValues?.active_products}
              />
              <BoxGridKpi
                title="Bajo Stock"
                icon={
                  <BsBoxArrowDown
                    className={`${bg_color} p-1 text-white rounded-md`}
                    size={size}
                    color={color}
                  />
                }
                value={kpiValues?.low_stock}
              />
              <BoxGridKpi
                title="Agotados"
                icon={
                  <TbBoxOff
                    className={`${bg_color} p-1 text-white rounded-md`}
                    size={size}
                    color={color}
                  />
                }
                value={kpiValues?.out_of_stock}
              />

              <BoxGridKpi
                title="Vendidos"
                icon={
                  <MdOutlineShoppingCartCheckout
                    className={`${bg_color} p-1 text-white rounded-md`}
                    size={size}
                    color={color}
                  />
                }
                value={kpiValues?.total_sold}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default ComercialKPI;
