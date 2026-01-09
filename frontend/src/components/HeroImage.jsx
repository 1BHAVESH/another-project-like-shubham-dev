import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import {
  useGetDataQuery,
  useGetGeneralSettingQueryQuery,
} from "@/redux/features/adminApi";
import { Menu } from "lucide-react";
import { useState } from "react";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Link, Links, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import EnquiryDialog from "./EnquiryDialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";

// const BASE_URL = "http://localhost:3001";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function HeroImage({ visible, setVisible }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: GetData, isLoading: getDataLoading } = useGetDataQuery({
    url: "/banners",
  });
  const {data: compniesData, isLoading: compnyNmaeLoading} = useGetDataQuery({
      url: "/company/get-title",
    
  })
  const {
    data: genralData,
    isSuccess: genralDataIsSuccess,
    isLoading: genralDataIsLoading,
  } = useGetGeneralSettingQueryQuery();

  // const banners = bannersData?.data || [];

  if (getDataLoading || compnyNmaeLoading) {
    return (
      <section className="w-full h-[270px] lg:h-[501px] bg-gray-200 animate-pulse" />
    );
  }

  console.log(genralData);

  console.log("getData", GetData);

  const banners = GetData?.data || [];

  if (banners.length === 0) return null;

  console.log("company name = ", compniesData);

  const companyName = compniesData?.data

  console.log("//////////", companyName);
  

  return (
    <section className="w-full  relative">
      {/* Navigation overlay */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto  px-5 py-4 ">
          <div className="flex items-center justify-between lg:justify-between w-full md:max-w-[1370px]">
            {/* LEFT SIDE - Desktop Navigation */}
            <div className="hidden cursor-pointer lg:flex items-center gap-6 ">
              {/* ABOUT - ShadCN Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-white cursor-pointer hover:opacity-80 text-sm lg:text-base bg-transparent">
                      About
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white rounded-md shadow-lg p-4 min-w-[250px]">
                      <ul className="flex flex-col gap-2">
                        <li>
                          <NavigationMenuLink
                            href="/about-shubham-developer"
                            className="block px-3 py-2 hover:bg-gray-100 rounded text-black"
                          >
                            About Shubham Developers
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink
                            href="/our-team"
                            className="block px-3 py-2 hover:bg-gray-100 rounded text-black"
                          >
                            Our Founder
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* CONTACT - Simple link */}
              <div className="relative group inline-block">
                {/* Trigger */}
                <button className="flex items-center gap-1 cursor-pointer text-white text-sm lg:text-base font-medium hover:opacity-80 transition-opacity">
                  <span>Companies</span>

                  <svg
                    className="w-3 h-4 transition-transform duration-200 group-hover:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 9-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                {
                  companyName.length > 0 && (
                    <div className="absolute left-0 top-full mt-2 w-44 hidden group-hover:block bg-white border rounded-lg shadow-lg z-50">
                 { companyName.map((company) => (
                  <ul className="p-1 text-sm text-black">
                    <li>
                      <Link
                        to={`/company/${company._id}`}
                        className="block px-3 py-1 rounded border-b-2 "
                      >
                        {company.name}
                      </Link>
                    </li>
                    
                    
                  </ul>
                 ))}
                </div>
                  )
                }
              </div>

              <Link
                to="/contact"
                className="group inline-flex items-center gap-1 text-white text-sm lg:text-base font-medium transition-all duration-200 hover:text-zinc-300"
              >
                <span>Contact</span>
              </Link>

              <Link
                to="/projects"
                className="text-white text-sm lg:text-base font-medium hover:opacity-80 transition-opacity"
              >
                Projects
              </Link>
            </div>

            {/* CENTER - LOGO   src={`${API_URL}/${genralData?.data?.logo}`} */}
            <div className="flex-1 flex justify-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
              <Link to="/" className="text-white text-xl lg:text-2xl font-bold">
                <img
                  src={`${API_URL}/${genralData?.data?.logo}`}
                  alt="Shubham Developer Logo"
                  className="w-[120px] sm:w-[150px] lg:w-[200px] mt-2 lg:mt-8"
                />
              </Link>
            </div>

            {/* RIGHT SIDE - Desktop Navigation & Mobile Menu Button */}
            <div className="flex items-center gap-6 lg:gap-8">
              {/* Desktop Navigation */}
              <ul className="hidden lg:flex gap-6 lg:gap-8">
                <li>
                  <Link
                    to="/media"
                    className="text-white text-sm lg:text-base font-medium hover:opacity-80 transition-opacity"
                  >
                    Media
                  </Link>
                </li>
                <li>
                  <Link
                    to="/join-venture"
                    className="text-white text-sm lg:text-base font-medium hover:opacity-80 transition-opacity"
                  >
                    Join Venture
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-white text-sm lg:text-base font-medium hover:opacity-80 transition-opacity"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-white text-sm lg:text-base font-medium hover:opacity-80 transition-opacity cursor-pointer">
                        Enquiry
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle className="hidden"></DialogTitle>
                      <DialogDescription className="hidden"></DialogDescription>
                      <EnquiryDialog />
                    </DialogContent>
                  </Dialog>
                </li>
              </ul>

              {/* Mobile Menu Button */}
              <Sheet
                open={mobileMenuOpen}
                onOpenChange={(open) => {
                  setMobileMenuOpen(open);
                  setVisible(!open);
                }}
              >
                <SheetTrigger asChild>
                  <button
                    className="lg:hidden text-white z-20"
                    aria-label="Toggle menu"
                  >
                    <Menu size={24} />
                  </button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="bg-white w-[280px] h-[520px]"
                >
                  <SheetTitle className="hidden"></SheetTitle>
                  <SheetHeader className="p-2 mr-[190px] h-[0px]">
                    <img
                      src="/logo.png"
                      alt="menu"
                      className="h-12 w-auto object-contain"
                    />
                    <SheetDescription className="hidden"></SheetDescription>
                  </SheetHeader>

                  {/* Mobile Menu Items */}
                  <ul className="flex flex-col gap-1 text-gray-700 mt-4">
                    <li
                      className="pl-4 py-3 hover:bg-gray-50 hover:text-[#d4af37] transition-colors cursor-pointer"
                      onClick={() => {
                        navigate("/");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Link to="/">Home</Link>
                    </li>
                    <Separator />

                    {/* About Section in Mobile */}
                    <li className="border-b border-gray-200 pb-2">
                      <div className="pl-4 py-3 font-semibold text-gray-700">
                        About us
                      </div>
                      <ul className="pl-8 space-y-2">
                        <li>
                          <Link
                            to="/about-shubham-developer"
                            className="block py-2 hover:text-[#d4af37] transition-colors"
                            onClick={() => {
                              navigate("/about-shubham-developer");
                              setMobileMenuOpen(false);
                            }}
                          >
                            About Shubham Developers
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/our-team"
                            className="block py-2 hover:text-[#d4af37] transition-colors"
                            onClick={() => {
                              navigate("/our-team");
                              setMobileMenuOpen(false);
                            }}
                          >
                            Our Founder
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li
                      className="pl-4 py-3 hover:bg-gray-50 hover:text-[#d4af37] transition-colors cursor-pointer"
                      onClick={() => {
                        navigate("/projects");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Link to="/projects">Projects</Link>
                    </li>
                    <Separator />

                    <li
                      className="pl-4 py-3 hover:bg-gray-50 hover:text-[#d4af37] transition-colors cursor-pointer"
                      onClick={() => {
                        navigate("/join-venture");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Link to="/join-venture">Join Venture</Link>
                    </li>
                    <Separator />

                    <li
                      className="pl-4 py-3 hover:bg-gray-50 hover:text-[#d4af37] transition-colors cursor-pointer"
                      onClick={() => {
                        navigate("/contact");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Link to="/contact">Contact us</Link>
                    </li>
                    <Separator />
                  </ul>

                  {/* Mobile Enquiry Button */}
                  <div className="mt-6 px-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="w-full bg-black text-[#d4af37] px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-900 transition-colors">
                          Enquiry
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle className="hidden"></DialogTitle>
                        <DialogDescription className="hidden"></DialogDescription>
                        <EnquiryDialog />
                      </DialogContent>
                    </Dialog>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Banner Swiper With Dark Overlay */}
      <section className="w-full relative">
        {/* NAVBAR */}
        <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
          {/* navbar content */}
        </nav>

        {/* HERO */}
        <div className="relative w-full h-[270px] sm:h-[350px] md:h-[400px] lg:h-[700px] overflow-hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            loop={banners.length > 1}
            className="w-full h-full relative z-0"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner._id}>
                <img
                  src={`${API_URL}${banner.imageUrl}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* FIGMA EXACT GRADIENT */}
          <div className="absolute h-[35%] inset-0 z-10 pointer-events-none hero-gradient"></div>
        </div>
      </section>
    </section>
  );
}
