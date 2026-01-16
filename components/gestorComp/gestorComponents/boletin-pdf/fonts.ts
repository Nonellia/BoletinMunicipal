import { Font } from "@react-pdf/renderer";

export const registerFonts = () => {
  Font.register({
    family: "versus",
    fonts: [{ src: "/versus.otf" }],
  });
  Font.register({
    family: "neulis",
    fonts: [{ src: "/neulis.otf" }],
  });
    Font.register({
    family: "neulis2",
    fonts: [{ src: "/neulis2.otf" }],
  });
    Font.register({
    family: "neulis4",
    fonts: [{ src: "/neulis6.otf" }],
  });
    Font.register({
    family: "neulis3",
    fonts: [{ src: "/neulis6.otf" }],
  });
    Font.register({
    family: "neulis6",
    fonts: [{ src: "/neulisThin.otf" }],
  });
  Font.register({
    family: "neulis5",
    fonts: [{ src: "/neulis5.otf" }],
  });
};
