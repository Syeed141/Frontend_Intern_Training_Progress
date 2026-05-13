"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Home,
  Building2,
  Factory,
  ShoppingBasket,
  ReceiptText,
  Users,
  UserCircle,
  LinkIcon,
  Coins,
  ShieldCheck,
  Bot,
  Presentation,
  Settings,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

type SidebarItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
};

type SidebarGroup = {
  title: string;
  items: SidebarItem[];
};

const sidebarGroups: SidebarGroup[] = [
  {
    title: "",
    items: [
      { label: "Overview", icon: Home },
      { label: "Studios", icon: Building2 },
      { label: "Companies", icon: Factory },
      { label: "Products", icon: ShoppingBasket, href: "/dashboard/products" },
    ],
  },
  {
    title: "ACCOUNTING",
    items: [{ label: "Invoices", icon: ReceiptText }],
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Team", icon: Users },
      { label: "Users", icon: UserCircle },
    ],
  },
  {
    title: "RESOURCES",
    items: [
      { label: "Tools", icon: LinkIcon },
      { label: "Rates", icon: Coins },
      { label: "Roles", icon: ShieldCheck },
    ],
  },
  {
    title: "APPLICATION",
    items: [
      { label: "AI Assistant", icon: Bot },
      { label: "Reports", icon: Presentation },
      { label: "Settings", icon: Settings },
    ],
  },
];

export default function DashboardSidebar() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("Overview");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-md bg-white p-2 text-gray-700 shadow-sm lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 h-dvh w-55 shrink-0 overflow-y-auto overscroll-contain bg-[#f7f8fa] px-4 py-4 transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-full flex-col overflow-hidden">
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 rounded-md p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>

            <Image
              src="/logo.png"
              alt="Pattern 50"
              width={106}
              height={24}
              className="mb-5 ml-3"
            />
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="flex min-h-full flex-col gap-5 pb-2">
              {sidebarGroups.map((group) => (
                <div key={group.title || "main"}>
                  {group.title && (
                    <p className="mb-2 text-[10px] font-semibold uppercase text-gray-400">
                      {group.title}
                    </p>
                  )}

                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeItem === item.label;

                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setActiveItem(item.label);

                            if (item.href) {
                              router.push(item.href);
                              setIsOpen(false);
                            }
                          }}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-left text-[13px] font-bold ${
                            isActive
                              ? "bg-blue-100 text-blue-600"
                              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
