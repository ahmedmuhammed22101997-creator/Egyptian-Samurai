import AdminSidebar from './AdminSidebar'

interface AdminPageShellProps {
  title: string
  description?: string
  children: React.ReactNode
}

export default function AdminPageShell({ title, description, children }: AdminPageShellProps) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C2C2C]">{title}</h1>
          {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
        </div>
        {children}
      </main>
    </div>
  )
}
