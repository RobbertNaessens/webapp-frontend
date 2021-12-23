import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import * as ordersApi from "../api/orders";
import { useSession } from "./AuthProvider";

//Context die alles in verband met orders beheert
//Orders ophalen, verwijderen, updaten, ...

export const OrdersContext = createContext();
export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [itemsInOrder, setItemsInOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const { ready: authReady, user } = useSession();
  const [currentOrder, setCurrentOrder] = useState({});

  const refreshOrders = useCallback(async () => {
    try {
      setError();
      setLoading(true);
      const data = await ordersApi.getAllOrders();
      setAllOrders(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderWithId = useCallback(async (id) => {
    try {
      setError();
      setLoading(true);
      const data = await ordersApi.getOrderById(id);
      return data.data;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderWithUserId = useCallback(async (id) => {
    try {
      setError();
      setLoading(true);
      const data = await ordersApi.getOrderByUserId(id);
      setItemsInOrder(data[0].items);
      setCurrentOrder(data[0]);
      return data[0];
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrUpdateOrder = useCallback(async ({ id, userId, items }) => {
    setError();
    setLoading(true);
    try {
      const changedOrder = await ordersApi.saveOrder({
        id,
        userId,
        items,
      });
      return changedOrder;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (id) => {
    try {
      setError();
      setLoading(true);
      await ordersApi.deleteOrder(id);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && authReady && itemsInOrder?.length === 0) {
      refreshOrders();
      getOrderWithUserId(user.id);
    }
  }, [user, authReady, itemsInOrder, getOrderWithUserId, refreshOrders]);

  const setOrderToUpdate = useCallback(
    (id) => {
      setCurrentOrder(id === null ? {} : allOrders.find((t) => t.id === id));
    },
    [allOrders, setCurrentOrder]
  );

  const value = useMemo(
    () => ({
      allOrders,
      itemsInOrder,
      error,
      loading,
      currentOrder,
      createOrUpdateOrder,
      deleteOrder,
      setOrderToUpdate,
      getOrderWithUserId,
      getOrderWithId,
    }),
    [
      allOrders,
      itemsInOrder,
      error,
      loading,
      currentOrder,
      createOrUpdateOrder,
      deleteOrder,
      setOrderToUpdate,
      getOrderWithUserId,
      getOrderWithId,
    ]
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
};
