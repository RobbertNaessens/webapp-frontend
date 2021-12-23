import { axios } from ".";

export const getAllItems = async () => {
  const { data } = await axios.get(`items`);
  return data;
};

export const getAllItemsOfType = async (pad) => {
  const { data } = await axios.get(`${pad}`);
  return data;
};

export const getItemWithId = async (id) => {
  const { data } = await axios.get(`items/${id}`);
  return data;
};

export const saveItem = async ({
  id,
  title,
  imagesrc,
  typeId,
  description,
  price,
}) => {
  const { data } = await axios({
    method: id ? "put" : "post",
    url: `items/${id ?? ""}`,
    data: {
      title,
      imagesrc,
      typeId,
      description,
      price,
    },
  });
  return data;
};

export const deleteItem = async (id) => {
  await axios.delete(`items/${id}`);
};
