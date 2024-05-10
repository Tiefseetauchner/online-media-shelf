import React
  from 'react'
import ReactDOM
  from 'react-dom/client'
import App
  from './App.tsx'
import {
  BrandVariants,
  createDarkTheme,
  createLightTheme,
  FluentProvider,
  Theme,
  Toaster
} from "@fluentui/react-components";
import "normalize.css";

const onlineMediaShelvesTheme: BrandVariants = {
  10: "#040202",
  20: "#1E1511",
  30: "#32211B",
  40: "#432B22",
  50: "#553529",
  60: "#673F31",
  70: "#7B4938",
  80: "#8E543F",
  90: "#A35E46",
  100: "#B9694D",
  110: "#D17251",
  120: "#CA8C77",
  130: "#D29D8B",
  140: "#DBAF9F",
  150: "#E3C0B4",
  160: "#ECD2C9"
};

const lightTheme: Theme = {
  ...createLightTheme(onlineMediaShelvesTheme),
};

const darkTheme: Theme = {
  ...createDarkTheme(onlineMediaShelvesTheme),
};


darkTheme.colorBrandForeground1 = onlineMediaShelvesTheme[110];
darkTheme.colorBrandForeground2 = onlineMediaShelvesTheme[120];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FluentProvider
      theme={lightTheme}>
      <Toaster/>
      <App/>
    </FluentProvider>
  </React.StrictMode>,
)
