'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';

/** Foto do aluno; se não houver arquivo (ou falhar ao carregar), cai nas iniciais. */
export function StudentPhoto({
  photo,
  name,
  initials,
  bg,
  size = 112,
}: {
  photo?: string;
  name: string;
  initials: string;
  bg: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (!photo || failed) {
    return <Avatar initials={initials} bg={bg} size={size} className="ring-1 ring-edge-hi" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo}
      alt={`Foto de ${name}`}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className="shrink-0 rounded-pill object-cover ring-1 ring-edge-hi"
      style={{ width: size, height: size }}
    />
  );
}
