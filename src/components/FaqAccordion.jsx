'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "¿La plataforma cobra comisión por boleto vendido?",
    answer: "No, deBuenas es una herramienta de gestión 100% libre de comisiones sobre tus ventas. El dinero nunca pasa por nosotros; tus compradores te transfieren directamente a tus cuentas personales (Nequi, Daviplata, Bancolombia, etc)."
  },
  {
    question: "¿Dónde se guarda el dinero de las ventas?",
    answer: "El dinero va directamente a ti. Al crear la rifa, configuras tus propios métodos de pago. Tus compradores verán esa información, te transferirán directamente, y tú apruebas la compra desde tu panel administrativo."
  },
  {
    question: "¿Cómo se garantiza que el sorteo sea transparente?",
    answer: "Tú decides con qué lotería oficial o sorteo certificado juegas. deBuenas se encarga de mostrar la fecha y el nombre de la lotería públicamente en la página de tu rifa, brindándole total claridad y confianza a tus participantes."
  },
  {
    question: "¿Qué documentos necesito para entregar el premio legalmente?",
    answer: "deBuenas es una plataforma tecnológica para organizar participantes, no asume responsabilidad legal sobre los sorteos. Dependiendo de tu país, las rifas entre amigos o por montos menores pueden no requerir trámites, pero te sugerimos revisar la normativa local (ej. Coljuegos en Colombia) si planeas un sorteo masivo comercial."
  },
  {
    question: "¿Qué pasa si alguien reserva un número pero no me paga?",
    answer: "Contamos con un sistema de reservas inteligentes. Si un comprador selecciona un número, tendrá 15 minutos para reportar su pago. Si no lo hace a tiempo, el sistema libera el número automáticamente para que otra persona pueda comprarlo, evitando que pierdas ventas."
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className="border border-gray-200 rounded-md bg-white overflow-hidden transition-all duration-400 ease-in-out hover:border-primary-200"
          >
            <h3 className="m-0 p-0">
              <button
                onClick={() => toggleAccordion(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
              >
                <span className="font-bold text-gray-900 text-lg pr-4">{faq.question}</span>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-400 ease-in-out ${isOpen ? 'bg-primary-100 text-primary-600 rotate-180' : 'bg-gray-50 text-gray-400'}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
            </h3>
            <p 
              id={`faq-answer-${index}`}
              className={`px-6 text-gray-600 leading-relaxed transition-all duration-400 ease-in-out overflow-hidden ${isOpen ? 'max-h-60 opacity-100 pb-6 pt-0  border-t border-gray-50' : 'max-h-0 opacity-0 pb-0 pt-0 border-transparent'}`}
            >
              {faq.answer}
            </p>
          </div>
        );
      })}
      </div>
    </>
  );
}
