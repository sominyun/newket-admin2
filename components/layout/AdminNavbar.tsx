import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";

export function AdminNavbar() {
  return (
    <Navbar fluid className="bg-gray-50">
      <NavbarBrand href="/">
        <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-900">
          Newket Admin
        </span>
      </NavbarBrand>
      <NavbarToggle />
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
