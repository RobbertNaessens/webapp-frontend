import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import * as typesApi from "../api/types";

//Context die alles in verband met types beheert
//Types ophalen, verwijderen, updaten, ...
//Het aanmaken en updaten van items wordt momenteel nog niet gebruikt, maar is wel
//al geschreven met het oog op mogelijk gebruik later

export const TypesContext = createContext();
export const useTypes = () => useContext(TypesContext);

export const TypesProvider = ({ children }) => {
  const [currentType, setCurrentType] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);

  const refreshTypes = useCallback(async () => {
    try {
      setError();
      setLoading(true);
      const data = await typesApi.getAllTypes();
      setTypes(data.data);
      return data.data;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (types?.length === 0) {
      refreshTypes();
    }
  }, [refreshTypes, types]);

  const createOrUpdateType = useCallback(
    async ({ id, title }) => {
      setError();
      setLoading(true);
      try {
        const changedType = await typesApi.saveType({
          id,
          title,
        });
        await refreshTypes();
        return changedType;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [refreshTypes]
  );
  const deleteType = useCallback(
    async (id) => {
      setLoading(true);
      setError();
      try {
        await typesApi.deleteType(id);
        refreshTypes();
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [refreshTypes]
  );

  const value = useMemo(
    () => ({
      currentType,
      setCurrentType,
      types,
      error,
      loading,
      deleteType,
      createOrUpdateType,
    }),
    [
      types,
      error,
      loading,
      setCurrentType,
      deleteType,
      currentType,
      createOrUpdateType,
    ]
  );

  return (
    <TypesContext.Provider value={value}>{children}</TypesContext.Provider>
  );
};
