'use client';

import Card from '@/components/cards/Card';
import { useRouter } from 'next/navigation';

const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const IconPlano = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 20l-5.447-2.724A1 1 0 013 15.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V8.618a1 1 0 00-.553-.894L15 4.5m-6 15l6-3m-6 3V7m6 10V7m0 10l6-3"
    />
  </svg>
);

const HomeCards = ({ planos, equipos, mantenimientos }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        title="EQUIPOS JCM STUDIO"
        subtitle="Expertos en diseño arquitectónico"
        description="Ingresa los equipos de JCM STUDIO, consulta su hoja de vida con el historial de mantenimientos y revisa su ubicación en el plano."
        color="blue"
        buttons={[
          {
            text: 'INGRESAR',
            icon: <IconPlus />,
            onClick: () => router.push('/equipos/nuevo'),
          },
          {
            text: 'CONSULTAR',
            icon: <IconSearch />,
            onClick: () => router.push('/equipos'),
          },
          {
            text: 'PLANO',
            icon: <IconPlano />,
            onClick: () => router.push('/planos'),
          },
        ]}
        stats={[
          { value: equipos, label: 'EQUIPOS' },
          { value: mantenimientos, label: 'MANTENIMIENTOS' },
          { value: planos, label: 'PLANOS' },
        ]}
      />
    </div>
  );
};

export default HomeCards;