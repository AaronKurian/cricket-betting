import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FiX } from 'react-icons/fi'
import { Toaster, ToastBar, toast } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2000,
        style: {
          background: '#0f172a',
          border: '1px solid rgba(34, 211, 238, 0.2)',
          color: '#cffafe',
        },
      }}
    >
      {(toastItem) => (
        <ToastBar toast={toastItem}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              <button aria-label="Close notification" className="ml-2 text-slate-400 hover:text-white" onClick={() => toast.dismiss(toastItem.id)} type="button">
                <FiX size={16} />
              </button>
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  </StrictMode>,
)
