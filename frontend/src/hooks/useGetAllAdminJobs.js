import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAdminJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
        if (res.data.success) dispatch(setAdminJobs(res.data.jobs || []));
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [dispatch]);
};

export default useGetAllAdminJobs;
