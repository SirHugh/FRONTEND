import { useEffect, useState } from "react";
import { getBasicInfo } from "../services/BasicsService";
import { baseURL } from "../services/ApiClient";
import { Button, Label, TextInput } from "flowbite-react";

function BasicsInfoPage() {
  const [organization, setOrganization] = useState();
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBasicInfo();
        setOrganization(res.data);
        setLoading(false);
        console.log(res.data);
      } catch (error) {
        console.error("Error al cargar la organización:", error);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {};

  const handleEdit = () => {
    setEdit(!edit);
  };

  return (
    <div className="flex p-6">
      {!loading && (
        <div className="flex p-3 rounded-md bg-slate-200 border-2 border-blue-100">
          <div className="text-center">
            <img
              src={baseURL + organization.logo}
              className="avatar rounded-full border-4 border-white mx-auto h-52 w-52 object-cover"
              alt="Logo"
            />
            <h6 className="mt-4">Subir un logo diferente</h6>
            <input type="file" disabled={!edit} />
          </div>
          <div className="flex flex-col p-3 gap-y-4">
            <Label className="flex flex-row items-center gap-5 justify-end">
              Nombre
              <TextInput
                value={organization.nombre}
                onChange={(e) => handleChange(e)}
                readOnly={!edit}
                type="text"
                name="ruc"
                placeholder="nombre"
              />
            </Label>
            <Label className="flex flex-row items-center gap-5 justify-end">
              Ruc
              <TextInput
                value={organization.ruc}
                onChange={(e) => handleChange(e)}
                readOnly={!edit}
                type="text"
                name="ruc"
                placeholder="RUC"
              />
            </Label>
            <Label className="flex flex-row items-center gap-5 justify-end">
              Dirección
              <TextInput
                value={organization.direccion}
                onChange={(e) => handleChange(e)}
                readOnly={!edit}
                type="text"
                name="direccion"
                placeholder="RUC"
              />
            </Label>
            <Label className="flex flex-row items-center gap-5 justify-end">
              Telefono
              <TextInput
                value={organization.telefono}
                onChange={(e) => handleChange(e)}
                readOnly={!edit}
                type="text"
                name="telefono"
                placeholder="RUC"
              />
            </Label>
            <Label className="flex flex-row items-center gap-5 justify-end">
              Email
              <TextInput
                value={organization.email}
                onChange={(e) => handleChange(e)}
                readOnly={!edit}
                type="text"
                name="email"
                placeholder="RUC"
              />
            </Label>
            <Label className="flex flex-row items-center gap-5 justify-end">
              Web
              <TextInput
                value={organization.web}
                onChange={(e) => handleChange(e)}
                readOnly={!edit}
                type="text"
                name="web"
              />
            </Label>
            <Button onClick={handleEdit}>
              {edit ? "Guardar" : "Actualizar"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BasicsInfoPage;
