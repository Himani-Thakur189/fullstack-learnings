import { useCallback, useEffect, useRef, useState } from "react";

// abort controller implemented to avoid race condition
// Retry mechanism
// retry with exponential backoff
// Cleanup
// Custom hook abstraction
// Error resilience

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const constrollerRef = useRef(null);
  let retries = 0;

  const fetchData = useCallback(async () => {
    console.log("hererer in the catch");
    if (constrollerRef.current) {
      console.log("aborting previous fetch");
      constrollerRef.current.abort();
    }

    const controller = new AbortController();
    constrollerRef.current = controller;

    setLoading(true);
    try {
      const data = await fetch(url, {
        signal: controller.signal,
      });
      console.log("datata", data, data.status);
      if (!data.ok) {
        throw new Error({
          message: "Error encountered",
          status: data.status,
        });
      }
      const values = await data.json();

      setData(values);
      setLoading(false);
      setError();
    } catch (err) {
      console.log("error", err);

      if (err.name === "AbortError") {
        console.log("Fetch aborted");
        return;
      }
      if (err.status === 500) {
        if (retries <= 3) {
          await new Promise((resolve) => setTimeout(resolve, retries * 1000)); // exponential backoff
          retries++;
          console.log(`Retrying fetch... Attempt ${retries}`);
          fetchData();
          return;
        }
      }
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, retries]);

  useEffect(() => {
    return () => {
      if (constrollerRef.current) {
        constrollerRef.current.abort();
      }
    };
  }, []);

  return { data, loading, error, fetchData };
};

export default useFetch;
