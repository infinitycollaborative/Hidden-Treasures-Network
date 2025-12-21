import * as React from "react"

const Tabs = ({ children, defaultValue, value, onValueChange }: { 
  children: React.ReactNode
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || '')

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue)
    onValueChange?.(newValue)
  }

  return (
    <div>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, handleTabChange } as any)
        }
        return child
      })}
    </div>
  )
}

const TabsList = ({ children, className = "", activeTab, handleTabChange }: { 
  children: React.ReactNode
  className?: string
  activeTab?: string
  handleTabChange?: (value: string) => void
}) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 ${className}`}>
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { activeTab, handleTabChange } as any)
      }
      return child
    })}
  </div>
)

const TabsTrigger = ({ value, children, activeTab, handleTabChange, className = "" }: {
  value: string
  children: React.ReactNode
  activeTab?: string
  handleTabChange?: (value: string) => void
  className?: string
}) => (
  <button
    type="button"
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
      activeTab === value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
    } ${className}`}
    onClick={() => handleTabChange?.(value)}
  >
    {children}
  </button>
)

const TabsContent = ({ value, children, activeTab, className = "" }: {
  value: string
  children: React.ReactNode
  activeTab?: string
  className?: string
}) => {
  if (activeTab !== value) return null
  return <div className={`mt-4 ${className}`}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
