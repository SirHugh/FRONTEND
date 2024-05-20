import React, { useState } from "react";

function CajaPage() {
  const [productoSearch, setProductoSearch] = useState("");
  const [arancelSearch, setArancelSearch] = useState("");

  const productos = [
    "Producto 1 - Tipo A", "Producto 2 - Tipo B", "Producto 3 - Tipo C", "Producto 4 - Tipo D",
    "Producto 5 - Tipo E", "Producto 6 - Tipo F", "Producto 7 - Tipo G", "Producto 8 - Tipo H",
    "Producto 9 - Tipo I", "Producto 10 - Tipo J", "Producto 11 - Tipo K", "Producto 12 - Tipo L",
    "Producto 13 - Tipo M", "Producto 14 - Tipo N", "Producto 15 - Tipo O",
  ];

  const arancelesACobrar = [
    "Cliente 1 - Arancel 1 - $100", "Cliente 2 - Arancel 2 - $200", "Cliente 3 - Arancel 3 - $300",
    "Cliente 4 - Arancel 4 - $400", "Cliente 5 - Arancel 5 - $500", "Cliente 6 - Arancel 6 - $600",
    "Cliente 7 - Arancel 7 - $700", "Cliente 8 - Arancel 8 - $800", "Cliente 9 - Arancel 9 - $900",
    "Cliente 10 - Arancel 10 - $1000", "Cliente 11 - Arancel 11 - $1100", "Cliente 12 - Arancel 12 - $1200",
    "Cliente 13 - Arancel 13 - $1300", "Cliente 14 - Arancel 14 - $1400", "Cliente 15 - Arancel 15 - $1500",
  ];

  const arancelesCobrados = [
    "Cliente 16 - Arancel 16 - $1600", "Cliente 17 - Arancel 17 - $1700", "Cliente 18 - Arancel 18 - $1800",
    "Cliente 19 - Arancel 19 - $1900", "Cliente 20 - Arancel 20 - $2000", "Cliente 21 - Arancel 21 - $2100",
    "Cliente 22 - Arancel 22 - $2200", "Cliente 23 - Arancel 23 - $2300", "Cliente 24 - Arancel 24 - $2400",
    "Cliente 25 - Arancel 25 - $2500", "Cliente 26 - Arancel 26 - $2600", "Cliente 27 - Arancel 27 - $2700",
    "Cliente 28 - Arancel 28 - $2800", "Cliente 29 - Arancel 29 - $2900", "Cliente 30 - Arancel 30 - $3000",
  ];

  const filteredProductos = productos.filter((producto) =>
    producto.toLowerCase().includes(productoSearch.toLowerCase())
  );

  const filteredArancelesACobrar = arancelesACobrar.filter((arancel) =>
    arancel.toLowerCase().includes(arancelSearch.toLowerCase())
  );

  const filteredArancelesCobrados = arancelesCobrados.filter((arancel) =>
    arancel.toLowerCase().includes(arancelSearch.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Caja Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta de Productos */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Productos</h2>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={productoSearch}
            onChange={(e) => setProductoSearch(e.target.value)}
            className="border p-2 mb-4 w-full"
          />
          <ul className="space-y-3 h-64 overflow-y-scroll">
            {filteredProductos.map((producto, index) => (
              <li key={index} className="border-b p-2">
                {producto}
              </li>
            ))}
          </ul>
        </div>

        {/* Tarjeta de Aranceles */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Aranceles</h2>
          <input
            type="text"
            placeholder="Buscar aranceles..."
            value={arancelSearch}
            onChange={(e) => setArancelSearch(e.target.value)}
            className="border p-2 mb-4 w-full"
          />
          <div className="mb-4">
            <h3 className="font-semibold mb-2">A cobrar</h3>
            <ul className="space-y-3 h-32 overflow-y-scroll">
              {filteredArancelesACobrar.map((arancel, index) => (
                <li key={index} className="border-b p-2">
                  {arancel}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Ya cobrados</h3>
            <ul className="space-y-3 h-32 overflow-y-scroll">
              {filteredArancelesCobrados.map((arancel, index) => (
                <li key={index} className="border-b p-2">
                  {arancel}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CajaPage;
