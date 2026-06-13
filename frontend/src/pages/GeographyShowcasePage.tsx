import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Focus,
  Globe2,
  Layers,
  Map,
  PencilLine,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

import agrarianImage from "../assets/geography-agrarian-chapter.png";
import agrarianLandUseImage from "../assets/geography-agrarian-land-use.png";
import atlasBrazil from "../assets/geography-atlas-brazil.png";
import climateFactorsImage from "../assets/geography-climate-factors.png";
import climateImage from "../assets/geography-climate-chapter.png";
import hydrographyBasinImage from "../assets/geography-hydrography-basin.png";
import hydrographyImage from "../assets/geography-hydrography-chapter.png";
import { cn } from "../lib/utils";

type ArticleKey = "clima" | "hidrografia" | "agraria";

type Annotation = {
  label: string;
  title: string;
  text: string;
  x: number;
  y: number;
};

type Concept = {
  term: string;
  definition: string;
};

type Subtopic = {
  title: string;
  paragraphs: string[];
};

type SecondaryFigure = {
  image: string;
  alt: string;
  caption: string;
};

type ReviewQuestion = {
  question: string;
  answer: string;
};

type ArticleSection = {
  key: ArticleKey;
  number: string;
  title: string;
  shortTitle: string;
  deck: string;
  image: string;
  caption: string;
  paragraphs: string[];
  subtopics: Subtopic[];
  secondaryFigure: SecondaryFigure;
  concepts: Concept[];
  annotations: Annotation[];
  important: string[];
  questions: ReviewQuestion[];
};

