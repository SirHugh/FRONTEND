// ArancelesPage.jsx
import React, { useEffect, useState } from "react";
import { getArancel, createArancel, updateArancel } from "../services/CajaService";
import ArancelModal from "../components/ArancelModal";
import { Button, Table } from "flowbite-react";

const ArancelesPage = () => {
  const [aranceles, setAranceles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingArancel, setEditingArancel] = useState(null);

  useEffect(() => {
    // Cargar aranceles al montar el componente
    loadAranceles();
  }, []);

  const loadAranceles = async () => {
    try {
      const res = await getArancel("", true, 1); // Obtener aranceles activos
      setAranceles(res.data.results);
    } catch (error) {
      console.error("Error al cargar aranceles:", error);
    }
  };

  const handleSaveArancel = async (formData) => {
    try {
      if (editingArancel) {
        await updateArancel(editingArancel.id_arancel, formData);
      } else {
        await createArancel(formData);
      }
      setShowModal(false);
      loadAranceles(); // Recargar la lista de aranceles después de guardar
    } catch (error) {
      console.error("Error al guardar el arancel:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingArancel(null);
  };

  const handleOpenModal = (arancel) => {
    setEditingArancel(arancel);
    setShowModal(true);
  };

  return (
    <div>
      <Button onClick={() => handleOpenModal(null)}>Agregar Arancel</Button>
      <Table>
        {/* Renderizar la lista de aranceles en una tabla */}
      </Table>
      {showModal && (
        <ArancelModal
          arancel={editingArancel}
          onSave={handleSaveArancel}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ArancelesPage;
