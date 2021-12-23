import axios from "axios";
import { useState, useEffect, useCallback } from "react";

export function useFetch(uri) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const fetchData = useCallback(async (uri) => {
    try {
      setError();
      setLoading(true);
      const { data } = await axios.get(uri);
      setData(data.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(uri);
  }, [uri, fetchData]);

  return { loading, data, error };
}
