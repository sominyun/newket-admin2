import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../src/auth/AuthContext";

export function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminName, isLoggedIn, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Navbar fluid className="bg-gray-50">
      <NavbarBrand href="/">
        <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-900">
          Newket Admin
        </span>
      </NavbarBrand>
      <div className="flex items-center gap-3 md:order-2">
        {isLoggedIn ? (
          <>
            <span className="hidden text-sm text-gray-700 sm:inline">
              {adminName}
            </span>
            <Button color="alternative" size="sm" onClick={handleLogout}>
              로그아웃
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={() => navigate("/login")}>
            로그인
          </Button>
        )}
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="/" active={location.pathname === "/"}>
          Ticket DB
        </NavbarLink>
        <NavbarLink href="/artist" active={location.pathname === "/artist"}>
          Artist DB
        </NavbarLink>
        <NavbarLink href="/place" active={location.pathname === "/place"}>
          Place DB
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
