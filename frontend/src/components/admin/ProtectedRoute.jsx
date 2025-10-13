import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isAdminPath = location.pathname.startsWith("/admin");
        if (!user) {
            navigate("/login", { replace: true, state: { from: location } });
            return;
        }
        if (isAdminPath && user.role !== "recruiter") {
            navigate("/", { replace: true });
        }
    }, [user, location.pathname]);

    // During redirect, render nothing
    if (!user) return null;
    const isAdminPath = location.pathname.startsWith("/admin");
    if (isAdminPath && user.role !== "recruiter") return null;

    return <>{children}</>;
};
export default ProtectedRoute;