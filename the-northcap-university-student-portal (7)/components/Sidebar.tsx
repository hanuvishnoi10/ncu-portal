import React, { useState, createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ViewState, Student } from '../types';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  BookOpen, 
  Clock, 
  GraduationCap, 
  IndianRupee, 
  FileText, 
  User, 
  MessageSquare, 
  Menu, 
  X,
  School,
  LogOut
} from 'lucide-react';

// -- Context --
interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}

const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// -- Components --

const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as unknown as React.ComponentProps<"div">)} />
    </>
  );
};

const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-slate-900 text-white w-[300px] flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "80px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-14 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-slate-900 text-white w-full sticky top-0 z-50"
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
           <School className="w-6 h-6 text-amber-500" />
           <span className="font-bold">NCU Portal</span>
        </div>
        <div className="flex justify-end z-20">
          <Menu
            className="text-white cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-slate-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-6 top-6 z-50 text-white cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X className="w-8 h-8" />
              </div>
              <div className="h-full overflow-y-auto">
                 {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

interface SidebarLinkProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
  className?: string;
}

const SidebarLink: React.FC<{
  link: SidebarLinkProps;
  className?: string;
}> = ({
  link,
  className,
}) => {
  const { open, animate, setOpen } = useSidebar();
  return (
    <button
      onClick={() => {
        link.onClick();
        // Close on mobile when clicked
        if (window.innerWidth < 768) {
             setOpen(false);
        }
      }}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-3 px-3 w-full rounded-lg transition-all duration-200",
        link.isActive 
          ? "bg-amber-500 text-slate-900 font-semibold shadow-md" 
          : "text-slate-300 hover:bg-slate-800 hover:text-white",
        className
      )}
    >
      <div className={cn("flex-shrink-0", link.isActive ? "text-slate-900" : "text-slate-400 group-hover/sidebar:text-white")}>
        {link.icon}
      </div>
      
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm whitespace-pre inline-block text-left"
      >
        {link.label}
      </motion.span>
    </button>
  );
};

// -- Main Sidebar Component --

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  student: Student;
  onLogout: () => void;
}

export function Sidebar({ currentView, onChangeView, student, onLogout }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.ATTENDANCE, label: 'Attendance', icon: CalendarCheck },
    { id: ViewState.TIMETABLE, label: 'Timetable', icon: Clock },
    { id: ViewState.COURSES, label: 'Courses & Syllabus', icon: BookOpen },
    { id: ViewState.ASSIGNMENTS, label: 'Assignments', icon: FileText },
    { id: ViewState.EXAMS, label: 'Exams & Results', icon: GraduationCap },
    { id: ViewState.FEES, label: 'Fee Portal', icon: IndianRupee },
    { id: ViewState.PROFILE, label: 'My Profile', icon: User },
    { id: ViewState.AI_HELP, label: 'NCU Assistant', icon: MessageSquare },
  ];

  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 border-r border-slate-800">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo Area */}
            <div className="flex items-center gap-3 px-2 py-1 mb-6">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <School className="w-5 h-5 text-slate-900" />
                </div>
                <motion.div
                    animate={{
                        display: open ? "block" : "none",
                        opacity: open ? 1 : 0,
                    }}
                    className="overflow-hidden whitespace-nowrap"
                >
                    <h1 className="font-bold text-white text-lg leading-none">NCU Portal</h1>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">NorthCap University</p>
                </motion.div>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-1">
               {menuItems.map((item) => (
                  <SidebarLink 
                    key={item.id} 
                    link={{
                        label: item.label,
                        icon: <item.icon className="w-5 h-5" />,
                        onClick: () => onChangeView(item.id),
                        isActive: currentView === item.id
                    }} 
                  />
               ))}
            </div>
        </div>
        
        {/* User Profile & Logout */}
        <div className="border-t border-slate-800 pt-4 mt-2 flex flex-col gap-2">
            <SidebarLink 
                link={{
                    label: "Sign Out",
                    icon: <LogOut className="w-5 h-5" />,
                    onClick: onLogout,
                    isActive: false
                }}
                className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
            />
            
            <div className="flex items-center gap-3 px-1 pt-2">
               <img 
                 src={student.avatar} 
                 alt="User" 
                 className="w-8 h-8 rounded-full bg-slate-700 object-cover flex-shrink-0"
               />
               <motion.div
                    animate={{
                        display: open ? "block" : "none",
                        opacity: open ? 1 : 0,
                    }}
                    className="overflow-hidden whitespace-nowrap"
                >
                    <p className="text-sm font-medium text-white">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.id}</p>
                </motion.div>
            </div>
        </div>
      </SidebarBody>
    </SidebarProvider>
  );
}

export default Sidebar;