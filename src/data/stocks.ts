// ============================================================
// PORTFOLIO INTELLIGENCE — stocks.ts
// Données fondamentales · Framework 8 Couches
// Dernière mise à jour : Avril 2026
// ============================================================

export type FilterStatus = 'pass' | 'warn' | 'fail'
export type Verdict = 'buy' | 'watch' | 'watchlist'
export type PositionType = 'Core' | 'Satellite' | 'Watchlist'

export interface Filter {
  id: string
  name: string
  threshold: string
  value: string
  status: FilterStatus
}

export interface MoatCriterion {
  name: string
  score: 0 | 1
}

export interface DCFScenario {
  label: string
  value: string
  marginOfSafety: number
  hypothesis: string
}

export interface Catalyst {
  title: string
  description: string
}

export interface Position {
  type: PositionType
  sizing: string
  horizon: string
  entryZone: string
  analyticalStop: string
}

export interface CycleRegime {
  nature: 'cyclical' | 'structural' | 'secular'
  assessment: string
  fxExposure: string
  cyclePosition: string
  macroRisks: string[]
}

export interface Stock {
  id: string
  name: string
  sector: string
  currency: string
  twelveDataSymbol: string
  verdict: Verdict
  entryZone: string
  currentPrice: number          // prix de référence — remplacé par API
  fcfPerShare: number
  fcfGrowthRate: number         // g pour formule FCF target
  fcfMargin: number             // en %
  filters: Filter[]
  moat: MoatCriterion[]
  moatScore: number             // /6
  thesis: string[]              // 4 points, HTML bold autorisé
  dcf: DCFScenario[]
  catalysts: Catalyst[]
  position: Position
  cycle: CycleRegime
  sectorAdaptation?: string     // note si filtres adaptés (banques, holdings, etc.)
}

// ============================================================
// UNIVERSE
// ============================================================

