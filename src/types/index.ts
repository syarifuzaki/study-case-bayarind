// Define types for the layout configuration and state
export interface LayoutConfig {
  preset: string
  primary: string
  surface: string | null
  darkTheme: boolean
  menuMode: string
}

export interface LayoutState {
  staticMenuDesktopInactive: boolean
  overlayMenuActive: boolean
  profileSidebarVisible: boolean
  configSidebarVisible: boolean
  staticMenuMobileActive: boolean
  menuHoverActive: boolean
  activeMenuItem: any | null // Replace 'any' with a more specific type if possible
}

// Define the type for item prop
export interface MenuItem {
  label?: string
  icon?: string
  to?: string
  url?: string
  target?: string
  class?: string
  items?: MenuItem[]
  command?: (event: { originalEvent: Event; item: MenuItem }) => void
  disabled?: boolean
  visible?: boolean
  separator?: boolean
}

// Define type for ColorPalette
export interface ColorPalette {
  [key: number]: string
}

// Define type for Color
export interface Color {
  name: string
  palette: ColorPalette
}

// Define Type Response
export interface ResourceResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export interface AuthLoginReturn {
  expires_in: number
  token: string
  user_data: UserData
}

export interface FetchEmployeeReturn {
  current_page: number
  list: Employee[]
  total: number
  total_page: number
}

export interface PayloadEmployee {
  id?: number
  name: string
  email: string
  gender: string
  date_of_birth: string
  phone: string
  address: string
  department_id: number | null | undefined
  job_position_id: number | null | undefined
}

// Auth Login
export interface FormLogin {
  email: string
  password: string
}

// Other type
export interface UserData {
  id: number
  name: string
  email: string
  email_verified_at: string
  created_at: string
  updated_at: string
}

export interface Employee {
  id: number
  name: string
  gender: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  departement: string
  position: string
  status: string
}

export interface Department {
  id: number
  title: string
}

export interface JobPosition {
  id: number
  title: string
}

export interface FormEmployee {
  name: string
  gender: string
  email: string
  phone: string
  dateOfBirth: Date | null
  address: string
  department: Department | null
  jobPosition: JobPosition | null
}

export interface Filters {
  page: number
  limit: number
  search: string
}