const articleSections: ArticleSection[] = [
  {
    key: "clima",
    number: "1",
    title: "Clima: os ritmos da atmosfera",
    shortTitle: "Clima",
    deck: "O clima organiza a distribuição das chuvas, das temperaturas, dos biomas e das atividades humanas.",
    image: climateImage,
    caption:
      "Figura 1. Representação de massas de ar, nebulosidade e áreas de transição climática no território brasileiro.",
    paragraphs: [
      "Clima é o comportamento médio da atmosfera em uma região durante longos períodos. Diferente do tempo atmosférico, que descreve as condições de hoje, o clima revela padrões que se repetem e ajudam a explicar paisagens, modos de vida e formas de ocupação.",
      "No Brasil, a diversidade climática aparece por causa da latitude, altitude, relevo, maritimidade, continentalidade e atuação das massas de ar. Esses fatores explicam por que há áreas úmidas, regiões semiáridas, zonas subtropicais e trechos sujeitos a frentes frias.",
      "Estudar clima não é apenas decorar nomes. É entender como chuva, calor, seca, umidade e eventos extremos influenciam rios, solos, agricultura, cidades e riscos ambientais.",
    ],
    subtopics: [
      {
        title: "Fatores que controlam o clima",
        paragraphs: [
          "A latitude interfere na quantidade de radiação solar recebida. Áreas próximas à Linha do Equador tendem a ser mais quentes, enquanto áreas mais afastadas apresentam maior variação térmica ao longo do ano.",
          "A altitude reduz a temperatura média: quanto mais alto o relevo, menor tende a ser a temperatura. A maritimidade suaviza o clima em áreas litorâneas, enquanto a continentalidade aumenta a amplitude térmica em áreas interiores.",
        ],
      },
      {
        title: "Principais climas do Brasil",
        paragraphs: [
          "O clima equatorial é quente e úmido, comum na Amazônia. O tropical apresenta verão chuvoso e inverno mais seco. O semiárido tem chuvas escassas e irregulares, enquanto o subtropical, no Sul, possui estações mais marcadas.",
          "Esses tipos climáticos não aparecem isolados da paisagem: eles influenciam vegetação, rios, solos, atividades agrícolas, moradias e riscos ambientais como secas, enchentes e deslizamentos.",
        ],
      },
      {
        title: "Clima e sociedade",
        paragraphs: [
          "A sociedade precisa se adaptar aos ritmos climáticos. Em áreas sujeitas à seca, tornam-se importantes cisternas, irrigação planejada e preservação de nascentes. Em áreas muito chuvosas, planejamento urbano e drenagem reduzem riscos de inundação.",
          "As mudanças climáticas tornam esse tema ainda mais importante, pois ampliam a frequência de eventos extremos e exigem políticas públicas de prevenção, monitoramento e adaptação.",
        ],
      },
    ],
    secondaryFigure: {
      image: climateFactorsImage,
      alt: "Paisagem brasileira mostrando relevo, litoral, chuva e área seca como fatores climáticos.",
      caption:
        "Figura 1.2. Relevo, proximidade do mar, cobertura vegetal e interiorização ajudam a explicar diferentes condições climáticas.",
    },
    concepts: [
      {
        term: "Tempo atmosférico",
        definition: "Estado momentâneo da atmosfera: chuva hoje, calor agora, vento neste período.",
      },
      {
        term: "Clima",
        definition: "Média histórica das condições atmosféricas observada ao longo de muitos anos.",
      },
      {
        term: "Massa de ar",
        definition: "Grande volume de ar com temperatura e umidade próprias, capaz de alterar chuvas e temperaturas.",
      },
    ],
    annotations: [
      {
        label: "A",
        title: "Umidade e vegetação",
        text: "Áreas vegetadas devolvem água à atmosfera pela evapotranspiração, ajudando na formação de chuvas.",
        x: 24,
        y: 42,
      },
      {
        label: "B",
        title: "Transição climática",
        text: "Entre áreas úmidas e secas surgem paisagens de transição, onde a chuva se torna mais irregular.",
        x: 55,
        y: 52,
      },
      {
        label: "C",
        title: "Seca e adaptação",
        text: "Quando a chuva é instável, a sociedade precisa planejar armazenamento, irrigação e uso cuidadoso da água.",
        x: 78,
        y: 62,
      },
    ],
    important: [
      "Clima e tempo atmosférico não são sinônimos.",
      "Massas de ar influenciam chuva, frio, calor e umidade.",
      "O clima ajuda a explicar biomas, rios e agricultura.",
    ],
    questions: [
      {
        question: "Qual é a diferença entre tempo atmosférico e clima?",
        answer:
          "Tempo atmosférico é momentâneo, como a chuva ou o calor de hoje. Clima é a média histórica dessas condições durante muitos anos.",
      },
      {
        question: "Como altitude, latitude e maritimidade interferem na temperatura?",
        answer:
          "Latitude altera a incidência solar, altitude tende a reduzir a temperatura e maritimidade suaviza variações térmicas perto do litoral.",
      },
      {
        question: "Por que o clima influencia a agricultura e o abastecimento de água?",
        answer:
          "Porque chuva, seca, calor e frio definem disponibilidade hídrica, calendário agrícola, riscos de perda de safra e necessidade de irrigação.",
      },
    ],
  },
  {
    key: "hidrografia",
    number: "2",
    title: "Hidrografia: a rede das águas",
    shortTitle: "Hidrografia",
    deck: "Rios, bacias, aquíferos e regimes fluviais conectam relevo, clima, cidades e economia.",
    image: hydrographyImage,
    caption:
      "Figura 2. Vista de uma rede fluvial, com rio principal, afluentes e planícies de inundação.",
    paragraphs: [
      "Hidrografia é o estudo das águas superficiais e subterrâneas. Ela analisa rios, lagos, aquíferos, bacias hidrográficas, regimes fluviais e as formas como a sociedade utiliza esses recursos.",
      "Uma bacia hidrográfica é a área drenada por um rio principal e seus afluentes. Seus limites são definidos por divisores de águas, geralmente áreas mais elevadas do relevo que direcionam a água para caminhos diferentes.",
      "No Brasil, a hidrografia é central para abastecimento, geração de energia, irrigação, transporte, pesca, turismo e preservação ambiental. Por isso, o uso da água pode gerar cooperação, mas também conflitos.",
    ],
    subtopics: [
      {
        title: "Bacias hidrográficas",
        paragraphs: [
          "Uma bacia hidrográfica funciona como uma unidade natural de organização do território. A água da chuva escorre pelas encostas, infiltra no solo ou segue para córregos, rios e lagos, formando uma rede de drenagem.",
          "No Brasil, grandes bacias como Amazônica, Tocantins-Araguaia, São Francisco, Paraná, Paraguai e Atlântico influenciam energia, transporte, agricultura, pesca, abastecimento urbano e conservação de ecossistemas.",
        ],
      },
      {
        title: "Regime fluvial e chuvas",
        paragraphs: [
          "O regime fluvial indica como a vazão de um rio muda durante o ano. Em áreas de clima tropical, muitos rios aumentam o volume no período chuvoso e diminuem no período seco.",
          "Quando o desmatamento remove a vegetação das margens, o solo fica mais exposto à erosão, aumenta o assoreamento e a qualidade da água pode piorar. Por isso, matas ciliares são essenciais para proteger os cursos d'água.",
        ],
      },
      {
        title: "Água como recurso estratégico",
        paragraphs: [
          "A água é usada para beber, produzir alimentos, gerar energia, transportar mercadorias, manter ecossistemas e sustentar atividades econômicas. Como muitos usos acontecem ao mesmo tempo, é preciso gestão.",
          "Conflitos pelo uso da água podem envolver cidades, indústrias, agricultores, comunidades tradicionais e áreas de preservação. A geografia ajuda a entender onde a água está, quem a utiliza e quais impactos surgem desse uso.",
        ],
      },
    ],
    secondaryFigure: {
      image: hydrographyBasinImage,
      alt: "Bacia hidrográfica com rio principal, afluentes, relevo e áreas de ocupação humana.",
      caption:
        "Figura 2.2. A bacia hidrográfica integra relevo, rios, áreas úmidas, vegetação e usos humanos do território.",
    },
    concepts: [
      {
        term: "Bacia hidrográfica",
        definition: "Área drenada por um rio principal, seus afluentes e subafluentes.",
      },
      {
        term: "Regime fluvial",
        definition: "Variação do volume de água de um rio ao longo do ano, geralmente ligada às chuvas.",
      },
      {
        term: "Divisor de águas",
        definition: "Área elevada que separa o escoamento de águas para bacias diferentes.",
      },
    ],
    annotations: [
      {
        label: "A",
        title: "Rio principal",
        text: "O rio principal organiza a drenagem da bacia e recebe água de diferentes afluentes.",
        x: 46,
        y: 46,
      },
      {
        label: "B",
        title: "Afluentes",
        text: "Afluentes ampliam a rede de drenagem e revelam como a água se espalha pelo relevo.",
        x: 32,
        y: 35,
      },
      {
        label: "C",
        title: "Planície de inundação",
        text: "Áreas baixas podem receber cheias, fertilizar solos e também criar riscos para a ocupação humana.",
        x: 67,
        y: 61,
      },
    ],
    important: [
      "Bacias hidrográficas conectam relevo, clima e sociedade.",
      "O regime dos rios depende muito do regime de chuvas.",
      "A água é recurso natural, econômico, social e político.",
    ],
    questions: [
      {
        question: "O que é uma bacia hidrográfica?",
        answer:
          "É a área drenada por um rio principal e seus afluentes, delimitada por divisores de águas no relevo.",
      },
      {
        question: "Como o regime de chuvas modifica a vazão dos rios?",
        answer:
          "Em períodos chuvosos, a vazão tende a aumentar; em períodos secos, diminui. Isso afeta abastecimento, energia, pesca e agricultura.",
      },
      {
        question: "Por que o uso da água pode gerar conflitos no território?",
        answer:
          "Porque cidades, indústrias, agricultores, energia, lazer e preservação ambiental podem disputar o mesmo recurso em uma bacia.",
      },
    ],
  },
  {
    key: "agraria",
    number: "3",
    title: "Geografia agrária: terra, trabalho e produção",
    shortTitle: "Geografia agrária",
    deck: "O campo brasileiro reúne agricultura familiar, agronegócio, desigualdade fundiária e impactos ambientais.",
    image: agrarianImage,
    caption:
      "Figura 3. Paisagem rural com áreas produtivas, limites de propriedade e contato com vegetação natural.",
    paragraphs: [
      "Geografia agrária estuda o uso da terra, a organização da produção, a distribuição das propriedades, as relações de trabalho e os conflitos no campo. Ela não observa apenas plantações: analisa também quem produz, para quem produz e com quais consequências.",
      "A estrutura fundiária brasileira é marcada pela concentração de terras. Ao mesmo tempo, o campo combina agricultura familiar, agronegócio, tecnologia, exportações, produção de alimentos para o mercado interno e disputas por água, solo e território.",
      "A expansão agrícola pode aumentar a produção, mas também pode pressionar biomas, comunidades tradicionais e recursos hídricos. Por isso, clima e hidrografia aparecem como bases naturais fundamentais para compreender a questão agrária.",
    ],
    subtopics: [
      {
        title: "Questão agrária e estrutura fundiária",
        paragraphs: [
          "A questão agrária envolve a forma como a terra é distribuída, apropriada e utilizada. Quando poucas propriedades concentram grandes áreas, surgem desigualdades no acesso à terra, ao crédito, à tecnologia e à renda.",
          "A estrutura fundiária brasileira tem origem histórica na colonização, nas grandes propriedades e na produção voltada ao mercado externo. Esse passado ajuda a explicar conflitos por terra e debates sobre reforma agrária.",
        ],
      },
      {
        title: "Agronegócio e agricultura familiar",
        paragraphs: [
          "O agronegócio envolve cadeias produtivas integradas à tecnologia, máquinas, crédito, armazenagem, transporte, indústria e exportação. Costuma operar em grandes áreas e produzir commodities como soja, milho, algodão, carne e açúcar.",
          "A agricultura familiar geralmente ocorre em menor escala, com trabalho realizado pela própria família. Ela é muito importante para a produção de alimentos que abastecem o mercado interno, como feijão, mandioca, hortaliças, leite e frutas.",
        ],
      },
      {
        title: "Campo, ambiente e tecnologia",
        paragraphs: [
          "A modernização do campo aumentou a produtividade, mas também modificou relações de trabalho e intensificou o uso de máquinas, fertilizantes, irrigação e logística. Nem todos os produtores têm acesso igual a essas tecnologias.",
          "A expansão da fronteira agrícola pode causar desmatamento, perda de biodiversidade, contaminação da água e pressão sobre povos indígenas, quilombolas e comunidades tradicionais. Por isso, produção e preservação precisam ser analisadas juntas.",
        ],
      },
    ],
    secondaryFigure: {
      image: agrarianLandUseImage,
      alt: "Paisagem rural mostrando agricultura familiar, grandes lavouras, vegetação preservada e estruturas de armazenagem.",
      caption:
        "Figura 3.2. A paisagem agrária revela contrastes entre pequenas propriedades, grandes lavouras, infraestrutura e áreas preservadas.",
    },
    concepts: [
      {
        term: "Estrutura fundiária",
        definition: "Forma como as terras rurais estão distribuídas entre pequenas, médias e grandes propriedades.",
      },
      {
        term: "Agronegócio",
        definition: "Produção agrícola integrada a tecnologia, crédito, logística, indústria e exportação.",
      },
      {
        term: "Agricultura familiar",
        definition: "Produção realizada por famílias, muito importante para alimentos do mercado interno.",
      },
    ],
    annotations: [
      {
        label: "A",
        title: "Parcelas produtivas",
        text: "O desenho dos lotes revela diferenças de escala, técnica, investimento e acesso a recursos.",
        x: 27,
        y: 55,
      },
      {
        label: "B",
        title: "Grandes cultivos",
        text: "Áreas extensas e padronizadas indicam produção mecanizada e conexão com mercados amplos.",
        x: 59,
        y: 43,
      },
      {
        label: "C",
        title: "Borda ambiental",
        text: "O contato entre cultivo e vegetação natural mostra a importância do manejo e da conservação.",
        x: 78,
        y: 30,
      },
    ],
    important: [
      "A questão agrária envolve terra, trabalho, renda e poder.",
      "Agricultura familiar e agronegócio têm escalas e funções diferentes.",
      "Produção rural depende de clima, água, solo e infraestrutura.",
    ],
    questions: [
      {
        question: "Qual é a diferença entre estrutura fundiária e produção agrícola?",
        answer:
          "Estrutura fundiária trata da distribuição das terras. Produção agrícola trata do que é cultivado, como é produzido e para qual mercado.",
      },
      {
        question: "Como agricultura familiar e agronegócio participam da economia brasileira?",
        answer:
          "A agricultura familiar abastece muitos alimentos do mercado interno, enquanto o agronegócio se destaca em cadeias mecanizadas e exportações.",
      },
      {
        question: "Quais impactos ambientais podem surgir com a expansão da fronteira agrícola?",
        answer:
          "Podem ocorrer desmatamento, erosão, contaminação da água, perda de biodiversidade e pressão sobre comunidades tradicionais.",
      },
    ],
  },
];

