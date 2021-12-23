import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import * as itemsApi from "../api/items";
import { useSession } from "./AuthProvider";

//Context die alles in verband met items beheert
//Items ophalen, verwijderen, updaten, ...

export const ItemsContext = createContext();
export const useItems = () => useContext(ItemsContext);

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [currentItem, setCurrentItem] = useState({});
  const { ready: authReady } = useSession();

  const refreshItems = useCallback(async () => {
    try {
      setError();
      setLoading(true);
      const data = await itemsApi.getAllItems();
      setItems(data.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getItemsOfType = useCallback(async (pad) => {
    try {
      setError();
      setLoading(true);
      const data = await itemsApi.getAllItemsOfType(pad);
      return data.data;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getItemWithId = useCallback(async (id) => {
    try {
      setError();
      setLoading(true);
      const data = await itemsApi.getItemWithId(id);
      return data.data;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authReady && items?.length === 0) {
      refreshItems();
    }
  }, [authReady, items, refreshItems]);

  const createOrUpdateItem = useCallback(
    async ({ id, title, imagesrc, typeId, description, price }) => {
      setError();
      setLoading(true);
      try {
        const changedItem = await itemsApi.saveItem({
          id,
          title,
          imagesrc,
          typeId,
          description,
          price,
        });
        await refreshItems();
        return changedItem;
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [refreshItems]
  );

  const deleteItem = useCallback(
    async (id) => {
      try {
        setError();
        setLoading(true);
        await itemsApi.deleteItem(id);
        refreshItems();
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [refreshItems]
  );

  const setItemToUpdate = useCallback(
    (id) => {
      setCurrentItem(id === null ? {} : items.find((t) => t.id === id));
    },
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      error,
      loading,
      currentItem,
      createOrUpdateItem,
      deleteItem,
      setItemToUpdate,
      getItemsOfType,
      getItemWithId,
    }),
    [
      items,
      error,
      loading,
      currentItem,
      createOrUpdateItem,
      deleteItem,
      setItemToUpdate,
      getItemsOfType,
      getItemWithId,
    ]
  );

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};
