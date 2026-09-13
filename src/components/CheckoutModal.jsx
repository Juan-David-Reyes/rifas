'use client'

import { useState, useEffect, useRef } from 'react';
import { createClient } from '../utils/supabase/client';
import { Clock, Copy, CheckCircle2, MessageCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { formatMoney, formatTicketNumber } from '../utils/formatters';
import { uploadReceiptAction } from '../utils/uploadAction';

export default function CheckoutModal({ 
  selectedTickets, 
  ticketMap,
  raffle,
  onClose, 
  totalAPagar,
  onConcurrencyError,
  onReset
}) {
  const [timeLeft, setTimeLeft] = useState(15 * 60); 
  const [isReserving, setIsReserving] = useState(true);
  const [error, setError] = useState(null);
  const [copiedAccount, setCopiedAccount] = useState(null);
  const [hasSentWhatsApp, setHasSentWhatsApp] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const getDbTicketIds = () => {
    return selectedTickets.map(num => ticketMap[num]?.id).filter(Boolean);
  };

  const handleClose = async () => {
    if (!hasSentWhatsApp && !error && !isReserving) {
      try {
        await supabase
          .from('tickets')
          .update({ status: 'disponible', reserved_at: null })
          .in('id', getDbTicketIds());
      } catch (err) {
        console.error("Error liberando tickets", err);
      }
    }

    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const hasAttemptedReserve = useRef(false);

  useEffect(() => {
    if (hasAttemptedReserve.current) return;
    hasAttemptedReserve.current = true;
    
    const reserveTickets = async () => {
      try {
        const now = new Date().toISOString();
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60000).toISOString();
        const dbTicketIds = getDbTicketIds();

        const { data, error } = await supabase
          .from('tickets')
          .update({ status: 'reservado', reserved_at: now })
          .in('id', dbTicketIds)
          .or(`status.eq.disponible,and(status.eq.reservado,reserved_at.lt.${fifteenMinsAgo})`)
          .select();

        if (error) throw error;
        
        if (data.length !== dbTicketIds.length) {
          const reservedIds = data.map(t => t.id);
          const reservedNumbers = data.map(t => t.ticket_number);
          const stolenNumbers = selectedTickets.filter(num => !reservedNumbers.includes(num));

          if (data.length > 0) {
            await supabase
              .from('tickets')
              .update({ status: 'disponible', reserved_at: null })
              .in('id', reservedIds);
          }
          
          setError(`¡Ups! Alguien más rápido acaba de reservar el/los número(s) ${stolenNumbers.join(' y ')}. Por favor, vuelve y selecciona otros.`);
          setIsReserving(false);
          if (onConcurrencyError) {
            onConcurrencyError(stolenNumbers);
          }
          return;
        }

        setIsReserving(false);
      } catch (err) {
        setError('Hubo un error al reservar los números. Por favor, intenta de nuevo.');
        setIsReserving(false);
      }
    };

    reserveTickets();
  }, [selectedTickets, ticketMap]);

  useEffect(() => {
    if (isReserving || error) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isReserving, error]);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleUploadAndNotify = async () => {
    if (!buyerName.trim() || !receiptFile) return;
    
    setIsUploading(true);
    setError(null);
    let receiptUrl = null;

    try {
      // 1. Subir la imagen a Supabase Storage via Server Action
      const formData = new FormData();
      formData.append('file', receiptFile);
      
      receiptUrl = await uploadReceiptAction(formData);

      // 2. Actualizar la base de datos con nombre y receipt_url
      const { error: dbError } = await supabase
        .from('tickets')
        .update({ 
          buyer_name: buyerName.trim(),
          receipt_url: receiptUrl 
        })
        .in('id', getDbTicketIds());

      if (dbError) throw dbError;

    } catch (err) {
      console.error("Error al procesar pago", err);
      setError("Error al subir el comprobante. Por favor intenta de nuevo.");
      setIsUploading(false);
      return;
    }

    setIsUploading(false);
    setHasSentWhatsApp(true); 
    
    // 3. Redirigir a WhatsApp
    let phone = raffle.whatsapp_number || raffle.payment_account_number || "3209513083";
    if (phone.length === 10 && !phone.startsWith("57")) {
      phone = "57" + phone;
    }
    
    const formattedTickets = selectedTickets.map(id => formatTicketNumber(id)).join(', ');
    const totalStr = `$${formatMoney(totalAPagar)}`;
    
    const defaultTemplate = '¡Hola! Ya cargué mi comprobante por {{total}} de los números: {{boletas}}. Soy {{nombre}}.';
    let rawTemplate = raffle.whatsapp_template || defaultTemplate;
    
    let message = rawTemplate
      .replace(/{{nombre}}/g, buyerName.trim() || 'un comprador')
      .replace(/{{boletas}}/g, formattedTickets)
      .replace(/{{total}}/g, totalStr);

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank'); // Open in new tab so they stay on success screen
    setIsSuccess(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 transition-opacity duration-300 ease-out ${isVisible && !isClosing ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] transition-transform duration-300 ease-out ${isVisible && !isClosing ? 'translate-y-0 sm:scale-100' : 'translate-y-full sm:translate-y-0 sm:scale-95'}`}>
        
        <div className="bg-primary-600 p-4 text-white text-center relative">
          <button 
            onClick={handleClose}
            disabled={isReserving}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Cerrar"
          >
            ✕
          </button>
          <h2 className="text-2xl font-extrabold mb-1">Completa tu compra</h2>
          <p className="text-green-100 text-sm">{raffle.title}</p>
        </div>

        <div className="p-4 overflow-y-auto relative min-h-105 flex flex-col">
          {isReserving ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium animate-pulse">Asegurando tus números...</p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <p className="text-red-500 font-semibold mb-4">{error}</p>
              <button 
                onClick={handleClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-xl transition-colors"
              >
                Volver
              </button>
            </div>
          ) : isSuccess ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in-up">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">¡Números reservados!</h3>
              <p className="text-gray-600">
                Estaremos validando tu transferencia.
              </p>
              <button 
                onClick={onReset}
                className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform active:scale-95"
              >
                Entendido
              </button>
            </div>
          ) : (
            <div className="space-y-6 grow transition-opacity duration-500 ease-in-out opacity-100">
              
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center space-y-2">
                <div className="flex items-center justify-center space-x-2 text-orange-600 font-bold">
                  <Clock className="w-5 h-5 animate-pulse" />
                  <span className="text-lg">Tienes {formatTime(timeLeft)} minutos</span>
                </div>
                <p className="text-sm text-gray-600">
                  Transfiere antes de que el tiempo expire para no perder tus números.
                </p>
                <div className="pt-2 flex justify-between items-center border-t border-orange-100/50 mt-2 text-gray-800">
                  <span className="font-medium">Números: {selectedTickets.map(id => formatTicketNumber(id)).join(', ')}</span>
                  <span className="text-xl font-black">${formatMoney(totalAPagar)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">1</span>
                  Nombre del participante
                </h3>
                
                <input 
                  type="text" 
                  placeholder="Tu nombre (Obligatorio)" 
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">2</span>
                  Transfiere a {raffle.payment_method_name || 'Nequi'}
                </h3>
                
                <div className="group flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium">Cuenta {raffle.payment_method_name || 'Nequi'}</span>
                    <span className="text-lg font-bold text-gray-900 tracking-wide">{raffle.payment_account_number || '3209513083'}</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(raffle.payment_account_number || '3209513083', 'cuenta')}
                    className="p-2 text-green-600 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    {copiedAccount === 'cuenta' ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">3</span>
                  Sube tu comprobante
                </h3>
                
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                  <input 
                    type="file" 
                    accept="image/*,.pdf"
                    onChange={(e) => setReceiptFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {!receiptFile ? (
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Toca para seleccionar imagen</span>
                      <span className="text-xs text-gray-400">JPG, PNG o PDF</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 truncate max-w-full px-4">{receiptFile.name}</span>
                      <span className="text-xs text-primary-600 font-bold">Cambiar archivo</span>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleUploadAndNotify}
                  disabled={buyerName.trim() === '' || !receiptFile || isUploading}
                  className="w-full bg-[#25D366] hover:bg-[#1ebd5b] active:bg-[#1a9d4b] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center space-x-2 transition-all"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Subiendo comprobante...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-6 h-6" />
                      <span>Notificar Pago vía WhatsApp</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
