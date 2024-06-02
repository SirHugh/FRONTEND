import { useEffect, useRef, useState } from "react";
import { getBasicInfo, updateBasicInfo } from "../services/BasicsService";
import { baseURL } from "../services/ApiClient";
import { Button, Label, TextInput } from "flowbite-react";
import { GrFormEdit, GrFormLock } from "react-icons/gr";
import toast from "react-hot-toast";

function BasicsInfoPage() {
  const [organization, setOrganization] = useState();
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const inputRef = useRef(null);

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
  }, [reload]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrganization({ ...organization, [name]: value });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setOrganization({ ...organization, [name]: files[0] });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setEdit(!edit);
    inputRef.current.focus();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const orgFormData = new FormData();

      for (var key in organization) {
        if (key == "logo") {
          if (organization[key] instanceof File) {
            orgFormData.append(key, organization[key]);
          }
        } else {
          orgFormData.append(key, organization[key] ? organization[key] : "");
        }
      }
      console.log("formdata: ", [...orgFormData]);
      const res = await updateBasicInfo(orgFormData);
      console.log(res.data);
      toast.success("Informacion Actualizada");
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar la organización");
    }
    setEdit(false);
    setReload(!reload);
  };

  return (
    <div className="flex p-6">
      {!loading && (
        <div className="flex p-3 rounded-md bg-slate-200 border-2 border-blue-100">
          <div className="text-center">
            <img
              src={
                organization.logo instanceof File
                  ? URL.createObjectURL(organization.logo)
                  : baseURL + organization.logo
              }
              className="avatar rounded-full border-4 border-white mx-auto h-52 w-52 object-cover"
              alt="Logo"
            />
            <h6 className="mt-4">Subir un logo</h6>
            <input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e)}
              // ref={hiddenFileInput}
              // style={{ display: "none" }}
              disabled={!edit}
            />
          </div>
          <form
            className="flex flex-col p-3 gap-y-4"
            onSubmit={edit ? onSubmit : handleEdit}
          >
            <Label className="flex flex-row items-center gap-5 justify-end">
              Nombre
              <TextInput
                ref={inputRef}
                id="nombre"
                value={organization.nombre}
                onChange={(e) => handleChange(e)}
                readOnly={!edit}
                type="text"
                name="nombre"
                placeholder="nombre"
                rightIcon={edit ? GrFormEdit : GrFormLock}
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
                rightIcon={edit ? GrFormEdit : GrFormLock}
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
                rightIcon={edit ? GrFormEdit : GrFormLock}
              />
            </Label>
            <Label className="flex flex-row items-center gap-5 justify-end">
              Telefono
              <TextInput
                type="tel"
                pattern="[0-9]{4}-[0-8]{6}"
                name="telefono"
                value={organization.telefono}
                onChange={(e) => handleChange(e)}
                readOnly={!edit}
                placeholder="0000-999999"
                rightIcon={edit ? GrFormEdit : GrFormLock}
              />
            </Label>
            <Label className="flex flex-row items-center gap-5 justify-end">
              Email
              <TextInput
                value={organization.email}
                onChange={(e) => handleChange(e)}
                readOnly={!edit}
                type="email"
                name="email"
                placeholder="RUC"
                rightIcon={edit ? GrFormEdit : GrFormLock}
                required
              />
            </Label>
            <Label className="flex flex-row items-center gap-5 justify-end">
              Web
              <TextInput
                value={organization.website}
                onChange={(e) => handleChange(e)}
                readOnly={!edit}
                type="text"
                name="website"
                rightIcon={edit ? GrFormEdit : GrFormLock}
              />
            </Label>
            <Button type="submit">{edit ? "Guardar" : "Actualizar"}</Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default BasicsInfoPage;
