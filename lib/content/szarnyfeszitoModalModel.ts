import { Project } from "./types";
import { projectVisuals } from "./projectVisuals";

export type SzarnyfeszitoIconItem = {
  icon: "compass" | "map" | "layers";
  title: string;
  text: string;
};

export type SzarnyfeszitoImageSide = "left" | "right";

export type SzarnyfeszitoSingleImageSection = {
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  imageSide: SzarnyfeszitoImageSide;
};

export type SzarnyfeszitoTwoImageSection = {
  title: string;
  body: string;
  imageSrcs: [string, string];
  imageAlt: string;
  imageSide: SzarnyfeszitoImageSide;
};

export type SzarnyfeszitoModalModel = {
  brand: { logo: string; name: string; tagline: string; appUrl: string };
  kiindulo: { body: string };
  mukodesiElv: { title: string; items: SzarnyfeszitoIconItem[] };
  kinekSzol: {
    title: string;
    items: { iconSrc: string; title: string; text: string }[];
  };
  hogyanKezddEl: {
    title: string;
    steps: { title: string; text: string }[];
  };
  madarKatalogus: SzarnyfeszitoSingleImageSection;
  terkepCore: SzarnyfeszitoSingleImageSection;
  madarMegfigyeles: SzarnyfeszitoTwoImageSection;
  mood: { text: string };
  helyszinekHalo: SzarnyfeszitoSingleImageSection;
  helyszinElozetes: SzarnyfeszitoTwoImageSection;
  kovetkezoIranyok: { title: string; cards: { title: string; text: string }[] };
  closing: { body: string };
};

