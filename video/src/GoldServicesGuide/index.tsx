import { AbsoluteFill, Sequence } from "remotion";
import { Scene, TitleCard } from "./Scene";

const INTRO = 90;
const SCENE = 165;
const OUTRO = 100;

const scenes = [
  {
    image: "screens/01-login.png",
    step: "1",
    title: "Ingresa a la aplicación",
    detail:
      "Abre index.html (o el link de GitHub Pages), escribe tu correo y una contraseña, y haz clic en INGRESAR. Es una sesión local: queda guardada en tu navegador.",
  },
  {
    image: "screens/02-dashboard.png",
    step: "2",
    title: "Revisa el Dashboard",
    detail:
      "Verás tus KPIs en tiempo real: propuestas generadas, monto total propuesto y el último cliente registrado.",
  },
  {
    image: "screens/03-propuestas.png",
    step: "3",
    title: "Crea una Propuesta Comercial",
    detail:
      "Completa cliente, fecha y servicios. El Neto, el IVA (19%) y el Total se calculan solos. Luego, expórtalo todo a Excel con un clic.",
  },
  {
    image: "screens/04-documento.png",
    step: "4",
    title: "Genera el documento oficial",
    detail:
      "Haz clic en “Ver” para abrir el documento con el formato oficial de Gold Services, listo para imprimir o guardar como PDF.",
  },
];

export const GoldServicesGuide: React.FC = () => {
  let cursor = 0;
  const introFrom = cursor;
  cursor += INTRO;

  const sceneRanges = scenes.map((scene) => {
    const from = cursor;
    cursor += SCENE;
    return { ...scene, from };
  });

  const outroFrom = cursor;

  return (
    <AbsoluteFill style={{ backgroundColor: "#07183f" }}>
      <Sequence from={introFrom} durationInFrames={INTRO}>
        <TitleCard
          eyebrow="GOLD SERVICES · GUÍA RÁPIDA"
          title="Cómo usar la plataforma"
          subtitle="Ingreso, Propuestas Comerciales y exportación a Excel"
        />
      </Sequence>

      {sceneRanges.map((scene) => (
        <Sequence key={scene.step} from={scene.from} durationInFrames={SCENE}>
          <Scene
            image={scene.image}
            step={scene.step}
            title={scene.title}
            detail={scene.detail}
          />
        </Sequence>
      ))}

      <Sequence from={outroFrom} durationInFrames={OUTRO}>
        <TitleCard
          eyebrow="GOLD SERVICES AND CONSULTING SpA"
          title="Calidad Gold, Confianza Global."
          subtitle="Tu aliado técnico para exportar sin rechazos"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export const GOLD_SERVICES_GUIDE_DURATION = INTRO + scenes.length * SCENE + OUTRO;
