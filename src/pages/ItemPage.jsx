import { ItemsContext } from "../contexts/ItemsProvider";
import Item from "../components/Item";
import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

//Toont alle items van een bepaald type, bv alle sleutelhangers

export default function ItemPage() {
  const { getItemsOfType, loading, error } = useContext(ItemsContext);
  const { pathname } = useLocation();
  const [items, setItems] = useState([]);

  const getItems = useCallback(async () => {
    try {
      const data = await getItemsOfType(pathname.substring(1));
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  }, [getItemsOfType, pathname, setItems]);

  useEffect(() => {
    getItems();
  }, [getItems]);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <pre className="text-red-600">{error.message}</pre>;
  if (!items) return null;
  if (items.length === 0) return <h1>Momenteel niets in stock</h1>;

  return (
    <>
      <br />
      <div className="grid grid-cols-4">
        {items.map((item) => {
          return <Item key={item.id} {...item} />;
        })}
      </div>
    </>
  );
}