export function buildSzarnyfeszitoModalModel(project: Project): SzarnyfeszitoModalModel {
  const visual = projectVisuals[project.slug];
  const appUrl = visual?.appUrl ?? "";
  const logo = visual?.logo ?? "/szarnyfeszito/logo.svg";

  return {
    brand: {
      logo,
      name: project.title,
      tagline: project.hero.trim(),
      appUrl,
    },
    kiindulo: {
      body: [
        "A Szárnyfeszítő nem egy hagyományos madárhatározó, hanem egy belépési pont a természet megfigyeléséhez.",
        "Ahelyett, hogy teljes képet akarna adni, inkább irányokat mutat: hol érdemes elindulni, mit figyelj meg, és hogyan válik a jelenlét fokozatosan egyre tudatosabbá.",
        "",
        "A felület úgy épül fel, hogy a felfedezés ne adatgyűjtésként, hanem élményként történjen.",
      ].join("\n"),
    },
    mukodesiElv: {
      title: "Működési elv",
      items: [
        {
          icon: "compass",
          title: "Felfedezés, nem keresés",
          text: "Nem pontos találatokra épít, hanem arra, hogy mit érdemes észrevenni.",
        },
        {
          icon: "map",
          title: "Térben gondolkodik",
          text: "A kiindulópont nem a faj, hanem a hely és annak élővilága.",
        },
        {
          icon: "layers",
          title: "Rétegzett tudás",
          text: "Helyszínek, fajok és megfigyelési szempontok egymásra épülnek.",
        },
      ],
    },
    kinekSzol: {
      title: "Kinek szól",
      items: [
        {
          iconSrc: "/szarnyfeszito/icons/icon_amateur.svg",
          title: "Kezdőknek",
          text: "Akik most ismerkednek a madármegfigyeléssel, és egyszerű, érthető kiindulópontot keresnek.",
        },
        {
          iconSrc: "/szarnyfeszito/icons/icon_photographer.svg",
          title: "Természetfotósoknak",
          text: "Akik nemcsak látni, hanem megörökíteni is szeretnék a helyszínek és fajok különleges pillanatait.",
        },
        {
          iconSrc: "/szarnyfeszito/icons/icon_school.svg",
          title: "Iskoláknak",
          text: "Akik élményszerű, természetközeli módon szeretnék közelebb hozni a diákokhoz a madárvilágot.",
        },
        {
          iconSrc: "/szarnyfeszito/icons/icon_family.svg",
          title: "Családoknak",
          text: "Akik közös kirándulásból szeretnének figyelmesebb, tartalmasabb természeti élményt csinálni.",
        },
      ],
    },
    hogyanKezddEl: {
      title: "Hogyan kezdd el",
      steps: [
        {
          title: "Válassz egy helyet",
          text: "Indulj egy olyan helyszínnel, amely könnyen elérhető és jó első élményt ígér.",
        },
        {
          title: "Ismerd meg a fajokat",
          text: "Nézd meg, milyen madarakkal találkozhatsz, és milyen időszakban a legizgalmasabb a megfigyelés.",
        },
        {
          title: "Figyelj nyitott szemmel",
          text: "Nem kell rögtön szakértőnek lenned. Az első madárlés lényege, hogy észrevedd, mennyi minden történik körülötted.",
        },
      ],
    },
    madarKatalogus: {
      title: "Madár katalógus",
      body: [
        "A madárkatalógus nem teljes adatbázis, hanem egy tudatosan válogatott gyűjtemény a leggyakrabban megfigyelhető fajokból.",
        "",
        "A cél nem az, hogy mindent lefedjen, hanem hogy segítsen eligazodni: felismerni az ismerős madarakat, és kiindulópontot adni a további felfedezéshez.",
      ].join("\n"),
      imageSrc: "/szarnyfeszito/screens/birds.JPG",
      imageAlt: "Madárkatalógus – gyakori fajok",
      imageSide: "right",
    },
    terkepCore: {
      title: "Térkép – core élmény",
      body: [
        "A központi nézet egy térkép, ahol a helyszínek nem pontokként, hanem történetekként jelennek meg.",
        "A panelek nem megszakítják a navigációt, hanem ráépülnek, így a felfedezés folyamatos marad.",
      ].join("\n"),
      imageSrc: "/szarnyfeszito/screens/hero.JPG",
      imageAlt: "Térkép nézet – helyszín panellel",
      imageSide: "left",
    },
    madarMegfigyeles: {
      title: "Madár – megfigyelés",
      body: [
        "A fajok bemutatása nem enciklopédikus, hanem megfigyelés-alapú.",
        "A hangsúly azon van, hogy mit érdemes észrevenni: mozgás, hang, viselkedés — azok a részletek, amelyek a terepen is felismerhetővé teszik őket.",
      ].join("\n"),
      imageSrcs: ["/szarnyfeszito/screens/birds_1.JPG", "/szarnyfeszito/screens/birds_2.JPG"],
      imageAlt: "Madár bemutató képernyők",
      imageSide: "right",
    },
    mood: {
      text: ["Nem kell rögtön tudnod, mit látsz.", "Először elég, ha észreveszed."].join(
        "\n"
      ),
    },
    helyszinekHalo: {
      title: "Helyszínek – táguló tér",
      body: [
        "A helyszínek nem különálló pontok, hanem egy nagyobb háló részei.",
        "Ahogy egyre több helyet fedezel fel, kirajzolódik, hogyan kapcsolódnak egymáshoz élőhelyek és fajok.",
      ].join("\n"),
      imageSrc: "/szarnyfeszito/screens/places.JPG",
      imageAlt: "Helyszínek – több táj grid",
      imageSide: "left",
    },
    helyszinElozetes: {
      title: "Helyszín – előnézet",
      body: [
        "Egy-egy helyszín saját karakterrel jelenik meg: nem csak információt ad, hanem kontextust is.",
        "A cél nem a teljesség, hanem az, hogy irányt adjon a következő megfigyeléshez.",
      ].join("\n"),
      imageSrcs: [
        "/szarnyfeszito/screens/places_1.JPG",
        "/szarnyfeszito/screens/places_2.JPG",
      ],
      imageAlt: "Helyszín előnézet – Fertő-tó",
      imageSide: "left",
    },
    kovetkezoIranyok: {
      title: "Következő irányok",
      cards: [
        {
          title: "Explorer mód",
          text: "Felhasználói élmény bővítése egy live napló- és követőrendszerrel.",
        },
        {
          title: "Megfigyelési szempontok finomítása",
          text: "A leírások további pontosítása a terepi használhatóság érdekében.",
        },
        {
          title: "Mélyebb összefüggések",
          text: "A helyek és fajok közötti kapcsolatok erősebb kirajzolása.",
        },
      ],
    },
    closing: {
      body: [
        "A Szárnyfeszítő nem egy lezárt tudásanyag, hanem egy nyitott tér, ami a használat során válik egyre gazdagabbá.",
        "Minél többet figyelsz, annál többet mutat.",
      ].join("\n"),
    },
  };
}
