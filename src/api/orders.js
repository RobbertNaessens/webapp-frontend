import { axios } from ".";

export const getAllOrders = async () => {
  const { data } = await axios.get(`orders`);
  return data;
};

export const saveOrder = async ({ id, userId, items }) => {
  const { data } = await axios({
    method: id ? "put" : "post",
    url: `orders/${id ?? ""}`,
    data: {
      userId,
      items,
    },
  });
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await axios.get(`orders/${id}`);
  return data;
};

export const getOrderByUserId = async (id) => {
  const { data } = await axios.get(`orders/user/${id}`);
  return data;
};

export const deleteOrder = async (id) => {
  await axios.delete(`orders/${id}`);
};
