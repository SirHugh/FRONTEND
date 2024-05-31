import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ProductosTab from "../components/Tabs/ProductosTab";
import ArancelesTab from "../components/Tabs/ArancelesTab";
import ActividadesTab from "../components/Tabs/ActividadesTab";

const ProductosPage = () => {
  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-6">
      <Tabs>
        <TabList>
          <Tab>Productos</Tab>
          <Tab>Aranceles</Tab>
          <Tab>Actividades</Tab>
        </TabList>

        <TabPanel>
          <ProductosTab />
        </TabPanel>

        <TabPanel>
          <ArancelesTab />
        </TabPanel>

        <TabPanel>
          <ActividadesTab />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ProductosPage;