export const stocks: Stock[] = [

  // ─────────────────────────────────────────────────────────
  // FORTINET — FTNT
  // ─────────────────────────────────────────────────────────
  {
    id: 'FTNT',
    name: 'Fortinet',
    sector: 'Cybersécurité · Infrastructure réseau',
    currency: 'USD',
    twelveDataSymbol: 'FTNT:NASDAQ',
    verdict: 'buy',
    entryZone: '<$80',
    currentPrice: 80,
    fcfPerShare: 3.20,
    fcfGrowthRate: 0.15,
    fcfMargin: 30,
    filters: [
      { id: 'F1', name: 'ROIC', threshold: '>15%', value: '66%', status: 'pass' },
      { id: 'F2', name: 'Forward P/E', threshold: '<30x', value: '28x', status: 'pass' },
      { id: 'F3', name: 'Dette / EBITDA', threshold: '<3x', value: '0.2x', status: 'pass' },
      { id: 'F4', name: 'Marge FCF', threshold: '>15%', value: '30%', status: 'pass' },
      { id: 'F5', name: 'EPS Growth', threshold: '>10%', value: '+18%', status: 'pass' },
    ],
    moat: [
      { name: 'Pricing Power', score: 1 },
      { name: 'Switching Costs', score: 1 },
      { name: 'Effets réseau', score: 1 },
      { name: 'Actifs intangibles', score: 1 },
      { name: 'Barrières réglementaires', score: 1 },
      { name: 'Économies d\'échelle', score: 1 },
    ],
    moatScore: 6,
    thesis: [
      '<strong>ASIC propriétaire FortiGEL</strong> — avantage matériel irréplicable vs Palo Alto ou CrowdStrike. 3–5× plus rapide pour le même coût. Impossible à répliquer sans 10 ans de R&D silicium.',
      '<strong>Security Fabric — 50+ produits intégrés natifs</strong> — switching cost maximal. Remplacer Fortinet implique de rechanger toute l\'architecture réseau. Lock-in structurel.',
      '<strong>CEO fondateur Xie — alignement actionnaire fort</strong> — culture R&D pure, jamais de grande acquisition dilutive. Croissance 100% organique depuis la création.',
      '<strong>Consolidation cybersécurité post-SolarWinds</strong> — les RSSI veulent réduire le nombre de vendors. Fortinet est le bénéficiaire naturel de cette tendance séculaire.',
    ],
    dcf: [
      { label: 'Bear', value: '$62', marginOfSafety: -23, hypothesis: 'Ralentissement adoption SASE, pression tarifaire, WACC 11%' },
      { label: 'Base', value: '$95–115', marginOfSafety: 19, hypothesis: 'WACC 9%, FCF CAGR 15%, TGR 4% — scénario central' },
      { label: 'Bull', value: '$140–160', marginOfSafety: 75, hypothesis: 'Expansion SASE + OT security, FCF CAGR 20%, WACC 8.5%' },
    ],
    catalysts: [
      { title: 'Adoption SASE', description: 'Transition SD-WAN vers cloud security architecture — Fortinet positionné comme leader intégré vs point solutions.' },
      { title: 'OT Security expansion', description: 'Sécurité des usines et infrastructures critiques — marché de $20Mds adressable, quasi-inexploité.' },
      { title: 'Upsell base installée', description: '700,000+ clients actifs — migration progressive vers Security Fabric complet = ARR croissant.' },
    ],
    position: {
      type: 'Core',
      sizing: 'Haute conviction — position maximale autorisée (5%+)',
      horizon: '3–5 ans',
      entryZone: '<$80 — entrée complète',
      analyticalStop: 'Si l\'ASIC perd l\'avantage face au software-defined concurrent · Si FCF margin tombe durablement sous 20% · Si Xie cède le contrôle opérationnel',
    },
    cycle: {
      nature: 'secular',
      assessment: 'Croissance séculaire — la cybersécurité ne peut pas régresser. Chaque cyberattaque majeure accélère les budgets.',
      fxExposure: 'Revenus majoritairement en USD · Exposition EUR/USD modérée sur ventes EMEA (~30% revenus)',
      cyclePosition: 'Milieu de cycle de consolidation — les grandes entreprises passent de 30+ vendors à 5–10 plateformes intégrées.',
      macroRisks: [
        'Compression budgets IT en récession sévère',
        'Émergence d\'un concurrent ASIC (peu probable à 3 ans)',
        'Réglementation antitrust sur les plateformes de sécurité intégrées',
      ],
    },
  },

  // ─────────────────────────────────────────────────────────
  // MSCI INC. — MSCI
  // ─────────────────────────────────────────────────────────
  {
    id: 'MSCI',
    name: 'MSCI Inc.',
    sector: 'Données financières · Indices · Analytics',
    currency: 'USD',
    twelveDataSymbol: 'MSCI:NYSE',
    verdict: 'buy',
    entryZone: 'Achat progressif',
    currentPrice: 530,
    fcfPerShare: 22.50,
    fcfGrowthRate: 0.12,
    fcfMargin: 37,
    filters: [
      { id: 'F1', name: 'ROIC', threshold: '>15%', value: '55%', status: 'pass' },
      { id: 'F2', name: 'Forward P/E', threshold: '<30x', value: '38x', status: 'warn' },
      { id: 'F3', name: 'Dette / EBITDA', threshold: '<3x', value: '2.8x', status: 'pass' },
      { id: 'F4', name: 'Marge FCF', threshold: '>15%', value: '37%', status: 'pass' },
      { id: 'F5', name: 'EPS Growth', threshold: '>10%', value: '+14%', status: 'pass' },
    ],
    moat: [
      { name: 'Pricing Power', score: 1 },
      { name: 'Switching Costs', score: 1 },
      { name: 'Effets réseau', score: 1 },
      { name: 'Actifs intangibles', score: 1 },
      { name: 'Barrières réglementaires', score: 1 },
      { name: 'Économies d\'échelle', score: 1 },
    ],
    moatScore: 6,
    thesis: [
      '<strong>Monopole de facto sur les indices</strong> — 97% des ETF actifs mondiaux répliquent des indices MSCI. Pas de substitut crédible à horizon 10 ans.',
      '<strong>Recurring revenue 80%+</strong> — abonnements long terme avec asset managers et institutionnels. Revenue quasi-contractuel, quasi-indépendant du cycle.',
      '<strong>AUM-linked fees</strong> — croissance automatique avec les marchés financiers. Plus les actifs sous gestion augmentent dans le monde, plus MSCI gagne sans effort supplémentaire.',
      '<strong>Expansion ESG & Private Assets</strong> — nouveaux marchés adressables milliardaires pour les données propriétaires. SFDR/SEC créent une demande réglementaire captive.',
    ],
    dcf: [
      { label: 'Bear', value: '$380', marginOfSafety: -28, hypothesis: 'Stagnation AUM mondial, pression réglementaire indices, WACC 10%' },
      { label: 'Base', value: '$550–620', marginOfSafety: 17, hypothesis: 'WACC 9%, EPS CAGR 12%, TGR 4% — scénario central' },
      { label: 'Bull', value: '$700+', marginOfSafety: 32, hypothesis: 'Expansion Private Assets + ESG mandatoire, CAGR 15%' },
    ],
    catalysts: [
      { title: 'Croissance AUM mondiale', description: 'Plus de capitaux sous gestion = plus de licensing fees automatiques. Corrélé à la performance des marchés mondiaux.' },
      { title: 'Adoption ESG institutionnelle', description: 'Réglementations SFDR (Europe) et SEC (US) créent une demande réglementaire captive pour les données ESG MSCI.' },
      { title: 'Indexation Private Assets', description: 'Nouvelle frontière — les actifs privés (PE, infrastructure, real estate) commencent à être indexés. Marché de $10Tr+ adressable.' },
    ],
    position: {
      type: 'Core',
      sizing: 'DCA trimestriel — achat progressif (5%+ en cible finale)',
      horizon: '5 ans',
      entryZone: 'Achat progressif — pas de prix cible strict',
      analyticalStop: 'Si un régulateur force la déconcentation des indices · Si les ETF passifs perdent durablement des parts de marché · Si FCF margin tombe sous 25%',
    },
    cycle: {
      nature: 'secular',
      assessment: 'Croissance séculaire liée à la financiarisation mondiale. Indépendant des cycles économiques grâce au recurring revenue.',
      fxExposure: 'Business USD-dominant · Exposition EUR (~30%) et JPY (~10%) sur licensing international',
      cyclePosition: 'Pas de cycle sectoriel identifiable — croissance quasi-linéaire depuis 20 ans.',
      macroRisks: [
        'Krach prolongé des marchés financiers mondiaux compressant les AUM',
        'Réglementation antitrust sur les monopoles d\'indices',
        'Perte de la licence MSCI China (risque géopolitique bas mais non nul)',
      ],
    },
  },

  // ─────────────────────────────────────────────────────────
  // INTERCONTINENTAL EXCHANGE — ICE
  // ─────────────────────────────────────────────────────────
  {
    id: 'ICE',
    name: 'Intercontinental Exchange',
    sector: 'Infrastructure financière · Données · Mortgage Tech',
    currency: 'USD',
    twelveDataSymbol: 'ICE:NYSE',
    verdict: 'buy',
    entryZone: '~$158',
    currentPrice: 158,
    fcfPerShare: 9.50,
    fcfGrowthRate: 0.10,
    fcfMargin: 42,
    filters: [
      { id: 'F1', name: 'ROIC (ex-goodwill)', threshold: '>15%', value: '~20% op.', status: 'pass' },
      { id: 'F2', name: 'Forward P/E', threshold: '<30x', value: '22x', status: 'pass' },
      { id: 'F3', name: 'Dette / EBITDA', threshold: '<3x', value: '2.8x', status: 'pass' },
      { id: 'F4', name: 'Marge FCF', threshold: '>15%', value: '42%', status: 'pass' },
      { id: 'F5', name: 'EPS Growth', threshold: '>10%', value: '+11%', status: 'pass' },
    ],
    moat: [
      { name: 'Pricing Power', score: 1 },
      { name: 'Switching Costs', score: 1 },
      { name: 'Effets réseau', score: 1 },
      { name: 'Actifs intangibles', score: 1 },
      { name: 'Barrières réglementaires', score: 1 },
      { name: 'Économies d\'échelle', score: 1 },
    ],
    moatScore: 6,
    thesis: [
      '<strong>NYSE + Données + Mortgage Tech</strong> — 3 business distincts à très haute récurrence. 20 années consécutives de records de revenus. Résilience à travers tous les cycles.',
      '<strong>Monopole de clearing CDS/taux/énergie</strong> — impossible à répliquer sans décennie de track record réglementaire. Les régulateurs eux-mêmes ont besoin d\'ICE pour la stabilité systémique.',
      '<strong>ICE Mortgage Technology</strong> — digitalisation du processus hypothécaire US. Marché $14Mds adressable, sous-pénétré. Acquisition Black Knight = position dominante.',
      '<strong>ROIC distordu par goodwill</strong> — acquisitions NYSE (2013) et Ellie Mae/Black Knight. ROIC opérationnel bien supérieur au GAAP. Intangibles en cours d\'amortissement.',
    ],
    dcf: [
      { label: 'Bear', value: '$130', marginOfSafety: -18, hypothesis: 'Mortgage stagnation prolongée, taux élevés durables, WACC 10%' },
      { label: 'Base', value: '$170–195', marginOfSafety: 15, hypothesis: 'WACC 9%, FCF CAGR 10%, TGR 3.5% — scénario central' },
      { label: 'Bull', value: '$220+', marginOfSafety: 39, hypothesis: 'Rebond mortgage + synergies Black Knight, FCF CAGR 13%' },
    ],
    catalysts: [
      { title: 'Normalisation taux US', description: 'La baisse des taux Fed relance les transactions hypothécaires — ICE Mortgage capte la reprise via sa plateforme dominante.' },
      { title: 'Synergies Black Knight', description: 'Intégration en cours — $125M+ de synergies de coûts identifiés, cross-selling données/services en accélération.' },
      { title: 'Expansion données alternatives', description: 'Analytics propriétaires sur les marchés d\'énergie, crédit et immobilier — pricing power croissant sur data licensing.' },
    ],
    position: {
      type: 'Core',
      sizing: 'Entrée complète à ~$158 (5%+)',
      horizon: '3–5 ans',
      entryZone: '~$158 — zone d\'achat validée',
      analyticalStop: 'Si les régulateurs démantèlent le monopole de clearing · Si mortgage tech perd 30%+ de parts de marché · Si FCF margin tombe sous 30%',
    },
    cycle: {
      nature: 'secular',
      assessment: 'Business séculaire avec composante cyclique mortgage. La partie clearing/données est indépendante des cycles. Mortgage suit les taux Fed.',
      fxExposure: 'Business quasi-exclusivement USD · Exposition limitée EUR sur marchés dérivés européens',
      cyclePosition: 'Bas de cycle mortgage — les taux élevés ont déprimé les transactions. Normalisation attendue sur 2–3 ans.',
      macroRisks: [
        'Taux Fed durablement hauts bloquant la reprise mortgage',
        'Réglementation des marchés dérivés OTC réduisant les volumes de clearing',
        'Récession profonde comprimant les volumes de trading',
      ],
    },
    sectorAdaptation: 'ROIC GAAP distordu par goodwill NYSE + Black Knight. ROIC opérationnel ex-goodwill ~20%+.',
  },

  // ─────────────────────────────────────────────────────────
  // BROOKFIELD CORPORATION — BN
  // ─────────────────────────────────────────────────────────
  {
    id: 'BN',
    name: 'Brookfield Corporation',
    sector: 'Asset Management · Actifs Réels · Assurance',
    currency: 'USD',
    twelveDataSymbol: 'BN:NYSE',
    verdict: 'buy',
    entryZone: '~$40',
    currentPrice: 40,
    fcfPerShare: 2.27,      // Distributable Earnings/share
    fcfGrowthRate: 0.18,
    fcfMargin: 0,           // N/A — holding structure
    filters: [
      { id: 'F1', name: 'DE Growth/share', threshold: '>10%', value: '+11%', status: 'pass' },
      { id: 'F2', name: 'Price / DE', threshold: '<20x', value: '17.6x', status: 'pass' },
      { id: 'F3', name: 'Discount to NAV', threshold: '>15%', value: '37–41%', status: 'pass' },
      { id: 'F4', name: 'FRE Growth', threshold: '>15%', value: '+22%', status: 'pass' },
      { id: 'F5', name: 'DE CAGR guidance', threshold: '>15%', value: '~25%', status: 'pass' },
    ],
    moat: [
      { name: 'Pricing Power', score: 1 },
      { name: 'Switching Costs', score: 1 },
      { name: 'Effets réseau (capital flywheel)', score: 1 },
      { name: 'Actifs intangibles (track record)', score: 1 },
      { name: 'Barrières à l\'entrée', score: 1 },
      { name: 'Économies d\'échelle', score: 0 },
    ],
    moatScore: 5,
    thesis: [
      '<strong>Discount NAV 37–41%</strong> — le marché valorise BN bien en dessous de ses actifs nets estimés à ~$68/action par le management. Marge de sécurité structurelle intégrée.',
      '<strong>DE CAGR 18% depuis 2021</strong> — guidance management ~25% CAGR sur 5 ans. Wealth Solutions +28% CAGR vers 2029. Momentum de croissance exceptionnel.',
      '<strong>Fee-bearing capital $603Mds</strong> — flywheel : plus de capital → accès aux meilleurs deals → meilleurs returns → plus d\'inflows. Cercle vertueux auto-renforcé.',
      '<strong>Merge BNT → BN 2026</strong> — simplification structure + accès plein au capital base de $180Mds pour l\'assurance. Catalyseur de re-rating immédiat.',
    ],
    dcf: [
      { label: 'Bear', value: '$38–45', marginOfSafety: 5, hypothesis: 'Ralentissement private credit, DE +10%/an, discount NAV persiste' },
      { label: 'Base', value: '$55–65', marginOfSafety: 45, hypothesis: 'DE CAGR 18%, re-rating partiel vers 20x DE — scénario central' },
      { label: 'Bull', value: '$65–75', marginOfSafety: 75, hypothesis: 'DE CAGR 25%, re-rating complet, merge BNT accretif' },
    ],
    catalysts: [
      { title: 'Réalisations carried interest 2026–2027', description: 'Pipeline de réalisations sur le vintage 2018–2021. Revenus non-récurrents mais très significatifs sur le DE total.' },
      { title: 'Merge BNT → BN', description: 'Fusion de l\'entité assurance directement dans BN d\'ici fin 2026. Accès $180Mds capital base, simplification perçue par les marchés.' },
      { title: 'AI Infrastructure Fund', description: 'Nouveau fonds dédié aux data centers et infrastructure IA — demande institutionnelle massive, Brookfield idéalement positionné.' },
    ],
    position: {
      type: 'Core',
      sizing: 'Entrée complète autour de $40 (5%+)',
      horizon: '3–5 ans',
      entryZone: '~$40 — zone d\'achat validée',
      analyticalStop: 'Si DE before realizations tombe sous 5% de croissance 2 années consécutives · Si discount NAV s\'élargit durablement au-delà de 50% sans catalyseur',
    },
    cycle: {
      nature: 'secular',
      assessment: 'Business d\'assets réels en croissance séculaire. Résilient aux cycles grâce à la diversification géographique et sectorielle des actifs.',
      fxExposure: 'Actifs globaux naturellement diversifiés en devises · Revenus en USD, CAD, GBP, EUR, BRL — hedging partiel via structure de fonds',
      cyclePosition: 'Phase de croissance accélérée des actifs réels mondiaux — infrastructure, énergie, immobilier commercial premium.',
      macroRisks: [
        'Taux élevés prolongés comprimant les valorisations d\'actifs réels',
        'Crise du crédit privé affectant les portefeuilles de dette infrastructure',
        'Complexité/opacité de la structure — risque de perception plus que de fondamentaux',
      ],
    },
    sectorAdaptation: 'Filtres adaptés structure holding. Métriques : Price/DE, Discount NAV, FRE growth au lieu de ROIC/FCF/P/E standard.',
  },

  // ─────────────────────────────────────────────────────────
  // MASTERCARD — MA
  // ─────────────────────────────────────────────────────────
  {
    id: 'MA',
    name: 'Mastercard',
    sector: 'Paiements numériques · Réseaux financiers',
    currency: 'USD',
    twelveDataSymbol: 'MA:NYSE',
    verdict: 'watch',
    entryZone: '<$460',
    currentPrice: 497,
    fcfPerShare: 15.80,
    fcfGrowthRate: 0.13,
    fcfMargin: 54,
    filters: [
      { id: 'F1', name: 'ROIC', threshold: '>15%', value: '50%', status: 'pass' },
      { id: 'F2', name: 'Forward P/E', threshold: '<30x', value: '35x', status: 'warn' },
      { id: 'F3', name: 'Dette / EBITDA', threshold: '<3x', value: '0.8x', status: 'pass' },
      { id: 'F4', name: 'Marge FCF', threshold: '>15%', value: '54%', status: 'pass' },
      { id: 'F5', name: 'EPS Growth', threshold: '>10%', value: '+15%', status: 'pass' },
    ],
    moat: [
      { name: 'Pricing Power', score: 1 },
      { name: 'Switching Costs', score: 1 },
      { name: 'Effets réseau', score: 1 },
      { name: 'Actifs intangibles', score: 1 },
      { name: 'Barrières réglementaires', score: 1 },
      { name: 'Économies d\'échelle', score: 1 },
    ],
    moatScore: 6,
    thesis: [
      '<strong>Duopole Visa/Mastercard — réseau à double face irréplicable</strong> — 3+ milliards de cartes, 150M+ marchands. Tout le monde accepte MA parce que tout le monde a une carte MA.',
      '<strong>FCF margin 54% — top mondial absolu</strong> — business asset-light pur. Mastercard ne prend aucun risque de crédit, ne détient pas de capital. Pur réseau de traitement.',
      '<strong>Cash-to-digital tailwind décennal</strong> — encore 60%+ des transactions mondiales en cash. Chaque paiement qui passe au digital est une transaction Mastercard potentielle.',
      '<strong>Cross-border expansion</strong> — frais plus élevés sur transactions internationales (+1.5–2%). Le développement du tourisme et du e-commerce mondial est un levier automatique.',
    ],
    dcf: [
      { label: 'Bear', value: '$360', marginOfSafety: -22, hypothesis: 'Réglementation interchange fees, stagnation cross-border, WACC 10%' },
      { label: 'Base', value: '$520–580', marginOfSafety: 17, hypothesis: 'WACC 9%, EPS CAGR 13%, TGR 4% — scénario central' },
      { label: 'Bull', value: '$650+', marginOfSafety: 31, hypothesis: 'B2B payments digitalisation, émergents accélération, CAGR 16%' },
    ],
    catalysts: [
      { title: 'Reprise travel international', description: 'Les transactions cross-border (à marge plus haute) corrélées au tourisme mondial. Retour aux niveaux pré-Covid terminé.' },
      { title: 'B2B Payments digitalisation', description: 'Marché $100 Trillions adressable quasi-intact. Mastercard Track Business Payment Service en développement actif.' },
      { title: 'Marchés émergents — NFC/contactless', description: 'Inde, Afrique, LATAM — adoption massive des paiements mobiles et contactless. MA investi massivement dans ces géographies.' },
    ],
    position: {
      type: 'Core',
      sizing: 'Entrée complète sous $460 (5%+)',
      horizon: '5 ans',
      entryZone: '<$460 — pull-back macro ou réglementaire attendu',
      analyticalStop: 'Si réglementation européenne/US cap les interchange fees significativement · Si crypto payments prend >10% des transactions retail mondiales · Si ROIC tombe sous 30%',
    },
    cycle: {
      nature: 'secular',
      assessment: 'Croissance séculaire — la digitalisation des paiements est une tendance irréversible sur 20+ ans. Légèrement sensible aux cycles via les volumes de transactions.',
      fxExposure: 'Revenus USD mais exposés à 150+ devises via transactions cross-border · FX fort USD = léger headwind sur revenus internationaux',
      cyclePosition: 'Pleine phase de croissance. Pas de saisonnalité marquée.',
      macroRisks: [
        'Réglementation des frais d\'interchange aux USA ou en Europe',
        'Émergence d\'un réseau de paiement crypto décentralisé à adoption massive',
        'Récession comprimant les volumes de dépenses discrétionnaires',
      ],
    },
  },

  // ─────────────────────────────────────────────────────────
  // TRANSDIGM GROUP — TDG
  // ─────────────────────────────────────────────────────────
  {
    id: 'TDG',
    name: 'TransDigm Group',
    sector: 'Aéronautique · Composants sole-source certifiés',
    currency: 'USD',
    twelveDataSymbol: 'TDG:NYSE',
    verdict: 'watch',
    entryZone: '<$1,300',
    currentPrice: 1434,
    fcfPerShare: 35.00,
    fcfGrowthRate: 0.12,
    fcfMargin: 20,
    filters: [
      { id: 'F1', name: 'ROIC', threshold: '>15%', value: '15%', status: 'pass' },
      { id: 'F2', name: 'Forward P/E', threshold: '<30x', value: '35x', status: 'warn' },
      { id: 'F3', name: 'Dette / EBITDA', threshold: '<3x', value: '5.3x', status: 'warn' },
      { id: 'F4', name: 'Marge FCF', threshold: '>15%', value: '20%', status: 'pass' },
      { id: 'F5', name: 'EPS Growth', threshold: '>10%', value: '+18%', status: 'pass' },
    ],
    moat: [
      { name: 'Pricing Power', score: 1 },
      { name: 'Switching Costs', score: 1 },
      { name: 'Effets réseau', score: 0 },
      { name: 'Actifs intangibles', score: 1 },
      { name: 'Barrières réglementaires', score: 1 },
      { name: 'Économies d\'échelle', score: 1 },
    ],
    moatScore: 5,
    thesis: [
      '<strong>80% sole-source</strong> — composants propriétaires certifiés FAA. TransDigm est le seul fournisseur légal pour chaque pièce. Pricing power absolu, aucune négociation possible.',
      '<strong>Aftermarket = 90% des profits</strong> — les compagnies aériennes DOIVENT acheter les pièces de maintenance chez TransDigm. Modèle razor-and-blade appliqué à l\'aéronautique.',
      '<strong>EBITDA margin 54%</strong> — le plus élevé de tout le secteur industriel mondial. Reflet direct et incontestable du pricing power sole-source.',
      '<strong>Dette 5.3x assumée stratégiquement</strong> — FCF couvre largement le service de la dette. Chaque acquisition est financée par dette puis remboursée via FCF. Modèle buyout&build éprouvé.',
    ],
    dcf: [
      { label: 'Bear', value: '$950', marginOfSafety: -34, hypothesis: 'Réglementation DoD, ralentissement aftermarket, WACC 11%' },
      { label: 'Base', value: '$1,400–1,600', marginOfSafety: 10, hypothesis: 'WACC 9.5%, FCF CAGR 12%, TGR 3% — scénario central' },
      { label: 'Bull', value: '$1,900+', marginOfSafety: 33, hypothesis: 'Nouvelles acquisitions accretives, défense US en hausse, CAGR 15%' },
    ],
    catalysts: [
      { title: 'Rebond aftermarket post-Covid', description: 'Flottes vieillissantes nécessitant plus de maintenance. Chaque avion en service = revenus récurrents TDG.' },
      { title: 'Budget défense US en hausse', description: 'Composants militaires sole-source = pricing power encore plus élevé. Géopolitique favorable aux dépenses défense.' },
      { title: 'Nouvelles acquisitions accretives', description: 'Modèle buyout&build — TDG acquiert des niche sole-source players à 8–10x EBITDA et les optimise à 50%+ margin.' },
    ],
    position: {
      type: 'Satellite',
      sizing: 'Position modérée (3%) — dette élevée justifie sizing conservateur',
      horizon: '3–5 ans',
      entryZone: '<$1,300 — correction de marché ou news DoD',
      analyticalStop: 'Si la FAA impose la multi-source sur les pièces historiquement sole-source · Si les compagnies aériennes renouvellent massivement leurs flottes · Si FCF coverage ratio dette < 1.5x',
    },
    cycle: {
      nature: 'secular',
      assessment: 'Business structurellement en croissance — le parc d\'avions mondiaux croît chaque décennie. Composante cyclique faible car aftermarket = maintenance obligatoire.',
      fxExposure: 'Revenus majoritairement USD · Exposition limitée EUR sur clients européens (Lufthansa, Air France)',
      cyclePosition: 'Milieu de cycle aftermarket post-rebond Covid. Flottes en plein vieillissement = pic de maintenance à venir.',
      macroRisks: [
        'Décision réglementaire FAA sur le sole-source',
        'Effondrement du trafic aérien (pandémie / choc géopolitique)',
        'Refinancement de la dette dans un contexte de taux élevés',
      ],
    },
  },

  // ─────────────────────────────────────────────────────────
  // BADGER METER — BMI
  // ─────────────────────────────────────────────────────────
  {
    id: 'BMI',
    name: 'Badger Meter',
    sector: 'Smart Water · AMI · SaaS utilities',
    currency: 'USD',
    twelveDataSymbol: 'BMI:NYSE',
    verdict: 'watch',
    entryZone: '<$155',
    currentPrice: 155,
    fcfPerShare: 4.10,
    fcfGrowthRate: 0.13,
    fcfMargin: 18.5,
    filters: [
      { id: 'F1', name: 'ROIC', threshold: '>15%', value: '19.4%', status: 'pass' },
      { id: 'F2', name: 'Forward P/E', threshold: '<30x', value: '34x', status: 'warn' },
      { id: 'F3', name: 'Dette / EBITDA', threshold: '<3x', value: '0x', status: 'pass' },
      { id: 'F4', name: 'Marge FCF', threshold: '>15%', value: '18.5%', status: 'pass' },
      { id: 'F5', name: 'EPS Growth', threshold: '>10%', value: '+13%', status: 'pass' },
    ],
    moat: [
      { name: 'Pricing Power', score: 1 },
      { name: 'Switching Costs', score: 1 },
      { name: 'Effets réseau', score: 0 },
      { name: 'Actifs intangibles', score: 1 },
      { name: 'Barrières réglementaires', score: 1 },
      { name: 'Économies d\'échelle', score: 1 },
    ],
    moatScore: 5,
    thesis: [
      '<strong>Transition SaaS BEACON</strong> — de vente de compteurs hardware one-time à abonnements data cloud récurrents. Recurring revenue en accélération structurelle.',
      '<strong>Infrastructure eau US — Bipartisan Infrastructure Law</strong> — $55Mds alloués à la modernisation des réseaux d\'eau. BMI est le bénéficiaire direct et mesurable.',
      '<strong>ROIC 19.4% stable</strong> — création de valeur durable et cohérente sur capital employé. Zéro dette = bilan forteresse et optionalité maximale.',
      '<strong>Détection PFAS et qualité eau</strong> — nouvelles réglementations environnementales US créent une demande obligatoire de monitoring intelligent. BMI = fournisseur naturel.',
    ],
    dcf: [
      { label: 'Bear', value: '$115', marginOfSafety: -26, hypothesis: 'Ralentissement infrastructure, BEACON adoption lente, WACC 10%' },
      { label: 'Base', value: '$170–195', marginOfSafety: 19, hypothesis: 'WACC 9%, EPS CAGR 13%, TGR 3.5% — scénario central' },
      { label: 'Bull', value: '$230+', marginOfSafety: 48, hypothesis: 'BEACON >50% revenues + expansion internationale, CAGR 16%' },
    ],
    catalysts: [
      { title: 'Déploiement AMI accéléré', description: 'Advanced Metering Infrastructure — les utilities US remplacent leurs compteurs analogiques. BMI capte la vague via sa plateforme BEACON.' },
      { title: 'Réglementation PFAS', description: 'Nouvelles normes EPA sur la détection des polluants per- et polyfluoroalkylés. Monitoring obligatoire = contrats longs termes.' },
      { title: 'Expansion internationale', description: 'Europe et Asie — réglementations similaires sur la qualité de l\'eau créent un marché international pour les solutions AMI.' },
    ],
    position: {
      type: 'Satellite',
      sizing: 'Entrée complète sous $155 (3–4%)',
      horizon: '3–5 ans',
      entryZone: '<$155 — validation accélération SaaS Q1 2026',
      analyticalStop: 'Si BEACON revenue reste sous 30% du total après 2026 · Si ROIC tombe sous 15% · Si un concurrent prend >20% des nouveaux contrats AMI municipaux',
    },
    cycle: {
      nature: 'secular',
      assessment: 'Croissance séculaire liée aux méga-tendances eau + infrastructure + réglementation environnementale. Quasi-indépendant des cycles économiques.',
      fxExposure: 'Revenus quasi-exclusivement USD · Exposition internationale faible (<10%)',
      cyclePosition: 'Début de super-cycle infrastructure eau aux USA — investissements obligatoires sur 10–15 ans.',
      macroRisks: [
        'Coupe budgétaire fédérale sur l\'Infrastructure Law',
        'Consolidation sectorielle — rachat par un concurrent industriel plus grand',
        'Échec de la transition SaaS BEACON',
      ],
    },
  },

  // ─────────────────────────────────────────────────────────
  // WATTS WATER TECHNOLOGIES — WTS
  // ─────────────────────────────────────────────────────────
  {
    id: 'WTS',
    name: 'Watts Water Technologies',
    sector: 'Gestion eau · Thermique · Data centers',
    currency: 'USD',
    twelveDataSymbol: 'WTS:NYSE',
    verdict: 'watch',
    entryZone: '<$260',
    currentPrice: 300,
    fcfPerShare: 10.60,
    fcfGrowthRate: 0.10,
    fcfMargin: 14.6,
    filters: [
      { id: 'F1', name: 'ROIC', threshold: '>15%', value: '19.1%', status: 'pass' },
      { id: 'F2', name: 'Forward P/E', threshold: '<30x', value: '28x', status: 'pass' },
      { id: 'F3', name: 'Dette / EBITDA', threshold: '<3x', value: '-0.4x', status: 'pass' },
      { id: 'F4', name: 'Marge FCF', threshold: '>15%', value: '14.6%', status: 'warn' },
      { id: 'F5', name: 'EPS Growth', threshold: '>10%', value: '+19%', status: 'pass' },
    ],
    moat: [
      { name: 'Pricing Power', score: 1 },
      { name: 'Switching Costs', score: 1 },
      { name: 'Effets réseau', score: 0 },
      { name: 'Actifs intangibles', score: 1 },
      { name: 'Barrières réglementaires', score: 1 },
      { name: 'Économies d\'échelle', score: 0 },
    ],
    moatScore: 4,
    thesis: [
      '<strong>Cash net positif — bilan forteresse</strong> — Net Debt/EBITDA -0.4x. Flexibilité totale pour acquisitions accretives. 3 acquisitions réussies en Q4 2025.',
      '<strong>Data centers tailwind IA</strong> — systèmes thermiques et hydrauliques pour les data centers. Nouveau moteur de croissance décennal, marché en explosion.',
      '<strong>Gross margin 49.5%</strong> — signal clair de pricing power. Produits différenciés certifiés codes de plomberie, pas des commodités substituables.',
      '<strong>Repositionnement non-résidentiel réussi</strong> — de résidentiel cyclique vers institutionnel/industriel/data centers. Mix revenue plus résilient et à marge plus haute.',
    ],
    dcf: [
      { label: 'Bear', value: '$195', marginOfSafety: -35, hypothesis: 'Ralentissement construction, tarifs durables, data center pause, WACC 10%' },
      { label: 'Base', value: '$270–310', marginOfSafety: 3, hypothesis: 'WACC 9.5%, FCF CAGR 10%, TGR 3% — scénario central' },
      { label: 'Bull', value: '$360–420', marginOfSafety: 30, hypothesis: 'Data center hypercroissance + acquisitions accretives, CAGR 14%' },
    ],
    catalysts: [
      { title: 'Expansion data centers', description: 'Hyperscalers (Meta, Google, Microsoft, Amazon) investissent $200Mds+/an. WTS fournit les systèmes thermiques critiques.' },
      { title: 'Transition énergétique', description: 'Pompes à chaleur, systèmes de chauffage efficaces — réglementation européenne et US pousse vers la décarbonation des bâtiments.' },
      { title: 'Intégration acquisitions Q4 2025', description: 'Haws + Superior Boiler + Saudi Cast — synergies et cross-selling à capturer en 2026–2027.' },
    ],
    position: {
      type: 'Satellite',
      sizing: 'Entrée complète sous $260 (3%)',
      horizon: '3–5 ans',
      entryZone: '<$260 — correction construction ou macro',
      analyticalStop: 'Si FCF margin tombe sous 10% deux années consécutives · Si les acquisitions Q4 2025 déçoivent à l\'intégration · Si data center demand ralentit structurellement',
    },
    cycle: {
      nature: 'cyclical',
      assessment: 'Business cyclique sur la partie résidentielle (en réduction) mais séculaire sur data centers et infrastructure. Mix en amélioration vers plus de résilience.',
      fxExposure: 'Revenus ~35% Europe (EUR) · Exposition USD dominant mais diversification géographique notable',
      cyclePosition: 'Reprise en cours sur non-résidentiel. Data center = moteur acyclique en croissance indépendante.',
      macroRisks: [
        'Récession immobilière commerciale ralentissant la construction',
        'Impact tarifs douaniers sur les composants (incorporé dans guidance 2026)',
        'Dual-class shares — famille Horne contrôle via actions B',
      ],
    },
  },

  // ─────────────────────────────────────────────────────────
  // KEYENCE — 6861
  // ─────────────────────────────────────────────────────────
  {
    id: '6861',
    name: 'Keyence',
    sector: 'Automation industrielle · Capteurs · Machine Vision',
    currency: 'JPY',
    twelveDataSymbol: '6861:TSE',
    verdict: 'watch',
    entryZone: '<¥52,000',
    currentPrice: 57500,
    fcfPerShare: 4460,
    fcfGrowthRate: 0.09,
    fcfMargin: 37.7,
    filters: [
      { id: 'F1', name: 'ROIC (ex-cash)', threshold: '>15%', value: '~25–35%', status: 'warn' },
      { id: 'F2', name: 'Forward P/E', threshold: '<30x', value: '35.8x', status: 'fail' },
      { id: 'F3', name: 'Dette / EBITDA', threshold: '<3x', value: '0x', status: 'pass' },
      { id: 'F4', name: 'Marge FCF', threshold: '>15%', value: '37.7%', status: 'pass' },
      { id: 'F5', name: 'EPS Growth', threshold: '>10%', value: '+8%', status: 'warn' },
    ],
    moat: [
      { name: 'Pricing Power', score: 1 },
      { name: 'Switching Costs', score: 1 },
      { name: 'Effets réseau (data)', score: 1 },
      { name: 'Actifs intangibles', score: 1 },
      { name: 'Barrières réglementaires', score: 1 },
      { name: 'Économies d\'échelle', score: 1 },
    ],
    moatScore: 6,
    thesis: [
      '<strong>Gross margin 83.79% sur hardware industriel</strong> — performance unique au monde dans ce secteur. Niveau software sur du matériel physique. Irréplicable.',
      '<strong>Operating margin 52% — FCF 37.7%</strong> — le plus élevé de toute l\'industrie des équipements industriels mondiaux. Reflet du modèle fabless + vente directe.',
      '<strong>Modèle fabless + 15,000 ingénieurs commerciaux directs</strong> — zéro distributeur. Keyence contrôle tout de la conception à la vente. Barrière à répliquer considérable.',
      '<strong>ROIC distordu par ¥583Mds de cash</strong> — le business opérationnel génère un ROIC de 25–35%. Le cash accumulé (culture japonaise) masque la rentabilité réelle.',
    ],
    dcf: [
      { label: 'Bear', value: '¥44,000', marginOfSafety: -23, hypothesis: 'Automation ralentit, concurrence chinoise, Chine géopolitique, WACC 10%' },
      { label: 'Base', value: '¥65,000–75,000', marginOfSafety: 25, hypothesis: 'WACC 8.5%, EPS CAGR 9%, TGR 4% — scénario central' },
      { label: 'Bull', value: '¥90,000–105,000', marginOfSafety: 74, hypothesis: 'IA machine vision boom + distribution cash, CAGR 13%' },
    ],
    catalysts: [
      { title: 'Rebond automation 2026', description: 'Après 2 ans de normalisation capex post-Covid. Les analystes anticipent une reprise des investissements industriels en 2026.' },
      { title: 'IA Machine Vision', description: 'Capteurs intelligents = backbone de l\'industrie 4.0 et de la robotique. Keyence est le fournisseur naturel de la révolution IA industrielle.' },
      { title: 'Distribution cash accumulé', description: '¥583Mds de cash. Pression institutionnelle croissante sur le management pour augmenter le payout ratio ou les rachats.' },
    ],
    position: {
      type: 'Satellite',
      sizing: 'Entrée sous ¥52,000 sur correction automation ou macro japonaise (3%)',
      horizon: '3–5 ans',
      entryZone: '<¥52,000 — marge de sécurité 25%+ sur DCF base',
      analyticalStop: 'Si operating margin tombe sous 40% · Si concurrence chinoise prend >20% PDM sur segments core · Si ROIC opérationnel (ex-cash) tombe sous 15%',
    },
    cycle: {
      nature: 'cyclical',
      assessment: 'Business cyclique corrélé aux cycles capex industriels mondiaux. Mais moat et marges exceptionnellement stables à travers les cycles.',
      fxExposure: 'Revenus JPY — favorable pour investisseur EUR quand yen faible · Exposition Chine (~20% revenues) — risque géopolitique non négligeable',
      cyclePosition: 'Bas/milieu de cycle capex industriel. Reprise attendue 2026.',
      macroRisks: [
        'Ralentissement prolongé des dépenses capex industrielles en Chine',
        'Émergence de concurrents chinois low-cost (Hikvision, Keyvisio)',
        'Appréciation forte du yen comprimant les marges export',
      ],
    },
    sectorAdaptation: 'ROIC GAAP 11.65% distordu par ¥583Mds de cash excédentaire non investi. ROIC opérationnel ex-cash estimé à 25–35%.',
  },

  // ─────────────────────────────────────────────────────────
  // COCHLEAR — COH
  // ─────────────────────────────────────────────────────────
  {
    id: 'COH',
    name: 'Cochlear',
    sector: 'Medtech · Implants cochléaires · Audition',
    currency: 'AUD',
    twelveDataSymbol: 'COH:ASX',
    verdict: 'watchlist',
    entryZone: '<AUD 250',
    currentPrice: 172,
    fcfPerShare: 2.67,
    fcfGrowthRate: 0.11,
    fcfMargin: 7.5,
    filters: [
      { id: 'F1', name: 'ROIC', threshold: '>15%', value: '15.3%', status: 'pass' },
      { id: 'F2', name: 'Forward P/E', threshold: '<30x (hist. 35–55x)', value: '~29x', status: 'pass' },
      { id: 'F3', name: 'Dette / EBITDA', threshold: '<3x', value: '0.1x', status: 'pass' },
      { id: 'F4', name: 'Marge FCF', threshold: '>15%', value: '7.5%', status: 'fail' },
      { id: 'F5', name: 'EPS Growth', threshold: '>10%', value: '+9%', status: 'warn' },
    ],
    moat: [
      { name: 'Pricing Power', score: 1 },
      { name: 'Switching Costs (biologique)', score: 1 },
      { name: 'Effets réseau (base installée)', score: 1 },
      { name: 'Actifs intangibles', score: 1 },
      { name: 'Barrières réglementaires (FDA)', score: 1 },
      { name: 'Économies d\'échelle', score: 1 },
    ],
    moatScore: 6,
    thesis: [
      '<strong>~60% PDM mondiale sur implants cochléaires</strong> — leader incontesté. Moat biologique : une fois l\'implant posé, le patient reste dans l\'écosystème Cochlear pour la vie.',
      '<strong>Nucleus Nexa — premier smart implant firmware upgradeable</strong> — 20 ans de R&D. Nouveau super-cycle produit. Approbation FDA obtenue, déploiement US en cours.',
      '<strong>Marché sous-pénétré à 6%</strong> — seulement 6% des adultes éligibles aux USA ont reçu un implant. Runway décennal sur le seul marché américain.',
      '<strong>Correction -50% sur miss exécution</strong> — la dislocation est sur un retard de 6 mois du déploiement Nexa, pas sur une dégradation du moat. Guidance FY26 maintenue.',
    ],
    dcf: [
      { label: 'Bear', value: 'AUD 190–220', marginOfSafety: 20, hypothesis: 'Remboursement adverse, Nexa déçoit, concurrence MED-EL, WACC 10%' },
      { label: 'Base', value: 'AUD 280–320', marginOfSafety: 75, hypothesis: 'WACC 9%, NPAT CAGR 11%, TGR 4% — scénario central' },
      { label: 'Bull', value: 'AUD 380–440', marginOfSafety: 145, hypothesis: 'Nexa super-cycle + démence/audition adoption, CAGR 14%' },
    ],
    catalysts: [
      { title: 'H2 FY2026 — reprise Nexa', description: 'Résultats août 2026 = catalyseur binaire. 80% des unités déjà en Nexa à fin décembre 2025. Forte reprise H2 attendue.' },
      { title: 'Lien démence/audition', description: 'Nouvelles études cliniques établissant le lien entre perte auditive et démence. Expansion des indications cliniques = marché adressable x2.' },
      { title: 'Adultes & seniors', description: 'Nouveau axe stratégique — 85%+ des adultes éligibles ne sont pas traités. Programme referral pathway en cours de déploiement.' },
    ],
    position: {
      type: 'Satellite',
      sizing: 'Position satellite (2–3%) — risque exécution H2 FY2026',
      horizon: '3–5 ans',
      entryZone: '<AUD 250 — actuellement AUD 172 (zone d\'achat)',
      analyticalStop: 'Si guidance FY26 révisée à la baisse (résultats août 2026) · Si concurrent non-chirurgical équivalent émerge · Si taux de rétention patients chute sous 85%',
    },
    cycle: {
      nature: 'secular',
      assessment: 'Croissance séculaire — vieillissement démographique mondial + sous-pénétration massive. Légère composante cyclique sur les Services (upgrades processeurs).',
      fxExposure: 'Revenus 65%+ hors Australie — USD, EUR, JPY · Investisseur EUR = double FX AUD→EUR. Risque currency significatif.',
      cyclePosition: 'Creux d\'exécution temporaire sur Nexa. Fondamentaux intacts.',
      macroRisks: [
        'Tightening remboursement implants cochléaires par les systèmes de santé',
        'Nouveau miss exécution sur Nexa au H2 FY2026',
        'FX AUD/EUR défavorable comprimant les returns pour investisseur européen',
      ],
    },
    sectorAdaptation: 'Medtech premium — P/E historique normalisé 35–55x. À AUD 172, forward P/E ~29x = première fois sous 30x en 5 ans. Signal de dislocation fort.',
  },

  // ─────────────────────────────────────────────────────────
  // SPIRAX GROUP — SPX
  // ─────────────────────────────────────────────────────────
  {
    id: 'SPX',
    name: 'Spirax Group',
    sector: 'Gestion thermique vapeur · ETS · Watson-Marlow',
    currency: 'GBP',
    twelveDataSymbol: 'SPX:LSE',
    verdict: 'watchlist',
    entryZone: '<£60',
    currentPrice: 69.50,
    fcfPerShare: 1.30,
    fcfGrowthRate: 0.09,
    fcfMargin: 11.7,
    filters: [
      { id: 'F1', name: 'ROIC', threshold: '>15%', value: '13.1%', status: 'fail' },
      { id: 'F2', name: 'Forward P/E', threshold: '<30x', value: '21x', status: 'pass' },
      { id: 'F3', name: 'Dette / EBITDA', threshold: '<3x', value: '1.5x', status: 'pass' },
      { id: 'F4', name: 'Marge FCF', threshold: '>15%', value: '11.7%', status: 'fail' },
      { id: 'F5', name: 'EPS Growth', threshold: '>10%', value: '+3%', status: 'fail' },
    ],
    moat: [
      { name: 'Pricing Power', score: 1 },
      { name: 'Switching Costs', score: 1 },
      { name: 'Effets réseau', score: 0 },
      { name: 'Actifs intangibles', score: 1 },
      { name: 'Barrières réglementaires', score: 1 },
      { name: 'Économies d\'échelle', score: 1 },
    ],
    moatScore: 5,
    thesis: [
      '<strong>Leader mondial systèmes vapeur industriels depuis 135 ans</strong> — ingénieurs Spirax intégrés chez les clients pharma, agroalimentaire, chimie. Switching implique requalification complète.',
      '<strong>Restructuring ETS complété en 2025</strong> — £40M d\'économies annuelles attendues dès 2026. Programme terminé, marges en recovery vers les niveaux historiques.',
      '<strong>ROCE 36% — rentabilité opérationnelle élevée</strong> — bien au-dessus du ROIC GAAP 13.1%. La rentabilité opérationnelle du business core est forte.',
      '<strong>Décarbonation industrielle</strong> — vapeur + chauffage électrique = solutions de transition énergétique. Spirax est un bénéficiaire naturel des réglementations énergie.',
    ],
    dcf: [
      { label: 'Bear', value: '£50–60', marginOfSafety: -10, hypothesis: 'ETS drag persistant, Chine faible durable, FX headwind, WACC 10%' },
      { label: 'Base', value: '£75–90', marginOfSafety: 22, hypothesis: 'WACC 9.5%, EPS CAGR 9%, TGR 3% — scénario central' },
      { label: 'Bull', value: '£100–115', marginOfSafety: 53, hypothesis: 'ETS turnaround réussi + Chine recovery, CAGR 12%' },
    ],
    catalysts: [
      { title: 'Synergies ETS restructuring 2026', description: '£40M d\'économies annuelles qui se matérialisent en 2026. Impact direct sur EBIT margin et FCF.' },
      { title: 'Reprise industrielle chinoise', description: 'Chine représente ~10–15% des revenus. Une normalisation de la demande industrielle = tailwind significatif.' },
      { title: 'Watson-Marlow croissance pharma', description: 'Segment pompes péristaltiques pour pharma/biotech — croissance séculaire, marges premium, indépendant du cycle industrial.' },
    ],
    position: {
      type: 'Watchlist',
      sizing: 'Entrée opportuniste sous £60 sur correction macro ou sectorielle (2–3%)',
      horizon: '3–5 ans',
      entryZone: '<£60 — marge de sécurité 25%+ sur DCF base',
      analyticalStop: 'Si ROIC ne dépasse pas 15% d\'ici fin 2027 · Si ETS reste en perte opérationnelle après restructuring · Si Watson-Marlow perd des parts de marché pharma',
    },
    cycle: {
      nature: 'cyclical',
      assessment: 'Business cyclique sur ETS et Steam core (capex industriel). Watson-Marlow est séculaire (pharma). Mix en amélioration post-restructuring.',
      fxExposure: 'Revenus £ mais ~70% hors UK — USD, EUR, CNY, JPY · Headwind structurel GBP fort vs USD/CNY pour investisseur EUR',
      cyclePosition: 'Bas de cycle post-acquisition ETS difficile. Recovery en cours.',
      macroRisks: [
        'ETS Electric Thermal Solutions ne délivre pas les synergies promises',
        'Ralentissement industriel Chine prolongé',
        'Nouveau CEO 2026 — risque de transition managériale',
      ],
    },
  },
]

