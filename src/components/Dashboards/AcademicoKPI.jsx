import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { BsBoxArrowDown, BsBoxSeam, BsHouseAdd } from "react-icons/bs";
import BoxGridKpi from "./BoxGridKpi";
import {
  MdGroup,
  MdOutlineGroupOff,
  MdOutlineShoppingCartCheckout,
} from "react-icons/md";
import { TbBoxOff } from "react-icons/tb";
import { getAcademicoKpi } from "../../services/ReportsService";
import { PiStudent } from "react-icons/pi";
import { HiUserGroup } from "react-icons/hi2";
import {
  FaSchoolCircleCheck,
  FaSchoolCircleExclamation,
} from "react-icons/fa6";

function AcademicoKPI() {
  const allowedGroup = ["ADMIN", "ACADEMICO"];
  const { user } = useAuth();
  const [kpiValues, setKpiValue] = useState();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const bg_color = "bg-green-500";
  const color = "#F6F4EB";
  const size = 50;

  useEffect(() => {
    if (user?.groups?.find((group) => allowedGroup?.includes(group))) {
      setAllowed(true);
      getAcademicoKpi()
        .then((response) => {
          setKpiValue(response.data);
          console.log(response.data);
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
                title="Matriculados"
                icon={
                  <MdGroup
                    className={`${bg_color} p-1 text-white rounded-md`}
                    size={size}
                    color={color}
                  />
                }
                value={kpiValues?.total_matriculas}
              />
              <BoxGridKpi
                title="Desmatriculados"
                icon={
                  <MdOutlineGroupOff
                    className={`${bg_color} p-1 text-white rounded-md`}
                    size={size}
                    color={color}
                  />
                }
                value={kpiValues?.desmatriculados}
              />
              <BoxGridKpi
                title="Fundación"
                icon={
                  <FaSchoolCircleCheck
                    className={`${bg_color} p-1 text-white rounded-md`}
                    size={size}
                    color={color}
                  />
                }
                value={kpiValues?.interno_matriculas}
              />

              <BoxGridKpi
                title="Externo"
                icon={
                  <FaSchoolCircleExclamation
                    className={`${bg_color} p-1 text-white rounded-md`}
                    size={size}
                    color={color}
                  />
                }
                value={kpiValues?.externo_matriculas}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default AcademicoKPI;
