import Item from "./Item.jsx";
import { ItemsContext } from "../contexts/ItemsProvider.js";
import React, { useContext } from "react";

export default function ItemList() {
  //Displayt alle huidige items in stock
  //Enkel zichtbaar voor admins

  const { items, error, loading } = useContext(ItemsContext);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <pre className="text-red-600">{error.message}</pre>;
  if (!items) return null;
  return (
    <>
      {items.map((item) => {
        return <Item key={item.id} {...item} />;
      })}
    </>
  );
}
