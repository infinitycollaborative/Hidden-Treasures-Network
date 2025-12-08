import * as React from "react"

const Dialog = ({ children, open, onOpenChange }: { children: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange?.(false)} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-auto">
        {children}
      </div>
    </div>
  )
}

const DialogTrigger = ({ children, asChild, onClick }: { children: React.ReactNode, asChild?: boolean, onClick?: () => void }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick } as any)
  }
  
  return <div onClick={onClick}>{children}</div>
}

const DialogContent = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
)

const DialogHeader = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
)

const DialogTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
)

const DialogDescription = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
)

const DialogFooter = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`mt-6 flex justify-end gap-2 ${className}`}>{children}</div>
)

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
