import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { setSingleCompany } from "@/redux/companySlice";

const useGetCompanyById = (id) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const run = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, { withCredentials: true });
        if (res.data.success) dispatch(setSingleCompany(res.data.company));
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [id, dispatch]);
};

export default useGetCompanyById;
