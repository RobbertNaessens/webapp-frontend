import { axios } from ".";

export const getAllTypes = async () => {
  const { data } = await axios.get(`types`);
  return data;
};

export const saveType = async ({ id, title }) => {
  const { data } = await axios({
    method: id ? "put" : "post",
    url: `items/${id ?? ""}`,
    data: {
      title,
    },
  });
  return data;
};

export const deleteType = async (id) => {
  await axios.delete(`type/${id}`);
};
