import {
  Button,
  ButtonGroup, Kbd,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle, Pagination,
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import {useState} from "react";

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="min-h-screen">
      <Navbar fluid className="bg-gray-50">
        <NavbarBrand href="/">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-900">
            Newket Admin
          </span>
        </NavbarBrand>
        <NavbarToggle />
        <NavbarCollapse>
          <NavbarLink href="#" active>
            Ticket DB
          </NavbarLink>
          <NavbarLink href="#">Artist DB</NavbarLink>
          <NavbarLink href="#">Place DB</NavbarLink>
        </NavbarCollapse>
      </Navbar>

      <div className="flex">
        <Sidebar className="h-[calc(100vh-65px)]">
          <SidebarItems>
            <SidebarItemGroup>
              <SidebarItem href="#">콘서트/팬미팅</SidebarItem>
              <SidebarItem href="#">페스티벌</SidebarItem>
              <SidebarItem href="#">뮤지컬</SidebarItem>
            </SidebarItemGroup>
          </SidebarItems>
        </Sidebar>

        <main className="flex-1 p-8">
          <div className="space-y-6">
            <ButtonGroup>
              <Button color="alternative">오픈 예정 티켓</Button>
              <Button color="alternative">예매 중인 티켓</Button>
              <Button color="alternative">예매 완료 티켓</Button>
            </ButtonGroup>

            <TextInput
              id="email4"
              icon={HiOutlineSearch}
              placeholder="공연명을 입력하세요"
              required
            />

            <Button>
              <HiPlus className="mr-2 h-5 w-5" />
              티켓추가
            </Button>

            <div className="overflow-x-auto">
              <Table hoverable>
                <TableHead>
                  <TableHeadCell>id</TableHeadCell>
                  <TableHeadCell>공연명</TableHeadCell>
                  <TableHeadCell>오픈일시</TableHeadCell>
                  <TableHeadCell>아티스트</TableHeadCell>
                  <TableHeadCell>공연 일시</TableHeadCell>
                  <TableHeadCell>공연 장소</TableHeadCell>
                  <TableHeadCell>티켓 가격</TableHeadCell>
                  <TableHeadCell>삭제</TableHeadCell>
                  <TableHeadCell>
                    <span className="sr-only">Edit</span>
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      1
                    </TableCell>
                    <TableCell>QWER 2nd TOUR ROCKATION : ROCKET LAUNCH!!</TableCell>
                    <TableCell><Kbd>선예매: 2026.08.12 (수) 20:00 (MELON)</Kbd><Kbd>일반예매: 2026.08.13 (목) 20:00 (MELON)</Kbd></TableCell>
                    <TableCell><Kbd>QWER</Kbd></TableCell>
                    <TableCell><Kbd>2026.09.12(토) 17:00:00</Kbd><Kbd>2026.09.13(일) 16:00:00</Kbd></TableCell>
                    <TableCell>고려대학교 화정체육관</TableCell>
                    <TableCell><Kbd>전석:154,000원</Kbd></TableCell>
                    <TableCell>
                      <a
                        href="#"
                        className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                      >
                        Edit
                      </a>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="flex overflow-x-auto sm:justify-center">
              <Pagination currentPage={currentPage} totalPages={100} onPageChange={onPageChange} showIcons />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
