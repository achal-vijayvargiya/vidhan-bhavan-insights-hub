import { Home, Users, FileText, MessageSquare, LogOut } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

export function MainNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      icon: <Home className="h-4 w-4" />,
      label: "Home",
      path: "/",
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Members",
      path: "/members",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Resolutions",
      path: "/resolutions",
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Debates",
      path: "/debates",
    },
  ]

  const handleLogout = () => {
    // Clear any auth tokens/state
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")
    localStorage.removeItem("isAuthenticated")
    // Redirect to login
    navigate("/login")
  }

  return (
    <div className="w-full h-full bg-background border-r flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Vidhan Bhavan</h2>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}