import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);
let proximoId = 0;

/** Avisos rápidos no canto da tela ("Produto adicionado ao carrinho" etc.). */
export function ToastProvider({ children }) {
  const [avisos, setAvisos] = useState([]);

  const avisar = useCallback((mensagem, tipo = 'sucesso') => {
    const id = ++proximoId;
    setAvisos((atual) => [...atual, { id, mensagem, tipo }]);
    setTimeout(() => setAvisos((atual) => atual.filter((a) => a.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={avisar}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {avisos.map((a) => (
          <div key={a.id} className={`toast toast--${a.tipo}`}>
            {a.mensagem}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
