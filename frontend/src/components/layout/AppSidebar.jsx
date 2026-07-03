import { Link, useLocation } from "react-router-dom"
import { Box, Tag, Users, LogOut, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar"
const items = [
  {
    title: "Produtos",
    url: "/produtos",
    icon: Box,
  },
  {
    title: "Promoções",
    url: "/promocoes",
    icon: Tag,
  },
  {
    title: "Usuários",
    url: "/usuarios",
    icon: Users,
  },
]

function getInitials(nome = "") {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")
}

export function AppSidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const visibleItems = items.filter(
    (item) => item.url !== "/usuarios" || user?.perfil === "ADMIN"
  )
  return (
    <Sidebar className="bg-[#0a0a0f] border-r border-white/10 text-white">
      <SidebarHeader className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">

          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-white">Sistema Administrativo</h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 pt-4">
        <SidebarGroup >
          <p className="px-2 pb-2 text-xs font-medium tracking-widest text-gray-500 uppercase">
            Menu
          </p>
          <SidebarGroupContent>
            <SidebarMenu className="grid gap-1.5">
              {visibleItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title} >
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-violet-500/15 border border-violet-500/20 h-11 rounded-xl text-violet-300 font-medium hover:bg-violet-500/20"
                          : "text-gray-400 h-11 rounded-xl hover:bg-white/5 hover:text-gray-200"
                      }
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-1">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-white/10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white">
              {getInitials(user?.nome) || "?"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">{user?.nome}</span>
              <span className="text-xs text-gray-500 truncate">{user?.email}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="inline-flex w-fit items-center rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-xs font-semibold text-violet-300">
              {user?.perfil}
            </div>
            <button
              className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition"
              onClick={() => {
                logout();
              }}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
