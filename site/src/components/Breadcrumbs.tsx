import { useLocation, useNavigate } from "react-router-dom";

function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="absolute top-0 left-0 p-4 lg:flex items-center hidden">
      {pathnames.length > 0 ? (
        <>
          <div onClick={() => navigate("/")} className="text-cyber-secondary cursor-pointer">
            Home
          </div>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            return (
              <div key={to} className="mx-2 text-cyber-text">
                {">"}{" "}
                <div onClick={() => navigate(to)} className="inline text-cyber-secondary cursor-pointer">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
}

export default Breadcrumbs;
