import { Phone, Mail, Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faSquareInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Separator } from "./ui/separator";
import { Link, useNavigate, useLocation } from "react-router-dom";
import EnquiryDialog from "./EnquiryDialog";
import React, { useState, useEffect } from "react";
import { useGetGeneralSettingQueryQuery } from "@/redux/features/adminApi";

export default function Header() {
  const { data: genralData } = useGetGeneralSettingQueryQuery();

  const navigate = useNavigate();
  const location = useLocation();

  const [showHeader, setShowHeader] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  const getActiveNav = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/projects") return "projects";
    if (path === "/join-venture") return "Venture";
    if (path === "/contact") return "contact";
    if (path === "/media") return "Media";
    if (path === "/about-shubham-developer" || path === "/our-team")
      return "about";
    return "";
  };

  const activeNav = getActiveNav();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll <= 10) setShowHeader(false);
      else if (currentScroll < lastScroll) setShowHeader(false);
      else if (currentScroll > lastScroll && currentScroll > 100)
        setShowHeader(true);

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* TOP BAR */}
      <div className="bg-black text-[#d4af37] text-xs flex justify-between items-center px-6 h-12">
        <div className="hidden md:flex gap-6">
          <Link to={`tel:+91${genralData?.data?.phone}`} className="flex gap-2">
            <Phone size={14} /> +91 {genralData?.data?.phone}
          </Link>

          <Link to={`mailto:${genralData?.data?.email}`} className="flex gap-2">
            <Mail size={14} /> {genralData?.data?.email}
          </Link>
        </div>

        <div className="flex gap-3">
          <Link to={genralData?.data?.facebookUrl}>
            <FontAwesomeIcon icon={faFacebook} />
          </Link>
          <Link to={genralData?.data?.instagramUrl}>
            <FontAwesomeIcon icon={faSquareInstagram} />
          </Link>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-[1370px] mx-auto h-24 flex items-center justify-between px-8">

          {/* LEFT — LOGO */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" className="h-20 object-contain" />
          </Link>

          {/* RIGHT — NAV */}
          <div className="hidden lg:flex items-center gap-4">

            <ul className="flex items-center gap-4 text-gray-700 text-base font-medium">

              {/* DROPDOWN */}
              <li>
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger
                        className={`bg-transparent max-w-[112px] ${
                          activeNav === "about" ? "text-[#d4af37]" : ""
                        }`}
                      >
                        About Us
                      </NavigationMenuTrigger>

                      <NavigationMenuContent className="bg-white p-4">
                        <ul className="space-y-2">
                          <li>
                            <NavigationMenuLink href="/about-shubham-developer">
                              About Shubham Developers
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink href="/our-team">
                              Our Founder
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </li>

              <li className={`${activeNav==="home"?"text-[#d4af37]":""}`}>
                <Link to="/">Home</Link>
              </li>

              <li className={`${activeNav==="projects"?"text-[#d4af37]":""}`}>
                <Link to="/projects">Projects</Link>
              </li>

              <li className={`${activeNav==="Media"?"text-[#d4af37]":""}`}>
                <Link to="/media">Media</Link>
              </li>

              <li className={`${activeNav==="Venture"?"text-[#d4af37]":""}`}>
                <Link to="/join-venture">Join Venture</Link>
              </li>

              <li className={`${activeNav==="contact"?"text-[#d4af37]":""}`}>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>

            {/* ENQUIRY */}
            <Dialog>
              <DialogTrigger>
                <button className="text-gray-700 font-medium hover:text-[#d4af37]">
                  Enquiry
                </button>
              </DialogTrigger>
              <DialogContent>
                <EnquiryDialog />
              </DialogContent>
            </Dialog>
          </div>

          {/* MOBILE MENU */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger>
                <Menu size={26} />
              </SheetTrigger>

              <SheetContent side="right">
                <SheetHeader>
                  <img src="/logo.png" className="h-14 mx-auto" />
                </SheetHeader>

                <ul className="mt-6 space-y-4">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/projects">Projects</Link></li>
                  <li><Link to="/media">Media</Link></li>
                  <li><Link to="/join-venture">Join Venture</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                </ul>

                <Dialog>
                  <DialogTrigger className="mt-6 block text-center">
                    Enquiry
                  </DialogTrigger>
                  <DialogContent>
                    <EnquiryDialog />
                  </DialogContent>
                </Dialog>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </nav>
    </header>
  );
}