const sources = [
  "IBGE Educa: território, população e campo brasileiro.",
  "ANA: bacias hidrográficas e gestão das águas.",
  "Embrapa: agricultura, solos e produção rural.",
  "Atlas Escolar: clima, relevo e organização do espaço brasileiro.",
];

const atlasPlates = [
  {
    label: "Prancha I",
    title: "Massas de ar e transições climáticas",
    image: climateImage,
    alt: "Prancha ilustrada sobre massas de ar e áreas climáticas.",
  },
  {
    label: "Prancha II",
    title: "Fatores do clima no território",
    image: climateFactorsImage,
    alt: "Paisagem comparando relevo, litoral, umidade e áreas secas.",
  },
  {
    label: "Prancha III",
    title: "Bacias, afluentes e planícies",
    image: hydrographyImage,
    alt: "Rede fluvial com rios, afluentes e planícies de inundação.",
  },
  {
    label: "Prancha IV",
    title: "A bacia hidrográfica como sistema",
    image: hydrographyBasinImage,
    alt: "Bacia hidrográfica com relevo, cursos d'água e ocupação humana.",
  },
  {
    label: "Prancha V",
    title: "Estrutura agrária e uso da terra",
    image: agrarianImage,
    alt: "Paisagem rural com propriedades, lavouras e vegetação natural.",
  },
  {
    label: "Prancha VI",
    title: "Contrastes da produção rural",
    image: agrarianLandUseImage,
    alt: "Áreas rurais com agricultura familiar, grandes lavouras e infraestrutura.",
  },
  {
    label: "Prancha VII",
    title: "Mapa-síntese do Brasil",
    image: atlasBrazil,
    alt: "Mapa do Brasil em perspectiva com camadas físicas e humanas.",
  },
];