// ============================================================
// HELPERS
// ============================================================

export function getStockById(id: string): Stock | undefined {
  return stocks.find(s => s.id === id)
}

export function getStocksByVerdict(verdict: Verdict): Stock[] {
  return stocks.filter(s => s.verdict === verdict)
}

export function calcFCFTarget(fcfPerShare: number, g: number, r = 0.15): number {
  if (r <= g) return 0
  return (fcfPerShare * Math.pow(1 + g, 3)) / (r - g)
}

export function calcUpside(currentPrice: number, targetPrice: number): number {
  return ((targetPrice - currentPrice) / currentPrice) * 100
}

export type UpsideColor = 'deep-green' | 'green' | 'light-green' | 'amber' | 'orange' | 'red' | 'deep-red'

export function getUpsideColor(pct: number): UpsideColor {
  if (pct > 40) return 'deep-green'
  if (pct > 20) return 'green'
  if (pct > 5)  return 'light-green'
  if (pct > -5) return 'amber'
  if (pct > -20) return 'orange'
  if (pct > -35) return 'red'
  return 'deep-red'
}

export const upsideColorMap: Record<UpsideColor, string> = {
  'deep-green':  '#34d399',
  'green':       '#6ee7b7',
  'light-green': '#a7f3d0',
  'amber':       '#fbbf24',
  'orange':      '#f97316',
  'red':         '#f87171',
  'deep-red':    '#ef4444',
}

export type StatusLabel = 'FORTE DÉCOTE' | 'DÉCOTE' | 'LÉGÈRE DÉCOTE' | 'JUSTE PRIX' | 'LÉGÈRE PRIME' | 'PRIME' | 'FORTE PRIME'

export function getStatusLabel(pct: number): StatusLabel {
  if (pct > 40) return 'FORTE DÉCOTE'
  if (pct > 20) return 'DÉCOTE'
  if (pct > 5)  return 'LÉGÈRE DÉCOTE'
  if (pct > -5) return 'JUSTE PRIX'
  if (pct > -20) return 'LÉGÈRE PRIME'
  if (pct > -35) return 'PRIME'
  return 'FORTE PRIME'
}

// Twelve Data ticker mapping
export const twelveDataTickers = stocks.map(s => s.twelveDataSymbol).join(',')
