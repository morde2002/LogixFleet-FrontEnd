import React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2">Close</button>
        {children}
      </div>
    </div>
  )
}

export const ModalContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-4">{children}</div>
)

export const ModalHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-lg font-bold">{children}</div>
)

export const ModalFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-4 flex justify-end">{children}</div>
) 