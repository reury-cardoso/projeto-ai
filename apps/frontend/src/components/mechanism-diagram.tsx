export function MechanismDiagram() {
  return (
    <figure className="glass rounded-lg p-8">
      <svg
        viewBox="0 0 640 200"
        role="img"
        aria-label="GitHub e LinkedIn alimentam o perfil público do aluno; o backend nunca faz scraping do LinkedIn, só publica o que o aluno autorizou"
        className="h-auto w-full max-w-[620px] text-foreground"
      >
        <defs>
          <marker id="pda-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-azul-ceu)" />
          </marker>
        </defs>
        <rect x="16" y="70" width="128" height="60" rx="14" fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.45" />
        <text x="80" y="97" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight={600} fontSize="11.5" letterSpacing="1.4" fill="currentColor">
          GITHUB
        </text>
        <text x="80" y="113" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fill="currentColor" opacity={0.5}>
          REST v3
        </text>

        <rect x="496" y="70" width="128" height="60" rx="14" fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.45" />
        <text x="560" y="97" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight={600} fontSize="11.5" letterSpacing="1.4" fill="currentColor">
          LINKEDIN
        </text>
        <text x="560" y="113" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fill="currentColor" opacity={0.5}>
          autorizado
        </text>

        <rect x="230" y="55" width="180" height="90" rx="18" fill="var(--color-amarelo)" />
        <text x="320" y="92" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight={700} fontSize="12" letterSpacing="1" fill="var(--color-roxo-profundo)">
          PERFIL DO ALUNO
        </text>
        <text x="320" y="116" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10.5" fill="var(--color-roxo-profundo)" opacity={0.75}>
          /alunos/joao-silva
        </text>

        <line x1="146" y1="100" x2="226" y2="100" stroke="var(--color-azul-ceu)" strokeWidth="1.5" strokeDasharray="1 6" strokeLinecap="round" markerEnd="url(#pda-arrow)" />
        <text x="186" y="88" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fill="currentColor" opacity={0.62}>
          repos
        </text>

        <line x1="494" y1="100" x2="414" y2="100" stroke="var(--color-azul-ceu)" strokeWidth="1.5" strokeDasharray="1 6" strokeLinecap="round" markerEnd="url(#pda-arrow)" />
        <text x="454" y="88" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fill="currentColor" opacity={0.62}>
          headline
        </text>

        <circle cx="146" cy="100" r="2.5" fill="var(--color-azul-ceu)" />
        <circle cx="494" cy="100" r="2.5" fill="var(--color-azul-ceu)" />
      </svg>
      <figcaption className="prose-body mt-5 max-w-[50ch] text-faint">
        O backend nunca faz scraping do LinkedIn — só publica o que o próprio aluno autorizou.
      </figcaption>
    </figure>
  );
}
