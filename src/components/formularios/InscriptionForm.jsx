import React, { useState } from 'react';
import AlumnoForm from './PersonalInfoForm';
import ResponsableForm from './ResponsableForm';
import AcademicoForm from './AcademicoForm';
import ResumenForm from './ResumenForm';

const InscripcionForm = () => {
  const [step, setStep] = useState(1);
  const [alumnoData, setAlumnoData] = useState(null);
  const [responsableData, setResponsableData] = useState(null);
  const [academicoData, setAcademicoData] = useState(null);

  const handleAlumnoSubmit = (data) => {
    setAlumnoData(data);
    setStep(step + 1);
  };

  const handleResponsableSubmit = (data) => {
    setResponsableData(data);
    setStep(step + 1);
  };

  const handleAcademicoSubmit = (data) => {
    setAcademicoData(data);
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="modal-container bg-white w-full max-w-[600px] mx-auto p-8 rounded-md shadow-xl z-50">
          <h2 className="text-2xl font-bold mb-6">Inscripción</h2>
          <div className="mb-8">
            <p className="mb-2 text-lg font-medium">Paso {step}: {step === 1 && 'Datos del alumno'}{step === 2 && 'Datos del responsable'}{step === 3 && 'Datos académicos'}{step === 4 && 'Resumen'}</p>
            {/* Aquí puedes agregar lógica para mostrar indicaciones de los pasos */}
          </div>
          {step === 1 && <AlumnoForm onSubmit={handleAlumnoSubmit} onClose={handleBack} />}
          {step === 2 && <ResponsableForm onSubmit={handleResponsableSubmit} onClose={handleBack} />}
          {step === 3 && <AcademicoForm onSubmit={handleAcademicoSubmit} onClose={handleBack} />}
          {step === 4 && <ResumenForm alumnoData={alumnoData} responsableData={responsableData} academicoData={academicoData} onClose={handleBack} />}
        </div>
      </div>
    </div>
  );
};

export default InscripcionForm;