function scrollToSection(id: string) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function LegacyGeographyShowcasePage() {
  const [activeSection, setActiveSection] = useState<ArticleKey>("clima");
  const [query, setQuery] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function updateProgress() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const searchMatches = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query.trim());
    if (!normalizedQuery) {
      return [];
    }

    return articleSections.filter((section) =>
      [
        section.title,
        section.deck,
        section.caption,
        section.secondaryFigure.caption,
        ...section.paragraphs,
        ...section.subtopics.flatMap((subtopic) => [subtopic.title, ...subtopic.paragraphs]),
        ...section.concepts.flatMap((concept) => [concept.term, concept.definition]),
        ...section.important,
        ...section.questions.flatMap((item) => [item.question, item.answer]),
      ]
        .join(" ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  function handleNavigate(section: ArticleKey) {
    setActiveSection(section);
    scrollToSection(section);
  }

  return (
    <div className={cn("article-root", focusMode && "article-focus-mode")}>
      <ArticleHeader
        query={query}
        onQueryChange={setQuery}
        readingProgress={readingProgress}
        focusMode={focusMode}
        onToggleFocus={() => setFocusMode((current) => !current)}
      />

      <div className="article-shell">
        <aside className="article-toc" aria-label="Sumário do artigo">
          <span className="article-aside-title">Sumário</span>
          <button type="button" onClick={() => scrollToSection("resumo")}>
            Resumo
          </button>
          {articleSections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => handleNavigate(section.key)}
              className={cn(activeSection === section.key && "is-current")}
            >
              {section.number}. {section.shortTitle}
            </button>
          ))}
          <button type="button" onClick={() => scrollToSection("sintese")}>
            Síntese
          </button>
        </aside>

        <main className="article-main">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="article-paper"
          >
            <header id="resumo" className="article-title-block">
              <span className="article-volume-mark">Atlas escolar ilustrado | caderno de pesquisa</span>
              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.56, ease: "easeOut" }}
              >
                Livro Vivo de Geografia
              </motion.h1>
              <p className="article-subtitle">Clima, Hidrografia e Geografia Agrária</p>
              <div className="article-meta">
                <span>Geografia do Brasil</span>
                <span>Material de estudo</span>
                <span>Atualizado em 2026</span>
              </div>
              <div className="article-title-actions">
                <motion.button
                  type="button"
                  onClick={() => handleNavigate("clima")}
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  Começar leitura
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => scrollToSection("sintese")}
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  Ver síntese
                </motion.button>
              </div>
            </header>

            <section className="article-abstract" aria-labelledby="abstract-title">
              <h2 id="abstract-title">Resumo</h2>
              <p>
                Este artigo apresenta três temas centrais da geografia brasileira: o clima, a hidrografia e a
                geografia agrária. A proposta é mostrar como natureza e sociedade estão conectadas por meio das
                paisagens, da água, do trabalho no campo e das formas de uso do território.
              </p>
            </section>

            <figure className="article-cover-figure">
              <img src={atlasBrazil} alt="Mapa do Brasil em perspectiva, com rios e áreas produtivas." />
              <figcaption>
                Imagem de abertura. O território brasileiro pode ser lido como um conjunto de camadas: clima, águas,
                relevo, produção e sociedade.
              </figcaption>
            </figure>

            <AtlasBuildSection />

            <ChapterStackPreview onNavigate={handleNavigate} />

            {articleSections.map((section) => (
              <ArticleSectionBlock
                key={section.key}
                section={section}
                onVisible={() => setActiveSection(section.key)}
              />
            ))}

            <section id="sintese" className="article-synthesis">
              <h2>Síntese final</h2>
              <p>
                A geografia mostra que natureza e sociedade não ficam separadas. O clima influencia a disponibilidade
                de água; a água condiciona cidades, energia e agricultura; e o campo transforma o espaço por meio do
                trabalho, da tecnologia e dos conflitos pelo uso da terra.
              </p>
              <blockquote>
                Para explicar ao professor: clima, hidrografia e geografia agrária formam um sistema. Eles ajudam a
                entender por que o Brasil tem paisagens tão diferentes e por que o uso do território exige planejamento.
              </blockquote>
            </section>
          </motion.article>
        </main>

        <aside className="article-notes" aria-label="Notas e busca">
          <div className="article-side-box">
            <span className="article-aside-title">Busca no artigo</span>
            {query.trim() ? (
              searchMatches.length ? (
                <ul className="article-search-results">
                  {searchMatches.map((match) => (
                    <li key={match.key}>
                      <button type="button" onClick={() => handleNavigate(match.key)}>
                        {match.shortTitle}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhuma seção encontrada.</p>
              )
            ) : (
              <p>Digite um termo no topo para localizar clima, água, campo, agricultura, bacias ou conceitos.</p>
            )}
          </div>

          <div className="article-side-box">
            <span className="article-aside-title">Notas</span>
            <p>
              Cada matéria tem uma figura principal com pontos clicáveis e uma figura complementar para aprofundar a
              explicação, como em um atlas comentado.
            </p>
          </div>

          <div className="article-side-box">
            <span className="article-aside-title">Referências para estudo</span>
            <ol className="article-source-list">
              {sources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ol>
          </div>
        </aside>
      </div>

      <FloatingReadingTools
        progress={readingProgress}
        focusMode={focusMode}
        onToggleFocus={() => setFocusMode((current) => !current)}
      />
    </div>
  );
}

function AtlasBuildSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    function updateOffset() {
      const element = sectionRef.current;
      if (!element) {
        return;
      }

      const sectionTop = element.getBoundingClientRect().top + window.scrollY;
      const nextOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.22;
      setOffset(Math.max(0, nextOffset));
    }

    updateOffset();
    window.addEventListener("scroll", updateOffset, { passive: true });
    window.addEventListener("resize", updateOffset);
    return () => {
      window.removeEventListener("scroll", updateOffset);
      window.removeEventListener("resize", updateOffset);
    };
  }, [reduceMotion]);

  const firstRow = useMemo(
    () => [...atlasPlates.slice(0, 4), ...atlasPlates.slice(0, 4), ...atlasPlates.slice(0, 4)],
    [],
  );
  const secondRow = useMemo(
    () => [...atlasPlates.slice(3), ...atlasPlates.slice(3), ...atlasPlates.slice(3)],
    [],
  );

  return (
    <section ref={sectionRef} className="article-atlas-build" aria-labelledby="atlas-build-title">
      <div className="article-atlas-build-head">
        <span>Pranchas dinâmicas do atlas</span>
        <h2 id="atlas-build-title">Uma galeria visual para atravessar o conteúdo</h2>
        <p>
          Clima, água e campo aparecem como camadas de uma mesma leitura geográfica: cada imagem funciona como uma
          prancha de observação antes dos capítulos completos.
        </p>
      </div>

      <div className="article-marquee-window" aria-label="Galeria de imagens do atlas">
        <motion.div
          className="article-marquee-row"
          style={reduceMotion ? undefined : { transform: `translate3d(${offset - 140}px, 0, 0)` }}
        >
          {firstRow.map((plate, index) => (
            <MagneticPlate key={`${plate.label}-top-${index}`} className="article-plate-card">
              <img src={plate.image} alt={plate.alt} loading="lazy" />
              <span>{plate.label}</span>
              <strong>{plate.title}</strong>
            </MagneticPlate>
          ))}
        </motion.div>

        <motion.div
          className="article-marquee-row article-marquee-row-reverse"
          style={reduceMotion ? undefined : { transform: `translate3d(${-offset + 140}px, 0, 0)` }}
        >
          {secondRow.map((plate, index) => (
            <MagneticPlate key={`${plate.label}-bottom-${index}`} className="article-plate-card">
              <img src={plate.image} alt={plate.alt} loading="lazy" />
              <span>{plate.label}</span>
              <strong>{plate.title}</strong>
            </MagneticPlate>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function MagneticPlate({ children, className }: { children: ReactNode; className?: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (reduceMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / 18;
    const y = (event.clientY - (rect.top + rect.height / 2)) / 20;
    setPosition({ x, y });
  }

  function resetPosition() {
    setPosition({ x: 0, y: 0 });
  }

  return (
    <motion.div
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPosition}
      animate={
        reduceMotion
          ? undefined
          : {
              x: position.x,
              y: position.y,
              rotateX: -position.y * 0.35,
              rotateY: position.x * 0.35,
            }
      }
      transition={{ type: "spring", stiffness: 160, damping: 18, mass: 0.45 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

function ChapterStackPreview({ onNavigate }: { onNavigate: (section: ArticleKey) => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="article-chapter-stack" aria-labelledby="chapter-stack-title">
      <div className="article-chapter-stack-head">
        <span>Mapa de leitura</span>
        <h2 id="chapter-stack-title">Três capítulos, uma mesma paisagem</h2>
        <p>
          As matérias se conectam como folhas sobrepostas: atmosfera, rede das águas e organização produtiva do campo.
        </p>
      </div>

      <div className="article-stack-cards">
        {articleSections.map((section, index) => (
          <motion.button
            key={section.key}
            type="button"
            className="article-stack-card"
            style={{ top: `${96 + index * 18}px` }}
            onClick={() => onNavigate(section.key)}
            initial={reduceMotion ? false : { opacity: 0, y: 26, scale: 0.98 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.08, duration: 0.48, ease: "easeOut" }}
          >
            <span className="article-stack-number">{section.number.padStart(2, "0")}</span>
            <span className="article-stack-copy">
              <strong>{section.shortTitle}</strong>
              <span>{section.deck}</span>
            </span>
            <img src={section.secondaryFigure.image} alt={section.secondaryFigure.alt} loading="lazy" />
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function ArticleHeader({
  query,
  onQueryChange,
  readingProgress,
  focusMode,
  onToggleFocus,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  readingProgress: number;
  focusMode: boolean;
  onToggleFocus: () => void;
}) {
  return (
    <header className="article-header">
      <div className="article-progress" aria-hidden="true">
        <span style={{ width: `${readingProgress}%` }} />
      </div>
      <nav className="article-header-inner" aria-label="Navegação principal">
        <button type="button" onClick={() => scrollToSection("resumo")} className="article-brand">
          <Globe2 size={19} />
          <span>Livro Vivo de Geografia</span>
        </button>

        <div className="article-header-links" aria-label="Seções do artigo">
          {articleSections.map((section) => (
            <button key={section.key} type="button" onClick={() => scrollToSection(section.key)}>
              {section.shortTitle}
            </button>
          ))}
          <a href="#sintese">Síntese</a>
        </div>

        <div className="article-search">
          <Search size={16} />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar no artigo"
            aria-label="Buscar no artigo"
          />
        </div>

        <button
          type="button"
          onClick={onToggleFocus}
          className={cn("article-focus-button", focusMode && "is-active")}
          aria-pressed={focusMode}
        >
          <Focus size={16} />
          {focusMode ? "Sair do foco" : "Modo foco"}
        </button>
      </nav>
    </header>
  );
}

function ArticleSectionBlock({
  section,
  onVisible,
}: {
  section: ArticleSection;
  onVisible: () => void;
}) {
  const [activeAnnotation, setActiveAnnotation] = useState(0);
  const [activeConcept, setActiveConcept] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={section.key}
      className="article-section"
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.52, ease: "easeOut" }}
      onViewportEnter={onVisible}
    >
      <div className="article-section-heading">
        <span>{section.number}</span>
        <div>
          <h2>{section.title}</h2>
          <p>{section.deck}</p>
        </div>
      </div>

      <div className="article-prose">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <FigureWithAnnotations
        section={section}
        activeAnnotation={activeAnnotation}
        onAnnotationChange={setActiveAnnotation}
      />

      <div className="article-subtopics">
        {section.subtopics.map((subtopic, index) => (
          <motion.div
            key={subtopic.title}
            className="article-subtopic"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.05, duration: 0.42 }}
          >
            <h3>{subtopic.title}</h3>
            {subtopic.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </motion.div>
        ))}
      </div>

      <figure className="article-secondary-figure">
        <img src={section.secondaryFigure.image} alt={section.secondaryFigure.alt} />
        <figcaption>{section.secondaryFigure.caption}</figcaption>
      </figure>

      <div className="article-learning-grid">
        <div className="article-important">
          <h3>Ideias principais</h3>
          <ul>
            {section.important.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="article-glossary">
          <h3>Glossário rápido</h3>
          <div className="article-concept-list">
            {section.concepts.map((concept, index) => (
              <button
                key={concept.term}
                type="button"
                className={cn(index === activeConcept && "is-selected")}
                onClick={() => setActiveConcept(index)}
              >
                {concept.term}
              </button>
            ))}
          </div>
          <motion.p
            key={section.concepts[activeConcept].term}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <strong>{section.concepts[activeConcept].term}:</strong> {section.concepts[activeConcept].definition}
          </motion.p>
        </div>
      </div>

      <ReviewCards questions={section.questions} />
    </motion.section>
  );
}

function FigureWithAnnotations({
  section,
  activeAnnotation,
  onAnnotationChange,
}: {
  section: ArticleSection;
  activeAnnotation: number;
  onAnnotationChange: (index: number) => void;
}) {
  const selected = section.annotations[activeAnnotation];
  const reduceMotion = useReducedMotion();

  function goToPreviousAnnotation() {
    onAnnotationChange(activeAnnotation === 0 ? section.annotations.length - 1 : activeAnnotation - 1);
  }

  function goToNextAnnotation() {
    onAnnotationChange(activeAnnotation === section.annotations.length - 1 ? 0 : activeAnnotation + 1);
  }

  return (
    <figure className="article-figure">
      <div className="article-figure-media">
        <img src={section.image} alt={`Figura sobre ${section.shortTitle}.`} />
        {section.annotations.map((annotation, index) => (
          <button
            key={annotation.title}
            type="button"
            className={cn("article-marker", index === activeAnnotation && "is-active")}
            style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
            onClick={() => onAnnotationChange(index)}
            aria-label={`Mostrar nota ${annotation.label}: ${annotation.title}`}
          >
            {annotation.label}
          </button>
        ))}
      </div>
      <figcaption>{section.caption}</figcaption>
      <motion.div
        key={selected.title}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="article-annotation-note"
      >
        <span>Nota da figura {selected.label}</span>
        <h3>{selected.title}</h3>
        <p>{selected.text}</p>
        <div className="article-annotation-actions">
          <button type="button" onClick={goToPreviousAnnotation}>
            <ChevronLeft size={16} />
            Anterior
          </button>
          <button type="button" onClick={goToNextAnnotation}>
            Próxima
            <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>
    </figure>
  );
}

function ReviewCards({ questions }: { questions: ReviewQuestion[] }) {
  const [openIndex, setOpenIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <div className="article-review">
      <h3>Perguntas para revisar</h3>
      <div className="article-review-list">
        {questions.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.button
              key={item.question}
              type="button"
              className={cn("article-review-card", isOpen && "is-open")}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              aria-expanded={isOpen}
            >
              <span className="article-review-number">{index + 1}</span>
              <span className="article-review-copy">
                <strong>{item.question}</strong>
                {isOpen && (
                  <motion.span
                    initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                    animate={reduceMotion ? undefined : { opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircle2 size={16} />
                    {item.answer}
                  </motion.span>
                )}
              </span>
              <Eye size={17} className="article-review-eye" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function FloatingReadingTools({
  progress,
  focusMode,
  onToggleFocus,
}: {
  progress: number;
  focusMode: boolean;
  onToggleFocus: () => void;
}) {
  return (
    <div className="article-floating-tools" aria-label="Ferramentas de leitura">
      <span>{Math.round(progress)}%</span>
      <button type="button" onClick={onToggleFocus} aria-pressed={focusMode}>
        <Focus size={16} />
      </button>
      <button type="button" onClick={() => scrollToSection("resumo")} aria-label="Voltar ao topo">
        <ArrowUp size={16} />
      </button>
    </div>
  );
}

export function GeographyShowcasePage() {
  const [activeKey, setActiveKey] = useState<ArticleKey>("clima");
  const [query, setQuery] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [completed, setCompleted] = useState<Record<ArticleKey, boolean>>({
    clima: false,
    hidrografia: false,
    agraria: false,
  });
  const [activeAnnotation, setActiveAnnotation] = useState(0);
  const [activeConcept, setActiveConcept] = useState(0);
  const [openQuestion, setOpenQuestion] = useState(0);
  const [openSubtopic, setOpenSubtopic] = useState(0);
  const reduceMotion = useReducedMotion();

  const activeSection = articleSections.find((section) => section.key === activeKey) ?? articleSections[0];
  const completedCount = Object.values(completed).filter(Boolean).length;
  const completion = Math.round((completedCount / articleSections.length) * 100);

  const searchMatches = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query.trim());
    if (!normalizedQuery) {
      return [];
    }

    return articleSections.filter((section) =>
      [
        section.title,
        section.deck,
        section.caption,
        section.secondaryFigure.caption,
        ...section.paragraphs,
        ...section.subtopics.flatMap((subtopic) => [subtopic.title, ...subtopic.paragraphs]),
        ...section.concepts.flatMap((concept) => [concept.term, concept.definition]),
        ...section.important,
        ...section.questions.flatMap((item) => [item.question, item.answer]),
      ]
        .join(" ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  function chooseSection(sectionKey: ArticleKey) {
    setActiveKey(sectionKey);
    setActiveAnnotation(0);
    setActiveConcept(0);
    setOpenQuestion(0);
    setOpenSubtopic(0);
  }

  function toggleCompleted(sectionKey: ArticleKey) {
    setCompleted((current) => ({ ...current, [sectionKey]: !current[sectionKey] }));
  }

  const currentAnnotation = activeSection.annotations[activeAnnotation];
  const currentConcept = activeSection.concepts[activeConcept];
  const currentQuestion = activeSection.questions[openQuestion];

  return (
    <div className={cn("study-root", focusMode && "study-focus-mode")}>
      <header className="study-topbar">
        <button type="button" className="study-brand" onClick={() => chooseSection("clima")}>
          <Map size={18} />
          <span>Geografia em estudo</span>
        </button>

        <nav className="study-tabs" aria-label="Matérias">
          {articleSections.map((section) => (
            <button
              key={section.key}
              type="button"
              className={cn(activeKey === section.key && "is-active")}
              onClick={() => chooseSection(section.key)}
            >
              {section.shortTitle}
            </button>
          ))}
        </nav>

        <label className="study-search">
          <Search size={16} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar conceito"
            aria-label="Buscar conceito"
          />
        </label>

        <button
          type="button"
          className={cn("study-focus-button", focusMode && "is-active")}
          onClick={() => setFocusMode((current) => !current)}
          aria-pressed={focusMode}
        >
          <Focus size={16} />
          {focusMode ? "Sair do foco" : "Foco"}
        </button>
      </header>

      <main className="study-layout">
        <aside className="study-roadmap" aria-label="Roteiro de estudo">
          <div className="study-panel-heading">
            <span>Roteiro</span>
            <strong>{completion}% concluído</strong>
          </div>

          <div className="study-progress-track" aria-hidden="true">
            <span style={{ width: `${completion}%` }} />
          </div>

          <div className="study-roadmap-list">
            {articleSections.map((section) => (
              <button
                key={section.key}
                type="button"
                className={cn("study-roadmap-card", activeKey === section.key && "is-active")}
                onClick={() => chooseSection(section.key)}
              >
                <img src={section.secondaryFigure.image} alt="" loading="lazy" />
                <span>
                  <strong>{section.shortTitle}</strong>
                  <small>{completed[section.key] ? "Revisado" : "Em aberto"}</small>
                </span>
                {completed[section.key] ? <Check size={18} /> : <BookOpen size={18} />}
              </button>
            ))}
          </div>

          <div className="study-goal-card">
            <Clock size={18} />
            <div>
              <strong>Plano de hoje</strong>
              <p>Ler o capítulo ativo, explorar a imagem e responder 3 perguntas.</p>
            </div>
          </div>
        </aside>

        <section className="study-main" aria-label="Área principal de estudo">
          <motion.section
            className="study-hero"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="study-hero-copy">
              <span className="study-kicker">Mesa de estudos • Geografia</span>
              <h1>Clima, águas e campo em um roteiro visual.</h1>
              <p>
                Escolha uma matéria, observe a imagem anotada, leia os blocos principais e revise com perguntas rápidas.
              </p>

              <div className="study-hero-actions">
                <button type="button" onClick={() => toggleCompleted(activeSection.key)}>
                  {completed[activeSection.key] ? <CheckCircle2 size={17} /> : <Target size={17} />}
                  {completed[activeSection.key] ? "Marcado como revisado" : "Marcar como revisado"}
                </button>
                <button type="button" onClick={() => setOpenQuestion((current) => (current + 1) % activeSection.questions.length)}>
                  <Brain size={17} />
                  Próxima pergunta
                </button>
              </div>
            </div>

            <div className="study-hero-visual">
              <img src={atlasBrazil} alt="Mapa do Brasil com camadas de clima, água e produção." />
              <div className="study-hero-card">
                <Layers size={18} />
                <span>Capítulo ativo</span>
                <strong>{activeSection.shortTitle}</strong>
              </div>
            </div>
          </motion.section>

          <section className="study-workbench">
            <article className="study-lesson">
              <div className="study-lesson-head">
                <span>{activeSection.number}</span>
                <div>
                  <h2>{activeSection.title}</h2>
                  <p>{activeSection.deck}</p>
                </div>
              </div>

              <div className="study-figure-grid">
                <figure className="study-figure">
                  <img src={activeSection.image} alt={`Imagem de estudo sobre ${activeSection.shortTitle}.`} />
                  {activeSection.annotations.map((annotation, index) => (
                    <button
                      key={annotation.title}
                      type="button"
                      className={cn("study-map-pin", activeAnnotation === index && "is-active")}
                      style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
                      onClick={() => setActiveAnnotation(index)}
                      aria-label={`Mostrar nota ${annotation.label}: ${annotation.title}`}
                    >
                      {annotation.label}
                    </button>
                  ))}
                </figure>

                <motion.aside
                  key={currentAnnotation.title}
                  className="study-observation"
                  initial={reduceMotion ? false : { opacity: 0, x: 14 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <span>Observação {currentAnnotation.label}</span>
                  <h3>{currentAnnotation.title}</h3>
                  <p>{currentAnnotation.text}</p>
                </motion.aside>
              </div>

              <div className="study-reading">
                {activeSection.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="study-subtopic-grid">
                {activeSection.subtopics.map((subtopic, index) => (
                  <button
                    key={subtopic.title}
                    type="button"
                    className={cn("study-subtopic-card", openSubtopic === index && "is-open")}
                    onClick={() => setOpenSubtopic(index)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{subtopic.title}</strong>
                    {openSubtopic === index && <p>{subtopic.paragraphs.join(" ")}</p>}
                  </button>
                ))}
              </div>
            </article>

            <aside className="study-review">
              <div className="study-tool-card">
                <span className="study-tool-label">
                  <Sparkles size={15} />
                  Glossário ativo
                </span>
                <div className="study-concept-tabs">
                  {activeSection.concepts.map((concept, index) => (
                    <button
                      key={concept.term}
                      type="button"
                      className={cn(activeConcept === index && "is-active")}
                      onClick={() => setActiveConcept(index)}
                    >
                      {concept.term}
                    </button>
                  ))}
                </div>
                <p>
                  <strong>{currentConcept.term}:</strong> {currentConcept.definition}
                </p>
              </div>

              <div className="study-tool-card study-quiz-card">
                <span className="study-tool-label">
                  <PencilLine size={15} />
                  Revisão rápida
                </span>
                <strong>{currentQuestion.question}</strong>
                <motion.p
                  key={currentQuestion.answer}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentQuestion.answer}
                </motion.p>
                <div className="study-quiz-actions">
                  {activeSection.questions.map((question, index) => (
                    <button
                      key={question.question}
                      type="button"
                      className={cn(openQuestion === index && "is-active")}
                      onClick={() => setOpenQuestion(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </section>

          <StudyPlateShelf activeKey={activeKey} onChoose={chooseSection} />
        </section>

        <aside className="study-tools" aria-label="Ferramentas de estudo">
          <div className="study-score-card">
            <span>Progresso</span>
            <strong>{completion}%</strong>
            <p>{completedCount} de {articleSections.length} matérias revisadas.</p>
          </div>

          <div className="study-side-card">
            <span className="study-tool-label">
              <Search size={15} />
              Busca
            </span>
            {query.trim() ? (
              searchMatches.length ? (
                <div className="study-search-results">
                  {searchMatches.map((match) => (
                    <button key={match.key} type="button" onClick={() => chooseSection(match.key)}>
                      {match.shortTitle}
                    </button>
                  ))}
                </div>
              ) : (
                <p>Nenhuma matéria encontrada.</p>
              )
            ) : (
              <p>Procure por água, clima, bacia, agricultura, solo ou território.</p>
            )}
          </div>

          <div className="study-side-card">
            <span className="study-tool-label">
              <CheckCircle2 size={15} />
              Ideias principais
            </span>
            <ul>
              {activeSection.important.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}

function StudyPlateShelf({
  activeKey,
  onChoose,
}: {
  activeKey: ArticleKey;
  onChoose: (section: ArticleKey) => void;
}) {
  return (
    <section className="study-plate-shelf" aria-label="Pranchas visuais">
      <div className="study-section-title">
        <span>Pranchas visuais</span>
        <h2>Imagens para revisar antes da prova</h2>
      </div>
      <div className="study-plate-row">
        {articleSections.map((section) => (
          <button
            key={section.key}
            type="button"
            className={cn("study-plate", activeKey === section.key && "is-active")}
            onClick={() => onChoose(section.key)}
          >
            <img src={section.secondaryFigure.image} alt={section.secondaryFigure.alt} loading="lazy" />
            <span>{section.shortTitle}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
